# Alpine.js meets AnimeJS

Alpine.js meets AnimeJS is a small, headless `x-anime` directive for viewport-driven reveal animations.

The focus is intentionally narrow: make AnimeJS easings and reveal presets easier to add through `IntersectionObserver`. Drop it into a project, add an `x-anime` preset to an element, and get a working animation without writing custom CSS for that element.

This project does not try to implement the full AnimeJS API. It keeps the API small and preset-based, so it stays easy to use in normal HTML templates.

## Quick Start

### Install

```bash
npm install alpine-anime alpinejs
```

For local development in this repository:

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
```

The CDN build registers itself on Alpine's `alpine:init` event.

## No Extra CSS Required

Supported presets are self-contained after Alpine initializes. For elements below the viewport, the directive applies the initial inline opacity/transform state, observes the element, and runs the WAAPI animation when the element enters the viewport.

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

One caveat is first paint. If an element must be hidden before JavaScript starts, use a project-level strategy such as Alpine's `x-cloak`. This is optional flash prevention, not animation CSS per element.

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

## Startup Visibility

The directive checks the element position when Alpine initializes. If the element is already visible in the viewport, the directive treats it as first-screen content.

First-screen content should not slide, scale, or blur from an off-screen state. That can look broken because the user already sees the element. Instead, the directive applies the final preset styles immediately and only runs the opacity part of the preset.

For example:

```html
<div x-anime.fade-up.once.threshold.20>
  First-screen image or card.
</div>
```

If this element is already in the viewport on page load:

```text
Applied immediately:
- transform: translateY(0px)
- opacity: 0

Animated:
- opacity: 0 -> 1
```

So the element fades in where it already belongs. It does not move up from `translateY(50px)`.

If the same element starts below the viewport, the full preset still runs when it enters:

```text
Initial state below viewport:
- transform: translateY(50px)
- opacity: 0

Animated on enter:
- transform: translateY(50px) -> translateY(0px)
- opacity: 0 -> 1
```

The startup visibility check is intentionally simple:

- It uses `checkVisibility()` when the browser supports it.
- It falls back to computed style checks for `display`, `visibility`, and `opacity`.
- It checks whether the element overlaps the current viewport.
- It does not use `threshold`, `enter`, or `leave`.

`threshold`, `enter`, and `leave` only control the `IntersectionObserver` behavior after startup. This means `threshold.20` can still control scroll-triggered entry, but it does not hide an element that is already visible when the page renders.

`fade-in-out` is the exception to the "stop after startup" rule. If a `fade-in-out` element is visible at startup, it fades in at its final position and keeps observing so the leave animation can run later.

## Presets

Exactly one preset modifier is required. If none or multiple presets are present, the directive does nothing.

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
<div x-anime.fade-in-out.enter.25.leave.-10.duration.1400>
  Repeats while scrolling in and out.
</div>
```

### `parallax`

Scroll-synced vertical movement, from `translate: 0px 60px` to `translate: 0px -60px` by default. Unlike the reveal presets, this does not wait for an enter event and then play. It links the WAAPI animation to Anime.js `onScroll()` so the element follows scroll progress while it crosses the viewport.

Parallax uses the native CSS `translate` property instead of Anime.js `x` / `y` transform shortcuts. That keeps it separate from existing `transform` styles used by reveal effects.

```html
<figure x-anime.parallax>
  <img src="/feature.jpg" alt="Feature">
</figure>
```

Tune the total movement range with `amount`, flip the direction with `reverse`, or move horizontally with `axis.x`:

```html
<figure x-anime.parallax.amount.180.reverse></figure>
<figure x-anime.parallax.amount.240.axis.x></figure>
```

## Runtime Modifiers

Modifiers are written as Alpine modifier tokens.

