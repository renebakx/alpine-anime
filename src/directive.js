import anime from './anime.js';
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

function prefersReducedMotion() {
  if (typeof globalThis.matchMedia !== 'function') return false;
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getViewportSize() {
  const doc = globalThis.document?.documentElement;

  return {
    width: globalThis.innerWidth || doc?.clientWidth || 0,
    height: globalThis.innerHeight || doc?.clientHeight || 0
  };
}

function isInitiallyIntersecting(element, config) {
  if (typeof element.getBoundingClientRect !== 'function') return false;

  const rect = element.getBoundingClientRect();
  const rectWidth = rect.width ?? rect.right - rect.left;
  const rectHeight = rect.height ?? rect.bottom - rect.top;

  const viewport = getViewportSize();
  if (viewport.width <= 0 || viewport.height <= 0) return false;

  const rootTop = 0;
  const rootBottom = viewport.height;
  const rootLeft = 0;
  const rootRight = viewport.width;

  const visibleWidth = Math.min(rect.right, rootRight) - Math.max(rect.left, rootLeft);
  const visibleHeight = Math.min(rect.bottom, rootBottom) - Math.max(rect.top, rootTop);

  if (rectWidth <= 0 || rectHeight <= 0) {
    const hasMeasurableEdge = rectWidth > 0 || rectHeight > 0;
    const crossesViewportX = rect.right > rootLeft && rect.left < rootRight;
    const crossesViewportY = rect.bottom >= rootTop && rect.top <= rootBottom;

    return hasMeasurableEdge && crossesViewportX && crossesViewportY;
  }

  if (visibleWidth <= 0 || visibleHeight <= 0) return false;

  const visibleRatio = (visibleWidth * visibleHeight) / (rectWidth * rectHeight);
  const threshold = config.threshold ?? 0;

  return threshold === 0 ? visibleRatio > 0 : visibleRatio >= threshold;
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

  if (prefersReducedMotion()) {
    applyStyles(element, preset, 'last');
    return;
  }

  const initialIntersected = isInitiallyIntersecting(element, config);
  applyStyles(element, preset, initialIntersected ? 'last' : 'first');

  if (initialIntersected && !config.replay && presetName !== 'fade-in-out') {
    return;
  }

  let activeAnimation;

  const animateWithConfig = (parameters) => {
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

  const teardown = presetName === 'fade-in-out'
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

  if (typeof cleanup === 'function') {
    cleanup(() => {
      if (typeof __DEBUG__ !== 'undefined' && __DEBUG__) {
        console.log('[Alpine Anime] Cleaning up directive', element);
      }
      if (activeAnimation && typeof activeAnimation.cancel === 'function') {
        activeAnimation.cancel();
      }

      teardown();
    });
  }
}
