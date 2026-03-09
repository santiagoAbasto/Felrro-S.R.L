import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import '../css/admin/globals.css'
import '../css/admin/app.css'
import '../css/admin/override/reboot.css'

import '../css/admin/layouts/container.css'
import '../css/admin/layouts/header.css'
import '../css/admin/layouts/sidebar.css'

import '../css/admin/pages/dashboards.css'
import '../css/admin/pages/auth.css'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
