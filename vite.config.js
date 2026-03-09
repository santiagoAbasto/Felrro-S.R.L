import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        host: '127.0.0.1',
        port: 5173,
        strictPort: true,
    },

    plugins: [
        laravel({
            input: [
                // DMIN (Inertia + React)
                'resources/js/app.jsx',
                'resources/css/app.css',

                // WEB CORPORATIVA (Blade)
                'resources/css/web.css',
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