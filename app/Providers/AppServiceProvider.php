<?php

namespace App\Providers;

use App\Support\SeoMetaResolver;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\View\View;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 🔐 Forzar HTTPS cuando la request viene desde ngrok
        if (request()->server('HTTP_X_FORWARDED_PROTO') === 'https') {
            URL::forceScheme('https');
        }

        view()->composer('web.layouts.app', function (View $view): void {
            $page = $view->getData()['page'] ?? null;

            $view->with('seoMeta', SeoMetaResolver::resolve(request(), $page));
        });

        // Prefetch de Vite (tu configuración actual)
        Vite::prefetch(concurrency: 3);
    }
}
