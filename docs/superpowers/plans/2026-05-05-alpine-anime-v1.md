# Alpine Anime V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready Alpine plugin named `alpine-anime` that provides an `x-anime` directive powered by Anime.js, with ESM and CDN builds, automated tests, and a minimal demo.

**Architecture:** Keep the plugin preset-first and intentionally small. The runtime is split into a directive entrypoint, static presets, a modifier parser, an `IntersectionObserver` wrapper, and a thin Anime.js adapter so the public API stays stable while the internals remain tree-shakable and testable.

**Tech Stack:** JavaScript, Alpine.js plugin API, Anime.js ESM build, Vite library mode, Vitest with jsdom, native `IntersectionObserver`

---

## Summary

- Build a single Alpine plugin that registers `x-anime`.
- Use static named presets selected from directive modifiers.
- Support modifiers only for runtime options: `duration`, `delay`, `threshold`, `once`, and explicit replay control.
- Default to replay on viewport re-entry; `once` disables replay.
- Output `dist/module.js` and `dist/cdn.js`.
- Externalize Alpine from the bundle and include Anime.js in the outputs.

## Public API and Interfaces

### Directive contract

Supported usage shape for v1:

```html
<div x-anime.fade-right></div>
<div x-anime.fade-up.duration.800.delay.150.once></div>
<div x-anime.scale-in.threshold.0_35.repeat></div>
```

Implementation rules:

- The preset must be provided as a modifier token.
- Exactly one preset modifier is required; none or multiple presets no-op.
- Supported preset names:
  - `fade-right`
  - `fade-left`
  - `fade-up`
  - `fade-down`
  - `scale-in`
- Supported modifiers:
  - `duration.<ms>`
  - `delay.<ms>`
  - `threshold.<ratio>`
  - `once`
  - `repeat`
- Defaults:
  - `duration: 800`
  - `delay: 0`
  - `easing: "easeOutQuad"`
  - `threshold: 0.2`
  - `replay: true`
- Precedence:
  - `once` sets `replay` to `false`
  - `repeat` sets `replay` to `true`
  - If both appear, the last modifier token wins

### Internal module contracts

- `src/index.js`
  - Default export: plugin installer function `(Alpine) => void`
  - Registers `Alpine.directive('anime', directive)`
- `src/directive.js`
  - Resolves preset name from modifiers
  - Applies initial hidden/transformed state before observing
  - Starts Anime.js when the observer callback fires
- `src/presets.js`
  - Exports a static preset map plus `getPreset(name)`
- `src/parser.js`
  - Exports `parseModifiers(modifiers)` returning normalized config:
    - `duration: number`
    - `delay: number`
    - `threshold: number`
    - `easing: string`
    - `replay: boolean`
- `src/observer.js`
  - Exports `observe(el, callback, config)` and ensures re-entry replay does not loop continuously while the element remains intersecting
- `src/anime.js`
  - Imports Anime.js from the ESM path only and re-exports the local adapter

## Implementation Changes

### Runtime

- Build the directive around static presets only; do not support arbitrary config objects or dynamic Anime.js option passthrough in v1.
- On initialization, derive the preset from modifiers, parse options, and exit early for missing, duplicate, or unknown preset usage.
- Apply initial opacity/transform styles from the first keyframe values before the element is observed.
- When the observer fires:
  - run Anime.js against the element
  - avoid repeated triggering while the element is still in the same visible session
  - allow a new run only after the element leaves and re-enters when `replay` is enabled
  - unobserve after the first successful run when `replay` is disabled

### Build and packaging

- Add Vite in library mode with:
  - entry: `src/index.js`
  - formats: `es`, `iife`
  - file names: `module.js`, `cdn.js`
  - `alpinejs` externalized with global `Alpine`
  - Anime.js bundled into both outputs
- Add Vitest as the only v1 test runner and use `jsdom` for directive-level DOM tests.
- Set package metadata for library consumption:
  - `name: "alpine-anime"`
  - `type: "module"`
  - `module: "dist/module.js"`
  - `unpkg: "dist/cdn.js"`
- Include scripts for:
  - `build`
  - `test`

### Project structure

Expected source layout:

```text
src/
  index.js
  directive.js
  presets.js
  parser.js
  observer.js
  anime.js
test/
  directive.test.js
  parser.test.js
  observer.test.js
demo/
  index.html
dist/
vite.config.js
package.json
```

### Error handling and normalization

- Unknown preset names should no-op without throwing.
- Invalid numeric modifier values should fall back to defaults.
- `threshold` values should be clamped to the valid `IntersectionObserver` range of `0` to `1`.
- The parser should accept decimal thresholds encoded via modifier tokens using underscore replacement, for example `0_35` -> `0.35`.
- The directive should not expose Anime.js instances publicly in v1.

## Test Plan

- Parser tests
  - returns default config when no supported modifiers are present
  - parses `duration`, `delay`, and `threshold`
  - clamps invalid threshold values
  - resolves `once` and `repeat` deterministically
  - ignores unrelated modifiers safely
- Preset and directive tests
  - known presets resolve correctly
  - unknown presets no-op
  - initial styles reflect the first preset frame
  - Anime.js receives the expected target and merged options
- Observer tests
  - callback fires on first intersection
  - callback does not re-fire continuously while still intersecting
  - callback re-fires after exit and re-entry when replay is enabled
  - observer unobserves after first run when replay is disabled
- Build verification
  - `npm run build` produces `dist/module.js` and `dist/cdn.js`
  - output treats Alpine as external and does not require it to be bundled
- Demo verification
  - demo page loads the CDN build and shows at least one working preset animation

## Assumptions and Defaults

- V1 is a preset-based animation plugin, not a general Anime.js wrapper.
- The canonical package name is `alpine-anime`, even though the workspace folder is named `alpine-animate`.
- The supported directive syntax is modifier-first preset plus option modifiers; expression-based preset syntax is out of scope for v1.
- Replay is enabled by default and can be made explicit with `repeat`; `once` disables replay.
- A minimal demo is required for manual verification, but full documentation and npm publishing workflow are not part of this plan.
- Playwright and other browser E2E tooling are out of scope for v1 unless CDN smoke coverage becomes a later requirement.
