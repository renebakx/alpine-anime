export function observe(element, callback, config) {
  if (typeof IntersectionObserver !== 'function') {
    callback({ isIntersecting: true, target: element });
    return () => {};
  }

  let hasIntersected = false;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.target !== element) continue;

      if (!entry.isIntersecting) {
        hasIntersected = false;
        continue;
      }

      if (hasIntersected) {
        continue;
      }

      hasIntersected = true;
      callback(entry);

      if (!config.replay) {
        observer.unobserve(element);
      }
    }
  }, {
    threshold: config.threshold
  });

  observer.observe(element);

  return () => {
    if (typeof observer.disconnect === 'function') {
      observer.disconnect();
      return;
    }

    if (typeof observer.unobserve === 'function') {
      observer.unobserve(element);
    }
  };
}
