function normalizeHandlers(handlers) {
  if (typeof handlers === 'function') {
    return {
      enter: handlers,
      leave: undefined
    };
  }

  return {
    enter: handlers?.enter,
    leave: handlers?.leave
  };
}

export function observe(element, handlers, config) {
  const { enter, leave } = normalizeHandlers(handlers);
  const enterMargin = config?.enterMargin ?? '0px';
  const leaveMargin = config?.leaveMargin ?? '0px';

  if (typeof IntersectionObserver !== 'function') {
    if (typeof enter === 'function') {
      enter({ isIntersecting: true, target: element });
    }

    return () => {};
  }

  let hasIntersected = false;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.target !== element) continue;

      if (!entry.isIntersecting) {
        if (hasIntersected && typeof leave === 'function') {
          leave(entry);
        }

        hasIntersected = false;
        continue;
      }

      if (hasIntersected) {
        continue;
      }

      hasIntersected = true;
      if (typeof enter === 'function') {
        enter(entry);
      }

      if (!config.replay) {
        observer.unobserve(element);
      }
    }
  }, {
    threshold: config.threshold,
    rootMargin: `${leaveMargin} 0px ${enterMargin} 0px`
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
