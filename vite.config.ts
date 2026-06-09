import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  // server: {
  //   proxy: {
  //     '/resources': {
  //       target: 'https://d5fxjgfib5.execute-api.eu-west-3.amazonaws.com',
  //       changeOrigin: true,
  //       secure: true,
  //       rewrite: (path) => path,
  //     },
  //   },
  // },
})
