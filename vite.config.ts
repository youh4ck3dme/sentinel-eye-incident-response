import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {}, // Explicitly empty to avoid defaults
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'Sentinel Eye Extreme - Incident Response AI',
          short_name: 'Sentinel Eye',
          description: 'Advanced AI-powered fraud detection and incident response system.',
          theme_color: '#000000',
          background_color: '#000000',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          // Cache Google Fonts, images, and other static assets
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      }),
      {
        name: 'configure-server',
        configureServer(server) {
          server.middlewares.use('/api/analyze', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk);
              req.on('end', async () => {
                try {
                  // Dynamically import the handler to avoid build issues if unrelated
                  const { handleAnalyze } = await import('./api/analyze');
                  const result = await handleAnalyze(JSON.parse(body), env.GEMINI_API_KEY);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(result));
                } catch (err) {
                  console.error('API Error:', err);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Internal Server Error' }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end();
            }
          });

          server.middlewares.use('/api/tts', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk);
              req.on('end', async () => {
                try {
                  const { handleTTS } = await import('./api/tts');
                  const result = await handleTTS(JSON.parse(body), env.GEMINI_API_KEY);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ audioData: result }));
                } catch (err) {
                  console.error('API TTS Error:', err);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'TTS Failed' }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end();
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
