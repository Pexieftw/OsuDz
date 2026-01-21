import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/osu': {
        target: 'https://osu.ppy.sh/api/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/osu/, ''),
      }
    }
  }
})