import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: {
        quality: 70,
      },
      jpeg: {
        quality: 70,
      },
      jpg: {
        quality: 70,
      },
      webp: {
        quality: 70,
      },
      avif: {
        quality: 60,
      },
      svg: {
        multipass: true,
      },
      test: /\.(jpe?g|png|gif|tiff|webp|avif|svg)$/i,
      includePublic: true,
    }),
  ],
})
