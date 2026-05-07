import anime, { createScrollObserver } from './anime.js';
import { observe } from './observer.js';
import { parseModifiers } from './parser.js';
import { getPreset } from './presets.js';

const NON_STYLE_PROPERTIES = new Set(['duration', 'delay', 'ease', 'opacity', 'x', 'y', 'scale']);

function getFrameValue(value, frame) {
  if (!Array.isArray(value)) return value;
  return frame === 'last' ? value[value.length - 1] : value[0];
}

function applyStyleValue(element, property, value) {
  if (value === undefined || value === null) return;

  if (property.includes('-')) {
    element.style.setProperty(property, String(value));
    return;
  }

  element.style[property] = String(value);
}

function applyAdditionalStyles(element, preset, frame) {
  for (const [property, value] of Object.entries(preset)) {
    if (NON_STYLE_PROPERTIES.has(property)) continue;
    applyStyleValue(element, property, getFrameValue(value, frame));
  }
}

function applyStyles(element, preset, frame) {
  if (preset.opacity) {
    element.style.opacity = String(getFrameValue(preset.opacity, frame));
  }

  const transforms = [];

  if (preset.x) transforms.push(`translateX(${getFrameValue(preset.x, frame)}px)`);
  if (preset.y) transforms.push(`translateY(${getFrameValue(preset.y, frame)}px)`);
  if (preset.scale) transforms.push(`scale(${getFrameValue(preset.scale, frame)})`);

  element.style.transform = transforms.join(' ');
  applyAdditionalStyles(element, preset, frame);
}

function getParallaxValues(config) {
  const half = config.parallax.amount / 2;
  const from = half === 0 ? 0 : half;
  const to = half === 0 ? 0 : -half;

  return config.parallax.reverse ? [to, from] : [from, to];
}

function formatParallaxTranslate(value, axis) {
  return axis === 'x' ? `${value}px 0px` : `0px ${value}px`;
}

function applyNeutralParallaxStyle(element) {
  element.style.translate = '0px 0px';
}

function applyStartupFadeStyles(element, preset) {
  applyStyles(element, preset, 'last');

  if (preset.opacity) {
    element.style.opacity = String(getFrameValue(preset.opacity, 'first'));
  }
}

