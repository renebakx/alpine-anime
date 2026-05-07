import { beforeEach, describe, expect, test, vi } from 'vitest';

const { observeMock, animeMock, trackScrollProgressMock } = vi.hoisted(() => ({
  observeMock: vi.fn(),
  animeMock: vi.fn(),
  trackScrollProgressMock: vi.fn()
}));

vi.mock('../src/observer.js', () => ({
  observe: observeMock
}));

vi.mock('../src/anime.js', () => ({
  default: animeMock
}));

vi.mock('../src/scroll.js', () => ({
  trackScrollProgress: trackScrollProgressMock
}));

import directive from '../src/directive.js';
import { definePreset, resetPresets } from '../src/presets.js';

describe('directive', () => {
  beforeEach(() => {
    observeMock.mockReset();
    animeMock.mockReset();
    trackScrollProgressMock.mockReset();
    trackScrollProgressMock.mockReturnValue(() => {});
    resetPresets();
    delete globalThis.matchMedia;
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
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

    directive(element, { modifiers: ['fade-left', 'duration', '1200', 'delay', '200', 'threshold', '35', 'once'] });

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

  test('fades an initially visible once element without observing for a later enter animation', () => {
    const element = document.createElement('div');
    element.getBoundingClientRect = () => ({
      top: 100,
      left: 100,
      right: 300,
      bottom: 300,
      width: 200,
      height: 200
    });

    directive(element, { modifiers: ['fade', 'once', 'threshold', '20'] });

    expect(element.style.opacity).toBe('0');
    expect(observeMock).not.toHaveBeenCalled();
    expect(animeMock).toHaveBeenCalledWith(element, {
      opacity: [0, 1],
      duration: 800,
      delay: 0,
      ease: 'out(2)'
    });
  });

  test('does not treat a zero-height wrapper as visible at startup', () => {
    const element = document.createElement('div');
    element.getBoundingClientRect = () => ({
      top: 420,
      left: 100,
      right: 900,
      bottom: 420,
      width: 800,
      height: 0
    });

    directive(element, { modifiers: ['fade', 'once', 'threshold', '20'] });

    expect(element.style.opacity).toBe('0');
    expect(observeMock).toHaveBeenCalledTimes(1);
    expect(animeMock).not.toHaveBeenCalled();
  });

  test('does not finalize initially intersecting elements hidden by checkVisibility', () => {
    const element = document.createElement('div');
    element.checkVisibility = vi.fn(() => false);
    element.getBoundingClientRect = () => ({
      top: 100,
      left: 100,
      right: 300,
      bottom: 300,
      width: 200,
      height: 200
    });

    directive(element, { modifiers: ['fade', 'once', 'threshold', '20'] });

    expect(element.checkVisibility).toHaveBeenCalledWith({
      contentVisibilityAuto: true,
      opacityProperty: true,
      visibilityProperty: true
    });
    expect(element.style.opacity).toBe('0');
    expect(observeMock).toHaveBeenCalledTimes(1);
    expect(animeMock).not.toHaveBeenCalled();
  });

  test('uses computed style fallback when checkVisibility is unavailable', () => {
    const element = document.createElement('div');
    element.style.visibility = 'hidden';
    element.getBoundingClientRect = () => ({
      top: 100,
      left: 100,
      right: 300,
      bottom: 300,
      width: 200,
      height: 200
    });

    directive(element, { modifiers: ['fade', 'once', 'threshold', '20'] });

    expect(element.style.opacity).toBe('0');
    expect(observeMock).toHaveBeenCalledTimes(1);
    expect(animeMock).not.toHaveBeenCalled();
  });

  test('fades an initially visible repeating element and tracks later viewport changes', () => {
    const element = document.createElement('div');
    element.getBoundingClientRect = () => ({
      top: 100,
      left: 100,
      right: 300,
      bottom: 300,
      width: 200,
      height: 200
    });

    directive(element, { modifiers: ['fade', 'repeat', 'threshold', '20'] });

    expect(element.style.opacity).toBe('0');
    expect(observeMock).toHaveBeenCalledWith(
      element,
      expect.any(Function),
      expect.objectContaining({
        initialIntersected: true,
        threshold: 0.2
      })
    );
    expect(animeMock).toHaveBeenCalledWith(element, {
      opacity: [0, 1],
      duration: 800,
      delay: 0,
      ease: 'out(2)'
    });
  });

  test('does not treat enter offset pre-trigger zones as initially visible', () => {
    const element = document.createElement('div');
    element.getBoundingClientRect = () => ({
      top: 800,
      left: 100,
      right: 300,
      bottom: 1000,
      width: 200,
      height: 200
    });

    directive(element, { modifiers: ['fade', 'repeat', 'threshold', '0', 'enter', '25'] });

    expect(element.style.opacity).toBe('0');
    expect(observeMock).toHaveBeenCalledWith(
      element,
      expect.any(Function),
      expect.objectContaining({
        enterMargin: '25%'
      })
    );
    expect(animeMock).not.toHaveBeenCalled();
  });

  test('finalizes on load when an initially below-viewport element becomes visible', () => {
    const element = document.createElement('div');
    const rects = [
      {
        top: 900,
        left: 100,
        right: 900,
        bottom: 1100,
        width: 800,
        height: 200
      },
      {
        top: 420,
        left: 100,
        right: 900,
        bottom: 720,
        width: 800,
        height: 300
      }
    ];
    element.getBoundingClientRect = vi.fn(() => rects.shift() ?? rects[0]);
    const teardown = vi.fn();
    observeMock.mockReturnValue(teardown);
    const originalAddEventListener = globalThis.addEventListener;
    const originalRemoveEventListener = globalThis.removeEventListener;
    const listeners = {};
    globalThis.addEventListener = vi.fn((eventName, callback) => {
      listeners[eventName] = callback;
    });
    globalThis.removeEventListener = vi.fn();

    try {
      directive(element, { modifiers: ['fade', 'once', 'threshold', '20'] });

      expect(element.style.opacity).toBe('0');
      expect(observeMock).toHaveBeenCalledTimes(1);

      listeners.load();

      expect(element.style.opacity).toBe('0');
      expect(teardown).toHaveBeenCalledTimes(1);
      expect(animeMock).toHaveBeenCalledWith(element, {
        opacity: [0, 1],
        duration: 800,
        delay: 0,
        ease: 'out(2)'
      });
      expect(globalThis.removeEventListener).toHaveBeenCalledWith('load', listeners.load);
      expect(globalThis.removeEventListener).toHaveBeenCalledWith('resize', listeners.resize);
    } finally {
      globalThis.addEventListener = originalAddEventListener;
      globalThis.removeEventListener = originalRemoveEventListener;
    }
  });

  test('finalizes on resize when an initially below-viewport element becomes visible', () => {
    const element = document.createElement('div');
    const rects = [
      {
        top: 900,
        left: 100,
        right: 900,
        bottom: 1100,
        width: 800,
        height: 200
      },
      {
        top: 420,
        left: 100,
        right: 900,
        bottom: 720,
        width: 800,
        height: 300
      }
    ];
    element.getBoundingClientRect = vi.fn(() => rects.shift() ?? rects[0]);
    const teardown = vi.fn();
    observeMock.mockReturnValue(teardown);
    const originalAddEventListener = globalThis.addEventListener;
    const originalRemoveEventListener = globalThis.removeEventListener;
    const listeners = {};
    globalThis.addEventListener = vi.fn((eventName, callback) => {
      listeners[eventName] = callback;
    });
    globalThis.removeEventListener = vi.fn();

    try {
      directive(element, { modifiers: ['fade', 'once', 'threshold', '20'] });

      expect(element.style.opacity).toBe('0');
      expect(observeMock).toHaveBeenCalledTimes(1);

      listeners.resize();

      expect(element.style.opacity).toBe('0');
      expect(teardown).toHaveBeenCalledTimes(1);
      expect(animeMock).toHaveBeenCalledWith(element, {
        opacity: [0, 1],
        duration: 800,
        delay: 0,
        ease: 'out(2)'
      });
    } finally {
      globalThis.addEventListener = originalAddEventListener;
      globalThis.removeEventListener = originalRemoveEventListener;
    }
  });

  test('keeps fade-in-out initially visible but still allows leave animation', () => {
    const element = document.createElement('div');
    element.getBoundingClientRect = () => ({
      top: 100,
      left: 100,
      right: 300,
      bottom: 300,
      width: 200,
      height: 200
    });
    observeMock.mockImplementation((_, handlers) => {
      handlers.leave();
    });

    directive(element, { modifiers: ['fade-in-out', 'threshold', '20'] });

    expect(element.style.opacity).toBe('0');
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

  test('sets up parallax as a scroll-driven WAAPI animation', () => {
    const element = document.createElement('div');

    directive(element, { modifiers: ['parallax'] });

    expect(observeMock).not.toHaveBeenCalled();
    expect(trackScrollProgressMock).toHaveBeenCalledWith(element, expect.objectContaining({
      axis: 'y',
      onProgress: expect.any(Function)
    }));
    expect(animeMock).toHaveBeenCalledWith(element, {
      translate: ['0px 60px', '0px -60px'],
      duration: 1000,
      ease: 'linear',
      autoplay: false,
      persist: true
    });
  });

  test('drives the WAAPI animation progress from scroll updates', () => {
    const element = document.createElement('div');
    const animation = {};
    animeMock.mockReturnValue(animation);

    directive(element, { modifiers: ['parallax'] });

    const { onProgress } = trackScrollProgressMock.mock.calls[0][1];

    onProgress(0.25);
    expect(animation.progress).toBe(0.25);

    onProgress(0.75);
    expect(animation.progress).toBe(0.75);
  });

  test('supports horizontal reversed parallax with a custom amount', () => {
    const element = document.createElement('div');

    directive(element, { modifiers: ['parallax', 'amount', '240', 'axis', 'x', 'reverse'] });

    expect(trackScrollProgressMock).toHaveBeenCalledWith(element, expect.objectContaining({
      axis: 'x'
    }));
    expect(animeMock).toHaveBeenCalledWith(element, {
      translate: ['-120px 0px', '120px 0px'],
      duration: 1000,
      ease: 'linear',
      autoplay: false,
      persist: true
    });
  });

  test('keeps existing transform styles separate from parallax translate animation', () => {
    const element = document.createElement('div');
    element.style.transform = 'translateX(20px)';

    directive(element, { modifiers: ['parallax'] });

    expect(element.style.transform).toBe('translateX(20px)');
    expect(animeMock).toHaveBeenCalledWith(element, expect.objectContaining({
      translate: ['0px 60px', '0px -60px']
    }));
    expect(animeMock.mock.calls[0][1]).not.toHaveProperty('x');
    expect(animeMock.mock.calls[0][1]).not.toHaveProperty('y');
  });

  test('respects reduced motion for parallax and skips scroll runtime', () => {
    const element = document.createElement('div');
    globalThis.matchMedia = () => ({ matches: true });

    directive(element, { modifiers: ['parallax', 'amount', '240'] });

    expect(element.style.translate).toBe('0px 0px');
    expect(element.style.transform).toBe('');
    expect(trackScrollProgressMock).not.toHaveBeenCalled();
    expect(observeMock).not.toHaveBeenCalled();
    expect(animeMock).not.toHaveBeenCalled();
  });

  test('cleans up parallax animation and scroll tracking when Alpine destroys the element', () => {
    const element = document.createElement('div');
    const cleanup = vi.fn();
    const cancel = vi.fn();
    const stopScrollTracking = vi.fn();
    trackScrollProgressMock.mockReturnValue(stopScrollTracking);
    animeMock.mockReturnValue({ cancel });

    directive(element, { modifiers: ['parallax'] }, { cleanup });

    const registeredCleanup = cleanup.mock.calls[0][0];
    registeredCleanup();

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(stopScrollTracking).toHaveBeenCalledTimes(1);
  });
});
