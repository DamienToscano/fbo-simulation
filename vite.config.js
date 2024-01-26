import { defineConfig } from 'vite'
import ViteGLSL from 'vite-plugin-glsl';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteGLSL()],
})
