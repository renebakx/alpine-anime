const PRESETS = {
  fade: { opacity: [0, 1] },
  'fade-in-out': { opacity: [0, 1] },
  'fade-right': { translateX: [-100, 0], opacity: [0, 1] },
  'fade-left': { translateX: [100, 0], opacity: [0, 1] },
  'fade-up': { translateY: [50, 0], opacity: [0, 1] },
  'fade-down': { translateY: [-50, 0], opacity: [0, 1] },
  'scale-in': { scale: [0.9, 1], opacity: [0, 1] }
};

export const PRESET_NAMES = Object.keys(PRESETS);

export function getPreset(name) {
  return PRESETS[name];
}
