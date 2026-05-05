import { describe, expect, test } from 'vitest';
import Alpine from 'alpinejs';
import plugin from '../src/index.js';

describe('Alpine integration', () => {
  test('registers x-anime and applies initial preset styles', async () => {
    document.body.innerHTML = `
      <main x-data>
        <article id="card" x-anime.fade-up.once>
          <h2>Fade Up Once</h2>
        </article>
      </main>
    `;

    globalThis.IntersectionObserver = class {
      constructor(callback) {
        this.callback = callback;
      }

      observe() {}
      unobserve() {}
    };

    plugin(Alpine);
    Alpine.start();
    await Promise.resolve();

    const card = document.getElementById('card');
    expect(card.style.opacity).toBe('0');
    expect(card.style.transform).toBe('translateY(50px)');
  });
});
