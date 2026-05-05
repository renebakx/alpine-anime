const DEFAULT_CONFIG = {
  duration: 800,
  delay: 0,
  easing: 'easeOutQuad',
  threshold: 0.2,
  replay: true
};

function parseNumber(value) {
  return Number.parseFloat(String(value).replaceAll('_', '.'));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function parseModifiers(modifiers = []) {
  const config = { ...DEFAULT_CONFIG };

  for (let index = 0; index < modifiers.length; index += 1) {
    const modifier = modifiers[index];

    if (modifier === 'duration') {
      const parsed = parseNumber(modifiers[index + 1]);
      if (Number.isFinite(parsed)) config.duration = parsed;
      continue;
    }

    if (modifier === 'delay') {
      const parsed = parseNumber(modifiers[index + 1]);
      if (Number.isFinite(parsed)) config.delay = parsed;
      continue;
    }

    if (modifier === 'threshold') {
      const parsed = parseNumber(modifiers[index + 1]);
      if (Number.isFinite(parsed)) config.threshold = clamp(parsed, 0, 1);
      continue;
    }

    if (modifier === 'once') {
      config.replay = false;
      continue;
    }

    if (modifier === 'repeat') {
      config.replay = true;
    }
  }

  return config;
}
