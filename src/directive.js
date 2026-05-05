import anime from './anime.js';
import { observe } from './observer.js';
import { parseModifiers } from './parser.js';
import { getPreset, PRESET_NAMES } from './presets.js';

function applyInitialStyles(element, preset) {
  if (preset.opacity) {
    element.style.opacity = String(preset.opacity[0]);
  }

  const transforms = [];

  if (preset.translateX) transforms.push(`translateX(${preset.translateX[0]}px)`);
  if (preset.translateY) transforms.push(`translateY(${preset.translateY[0]}px)`);
  if (preset.scale) transforms.push(`scale(${preset.scale[0]})`);

  if (transforms.length > 0) {
    element.style.transform = transforms.join(' ');
  }
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
  applyInitialStyles(element, preset);

  const teardown = observe(element, () => {
    anime({
      targets: element,
      ...preset,
      duration: config.duration,
      delay: config.delay,
      easing: config.easing
    });
  }, config);

  if (typeof cleanup === 'function') {
    cleanup(teardown);
  }
}
