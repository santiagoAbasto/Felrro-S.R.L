<!DOCTYPE html>
<html lang="{{ $htmlLang }}" class="web-pending">
<head>
    @php
        $webManifest = [];
        $webManifestPath = public_path('build/manifest.json');

        if (is_file($webManifestPath)) {
            $webManifest = json_decode(file_get_contents($webManifestPath), true) ?: [];
        }

        $webCssAsset = $webManifest['resources/css/web.css']['file'] ?? null;
        $webJsAsset = $webManifest['resources/js/web.js']['file'] ?? null;
    @endphp

    <meta charset="UTF-8">
    <style>
        html.web-pending body {
            visibility: hidden;
            opacity: 0;
        }
    </style>
    <script>
        window.addEventListener('load', function () {
            document.documentElement.classList.remove('web-pending');
        });
    </script>

    <title>{{ $metaTitle }}</title>
    <meta name="description" content="{{ $metaDescription }}">
    @if(!empty($metaKeywords))
    <meta name="keywords" content="{{ $metaKeywords }}">
    @endif
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="{{ $siteAuthor }}">
    <meta name="robots" content="{{ $metaRobots }}">
    <meta name="theme-color" content="{{ $themeColor }}">
    <meta name="application-name" content="{{ $siteName }}">
    <meta name="apple-mobile-web-app-title" content="{{ $siteName }}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="canonical" href="{{ $canonicalUrl }}">
    <link rel="icon" type="image/svg+xml" href="{{ $faviconSvgUrl }}">
    <link rel="icon" type="image/png" sizes="96x96" href="{{ $faviconPngUrl }}">
    <link rel="icon" type="image/x-icon" href="{{ $faviconIcoUrl }}">
    <link rel="shortcut icon" href="{{ $faviconIcoUrl }}">
    <link rel="alternate icon" href="{{ $fallbackFaviconIcoUrl }}">
    <link rel="apple-touch-icon" sizes="180x180" href="{{ $appleTouchIconUrl }}">
    <link rel="manifest" href="{{ $manifestUrl }}">
    <meta property="og:locale" content="{{ $ogLocale }}">
    <meta property="og:title" content="{{ $ogTitle }}">
    <meta property="og:description" content="{{ $ogDescription }}">
    <meta property="og:type" content="{{ $ogType }}">
    <meta property="og:url" content="{{ $ogUrl }}">
    <meta property="og:site_name" content="{{ $siteName }}">
    <meta property="og:image" content="{{ $ogImage }}">
    <meta name="twitter:card" content="{{ $twitterCard }}">
    <meta name="twitter:title" content="{{ $twitterTitle }}">
    <meta name="twitter:description" content="{{ $twitterDescription }}">
    <meta name="twitter:image" content="{{ $twitterImage }}">
    @if(!empty($structuredDataJson))
    <script type="application/ld+json">{!! $structuredDataJson !!}</script>
    @endif

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
    @if($webCssAsset)
    <link
        rel="stylesheet"
        href="{{ asset('build/'.$webCssAsset) }}"
        onload="document.documentElement.classList.remove('web-pending')">
    @endif
    @if($webJsAsset)
    <script type="module" src="{{ asset('build/'.$webJsAsset) }}"></script>
    @endif
    <noscript>
        <style>
            html.web-pending body {
                visibility: visible;
                opacity: 1;
            }
        </style>
    </noscript>
</head>
<body>

    @include('web.components.navbar')

    <main>@yield('content')</main>

    @include('web.components.footer')

    {{-- WHATSAPP FLOTANTE GLOBAL --}}
    @if($floatingWhatsappEnabled && $floatingWhatsappHref)
    <a href="{{ $floatingWhatsappHref }}"
       target="_blank"
       rel="noopener noreferrer"
       class="footer__whatsapp-float"
       data-label="{{ $floatingWhatsappLabel }}"
       data-bottom-offset="{{ $floatingWhatsappBottomOffset }}"
       style="--whatsapp-bottom-offset: {{ $floatingWhatsappBottomOffset }}px;"
       aria-label="{{ $floatingWhatsappLabel }}">
        <span class="footer__whatsapp-float-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.52 3.48A11.8 11.8 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.18 1.6 6L0 24l6.18-1.62A11.95 11.95 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.9 0-3.75-.5-5.37-1.44l-.38-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 012 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.07-7.75c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.4-1.65-1.56-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.54-.88-2.11-.23-.56-.46-.48-.64-.49h-.55c-.19 0-.49.07-.74.35-.25.28-.97.95-.97 2.32 0 1.37.99 2.7 1.13 2.88.14.19 1.95 2.99 4.73 4.2.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.66-.68 1.9-1.34.24-.66.24-1.23.17-1.35-.07-.12-.26-.19-.54-.33z"/>
            </svg>
        </span>
    </a>
    @endif

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const whatsapp = document.querySelector('.footer__whatsapp-float');
            const footerBottom = document.querySelector('.footer-bottom');

            if (!whatsapp || !footerBottom) return;

            const updateWhatsappStop = () => {
                const bottomOffset = Number(whatsapp.dataset.bottomOffset || 67);
                const safeGap = 18;
                const footerTop = footerBottom.getBoundingClientRect().top;
                const naturalTop = window.innerHeight - bottomOffset - whatsapp.offsetHeight;
                const lift = Math.max(0, naturalTop + whatsapp.offsetHeight + safeGap - footerTop);

                whatsapp.style.setProperty('--whatsapp-footer-lift', `${Math.ceil(lift)}px`);
            };

            updateWhatsappStop();
            window.addEventListener('scroll', updateWhatsappStop, { passive: true });
            window.addEventListener('resize', updateWhatsappStop);
        });
    </script>

    <script>
        window.addEventListener("scroll", function() {
            const navbar = document.querySelector(".navbar");
            if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
        });
    </script>

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const box = document.querySelector(".about-page-video-box");
            const video = document.getElementById("aboutVideo");
            if (!box || !video) return;
            box.addEventListener("click", function(e) {
                if (e.target.closest("iframe")) return;
                if (video.paused) {
                    video.setAttribute("controls", "controls");
                    video.play();
                    box.classList.add("playing");
                    box.classList.remove("paused");
                } else {
                    video.pause();
                    box.classList.remove("playing");
                    box.classList.add("paused");
                }
            });
            video.addEventListener("ended", function() {
                box.classList.remove("playing");
                box.classList.remove("paused");
            });
        });
    </script>

    <script>
        function showFileInfo(input, infoId) {
            const info = document.getElementById(infoId);
            const prefix = infoId.replace('-info', '');
            if (input.files && input.files[0]) {
                const file = input.files[0];
                const sizeKB = (file.size / 1024).toFixed(0);
                const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                const sizeStr = file.size > 1024 * 1024 ? sizeMB + ' MB' : sizeKB + ' KB';
                document.getElementById(prefix + '-name').textContent = file.name;
                document.getElementById(prefix + '-size').textContent = sizeStr;
                const label = document.getElementById(prefix + '-label');
                if (label) label.style.display = 'none';
                info.style.display = 'block';
            }
        }
        function removeFile(inputName, infoId, labelId) {
            const input = document.querySelector(`input[name="${inputName}"]`);
            if (input) input.value = '';
            document.getElementById(infoId).style.display = 'none';
            const label = document.getElementById(labelId);
            if (label) label.style.display = 'flex';
        }
    </script>

    @stack('scripts')

</body>
</html>
