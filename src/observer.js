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

  if (typeof __DEBUG__ !== 'undefined' && __DEBUG__) {
    console.log('[Alpine Anime] Setting up observer', element);
    console.log('[Alpine Anime] Root margins - enter:', enterMargin, 'leave:', leaveMargin);
    console.log('[Alpine Anime] Threshold:', config?.threshold);
  }

  if (typeof IntersectionObserver !== 'function') {
    if (typeof __DEBUG__ !== 'undefined' && __DEBUG__) {
      console.warn('[Alpine Anime] IntersectionObserver not supported, triggering enter immediately');
    }
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
          if (typeof __DEBUG__ !== 'undefined' && __DEBUG__) {
            console.log('[Alpine Anime] Leave viewport', entry.target);
          }
          leave(entry);
        }

        hasIntersected = false;
        continue;
      }

      if (hasIntersected) {
        continue;
      }

      hasIntersected = true;
      if (typeof __DEBUG__ !== 'undefined' && __DEBUG__) {
        console.log('[Alpine Anime] Enter viewport', entry.target);
      }
      if (typeof enter === 'function') {
        enter(entry);
      }

      if (!config.replay) {
        if (typeof __DEBUG__ !== 'undefined' && __DEBUG__) {
          console.log('[Alpine Anime] Once: unobserving', entry.target);
        }
        observer.unobserve(element);
      }
    }
  }, {
    threshold: config.threshold,
    rootMargin: `${leaveMargin} 0px ${enterMargin} 0px`
  });

  observer.observe(element);

  return () => {
    if (typeof __DEBUG__ !== 'undefined' && __DEBUG__) {
      console.log('[Alpine Anime] Disconnecting observer', element);
    }
    if (typeof observer.disconnect === 'function') {
      observer.disconnect();
      return;
    }

    if (typeof observer.unobserve === 'function') {
      observer.unobserve(element);
    }
  };
}
