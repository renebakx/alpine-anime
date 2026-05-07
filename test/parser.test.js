import { describe, expect, test } from 'vitest';
import { parseModifiers } from '../src/parser.js';

describe('parseModifiers', () => {
  test('returns defaults when no supported modifiers are present', () => {
    expect(parseModifiers(['unknown'])).toEqual({
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
    });
  });

  test('parses duration, delay, and percentage threshold modifiers', () => {
    expect(parseModifiers(['fade-left', 'duration', '1200', 'delay', '200', 'threshold', '35'])).toEqual({
      duration: 1200,
      delay: 200,
      ease: 'out(2)',
      threshold: 0.35,
      replay: true,
      enterMargin: '0px',
      leaveMargin: '0px',
      parallax: {
        amount: 120,
        axis: 'y',
        reverse: false
      }
    });
  });

  test('falls back to defaults for invalid numeric modifiers', () => {
    expect(parseModifiers(['duration', 'fast', 'delay', '-x', 'threshold', 'bad'])).toEqual({
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
    });
  });

  test('clamps threshold values to the intersection observer range', () => {
    expect(parseModifiers(['threshold', '100'])).toMatchObject({ threshold: 1 });
    expect(parseModifiers(['threshold', '50'])).toMatchObject({ threshold: 0.5 });
    expect(parseModifiers(['threshold', '140'])).toMatchObject({ threshold: 1 });
    expect(parseModifiers(['threshold', '-10'])).toMatchObject({ threshold: 0 });
  });

  test('uses the last replay modifier when once and repeat both appear', () => {
    expect(parseModifiers(['once', 'repeat'])).toMatchObject({ replay: true });
    expect(parseModifiers(['repeat', 'once'])).toMatchObject({ replay: false });
  });

  test('parses enter and leave viewport margins as percentages by default', () => {
    expect(parseModifiers(['enter', '25', 'leave', '-10'])).toMatchObject({
      enterMargin: '25%',
      leaveMargin: '-10%'
    });
    expect(parseModifiers(['start', '120px', 'end', '80px'])).toMatchObject({
      enterMargin: '120px',
      leaveMargin: '80px'
    });
  });

  test('parses named bezier easing modifiers', () => {
    expect(parseModifiers(['ease', 'bezier-in'])).toMatchObject({
      ease: 'cubicBezier(0.5, 0, 0.9, 0.3)'
    });
    expect(parseModifiers(['ease', 'bezier-out'])).toMatchObject({
      ease: 'cubicBezier(0.1, 0.7, 0.5, 1)'
    });
  });

  test('parses power easing modifiers using integer hundredths', () => {
    expect(parseModifiers(['ease', 'power-in', '101'])).toMatchObject({
      ease: 'in(1.01)'
    });
    expect(parseModifiers(['ease', 'power-out', '250'])).toMatchObject({
      ease: 'out(2.5)'
    });
  });

  test('clamps power easing values to the supported range', () => {
    expect(parseModifiers(['ease', 'power-in', '12'])).toMatchObject({
      ease: 'in(1)'
    });
    expect(parseModifiers(['ease', 'power-out', '2400'])).toMatchObject({
      ease: 'out(10)'
    });
  });

  test('parses parallax amount modifiers as pixel ranges', () => {
    expect(parseModifiers(['parallax', 'amount', '240'])).toMatchObject({
      parallax: {
        amount: 240,
        axis: 'y',
        reverse: false
      }
    });
  });

  test('falls back to the default parallax amount for invalid values', () => {
    expect(parseModifiers(['parallax', 'amount', 'wide'])).toMatchObject({
      parallax: {
        amount: 120
      }
    });
  });

  test('clamps parallax amount to the supported range', () => {
    expect(parseModifiers(['parallax', 'amount', '-20'])).toMatchObject({
      parallax: {
        amount: 0
      }
    });
    expect(parseModifiers(['parallax', 'amount', '1800'])).toMatchObject({
      parallax: {
        amount: 1000
      }
    });
  });

  test('parses parallax axis modifiers', () => {
    expect(parseModifiers(['parallax', 'axis', 'x'])).toMatchObject({
      parallax: {
        axis: 'x'
      }
    });
    expect(parseModifiers(['parallax', 'axis', 'y'])).toMatchObject({
      parallax: {
        axis: 'y'
      }
    });
    expect(parseModifiers(['parallax', 'axis', 'z'])).toMatchObject({
      parallax: {
        axis: 'y'
      }
    });
  });

  test('parses the parallax reverse modifier', () => {
    expect(parseModifiers(['parallax', 'reverse'])).toMatchObject({
      parallax: {
        reverse: true
      }
    });
  });
});
