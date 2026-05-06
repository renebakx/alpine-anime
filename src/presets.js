const BUILT_IN_PRESETS = {
  fade: { opacity: [0, 1] },
  'fade-in-out': { opacity: [0, 1] },
  'fade-right': { x: [-100, 0], opacity: [0, 1] },
  'fade-left': { x: [100, 0], opacity: [0, 1] },
  'fade-up': { y: [50, 0], opacity: [0, 1] },
  'fade-down': { y: [-50, 0], opacity: [0, 1] },
  'scale-in': { scale: [0.9, 1], opacity: [0, 1] }
};

let presets = { ...BUILT_IN_PRESETS };

export function definePreset(name, preset) {
  if (typeof name !== 'string' || name.trim().length === 0 || !preset || typeof preset !== 'object') {
    return;
  }

  presets[name] = preset;
}

export function getPreset(name) {
  return presets[name];
}

export function getPresetNames() {
  return Object.keys(presets);
}

export function resetPresets() {
  presets = { ...BUILT_IN_PRESETS };
}
