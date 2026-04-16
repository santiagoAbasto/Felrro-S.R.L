<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        @php
            $faviconPngPath = public_path('favicon/favicon-96x96.png');
            $faviconIcoPath = public_path('favicon/favicon.ico');
            $faviconSvgPath = public_path('favicon/favicon.svg');
            $appleTouchIconPath = public_path('favicon/apple-touch-icon.png');
            $manifestPath = public_path('favicon/site.webmanifest');

            $faviconVersion = file_exists($faviconPngPath) ? filemtime($faviconPngPath) : time();
            $faviconIcoVersion = file_exists($faviconIcoPath) ? filemtime($faviconIcoPath) : $faviconVersion;
            $faviconSvgVersion = file_exists($faviconSvgPath) ? filemtime($faviconSvgPath) : $faviconVersion;
            $appleTouchIconVersion = file_exists($appleTouchIconPath) ? filemtime($appleTouchIconPath) : $faviconVersion;
            $manifestVersion = file_exists($manifestPath) ? filemtime($manifestPath) : $faviconVersion;
        @endphp
        <link rel="icon" type="image/svg+xml" href="{{ asset('favicon/favicon.svg') }}?v={{ $faviconSvgVersion }}">
        <link rel="icon" type="image/png" sizes="96x96" href="{{ asset('favicon/favicon-96x96.png') }}?v={{ $faviconVersion }}">
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon/favicon.ico') }}?v={{ $faviconIcoVersion }}">
        <link rel="shortcut icon" href="{{ asset('favicon/favicon.ico') }}?v={{ $faviconIcoVersion }}">
        <link rel="alternate icon" href="{{ asset('favicon.ico') }}?v={{ $faviconIcoVersion }}">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('favicon/apple-touch-icon.png') }}?v={{ $appleTouchIconVersion }}">
        <link rel="manifest" href="{{ asset('favicon/site.webmanifest') }}?v={{ $manifestVersion }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
