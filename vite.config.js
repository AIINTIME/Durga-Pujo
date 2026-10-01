import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // older iPhones (iOS 14+) must be able to run the bundle, not only the newest Safari
  build: { target: ['es2020', 'safari14'] },
})
