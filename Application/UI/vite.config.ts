import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

export default defineConfig({
  plugins: [vue(), VueDevTools()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  /** Pre-bundle heavy PDF deps so the dev server does not serve stale `?v=` hashes (504 Outdated Optimize Dep). */
  optimizeDeps: {
    include: ['html2canvas', 'jspdf'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
