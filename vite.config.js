import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {} // helps avoid undefined process.env in browser
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
    open: false
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    esbuildOptions: {
      loader: { '.js': 'jsx' }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    },
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  base: '/',
  assetsInclude: [
    '**/*.png', '**/*.jpg', '**/*.jpeg',
    '**/*.gif', '**/*.svg', '**/*.ico'
  ]
})
