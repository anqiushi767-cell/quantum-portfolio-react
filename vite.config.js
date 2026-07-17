import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// GitHub Pages 部署时设置 GHPAGES=true，其他环境（Vercel/本地）用根路径
const base = process.env.GHPAGES ? '/quantum-portfolio-react/' : '/';

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
        cabin: resolve(__dirname, 'cabin.html'),
      }
    }
  }
})
