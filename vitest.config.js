import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import workerThreads from 'node:worker_threads'

// Defensive polyfill for environments where worker_threads lacks markAsUncloneable
if (workerThreads && typeof workerThreads.markAsUncloneable !== 'function') {
  workerThreads.markAsUncloneable = () => {}
}

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setupTests.js'],
    css: false,
    pool: 'threads',
  },
})

