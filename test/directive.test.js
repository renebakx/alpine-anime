import { beforeEach, describe, expect, test, vi } from 'vitest';

const { observeMock, animeMock } = vi.hoisted(() => ({
  observeMock: vi.fn(),
  animeMock: vi.fn()
}));

vi.mock('../src/observer.js', () => ({
  observe: observeMock
}));

vi.mock('../src/anime.js', () => ({
  default: animeMock
}));

import directive from '../src/directive.js';
import { definePreset, resetPresets } from '../src/presets.js';

describe('directive', () => {
  beforeEach(() => {
    observeMock.mockReset();
    animeMock.mockReset();
    resetPresets();
    delete globalThis.matchMedia;
  });

  test('does nothing when no preset modifier is present', () => {
    const element = document.createElement('div');

    directive(element, { modifiers: ['duration', '1200'] });

    expect(observeMock).not.toHaveBeenCalled();
    expect(animeMock).not.toHaveBeenCalled();
    expect(element.style.opacity).toBe('');
    expect(element.style.transform).toBe('');
  });

  test('does nothing when more than one preset modifier is present', () => {
    const element = document.createElement('div');

    directive(element, { modifiers: ['fade-left', 'fade-right'] });

    expect(observeMock).not.toHaveBeenCalled();
    expect(animeMock).not.toHaveBeenCalled();
  });

  test('applies initial styles and animates with merged options', () => {
    const element = document.createElement('div');
    observeMock.mockImplementation((_, callback) => callback());

    directive(element, { modifiers: ['fade-left', 'duration', '1200', 'delay', '200', 'threshold', '0_35', 'once'] });

    expect(element.style.opacity).toBe('0');
    expect(element.style.transform).toBe('translateX(100px)');
    expect(observeMock).toHaveBeenCalledTimes(1);
    expect(observeMock).toHaveBeenCalledWith(
      element,
      expect.any(Function),
      expect.objectContaining({
        duration: 1200,
        delay: 200,
        threshold: 0.35,
        replay: false
      })
    );
    expect(animeMock).toHaveBeenCalledWith(element, {
      x: [100, 0],
      opacity: [0, 1],
      duration: 1200,
      delay: 200,
      ease: 'out(2)'
    });
  });

  test('registers observer teardown with Alpine cleanup when available', () => {
    const element = document.createElement('div');
    const cleanup = vi.fn();
    const teardown = vi.fn();
    observeMock.mockReturnValue(teardown);

    directive(element, { modifiers: ['fade-up'] }, { cleanup });

    expect(cleanup).toHaveBeenCalledTimes(1);
    const registeredCleanup = cleanup.mock.calls[0][0];
    expect(typeof registeredCleanup).toBe('function');

    registeredCleanup();
    expect(teardown).toHaveBeenCalledTimes(1);
  });

  test('supports fade preset without applying slide transforms', () => {
    const element = document.createElement('div');
    observeMock.mockImplementation((_, callback) => callback());

    directive(element, { modifiers: ['fade', 'once'] });

    expect(element.style.opacity).toBe('0');
    expect(element.style.transform).toBe('');
    expect(animeMock).toHaveBeenCalledWith(element, {
      opacity: [0, 1],
      duration: 800,
      delay: 0,
      ease: 'out(2)'
    });
  });

  test('respects prefers-reduced-motion and skips animation runtime', () => {
    const element = document.createElement('div');
    globalThis.matchMedia = () => ({ matches: true });

    directive(element, { modifiers: ['fade-left', 'once'] });

    expect(element.style.opacity).toBe('1');
    expect(element.style.transform).toBe('translateX(0px)');
    expect(observeMock).not.toHaveBeenCalled();
    expect(animeMock).not.toHaveBeenCalled();
  });

  test('supports fade-in-out as enter/leave viewport behavior', () => {
    const element = document.createElement('div');
    observeMock.mockImplementation((_, handlers) => {
      handlers.enter();
      handlers.leave();
    });

    directive(element, { modifiers: ['fade-in-out'] });

    expect(element.style.opacity).toBe('0');
    expect(element.style.transform).toBe('');
    expect(animeMock).toHaveBeenNthCalledWith(1, element, {
      opacity: [0, 1],
      duration: 800,
      delay: 0,
      ease: 'out(2)'
    });
    expect(animeMock).toHaveBeenNthCalledWith(2, element, {
      opacity: [1, 0],
      duration: 800,
      delay: 0,
      ease: 'out(2)'
    });
  });

  test('uses WAAPI-compatible y transform parameters for vertical presets', () => {
    const element = document.createElement('div');
    observeMock.mockImplementation((_, callback) => callback());

    directive(element, { modifiers: ['fade-up'] });

    expect(element.style.opacity).toBe('0');
    expect(element.style.transform).toBe('translateY(50px)');
    expect(animeMock).toHaveBeenCalledWith(element, {
      y: [50, 0],
      opacity: [0, 1],
      duration: 800,
      delay: 0,
      ease: 'out(2)'
    });
  });

  test('fade-right applies negative x translate and animates correctly', () => {
    const element = document.createElement('div');
    observeMock.mockImplementation((_, callback) => callback());

    directive(element, { modifiers: ['fade-right'] });

    expect(element.style.opacity).toBe('0');
    expect(element.style.transform).toBe('translateX(-100px)');
    expect(animeMock).toHaveBeenCalledWith(element, {
      x: [-100, 0],
      opacity: [0, 1],
      duration: 800,
      delay: 0,
      ease: 'out(2)'
    });
  });

  test('fade-down applies negative y translate and animates correctly', () => {
    const element = document.createElement('div');
    observeMock.mockImplementation((_, callback) => callback());

    directive(element, { modifiers: ['fade-down'] });

    expect(element.style.opacity).toBe('0');
    expect(element.style.transform).toBe('translateY(-50px)');
    expect(animeMock).toHaveBeenCalledWith(element, {
      y: [-50, 0],
      opacity: [0, 1],
      duration: 800,
      delay: 0,
      ease: 'out(2)'
    });
  });

  test('scale-in applies initial scale and animates correctly', () => {
    const element = document.createElement('div');
    observeMock.mockImplementation((_, callback) => callback());

    directive(element, { modifiers: ['scale-in'] });

    expect(element.style.opacity).toBe('0');
    expect(element.style.transform).toBe('scale(0.9)');
    expect(animeMock).toHaveBeenCalledWith(element, {
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 800,
      delay: 0,
      ease: 'out(2)'
    });
  });

  test('passes parsed easing modifiers to the WAAPI adapter', () => {
    const element = document.createElement('div');
    observeMock.mockImplementation((_, callback) => callback());

    directive(element, { modifiers: ['fade-up', 'ease', 'power-out', '250'] });

    expect(animeMock).toHaveBeenCalledWith(element, {
      y: [50, 0],
      opacity: [0, 1],
      duration: 800,
      delay: 0,
      ease: 'out(2.5)'
    });
  });

  test('supports custom presets with additional CSS properties', () => {
    const element = document.createElement('div');
    observeMock.mockImplementation((_, callback) => callback());
    definePreset('blur-up', {
      opacity: [0, 1],
      y: [24, 0],
      filter: ['blur(12px)', 'blur(0px)'],
      ease: 'cubicBezier(0.7, 0.1, 0.5, 0.9)'
    });

    directive(element, { modifiers: ['blur-up', 'once'] });

    expect(element.style.opacity).toBe('0');
    expect(element.style.transform).toBe('translateY(24px)');
    expect(element.style.filter).toBe('blur(12px)');
    expect(animeMock).toHaveBeenCalledWith(element, {
      opacity: [0, 1],
      y: [24, 0],
      filter: ['blur(12px)', 'blur(0px)'],
      ease: 'cubicBezier(0.7, 0.1, 0.5, 0.9)',
      duration: 800,
      delay: 0
    });
  });

  test('applies custom preset final styles for reduced motion', () => {
    const element = document.createElement('div');
    globalThis.matchMedia = () => ({ matches: true });
    definePreset('blur-up', {
      opacity: [0, 1],
      y: [24, 0],
      filter: ['blur(12px)', 'blur(0px)']
    });

    directive(element, { modifiers: ['blur-up', 'once'] });

    expect(element.style.opacity).toBe('1');
    expect(element.style.transform).toBe('translateY(0px)');
    expect(element.style.filter).toBe('blur(0px)');
    expect(observeMock).not.toHaveBeenCalled();
    expect(animeMock).not.toHaveBeenCalled();
  });
});
