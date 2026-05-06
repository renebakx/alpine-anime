import { describe, expect, test, vi, beforeEach } from 'vitest';

describe('CDN browser build', () => {
    beforeEach(() => {
        // Reset global state
        document.body.innerHTML = '';
        delete window.Alpine;
        delete window.AlpineAnime;
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
        expect(typeof window.AlpineAnime.definePreset).toBe('function');
        
        // Test defining a preset via the global object
        window.AlpineAnime.definePreset('cdn-test', { opacity: [0, 1] });
        
        // Verify it was registered in the presets (we can import getPreset to check)
        const { getPreset } = await import('../src/presets.js');
        expect(getPreset('cdn-test')).toEqual({ opacity: [0, 1] });
    });
});
