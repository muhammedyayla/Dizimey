import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Dizimey/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: { // index.html'in bir kopyasını 404.html olarak oluşturmak için
      input: {
        main: 'index.html',
        '404': 'index.html', // index.html'i 404.html olarak da kullan
      },
    },
  },
})