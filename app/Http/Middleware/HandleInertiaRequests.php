<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * Dynamically define the root template.
     */
    public function rootView(Request $request)
    {
        // Si es ruta admin → usar layout admin
        if ($request->is('admin') || $request->is('admin/*')) {
            return 'admin';
        }

        // Todo lo demás usa el layout público Inertia
        return 'app';
    }

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Shared props for all Inertia pages.
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [

            // Usuario autenticado
            'auth' => [
                'user' => $request->user(),
            ],

            // Flash messages (para Toast)
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info'    => fn () => $request->session()->get('info'),
            ],
        ]);
    }
}