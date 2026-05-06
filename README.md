# alpine-anime

A small Alpine.js plugin that adds a headless `x-anime` directive for viewport-driven reveal animations.

The directive is powered by Anime.js 4 `waapi.animate()`. The goal is simple: drop it into a project, add an `x-anime` preset to an element, and get a working animation without writing custom CSS for that element.

## Quick Start

### Install

```bash
npm install alpine-anime alpinejs
```

This repository's local setup still uses:

```bash
npm install
```

### Use with module bundlers

```js
import Alpine from 'alpinejs';
import AlpineAnime from 'alpine-anime';

Alpine.plugin(AlpineAnime);
Alpine.start();
```

```html
<section x-data>
  <div x-anime.fade-up>
    This fades in and moves up when it enters the viewport.
  </div>
</section>
```

### Use in browser builds

```html
<script defer src="/dist/cdn.js"></script>
<script defer src="/node_modules/alpinejs/dist/cdn.min.js"></script>
<script>
  document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(window.AlpineAnime);
  });
</script>
```

## No Extra CSS Required

Supported presets are self-contained after Alpine initializes. The directive applies the initial inline opacity/transform state, observes the element, and runs the WAAPI animation when the element enters the viewport.

You do not need per-element CSS like this:

```css
.my-card {
  opacity: 0;
  transform: translateY(50px);
}
```

Use the directive instead:

```html
<article x-anime.fade-up.once>
  <h2>Self-contained reveal</h2>
  <p>The directive sets the initial and final visual states.</p>
</article>
```

The only caveat is first paint. If an element must be hidden before JavaScript starts, use a project-level strategy such as Alpine's `x-cloak`. That is optional flash prevention, not animation CSS per element.

```html
<style>
  [x-cloak] {
    display: none !important;
  }
</style>

<div x-data x-cloak>
  <article x-anime.fade-up.once>Hidden until Alpine is ready.</article>
</div>
```

## Presets

Exactly one preset modifier is required. If none or multiple presets are present, the directive no-ops.

### `fade`

Opacity only, from `0` to `1`.

```html
<div x-anime.fade>
  Fades in every time it re-enters the viewport.
</div>
```

### `fade-left`

Starts to the right and slides left into place.

```html
<aside x-anime.fade-left.duration.1000>
  Slides in from the right.
</aside>
```

### `fade-right`

Starts to the left and slides right into place.

```html
<aside x-anime.fade-right.duration.1000>
  Slides in from the left.
</aside>
```

### `fade-up`

Starts lower and moves up into place.

```html
<article x-anime.fade-up.once>
  Common card reveal animation.
</article>
```

### `fade-down`

Starts higher and moves down into place.

```html
<header x-anime.fade-down.delay.150>
  Drops gently into place.
</header>
```

### `scale-in`

Starts at `0.9` scale and grows to full size while fading in.

```html
<figure x-anime.scale-in.once.duration.700>
  <img src="/product.jpg" alt="Product">
</figure>
```

### `fade-in-out`

Fades in on viewport enter and fades out on viewport leave.

```html
<div x-anime.fade-in-out.enter.25p.leave.-10p.duration.1400>
  Repeats while scrolling in and out.
</div>
```

## Runtime Modifiers

Modifiers are written as Alpine modifier tokens.

| Modifier | Example | Behavior |
| --- | --- | --- |
| `duration.<ms>` | `duration.1200` | Animation duration in milliseconds |
| `delay.<ms>` | `delay.150` | Enter animation delay in milliseconds |
| `threshold.<ratio>` | `threshold.0_35` | Intersection threshold, clamped to `0..1` |
| `once` | `once` | Animate on first enter, then stop observing |
| `repeat` | `repeat` | Animate again after leaving and re-entering |
| `enter.<value>` / `start.<value>` | `enter.25p` | Adjust when enter is considered intersecting |
| `leave.<value>` / `end.<value>` | `leave.-10p` | Adjust when leave is triggered |

Supported margin values:

| Format | Example | Result |
| --- | --- | --- |
| Plain number | `enter.120` | `120px` |
| Pixels | `leave.80px` | `80px` |
| Percent with `p` suffix | `enter.25p` | `25%` |
| Negative percent | `leave.-10p` | `-10%` |

## Scroll Behavior Examples

Animate once:

```html
<div x-anime.fade-up.once>
  Runs once and stays visible.
</div>
```

Replay on re-entry:

