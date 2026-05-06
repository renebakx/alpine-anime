import directive from './directive.js';
import { definePreset, getPreset, getPresetNames } from './presets.js';

function plugin(Alpine) {
  Alpine.directive('anime', directive);
}

plugin.definePreset = definePreset;
plugin.getPreset = getPreset;
plugin.getPresetNames = getPresetNames;

export default plugin;
