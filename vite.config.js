import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isCdn = mode === 'cdn' || mode === 'debug';
  const isDebug = mode === 'debug';

  return {
    define: {
      __DEBUG__: isDebug
    },
    test: {
      environment: 'jsdom'
    },
    build: {
      lib: {
        entry: isCdn ? 'src/cdn.js' : 'src/index.js',
        name: 'AlpineAnime',
        formats: isCdn ? ['iife'] : ['es'],
        fileName: (format) => {
          if (format === 'es') return 'module.js';
          return isDebug ? 'cdn.debug.js' : 'cdn.js';
        }
      },
      rollupOptions: {
        external: ['alpinejs'],
        output: {
          globals: {
            alpinejs: 'Alpine'
          }
        }
      },
      minify: isDebug ? false : 'esbuild',
      target: 'es2018',
      emptyOutDir: !isCdn
    }
  };
});
