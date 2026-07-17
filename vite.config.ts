import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',

        workbox: {
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,

  navigateFallback: 'index.html',

  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.destination === 'document',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'script',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'js-cache',
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'style',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'css-cache',
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'font',
      handler: 'CacheFirst',
      options: {
        cacheName: 'font-cache',
      },
    },
  ],
},
        manifest: {
          id: '/',
          name: 'PPM - Personal Project Mentor',
          short_name: 'PP Mentor',
          description: 'Personal Project Mentor by EDUTN43',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#2563eb',
          orientation: 'portrait',

          icons: [
            {
              src: '/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
          ],
        },
      }),
    ],

    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});