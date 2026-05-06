const DEFAULT_CONFIG = {
  duration: 800,
  delay: 0,
  ease: 'outQuad',
  threshold: 0.2,
  replay: true,
  enterMargin: '0px',
  leaveMargin: '0px'
};

function parseNumber(value) {
  return Number.parseFloat(String(value).replaceAll('_', '.'));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function parseMargin(value) {
  const raw = String(value).trim().replaceAll('_', '.');

  if (raw.length === 0) return null;

  if (/^-?\d+(\.\d+)?p$/i.test(raw)) {
    return `${raw.slice(0, -1)}%`;
  }

  if (/^-?\d+(\.\d+)?%$/.test(raw)) {
    return raw;
  }

  if (/^-?\d+(\.\d+)?px$/i.test(raw)) {
    return `${Number.parseFloat(raw)}px`;
  }

  const numeric = Number.parseFloat(raw);
  if (Number.isFinite(numeric)) {
    return `${numeric}px`;
  }

  return null;
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
      continue;
    }

    if (modifier === 'enter' || modifier === 'start') {
      const parsed = parseMargin(modifiers[index + 1]);
      if (parsed !== null) config.enterMargin = parsed;
      continue;
    }

    if (modifier === 'leave' || modifier === 'end') {
      const parsed = parseMargin(modifiers[index + 1]);
      if (parsed !== null) config.leaveMargin = parsed;
    }
  }

  return config;
}
