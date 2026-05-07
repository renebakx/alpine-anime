import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isCdn = mode === 'cdn';

  return {
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
          return 'cdn.js';
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
      minify: 'esbuild',
      target: 'es2018',
      emptyOutDir: !isCdn
    }
  };
});
