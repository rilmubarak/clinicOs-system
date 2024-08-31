import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'src': '/src' // Convert to absolute
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
})
