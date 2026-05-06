import anime from './anime.js';
import { observe } from './observer.js';
import { parseModifiers } from './parser.js';
import { getPreset, PRESET_NAMES } from './presets.js';

function applyInitialStyles(element, preset) {
  if (preset.opacity) {
    element.style.opacity = String(preset.opacity[0]);
  }

  const transforms = [];

  if (preset.x) transforms.push(`translateX(${preset.x[0]}px)`);
  if (preset.y) transforms.push(`translateY(${preset.y[0]}px)`);
  if (preset.scale) transforms.push(`scale(${preset.scale[0]})`);

  if (transforms.length > 0) {
    element.style.transform = transforms.join(' ');
  }
}

function applyFinalStyles(element, preset) {
  if (preset.opacity) {
    element.style.opacity = String(preset.opacity[preset.opacity.length - 1]);
  }

  const transforms = [];

  if (preset.x) transforms.push(`translateX(${preset.x[preset.x.length - 1]}px)`);
  if (preset.y) transforms.push(`translateY(${preset.y[preset.y.length - 1]}px)`);
  if (preset.scale) transforms.push(`scale(${preset.scale[preset.scale.length - 1]})`);

  element.style.transform = transforms.join(' ');
}

function prefersReducedMotion() {
  if (typeof globalThis.matchMedia !== 'function') return false;
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function directive(element, { modifiers = [] }, { cleanup } = {}) {
  const presetNames = modifiers.filter((modifier) => PRESET_NAMES.includes(modifier));

  if (presetNames.length !== 1) {
    return;
  }

  const preset = getPreset(presetNames[0]);

  if (!preset) {
    return;
  }

  const config = parseModifiers(modifiers);

  if (prefersReducedMotion()) {
    applyFinalStyles(element, preset);
    return;
  }

  applyInitialStyles(element, preset);

  let activeAnimation;

  const animateWithConfig = (parameters) => {
    if (activeAnimation && typeof activeAnimation.cancel === 'function') {
      activeAnimation.cancel();
    }

    activeAnimation = anime(element, {
      ...parameters,
      duration: parameters.duration ?? config.duration,
      delay: parameters.delay ?? config.delay,
      ease: parameters.ease ?? config.ease
    });
  };

  const teardown = presetNames[0] === 'fade-in-out'
    ? observe(element, {
      enter: () => animateWithConfig({ opacity: [0, 1] }),
      leave: () => animateWithConfig({ opacity: [1, 0], delay: 0 })
    }, config)
    : observe(element, () => {
      animateWithConfig(preset);
    }, config);

  if (typeof cleanup === 'function') {
    cleanup(() => {
      if (activeAnimation && typeof activeAnimation.cancel === 'function') {
        activeAnimation.cancel();
      }

      teardown();
    });
  }
}