function prefersReducedMotion() {
  if (typeof globalThis.matchMedia !== 'function') return false;
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isRendered(element, { ignoreOpacity = false } = {}) {
  if (typeof element.checkVisibility === 'function') {
    return element.checkVisibility({
      contentVisibilityAuto: true,
      opacityProperty: !ignoreOpacity,
      visibilityProperty: true
    });
  }

  if (typeof globalThis.getComputedStyle !== 'function') return true;

  const style = globalThis.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  if (!ignoreOpacity && style.opacity === '0') return false;

  return true;
}

function getViewportSize() {
  const doc = globalThis.document?.documentElement;

  return {
    width: globalThis.innerWidth || doc?.clientWidth || 0,
    height: globalThis.innerHeight || doc?.clientHeight || 0
  };
}

function isVisibleInViewport(element, options) {
  if (!isRendered(element, options)) return false;
  if (typeof element.getBoundingClientRect !== 'function') return false;

  const viewport = getViewportSize();
  if (viewport.width <= 0 || viewport.height <= 0) return false;

  const rect = element.getBoundingClientRect();
  const visibleWidth = Math.min(rect.right, viewport.width) - Math.max(rect.left, 0);
  const visibleHeight = Math.min(rect.bottom, viewport.height) - Math.max(rect.top, 0);

  return visibleWidth >= 1 && visibleHeight >= 1;
}

function createStartupVisibilityWatcher(callback) {
  if (typeof globalThis.addEventListener !== 'function') return () => {};

  globalThis.addEventListener('load', callback);
  globalThis.addEventListener('resize', callback);

  return () => {
    if (typeof globalThis.removeEventListener !== 'function') return;
    globalThis.removeEventListener('load', callback);
    globalThis.removeEventListener('resize', callback);
  };
}

export default function directive(element, { modifiers = [] }, { cleanup } = {}) {
  const presetNames = modifiers.filter((modifier) => Boolean(getPreset(modifier)));

  if (presetNames.length !== 1) {
    if (typeof __DEBUG__ !== 'undefined' && __DEBUG__) {
      console.warn('[Alpine Anime] Directive ignored: exactly one preset required, found:', presetNames);
    }
    return;
  }

  const presetName = presetNames[0];
  const preset = getPreset(presetName);
  const config = parseModifiers(modifiers);

  if (typeof __DEBUG__ !== 'undefined' && __DEBUG__) {
    console.log('[Alpine Anime] Initializing directive', element);
    console.log('[Alpine Anime] Preset:', presetNames[0], preset);
    console.log('[Alpine Anime] Config:', config);
  }

  if (presetName === 'parallax') {
    if (prefersReducedMotion()) {
      applyNeutralParallaxStyle(element);
      return;
    }

    const values = getParallaxValues(config);
    const scrollObserver = createScrollObserver({
      target: element,
      axis: config.parallax.axis,
      sync: true,
      enter: 'end start',
      leave: 'start end'
    });
    const activeAnimation = anime(element, {
      translate: values.map((value) => formatParallaxTranslate(value, config.parallax.axis)),
      duration: 1000,
      ease: 'linear',
      autoplay: scrollObserver
    });

    if (typeof cleanup === 'function') {
      cleanup(() => {
        if (activeAnimation && typeof activeAnimation.cancel === 'function') {
          activeAnimation.cancel();
        }
        if (scrollObserver && typeof scrollObserver.revert === 'function') {
          scrollObserver.revert();
        }
      });
    }

    return;
  }

  if (prefersReducedMotion()) {
    applyStyles(element, preset, 'last');
    return;
  }

  let activeAnimation;
  let teardown = () => {};
  let stopStartupVisibilityWatcher = () => {};

  const animateWithConfig = (parameters) => {
    stopStartupVisibilityWatcher();
    stopStartupVisibilityWatcher = () => {};

    if (activeAnimation && typeof activeAnimation.cancel === 'function') {
      activeAnimation.cancel();
    }

    if (typeof __DEBUG__ !== 'undefined' && __DEBUG__) {
      console.log('[Alpine Anime] Triggering animation', element);
      console.log('[Alpine Anime] Animation parameters:', parameters);
    }

    activeAnimation = anime(element, {
      ...parameters,
      duration: parameters.duration ?? config.duration,
      delay: parameters.delay ?? config.delay,
      ease: parameters.ease ?? config.ease
    });
  };

  const setupObserver = (initialIntersected = false) => {
    teardown = presetName === 'fade-in-out'
      ? observe(element, {
        enter: () => animateWithConfig({ opacity: [0, 1] }),
        leave: () => animateWithConfig({ opacity: [1, 0], delay: 0 })
      }, {
        ...config,
        initialIntersected
      })
      : observe(element, () => {
        animateWithConfig(preset);
      }, {
        ...config,
        initialIntersected
      });
  };

  const finalizeStartup = () => {
    stopStartupVisibilityWatcher();
    stopStartupVisibilityWatcher = () => {};
    applyStartupFadeStyles(element, preset);
    animateWithConfig({ opacity: preset.opacity ?? [0, 1] });

    if (!config.replay && presetName !== 'fade-in-out') return;
    setupObserver(true);
  };

  if (isVisibleInViewport(element)) {
    finalizeStartup();
  } else {
    applyStyles(element, preset, 'first');
    stopStartupVisibilityWatcher = createStartupVisibilityWatcher(() => {
      if (!isVisibleInViewport(element, { ignoreOpacity: true })) return;

      teardown();
      teardown = () => {};
      finalizeStartup();
    });
    setupObserver(false);
  }

  if (typeof cleanup === 'function') {
    cleanup(() => {
      if (typeof __DEBUG__ !== 'undefined' && __DEBUG__) {
        console.log('[Alpine Anime] Cleaning up directive', element);
      }
      if (activeAnimation && typeof activeAnimation.cancel === 'function') {
        activeAnimation.cancel();
      }
      stopStartupVisibilityWatcher();
      teardown();
    });
  }
}
