import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@lib-study': resolve(__dirname, 'packages'),
    },
  },
})
