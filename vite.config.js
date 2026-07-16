import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Vercel 部署用根路径，GitHub Pages 用仓库名路径
const base = process.env.VERCEL ? '/' : '/quantum-portfolio-react/'

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        works: resolve(__dirname, 'works.html'),
        lab: resolve(__dirname, 'lab.html'),
        contact: resolve(__dirname, 'contact.html'),
        blackbox: resolve(__dirname, 'blackbox.html'),
        notfound: resolve(__dirname, '404.html'),
      }
    }
  }
})
