function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getViewportSize(axis) {
  if (axis === 'x') return globalThis.innerWidth || globalThis.document?.documentElement?.clientWidth || 0;
  return globalThis.innerHeight || globalThis.document?.documentElement?.clientHeight || 0;
}

function computeProgress(element, axis) {
  if (typeof element.getBoundingClientRect !== 'function') return 0;

  const rect = element.getBoundingClientRect();
  const size = getViewportSize(axis);
  const start = axis === 'x' ? rect.left : rect.top;
  const length = axis === 'x' ? rect.width : rect.height;
  const denom = size + length;

  if (denom <= 0) return 0;
  return clamp((size - start) / denom, 0, 1);
}

export function trackScrollProgress(element, { axis = 'y', onProgress } = {}) {
  if (typeof onProgress !== 'function') return () => {};
  if (typeof IntersectionObserver !== 'function') {
    onProgress(computeProgress(element, axis));
    return () => {};
  }

  let isInView = false;
  let scrollAttached = false;

  const compute = () => {
    if (!isInView) return;
    onProgress(computeProgress(element, axis));
  };

  const attachScroll = () => {
    if (scrollAttached) return;
    globalThis.addEventListener('scroll', compute, { passive: true, capture: true });
    scrollAttached = true;
  };

  const detachScroll = () => {
    if (!scrollAttached) return;
    globalThis.removeEventListener('scroll', compute, { capture: true });
    scrollAttached = false;
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.target !== element) continue;
      isInView = entry.isIntersecting;
      if (isInView) attachScroll();
      else detachScroll();
      compute();
    }
  });

  observer.observe(element);
  globalThis.addEventListener('resize', compute);
  compute();

  return () => {
    observer.disconnect();
    detachScroll();
    globalThis.removeEventListener('resize', compute);
  };
}