| Modifier | Example | Behavior |
| --- | --- | --- |
| `duration.<ms>` | `duration.1200` | Animation duration in milliseconds |
| `delay.<ms>` | `delay.150` | Enter animation delay in milliseconds |
| `ease.bezier-in` | `ease.bezier-in` | Uses the built-in cubic-bezier in curve |
| `ease.bezier-out` | `ease.bezier-out` | Uses the built-in cubic-bezier out curve |
| `ease.power-in.<n>` | `ease.power-in.168` | Uses Anime.js `in(1.68)` |
| `ease.power-out.<n>` | `ease.power-out.250` | Uses Anime.js `out(2.5)` |
| `threshold.<percent>` | `threshold.35` | How much of the element must be visible before enter runs, clamped to `0..100` |
| `once` | `once` | Animate on first enter, then stop observing |
| `repeat` | `repeat` | Animate again after leaving and re-entering |
| `enter.<value>` / `start.<value>` | `enter.25` | Move the viewport bottom edge for enter detection |
| `leave.<value>` / `end.<value>` | `leave.-10` | Move the viewport top edge for leave detection |
| `amount.<px>` | `amount.180` | Total parallax movement in pixels, clamped to `0..1000` |
| `axis.x` / `axis.y` | `axis.x` | Parallax movement axis, default `y` |
| `reverse` | `reverse` | Flips parallax movement direction |

### Visibility vs Viewport Offsets

Use `threshold` when you care how much of the element is visible.

For example, this starts the fade when about 30% of the element is visible in the viewport:

```html
<div x-anime.fade.threshold.30>
  Starts when 30% visible.
</div>
```

```text
threshold.30

Viewport
+-------------------------------+
|                               |
|    +===================+      |
|    | Element           |      |
|    | visible 30%       |      |  enter runs here
+----|-------------------|------+
     | hidden 70%        |
     |                   |
     +===================+
```

Threshold values use whole percentages:

| Desired visibility | Modifier |
| --- | --- |
| Any visible part | `threshold.0` |
| 30% visible | `threshold.30` |
| Half visible | `threshold.50` |
| Fully visible | `threshold.100` |

Use `enter` and `leave` when you want to move the viewport trigger line, usually to start earlier or later while scrolling vertically. The `threshold` still applies inside that adjusted observer area. If you want a simple "trigger when it crosses this adjusted line" behavior, pair the offset with `threshold.0`.

`enter` changes the bottom edge of the observer viewport:

```text
enter.25.threshold.0

Normal viewport
+-------------------------------+
|                               |
|                               |
+-------------------------------+  normal bottom edge
|  +25% enter zone              |
|    +===================+      |
|    | Element           |      |  enter runs before visible
|    +===================+      |
+-------------------------------+  adjusted bottom edge
```

```html
<!-- Starts before the element reaches the visible viewport. -->
<div x-anime.fade-up.enter.25.threshold.0>
  Starts when it is within 25% of the viewport below the fold.
</div>

<!-- Starts later, after the element is deeper inside the viewport. -->
<div x-anime.fade-up.enter.-20.threshold.0>
  Starts after it has crossed 20% into the viewport.
</div>
```

`leave` changes the top edge of the observer viewport. This only matters for repeating animations or presets with leave behavior, such as `fade-in-out`.

```text
leave.-10.threshold.0

Adjusted top edge
+-------------------------------+
|  -10% leave zone              |  leave runs earlier
+-------------------------------+  normal top edge
|    +===================+      |
|    | Element           |      |
|    +===================+      |
|                               |
+-------------------------------+
```

```html
<!-- Leaves earlier as the element scrolls out through the top. -->
<div x-anime.fade-in-out.leave.-10.threshold.0>
  Fades out once it crosses the top 10% of the viewport.
</div>

<!-- Leaves later, after it has moved past the top edge. -->
<div x-anime.fade-in-out.leave.120px.threshold.0>
  Fades out 120px after passing the top of the viewport.
</div>
```

