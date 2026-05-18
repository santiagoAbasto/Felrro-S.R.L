<header class="navbar {{ request()->routeIs('home') ? 'navbar--transparent' : 'navbar--solid' }}" id="main-navbar">
    <div class="nav-inner">

        <!-- LOGO -->
        <div class="logo">
            <a href="{{ route('home') }}">
                <img src="{{ asset('images/logo.png') }}" alt="Felrro" fetchpriority="high" decoding="async">
            </a>
        </div>

        <!-- LINKS DESKTOP -->
        <nav class="nav-links" id="nav-links">
            <a href="{{ route('nosotros') }}" class="nav-nosotros {{ request()->routeIs('nosotros') ? 'active' : '' }}">{{ __('messages.nav_nosotros') }}</a>
            <a href="{{ route('productos.index') }}" class="{{ request()->routeIs('productos.*') ? 'active' : '' }}">{{ __('messages.nav_productos') }}</a>
            <a href="{{ route('sectores') }}" class="{{ request()->routeIs('sectores') ? 'active' : '' }}">{{ __('messages.nav_sectores') }}</a>
            <a href="{{ route('calidad') }}" class="{{ request()->routeIs('calidad') ? 'active' : '' }}">{{ __('messages.nav_calidad') }}</a>
            <a href="{{ route('descargas') }}" class="{{ request()->routeIs('descargas') ? 'active' : '' }}">{{ __('messages.nav_descargas') }}</a>
            <a href="{{ route('novedades') }}" class="{{ request()->routeIs('novedades') || request()->routeIs('novedades.show') ? 'active' : '' }}">{{ __('messages.nav_novedades') }}</a>
            <a href="{{ route('rrhh') }}" class="{{ request()->routeIs('rrhh') ? 'active' : '' }}">{{ __('messages.nav_rrhh') }}</a>
            <a href="{{ route('clientes') }}" class="{{ request()->routeIs('clientes') ? 'active' : '' }}">{{ __('messages.nav_clientes') }}</a>
            <a href="{{ route('contacto') }}" class="{{ request()->routeIs('contacto') ? 'active' : '' }}">{{ __('messages.nav_contacto') }}</a>
        </nav>

        <!-- ACTIONS -->
        <div class="nav-actions">

            <!-- LUPA -->
            <a href="{{ route('buscador') }}" class="nav-search-btn" aria-label="Buscar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21L16.66 16.66M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </a>

            <!-- IDIOMA -->
            <div class="lang-switch">
                <button class="lang-current" type="button">
                    {{ strtoupper(app()->getLocale()) }}
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <div class="lang-dropdown">
                    @if(app()->getLocale() === 'es')
                    <a href="{{ route('lang.switch', 'en') }}">EN</a>
                    @else
                    <a href="{{ route('lang.switch', 'es') }}">ES</a>
                    @endif
                </div>
            </div>

            <!-- COTIZACIÓN -->
            <a href="{{ route('cotizacion') }}" class="btn-adaptive">
                {{ __('messages.nav_quote') }}
            </a>

            <!-- HAMBURGER (solo mobile) -->
            <button class="nav-hamburger" id="nav-hamburger" aria-label="Menú" type="button">
                <span></span>
                <span></span>
                <span></span>
            </button>

        </div>

    </div>

    <!-- MENÚ MOBILE -->
    <div class="nav-mobile" id="nav-mobile">
        <nav class="nav-mobile__links">
            <a href="{{ route('nosotros') }}" class="nav-nosotros {{ request()->routeIs('nosotros') ? 'active' : '' }}">{{ __('messages.nav_nosotros') }}</a>
            <a href="{{ route('productos.index') }}" class="{{ request()->routeIs('productos.*') ? 'active' : '' }}">{{ __('messages.nav_productos') }}</a>
            <a href="{{ route('sectores') }}" class="{{ request()->routeIs('sectores') ? 'active' : '' }}">{{ __('messages.nav_sectores') }}</a>
            <a href="{{ route('calidad') }}" class="{{ request()->routeIs('calidad') ? 'active' : '' }}">{{ __('messages.nav_calidad') }}</a>
            <a href="{{ route('descargas') }}" class="{{ request()->routeIs('descargas') ? 'active' : '' }}">{{ __('messages.nav_descargas') }}</a>
            <a href="{{ route('novedades') }}" class="{{ request()->routeIs('novedades') || request()->routeIs('novedades.show') ? 'active' : '' }}">{{ __('messages.nav_novedades') }}</a>
            <a href="{{ route('rrhh') }}" class="{{ request()->routeIs('rrhh') ? 'active' : '' }}">{{ __('messages.nav_rrhh') }}</a>
            <a href="{{ route('clientes') }}" class="{{ request()->routeIs('clientes') ? 'active' : '' }}">{{ __('messages.nav_clientes') }}</a>
            <a href="{{ route('contacto') }}" class="{{ request()->routeIs('contacto') ? 'active' : '' }}">{{ __('messages.nav_contacto') }}</a>
            <a href="{{ route('cotizacion') }}" class="nav-mobile__cta">{{ __('messages.nav_quote') }}</a>
        </nav>
    </div>

</header>

<script>
    (function() {
        const hamburger = document.getElementById('nav-hamburger');
        const mobileMenu = document.getElementById('nav-mobile');
        const navbar = document.getElementById('main-navbar');

        if (!hamburger || !mobileMenu) return;

        hamburger.addEventListener('click', function() {
            const isOpen = mobileMenu.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            // En home con navbar transparente, cuando abre el menú ponemos fondo
            navbar.classList.toggle('nav-mobile-open', isOpen);
        });

        // Cerrar al clickear un link
        mobileMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('open');
                navbar.classList.remove('nav-mobile-open');
            });
        });
    })();
</script>
