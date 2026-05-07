const DEFAULT_CONFIG = {
  duration: 800,
  delay: 0,
  ease: 'out(2)',
  threshold: 0,
  replay: true,
  enterMargin: '0px',
  leaveMargin: '0px',
  parallax: {
    amount: 120,
    axis: 'y',
    reverse: false
  }
};

const BEZIER_EASES = {
  'bezier-in': 'cubicBezier(0.5, 0, 0.9, 0.3)',
  'bezier-out': 'cubicBezier(0.1, 0.7, 0.5, 1)'
};

function parseNumber(value) {
  return Number.parseFloat(String(value).replaceAll('_', '.'));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function parseThreshold(value) {
  const parsed = parseNumber(value);
  if (!Number.isFinite(parsed)) return null;

  return clamp(parsed, 0, 100) / 100;
}

function formatPowerEase(direction, value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return null;

  const power = clamp(parsed, 100, 1000) / 100;
  return `${direction}(${Number.parseFloat(power.toFixed(2))})`;
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
    return `${numeric}%`;
  }

  return null;
}

export function parseModifiers(modifiers = []) {
  const config = {
    ...DEFAULT_CONFIG,
    parallax: { ...DEFAULT_CONFIG.parallax }
  };

  for (let index = 0; index < modifiers.length; index += 1) {
    const modifier = modifiers[index];

    if (modifier === 'duration') {
      const parsed = parseNumber(modifiers[index + 1]);
      if (Number.isFinite(parsed)) config.duration = parsed;
      index += 1;
      continue;
    }

    if (modifier === 'delay') {
      const parsed = parseNumber(modifiers[index + 1]);
      if (Number.isFinite(parsed)) config.delay = parsed;
      index += 1;
      continue;
    }

    if (modifier === 'threshold') {
      const parsed = parseThreshold(modifiers[index + 1]);
      if (parsed !== null) config.threshold = parsed;
      index += 1;
      continue;
    }

    if (modifier === 'ease') {
      const name = modifiers[index + 1];

      if (BEZIER_EASES[name]) {
        config.ease = BEZIER_EASES[name];
        index += 1;
        continue;
      }

      if (name === 'power-in' || name === 'power-out') {
        const parsed = formatPowerEase(name === 'power-in' ? 'in' : 'out', modifiers[index + 2]);
        if (parsed !== null) config.ease = parsed;
        index += 2;
        continue;
      }

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
      index += 1;
      continue;
    }

    if (modifier === 'leave' || modifier === 'end') {
      const parsed = parseMargin(modifiers[index + 1]);
      if (parsed !== null) config.leaveMargin = parsed;
      index += 1;
      continue;
    }

    if (modifier === 'amount') {
      const parsed = parseNumber(modifiers[index + 1]);
      if (Number.isFinite(parsed)) config.parallax.amount = clamp(parsed, 0, 1000);
      index += 1;
      continue;
    }

    if (modifier === 'axis') {
      const axis = modifiers[index + 1];
      if (axis === 'x' || axis === 'y') config.parallax.axis = axis;
      index += 1;
      continue;
    }

    if (modifier === 'reverse') {
      config.parallax.reverse = true;
    }
  }

  return config;
}
