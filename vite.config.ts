import { defineConfig } from 'vite'

export default defineConfig({
  base: './',  // This ensures assets use relative paths
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
}) 