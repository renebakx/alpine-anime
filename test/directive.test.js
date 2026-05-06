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

describe('directive', () => {
  beforeEach(() => {
    observeMock.mockReset();
    animeMock.mockReset();
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
      ease: 'outQuad'
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
      ease: 'outQuad'
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
      ease: 'outQuad'
    });
    expect(animeMock).toHaveBeenNthCalledWith(2, element, {
      opacity: [1, 0],
      duration: 800,
      delay: 0,
      ease: 'outQuad'
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
      ease: 'outQuad'
    });
  });
});
