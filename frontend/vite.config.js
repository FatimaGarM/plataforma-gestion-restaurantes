import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      'unsuited-relenting-remorse.ngrok-free.dev',
      '.ngrok-free.dev',
      '.devtunnels.ms',
      'localhost',
      '127.0.0.1'
    ],
    proxy: {
      '/empleados': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) return '/index.html';
        }
      },
      '/platos': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/pedidos': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) return '/index.html';
        }
      },
      '/estadisticas': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) return '/index.html';
        }
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/configuracion': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) return '/index.html';
        }
      },
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/servicios': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/cartas': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) return '/index.html';
        }
      },
      '/publica': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/menus': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) return '/index.html';
        }
        },
      '/productos': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) return '/index.html';
        }
      },
      '/proveedores': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) return '/index.html';
        }
      }
    }
  }
})
