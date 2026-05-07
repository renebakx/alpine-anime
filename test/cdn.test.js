import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test, vi, beforeEach } from 'vitest';

const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));

describe('CDN browser build', () => {
    beforeEach(() => {
        // Reset global state
        document.body.innerHTML = '';
        document.head.innerHTML = '';
        delete window.Alpine;
        delete window.AlpineAnime;
        delete globalThis.IntersectionObserver;
        vi.resetModules();
    });

    test('auto-registers on alpine:init', async () => {
        // Mock Alpine on window
        const pluginSpy = vi.fn();
        window.Alpine = {
            plugin: pluginSpy,
            directive: vi.fn()
        };

        // Import the CDN entry point
        // In a real browser, this would be executed via <script src="dist/cdn.js">
        // which sets window.AlpineAnime because of Vite's build.lib.name = 'AlpineAnime'
        // Since we are in a test environment and importing it as a module, 
        // we can simulate the global assignment if needed, but src/cdn.js 
        // mainly handles the event listener.
        
        await import('../src/cdn.js');

        // Dispatch alpine:init
        document.dispatchEvent(new CustomEvent('alpine:init'));

        // Verify plugin was registered
        expect(pluginSpy).toHaveBeenCalled();
        
        // The first argument to Alpine.plugin() should be our plugin function
        const registeredPlugin = pluginSpy.mock.calls[0][0];
        expect(typeof registeredPlugin).toBe('function');
        
        // Verify it exposes the expected API
        expect(typeof registeredPlugin.definePreset).toBe('function');
    });

    test('is available as window.AlpineAnime when loaded via CDN', async () => {
        // Simulate the IIFE behavior where Vite assigns the export to a global
        // In src/cdn.js, it exports default plugin.
        const cdnModule = await import('../src/cdn.js');
        window.AlpineAnime = cdnModule.default;

        expect(window.AlpineAnime).toBeDefined();
        expect(window.AlpineAnime.version).toBe(packageJson.version);
        expect(typeof window.AlpineAnime.definePreset).toBe('function');
        
        // Test defining a preset via the global object
        window.AlpineAnime.definePreset('cdn-test', { opacity: [0, 1] });
        
        // Verify it was registered in the presets (we can import getPreset to check)
        const { getPreset } = await import('../src/presets.js');
        expect(getPreset('cdn-test')).toEqual({ opacity: [0, 1] });
    });

    test('built CDN file supports README custom presets registered during alpine:init', () => {
        const directiveSpy = vi.fn();
        const pluginSpy = vi.fn((plugin) => {
            if (plugin === window.AlpineAnime) {
                plugin({ directive: directiveSpy });
            }
        });
        window.Alpine = {
            plugin: pluginSpy
        };

        document.addEventListener('alpine:init', () => {
            window.AlpineAnime.definePreset('blur-up', {
                opacity: [0, 1],
                y: [24, 0],
                filter: ['blur(12px)', 'blur(0px)'],
                ease: 'cubicBezier(0.7, 0.1, 0.5, 0.9)'
            });
        });

        const observers = [];
        const observerOptions = [];
        globalThis.IntersectionObserver = class {
            constructor(callback, options) {
                this.callback = callback;
                observers.push(this);
                observerOptions.push(options);
            }

            observe() {}
            unobserve() {}
            disconnect() {}
        };
        const animateSpy = vi.fn(() => ({
            cancel: vi.fn(),
            commitStyles: vi.fn(),
            finished: Promise.resolve(),
            pause: vi.fn(),
            play: vi.fn()
        }));
        const originalAnimate = Element.prototype.animate;
        Element.prototype.animate = animateSpy;

        try {
            const cdnScript = readFileSync(resolve('dist/cdn.js'), 'utf8');
            window.eval(cdnScript);
            document.dispatchEvent(new CustomEvent('alpine:init'));

            expect(window.AlpineAnime).toBeDefined();
            expect(pluginSpy).toHaveBeenCalledWith(window.AlpineAnime);
            expect(directiveSpy).toHaveBeenCalledWith('anime', expect.any(Function));

            const directive = directiveSpy.mock.calls[0][1];
            const element = document.createElement('article');
            directive(element, { modifiers: ['blur-up', 'once', 'duration', '900', 'threshold', '35', 'enter', '25', 'leave', '-10'] });
            observers[0].callback([{ target: element, isIntersecting: false, intersectionRatio: 0 }]);

            expect(element.style.opacity).toBe('0');
            expect(element.style.transform).toBe('translateY(24px)');
            expect(element.style.filter).toBe('blur(12px)');
            expect(observerOptions[0]).toEqual({
                threshold: 0.35,
                rootMargin: '-10% 0px 25% 0px'
            });

            const initiallyVisibleElement = document.createElement('article');
            initiallyVisibleElement.getBoundingClientRect = () => ({
                top: 100,
                left: 100,
                right: 300,
                bottom: 300,
                width: 200,
                height: 200
            });

            directive(initiallyVisibleElement, { modifiers: ['blur-up', 'once', 'threshold', '20'] });

            expect(initiallyVisibleElement.style.opacity).toBe('0');
            expect(initiallyVisibleElement.style.transform).toBe('translateY(0px)');
            expect(initiallyVisibleElement.style.filter).toBe('blur(0px)');
            expect(animateSpy).toHaveBeenCalledTimes(1);
            expect(animateSpy.mock.calls[0][0]).toEqual({ opacity: ['0', '1'] });
            expect(observerOptions).toHaveLength(1);
        } finally {
            if (originalAnimate) {
                Element.prototype.animate = originalAnimate;
            } else {
                delete Element.prototype.animate;
            }
        }
    });
});
