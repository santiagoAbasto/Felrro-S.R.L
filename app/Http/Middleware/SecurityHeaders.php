<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
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

        // Content Security Policy - previene XSS
        $response->header(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' fonts.gstatic.com; connect-src 'self' https:;"
        );

        // Force HTTPS (HSTS)
        // Comentado para desarrollo local - descomentar en producción
        // $response->header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        return $response;
    }
}
