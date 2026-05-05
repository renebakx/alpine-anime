import { describe, expect, test } from 'vitest';
import { parseModifiers } from '../src/parser.js';

describe('parseModifiers', () => {
  test('returns defaults when no supported modifiers are present', () => {
    expect(parseModifiers(['unknown'])).toEqual({
      duration: 800,
      delay: 0,
      easing: 'easeOutQuad',
      threshold: 0.2,
      replay: true
    });
  });

  test('parses duration, delay, and threshold modifiers', () => {
    expect(parseModifiers(['fade-left', 'duration', '1200', 'delay', '200', 'threshold', '0_35'])).toEqual({
      duration: 1200,
      delay: 200,
      easing: 'easeOutQuad',
      threshold: 0.35,
      replay: true
    });
  });

  test('falls back to defaults for invalid numeric modifiers', () => {
    expect(parseModifiers(['duration', 'fast', 'delay', '-x', 'threshold', 'bad'])).toEqual({
      duration: 800,
      delay: 0,
      easing: 'easeOutQuad',
      threshold: 0.2,
      replay: true
    });
  });

  test('clamps threshold values to the intersection observer range', () => {
    expect(parseModifiers(['threshold', '4'])).toMatchObject({ threshold: 1 });
    expect(parseModifiers(['threshold', '-1'])).toMatchObject({ threshold: 0 });
  });

  test('uses the last replay modifier when once and repeat both appear', () => {
    expect(parseModifiers(['once', 'repeat'])).toMatchObject({ replay: true });
    expect(parseModifiers(['repeat', 'once'])).toMatchObject({ replay: false });
  });
});
