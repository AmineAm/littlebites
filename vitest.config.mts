import { defineConfig } from 'vitest/config'
import path from 'node:path'

// Pure-logic seam only — src/utils/. These modules import types only (erased at
// runtime), so no React Native transform is needed. See CLAUDE.md § Testing.
export default defineConfig({
  test: {
    include: ['src/utils/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
