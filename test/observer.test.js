import { beforeEach, describe, expect, test, vi } from 'vitest';
import { observe } from '../src/observer.js';

describe('observe', () => {
  let ObserverMock;
  let instance;

  beforeEach(() => {
    instance = {
      observe: vi.fn(),
      unobserve: vi.fn()
    };

    ObserverMock = vi.fn((callback, options) => {
      instance.callback = callback;
      instance.options = options;
      return instance;
    });

    globalThis.IntersectionObserver = ObserverMock;
  });

  test('fires the callback on first intersection', () => {
    const element = document.createElement('div');
    const callback = vi.fn();

    observe(element, callback, { threshold: 0.35, replay: true });
    instance.callback([{ isIntersecting: true, target: element }]);

    expect(ObserverMock).toHaveBeenCalledWith(expect.any(Function), { threshold: 0.35 });
    expect(instance.observe).toHaveBeenCalledWith(element);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('does not re-fire continuously while the element remains visible', () => {
    const element = document.createElement('div');
    const callback = vi.fn();

    observe(element, callback, { threshold: 0.2, replay: true });
    instance.callback([{ isIntersecting: true, target: element }]);
    instance.callback([{ isIntersecting: true, target: element }]);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('fires again after exit and re-entry when replay is enabled', () => {
    const element = document.createElement('div');
    const callback = vi.fn();

    observe(element, callback, { threshold: 0.2, replay: true });
    instance.callback([{ isIntersecting: true, target: element }]);
    instance.callback([{ isIntersecting: false, target: element }]);
    instance.callback([{ isIntersecting: true, target: element }]);

    expect(callback).toHaveBeenCalledTimes(2);
  });

  test('unobserves after the first successful run when replay is disabled', () => {
    const element = document.createElement('div');
    const callback = vi.fn();

    observe(element, callback, { threshold: 0.2, replay: false });
    instance.callback([{ isIntersecting: true, target: element }]);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(instance.unobserve).toHaveBeenCalledWith(element);
  });

  test('returns a teardown function that disconnects the observer', () => {
    const element = document.createElement('div');
    const callback = vi.fn();
    instance.disconnect = vi.fn();

    const teardown = observe(element, callback, { threshold: 0.2, replay: true });
    teardown();

    expect(instance.disconnect).toHaveBeenCalledTimes(1);
  });

  test('teardown falls back to unobserve when disconnect is unavailable', () => {
    const element = document.createElement('div');
    const callback = vi.fn();
    instance.disconnect = undefined;

    const teardown = observe(element, callback, { threshold: 0.2, replay: true });
    teardown();

    expect(instance.unobserve).toHaveBeenCalledWith(element);
  });

  test('falls back to an immediate callback when IntersectionObserver is unavailable', () => {
    const element = document.createElement('div');
    const callback = vi.fn();

    globalThis.IntersectionObserver = undefined;

    const teardown = observe(element, callback, { threshold: 0.2, replay: true });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(typeof teardown).toBe('function');
  });
});
