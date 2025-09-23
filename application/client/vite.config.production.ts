import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// Temporarily disable devtools for production builds
// import VueDevTools from 'vite-plugin-vue-devtools';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    // Only enable devtools in development
    // process.env.NODE_ENV === 'development' && VueDevTools(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/ui'),
    },
  },
  server: {
    port: 3001, // Your configured port
  },
});
