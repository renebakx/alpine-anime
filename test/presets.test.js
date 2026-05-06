import { afterEach, describe, expect, test } from 'vitest';
import { definePreset, getPreset, getPresetNames, resetPresets } from '../src/presets.js';

describe('preset registry', () => {
  afterEach(() => {
    resetPresets();
  });

  test('includes built-in presets by default', () => {
    expect(getPresetNames()).toContain('fade-up');
    expect(getPreset('fade-up')).toEqual({
      y: [50, 0],
      opacity: [0, 1]
    });
  });

  test('registers custom presets for directive lookup', () => {
    definePreset('blur-up', {
      opacity: [0, 1],
      y: [24, 0],
      filter: ['blur(12px)', 'blur(0px)'],
      ease: 'cubicBezier(0.7, 0.1, 0.5, 0.9)'
    });

    expect(getPresetNames()).toContain('blur-up');
    expect(getPreset('blur-up')).toEqual({
      opacity: [0, 1],
      y: [24, 0],
      filter: ['blur(12px)', 'blur(0px)'],
      ease: 'cubicBezier(0.7, 0.1, 0.5, 0.9)'
    });
  });

  test('allows a custom preset to override a built-in preset', () => {
    definePreset('fade-up', {
      y: [12, 0],
      opacity: [0.25, 1]
    });

    expect(getPreset('fade-up')).toEqual({
      y: [12, 0],
      opacity: [0.25, 1]
    });
  });
});
