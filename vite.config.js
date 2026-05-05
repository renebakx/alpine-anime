import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom'
  },
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'AlpineAnime',
      formats: ['es', 'iife'],
      fileName: (format) => (format === 'es' ? 'module.js' : 'cdn.js')
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
    target: 'es2018'
  }
});
