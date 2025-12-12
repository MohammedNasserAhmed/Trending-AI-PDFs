import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'analytics': ['./src/features/analytics/services/analyticsService.js'],
          'catalog': ['./src/features/catalog/services/catalogService.js']
        }
      }
    }
  },
  optimizeDeps: {
    include: []
  }
});
