import directive from './directive.js';
import { definePreset, getPreset, getPresetNames } from './presets.js';

const plugin = function (Alpine) {
  Alpine.directive('anime', directive);
};

plugin.definePreset = definePreset;
plugin.getPreset = getPreset;
plugin.getPresetNames = getPresetNames;

export default plugin;

export { definePreset, getPreset, getPresetNames };
