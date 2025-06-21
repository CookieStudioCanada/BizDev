import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/BizDev/',
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['crypto-js']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
}) 