import { defineVitestConfig } from '@nuxt/test-utils/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineVitestConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    coverage: {
      provider: 'v8'
    },
    // You can add other Vitest options here
  },
  plugins: [
    tsconfigPaths()
  ]
}) 