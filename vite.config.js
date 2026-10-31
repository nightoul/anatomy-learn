import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/the-body/',
  // Unit tests (Vitest) live in the tests/ folder.
  test: {
    include: ['tests/**/*.test.js'],
  },
})
