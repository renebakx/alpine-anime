import { waapi } from 'animejs/waapi';
import { onScroll } from 'animejs/events';

export function animate(targets, parameters) {
  return waapi.animate(targets, parameters);
}

export function createScrollObserver(parameters) {
  return onScroll(parameters);
}

export default animate;
