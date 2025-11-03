import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          monaco: ['monaco-editor']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['monaco-editor', 'marked'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  worker: {
    format: 'es'
  },
  resolve: {
    alias: {
      'monaco-editor': 'monaco-editor/esm/vs/editor/editor.api.js'
    }
  }
})
