import { defineConfig } from 'vite';
import { resolve } from 'path';
// To migrate to React: npm install react react-dom @vitejs/plugin-react
// import react from '@vitejs/plugin-react';

export default defineConfig({
  // plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // Module 01 — JavaScript
        'js-hub':             resolve(__dirname, 'modules/01-javascript/index.html'),
        'js-objects':         resolve(__dirname, 'modules/01-javascript/pages/objects.html'),
        'js-arrays':          resolve(__dirname, 'modules/01-javascript/pages/arrays.html'),
        'js-matrices':        resolve(__dirname, 'modules/01-javascript/pages/matrices.html'),
        'js-linked-list':     resolve(__dirname, 'modules/01-javascript/pages/linked-list.html'),
        'js-doubly-linked':   resolve(__dirname, 'modules/01-javascript/pages/doubly-linked-list.html'),
        'js-stacks':          resolve(__dirname, 'modules/01-javascript/pages/stacks.html'),
        'js-queues':          resolve(__dirname, 'modules/01-javascript/pages/queues.html'),
        'js-sorting':         resolve(__dirname, 'modules/01-javascript/pages/sorting.html'),
        // Module 02 — Frontend & Git
        'fe-hub':             resolve(__dirname, 'modules/02-frontend/index.html'),
        'fe-git':             resolve(__dirname, 'modules/02-frontend/pages/git-github.html'),
        'fe-html':            resolve(__dirname, 'modules/02-frontend/pages/html-basico.html'),
        'fe-css':             resolve(__dirname, 'modules/02-frontend/pages/css-basico.html'),
      },
    },
  },
});
