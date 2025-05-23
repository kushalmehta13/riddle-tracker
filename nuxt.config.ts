import { defineNuxtConfig } from 'nuxt/config'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  typescript: {
    typeCheck: true,
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'], // You might need a setup file for Nuxt environment
    coverage: {
      provider: 'v8'
    }
  },
  vite: {
    plugins: [
      tsconfigPaths()
    ]
  }
}) 