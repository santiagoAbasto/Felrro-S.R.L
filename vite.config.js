import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

const viteHost = process.env.VITE_HOST ?? '0.0.0.0';
const vitePort = Number(process.env.VITE_PORT ?? 5173);
const hmrHost = process.env.VITE_HMR_HOST ?? 'localhost';
const hmrProtocol = process.env.VITE_HMR_PROTOCOL ?? 'ws';
const hmrPort = Number(process.env.VITE_HMR_PORT ?? vitePort);

export default defineConfig({
    server: {
        host: viteHost,
        port: vitePort,
        strictPort: true,
        cors: true,
        hmr: {
            host: hmrHost,
            protocol: hmrProtocol,
            port: hmrPort,
        },
    },

    plugins: [
        laravel({
            input: [
                // DMIN (Inertia + React)
                'resources/js/app.jsx',
                'resources/css/app.css',

                // WEB CORPORATIVA (Blade)
                'resources/js/web.js',
            ],
            refresh: true,
        }),
        react(),
    ],

    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