```text
leave.120px.threshold.0

Normal top edge
+-------------------------------+
|                               |
|                               |
|    +===================+      |
|    | Element           |      |  still considered visible
|    +===================+      |
+-------------------------------+
|  +120px leave zone            |  leave runs after passing top
+-------------------------------+  adjusted top edge
```

`enter.30` does not mean "30% of the element is visible". It means "expand the bottom observer edge by 30% of the viewport". For "30% visible", use `threshold.30`.

Supported margin values:

| Format | Example | Result |
| --- | --- | --- |
| Plain number | `enter.25` | `25%` |
| Pixels | `leave.80px` | `80px` |
| Negative percent | `leave.-10` | `-10%` |

## Easing Modifiers

The default ease is `out(2)`, matching Anime.js' WAAPI default. For common tuning, use the `ease.*` modifier namespace.

Bezier variants:

```html
<div x-anime.fade-up.ease.bezier-in></div>
<div x-anime.fade-up.ease.bezier-out></div>
```

The built-in bezier aliases map to concrete WAAPI strings:

| Modifier | Anime.js ease |
| --- | --- |
| `ease.bezier-in` | `cubicBezier(0.5, 0, 0.9, 0.3)` |
| `ease.bezier-out` | `cubicBezier(0.1, 0.7, 0.5, 1)` |

Power variants:

```html
<div x-anime.fade-left.ease.power-in.101></div>
<div x-anime.fade-left.ease.power-out.250></div>
```

Power values use integer hundredths because Alpine modifiers split on dots. The directive divides the integer by `100` before passing it to Anime.js:

| Modifier | Anime.js ease |
| --- | --- |
| `ease.power-in.101` | `in(1.01)` |
| `ease.power-out.168` | `out(1.68)` |
| `ease.power-out.250` | `out(2.5)` |
| `ease.power-in.1000` | `in(10)` |

Power values are clamped to `100..1000`, so the effective Anime.js range is `1..10`.

Raw `x1`, `y1`, `x2`, and `y2` bezier modifier support is intentionally not included. Positional control-point modifiers are hard to read and easy to misorder. Use a custom preset when you need an exact curve.

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
<div x-anime.scale-in.enter.20>
  Starts when the element is within 20% of the viewport below the fold.
</div>
```

Fade in and out:

```html
<div x-anime.fade-in-out.enter.25.leave.-10>
  Uses separate enter and leave animations.
</div>
```

Scroll-synced parallax:

```html
<figure x-anime.parallax.amount.180>
  Moves continuously with scroll progress.
</figure>
```

Custom ease:

```html
<div x-anime.scale-in.once.ease.power-out.250>
  Uses Anime.js out(2.5).
</div>
```

## Custom Presets

The built-in presets cover common reveal patterns. For project-specific motion, you can register custom presets using `AlpineAnime.definePreset`.

### ESM (Module Bundlers)

```js
import Alpine from 'alpinejs';
import AlpineAnime from 'alpine-anime';

AlpineAnime.definePreset('blur-up', {
  opacity: [0, 1],
  y: [24, 0],
  filter: ['blur(12px)', 'blur(0px)'],
  ease: 'cubicBezier(0.7, 0.1, 0.5, 0.9)'
});

Alpine.plugin(AlpineAnime);
Alpine.start();
```

### CDN (Browser)

The CDN version automatically registers itself on `alpine:init`. You can define custom presets within your own `alpine:init` listener:

```html
<script defer src="https://unpkg.com/alpine-anime/dist/cdn.js"></script>
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

<script>
  document.addEventListener('alpine:init', () => {
    window.AlpineAnime.definePreset('blur-up', {
      opacity: [0, 1],
      y: [24, 0],
      filter: ['blur(12px)', 'blur(0px)'],
      ease: 'cubicBezier(0.7, 0.1, 0.5, 0.9)'
    });
  });
</script>
```

Register custom presets before Alpine starts. The example above works because the inline script is parsed before the deferred Alpine script runs.

Then use the preset like any built-in preset:

```html
<article x-anime.blur-up.once.duration.900>
  Custom preset reveal.
