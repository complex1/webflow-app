import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Conditionally import Vue DevTools only in development
let VueDevTools: any = null;
if (process.env.NODE_ENV === 'development') {
  try {
    VueDevTools = require('vite-plugin-vue-devtools').default;
  } catch (e) {
    console.warn('Vue DevTools plugin not available');
  }
}

export default defineConfig({
  plugins: [
    vue(),
    // Only include Vue DevTools in development
    ...(VueDevTools && process.env.NODE_ENV === 'development' ? [VueDevTools()] : [])
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/ui'),
    },
  },
  server: {
    port: 3001, // Your configured port
  },
});