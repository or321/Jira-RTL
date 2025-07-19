import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'scripts/main.js')
      },
      output: {
        entryFileNames: 'jiraRTL.js'
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020'
  }
});