</article>
```

Custom presets can define WAAPI-compatible CSS properties and transform shortcuts:

| Property | Example | Notes |
| --- | --- | --- |
| `opacity` | `[0, 1]` | Initial/final inline states are applied automatically |
| `x` / `y` | `[24, 0]` | Composed into `translateX(...)` / `translateY(...)` before animation |
| `scale` | `[0.95, 1]` | Composed into `transform` before animation |
| CSS properties | `filter: ['blur(12px)', 'blur(0px)']` | Applied as inline initial/final states for self-contained presets |
| `ease` | `'cubicBezier(...)'` | Overrides the parsed/default ease for that preset |

If a custom preset uses the same name as a built-in preset, it overrides the built-in preset for the current page bundle.

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

Alpine.js meets AnimeJS uses Anime.js 4's `waapi.animate()` adapter from `animejs/waapi`. The `parallax` preset also uses `onScroll()` from `animejs/events` to link WAAPI animation progress to scroll position.

This is a good fit for the current presets because they animate CSS opacity and transforms. Anime.js documents WAAPI as a smaller path than the JavaScript `animate()` runtime and recommends it for CSS animations where page load size or CPU/network load matters.

Use the JavaScript Anime.js runtime instead for future features that need SVG or DOM attribute animation, JS object animation, canvas/WebGL/WebGPU animation, complex timelines/keyframes, advanced callbacks/control methods, or very large target counts. Those are intentionally outside this plugin's current preset-based surface.

References:

- [Anime.js WAAPI documentation](https://animejs.com/documentation/web-animation-api/)
- [Anime.js onScroll documentation](https://animejs.com/documentation/events/onscroll/)
- [When to use WAAPI](https://animejs.com/documentation/web-animation-api/when-to-use-waapi/)

## Easing Support

The directive uses `out(2)` by default and exposes common `ease.*` modifiers for bezier and power curves. Custom presets are the escape hatch for exact curves, springs, and project-specific motion.

Anime.js 4 WAAPI can use these easing families:

| Easing family | Examples | WAAPI status |
| --- | --- | --- |
| Built-in strings | `linear`, `outQuad`, `inOutExpo`, `outElastic(.8, 1.2)` | Supported by Anime.js `waapi.animate()` |
| Power strings | `in`, `out`, `inOut`, `outIn`, `out(2)` | Supported |
| Cubic bezier strings | `cubic-bezier(0, 0, 0.58, 1)`, `cubicBezier(.7, .1, .5, .9)` | Supported |
| Linear timing strings | `linear(0, 0.5 50%, 1)` | Supported |
| Steps strings | `steps(5)`, `steps(5, start)` | Supported |
| Function eases | `spring(...)`, `irregular(...)`, custom functions | Supported by Anime.js WAAPI through custom presets or direct runtime expansion |

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
| `ease` | `out(2)` |
| `threshold` | `0` |
| `replay` | `true` |
| `enterMargin` | `0px` |
| `leaveMargin` | `0px` |
| `parallax.amount` | `120` |
| `parallax.axis` | `y` |
| `parallax.reverse` | `false` |

## Behavior Notes

- Unknown modifiers are ignored.
- Invalid numeric values fall back to defaults.
- `threshold` modifiers are clamped to `0..100` and converted to the native `IntersectionObserver` `0..1` range.
- Startup visibility is checked directly with `checkVisibility()` when available, a computed-style fallback, and the element's current viewport overlap.
- Elements already in view get final preset styles immediately and then run an opacity-only fade. They do not run the movement, scale, or blur part of the enter animation.
- The `threshold`, `enter`, and `leave` modifiers only affect `IntersectionObserver` behavior after startup; they do not change the startup visibility check.
- `fade-in-out` still observes initially visible elements so the leave animation can run when they exit the viewport.
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
