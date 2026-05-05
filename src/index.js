import directive from './directive.js';

export default function plugin(Alpine) {
  Alpine.directive('anime', directive);
}
