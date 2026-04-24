<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Previene que el navegador interprete archivos como script si el MIME type es incorrecto
        $response->header('X-Content-Type-Options', 'nosniff');

        // Controla en qué contextos puede ser embebido el sitio (iframe)
        $response->header('X-Frame-Options', 'SAMEORIGIN');

        // Habilita la protección XSS del navegador
        $response->header('X-XSS-Protection', '1; mode=block');

        // Controla cuánta información de referrer se envía
        $response->header('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Especifica qué características del navegador pueden usarse
        $response->header('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');

        $hotOrigin = $this->resolveViteDevOrigin();

        $scriptSrc = [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            'cdn.jsdelivr.net',
        ];

        $styleSrc = [
            "'self'",
            "'unsafe-inline'",
            'fonts.googleapis.com',
        ];

        $connectSrc = [
            "'self'",
            'https:',
        ];

        $frameSrc = [
            "'self'",
            'https://www.google.com',
            'https://maps.google.com',
            'https://www.google.com.ar',
            'https://www.googleusercontent.com',
        ];

        if ($hotOrigin) {
            $scriptSrc[] = $hotOrigin;
            $styleSrc[] = $hotOrigin;
            $connectSrc[] = $hotOrigin;

            if (Str::startsWith($hotOrigin, 'http://')) {
                $connectSrc[] = Str::replaceFirst('http://', 'ws://', $hotOrigin);
            }

            if (Str::startsWith($hotOrigin, 'https://')) {
                $connectSrc[] = Str::replaceFirst('https://', 'wss://', $hotOrigin);
            }
        }

        $response->header(
            'Content-Security-Policy',
            sprintf(
                "default-src 'self'; script-src %s; style-src %s; img-src 'self' data: blob: https:; font-src 'self' fonts.gstatic.com; connect-src %s; frame-src %s;",
                implode(' ', array_unique($scriptSrc)),
                implode(' ', array_unique($styleSrc)),
                implode(' ', array_unique($connectSrc)),
                implode(' ', array_unique($frameSrc)),
            )
        );

        // Force HTTPS (HSTS)
        // Comentado para desarrollo local - descomentar en producción
        // $response->header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        return $response;
    }

    private function resolveViteDevOrigin(): ?string
    {
        $hotFile = public_path('hot');

        if (!is_file($hotFile)) {
            return null;
        }

        $hotUrl = trim((string) file_get_contents($hotFile));

        if ($hotUrl === '') {
            return null;
        }

        $parts = parse_url($hotUrl);

        if (!is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
            return null;
        }

        $origin = $parts['scheme'].'://'.$parts['host'];

        if (!empty($parts['port'])) {
            $origin .= ':'.$parts['port'];
        }

        return $origin;
    }
}
