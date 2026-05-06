const PRESETS = {
  fade: { opacity: [0, 1] },
  'fade-in-out': { opacity: [0, 1] },
  'fade-right': { x: [-100, 0], opacity: [0, 1] },
  'fade-left': { x: [100, 0], opacity: [0, 1] },
  'fade-up': { y: [50, 0], opacity: [0, 1] },
  'fade-down': { y: [-50, 0], opacity: [0, 1] },
  'scale-in': { scale: [0.9, 1], opacity: [0, 1] }
};

export const PRESET_NAMES = Object.keys(PRESETS);

export function getPreset(name) {
  return PRESETS[name];
}
