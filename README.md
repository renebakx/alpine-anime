# alpine-anime

A small Alpine.js plugin that adds the `x-anime` directive for viewport-driven animations powered by Anime.js.

It is designed for content reveal patterns:
- fade/slide in on viewport enter
- optional replay on re-entry
- optional fade out on viewport leave (`fade-in-out`)
- reduced-motion support (`prefers-reduced-motion`)

## Quick Start

### Install

```bash
npm install
```

### Build

```bash
npm run build
```

Outputs:
- `dist/module.js` (ESM)
- `dist/cdn.js` (browser global `AlpineAnime`)

### Use in browser (CDN style)

```html
<script defer src="dist/cdn.js"></script>
<script defer src="node_modules/alpinejs/dist/cdn.min.js"></script>
<script>
  document.addEventListener('alpine:init', () => {
    if (typeof window.AlpineAnime === 'function') {
      window.Alpine.plugin(window.AlpineAnime);
    }
  });
</script>
```

### Use with module bundlers

```js
import Alpine from 'alpinejs';
import AlpineAnime from 'alpine-anime';

Alpine.plugin(AlpineAnime);
Alpine.start();
```

## Directive Manual

### Base syntax

The plugin uses modifier-first syntax:

```html
<div x-anime.fade-left></div>
```

Exactly one preset modifier is required. If none or multiple presets are present, the directive no-ops.

### Presets

- `fade`
  - opacity only (`0 -> 1`)
- `fade-left`
  - slides from right to left (`translateX: 100 -> 0`) + opacity (`0 -> 1`)
- `fade-right`
  - slides from left to right (`translateX: -100 -> 0`) + opacity (`0 -> 1`)
- `fade-up`
  - slides up (`translateY: 50 -> 0`) + opacity (`0 -> 1`)
- `fade-down`
  - slides down (`translateY: -50 -> 0`) + opacity (`0 -> 1`)
- `scale-in`
  - scales (`0.9 -> 1`) + opacity (`0 -> 1`)
- `fade-in-out`
  - fades in on viewport enter and fades out on viewport leave

### Runtime modifiers

- `duration.<ms>`
  - animation duration in milliseconds
- `delay.<ms>`
  - enter animation delay in milliseconds
- `threshold.<ratio>`
  - `IntersectionObserver` threshold (`0..1`)
  - supports decimals via underscore, for example `threshold.0_35`
- `once`
  - disables replay after first successful enter
- `repeat`
  - allows replay after leaving and re-entering

### Viewport start/end tuning

You can tune observer start and leave points using root margins:

- `enter.<value>` or `start.<value>`
  - adjusts when enter is considered intersecting
- `leave.<value>` or `end.<value>`
  - adjusts when leave is triggered

Supported value formats:
- plain number -> pixels (`enter.120` => `120px`)
- `px` (`leave.80px`)
- `p` suffix for percentage (`enter.25p`, `leave.-10p`)

Example:

```html
<div x-anime.fade-in-out.enter.25p.leave.-10p.duration.1400></div>
```

### Defaults

- `duration`: `800`
- `delay`: `0`
- `easing`: `easeOutQuad`
- `threshold`: `0.2`
- `replay`: `true`
- `enterMargin`: `0px`
- `leaveMargin`: `0px`

## Behavior Notes

- Unknown modifiers are ignored.
- Invalid numeric values fall back to defaults.
- `threshold` is clamped to `0..1`.
- The plugin uses native `IntersectionObserver`.
- In environments without `IntersectionObserver`, enter animation falls back to immediate run.

## Accessibility (Reduced Motion)

If the user has `prefers-reduced-motion: reduce`, the plugin skips runtime animation and applies final visual state directly.

This avoids motion while keeping content visible and readable.

## Development

Run tests:

```bash
npm test
```

Demo page:

```text
demo/index.html
```
