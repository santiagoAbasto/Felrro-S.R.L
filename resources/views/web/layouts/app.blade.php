<!DOCTYPE html>
<html lang="{{ session('locale', 'es') }}">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Felrro - Cables Especiales')</title>
    <meta name="description" content="@yield('meta_description', 'Fabricación de conductores eléctricos especiales certificados UL e ISO 9001.')">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Felrro S.R.L.">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="@yield('title', 'Felrro - Cables Especiales')">
    <meta property="og:description" content="@yield('meta_description', 'Fabricación de conductores eléctricos especiales.')">
    <meta property="og:type" content="website">

    {{-- ANTI-FOUC: ocultar body hasta que CSS esté listo --}}
    <style>body{visibility:hidden;}</style>

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
    @vite(['resources/css/web.css', 'resources/js/web.js'])
</head>
<body>

    @include('web.components.navbar')

    <main>@yield('content')</main>

    @include('web.components.footer')

    {{-- WHATSAPP FLOTANTE GLOBAL --}}
    @php $wa = \App\Models\SiteSetting::getRaw('footer'); @endphp
    @if(!empty($wa['whatsapp']))
    <a href="https://wa.me/{{ preg_replace('/\D/', '', $wa['whatsapp']) }}"
       target="_blank"
       class="whatsapp-float"
       aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.52 3.48A11.8 11.8 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.18 1.6 6L0 24l6.18-1.62A11.95 11.95 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.9 0-3.75-.5-5.37-1.44l-.38-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 012 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.07-7.75c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.4-1.65-1.56-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.54-.88-2.11-.23-.56-.46-.48-.64-.49h-.55c-.19 0-.49.07-.74.35-.25.28-.97.95-.97 2.32 0 1.37.99 2.7 1.13 2.88.14.19 1.95 2.99 4.73 4.2.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.66-.68 1.9-1.34.24-.66.24-1.23.17-1.35-.07-.12-.26-.19-.54-.33z"/>
        </svg>
    </a>
    @endif

    {{-- ANTI-FOUC: mostrar body cuando DOM + CSS listos --}}
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            document.body.style.visibility = 'visible';
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
