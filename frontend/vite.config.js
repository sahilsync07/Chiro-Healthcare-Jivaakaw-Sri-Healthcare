import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/Chiro-Healthcare-Jivaakaw-Sri-Healthcare/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        print: resolve(__dirname, 'print.html'),
      },
    },
  },
});
