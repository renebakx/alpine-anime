import { describe, expect, test, vi } from 'vitest';
import plugin from '../src/index.js';

describe('plugin entrypoint', () => {
  test('registers the anime directive with Alpine', () => {
    const directive = vi.fn();

    plugin({ directive });

    expect(directive).toHaveBeenCalledTimes(1);
    expect(directive).toHaveBeenCalledWith('anime', expect.any(Function));
  });

  test('exposes the custom preset registry API on the plugin function', () => {
    expect(typeof plugin.definePreset).toBe('function');
    expect(typeof plugin.getPreset).toBe('function');
    expect(typeof plugin.getPresetNames).toBe('function');
  });
});
