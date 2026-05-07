import directive from './directive.js';
import { definePreset, getPreset, getPresetNames } from './presets.js';

const plugin = function (Alpine) {
  Alpine.directive('anime', directive);
};

plugin.version = __PACKAGE_VERSION__;
plugin.definePreset = definePreset;
plugin.getPreset = getPreset;
plugin.getPresetNames = getPresetNames;

export default plugin;

export const version = __PACKAGE_VERSION__;
export { definePreset, getPreset, getPresetNames };