```html
<div x-anime.fade-left.repeat>
  Replays after leaving and entering again.
</div>
```

Start earlier:

```html
<div x-anime.scale-in.enter.20p>
  Starts when the viewport is within 20% of the element.
</div>
```

Fade in and out:

```html
<div x-anime.fade-in-out.enter.25p.leave.-10p>
  Uses separate enter and leave animations.
</div>
```

## Headless by Default

The plugin does not ship CSS and does not require Tailwind. It only controls the animation-related inline styles for supported presets.

Plain HTML:

```html
<article x-anime.fade-up.once>
  <h2>Plain card</h2>
  <p>Your existing CSS handles layout and typography.</p>
</article>
```

Tailwind 3.x or 4.x:

```html
<article
  class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
  x-anime.fade-up.once.duration.900
>
  <h2 class="text-lg font-semibold text-slate-900">Tailwind styled</h2>
  <p class="mt-2 text-sm text-slate-600">
    Tailwind styles the card. `x-anime` handles only the reveal animation.
  </p>
</article>
```

## WAAPI Runtime

`alpine-anime` uses Anime.js 4's `waapi.animate()` adapter from `animejs/waapi`.

This is a good fit for the current presets because they animate CSS opacity and transforms. Anime.js documents WAAPI as a smaller path than the JavaScript `animate()` runtime and recommends it for CSS animations where page load size or CPU/network load matters.

Use the JavaScript Anime.js runtime instead for future features that need SVG or DOM attribute animation, JS object animation, canvas/WebGL/WebGPU animation, complex timelines/keyframes, advanced callbacks/control methods, or very large target counts. Those are intentionally outside this plugin's current preset-based surface.

References:

- [Anime.js WAAPI documentation](https://animejs.com/documentation/web-animation-api/)
- [When to use WAAPI](https://animejs.com/documentation/web-animation-api/when-to-use-waapi/)

## Easing Support

The directive currently uses the internal default `outQuad`. There is no public `ease.*` modifier yet because Alpine modifier syntax is not a clean fit for function arguments like springs or custom cubic curves.

Anime.js 4 WAAPI can use these easing families:

| Easing family | Examples | WAAPI status |
| --- | --- | --- |
| Built-in strings | `linear`, `outQuad`, `inOutExpo`, `outElastic(.8, 1.2)` | Supported by Anime.js `waapi.animate()` |
| Power strings | `in`, `out`, `inOut`, `outIn`, `out(2)` | Supported |
| Cubic bezier strings | `cubic-bezier(0, 0, 0.58, 1)`, `cubicBezier(.7, .1, .5, .9)` | Supported |
| Linear timing strings | `linear(0, 0.5 50%, 1)` | Supported |
| Steps strings | `steps(5)`, `steps(5, start)` | Supported |
| Function eases | `spring(...)`, `irregular(...)`, custom functions | Supported by Anime.js WAAPI, but not exposed as directive modifiers |

References:

- [Built-in eases](https://animejs.com/documentation/easings/built-in-eases/)
- [Cubic Bezier easing](https://animejs.com/documentation/easings/cubic-bezier-easing/)
- [Linear easing](https://animejs.com/documentation/easings/linear-easing/)
- [Steps easing](https://animejs.com/documentation/easings/steps-easing/)
- [Spring and custom easings in WAAPI](https://animejs.com/documentation/web-animation-api/improvements-to-the-web-animation-api/spring-and-custom-easings/)
- [waapi.convertEase()](https://animejs.com/documentation/web-animation-api/waapi-convertease/)

## Defaults

| Option | Default |
| --- | --- |
| `duration` | `800` |
| `delay` | `0` |
| `ease` | `outQuad` |
| `threshold` | `0.2` |
| `replay` | `true` |
| `enterMargin` | `0px` |
| `leaveMargin` | `0px` |

## Behavior Notes

- Unknown modifiers are ignored.
- Invalid numeric values fall back to defaults.
- `threshold` is clamped to `0..1`.
- The plugin uses native `IntersectionObserver`.
- In environments without `IntersectionObserver`, enter animation falls back to immediate run.
- If the user has `prefers-reduced-motion: reduce`, the plugin skips runtime animation and applies final visual state directly.

## Development

Run tests:

```bash
npm test
```

Build:

```bash
npm run build
```

Outputs:

- `dist/module.js` for ESM
- `dist/cdn.js` for browser global `AlpineAnime`

Demo page:

```text
demo/index.html
```
