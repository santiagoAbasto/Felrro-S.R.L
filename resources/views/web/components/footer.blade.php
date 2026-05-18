{{-- =========================================================
    FOOTER
    
========================================================= --}}
@php
$locale = app()->getLocale();
$footer = $footerSettings ?? [];
$footerEmails = collect($footer['emails'] ?? [])
    ->filter(fn ($email) => filled($email))
    ->values();

if ($footerEmails->isEmpty() && !empty($footer['email'])) {
    $footerEmails = collect([$footer['email']]);
}
@endphp

<footer class="footer">
    <div class="footer-inner">

        {{-- LOGO --}}
        <div class="footer-col--logo">
            <img src="{{ asset('images/logo.png') }}" alt="Felrro" class="footer-logo" loading="lazy" decoding="async">
        </div>

        {{-- SECCIONES --}}
        <div class="footer-col--sections">
            <h4 class="footer-heading">
                {{ $footer['sections_title'][$locale] ?? 'Secciones' }}
            </h4>

            <div class="footer-links-grid">
                <ul class="footer-links">
                    <li><a href="{{ route('nosotros') }}">{{ __('messages.nav_nosotros') }}</a></li>
                    <li><a href="{{ route('productos.index') }}">{{ __('messages.nav_productos') }}</a></li>
                    <li><a href="{{ route('sectores') }}">{{ __('messages.nav_sectores') }}</a></li>
                    <li><a href="{{ route('calidad') }}">{{ __('messages.nav_calidad') }}</a></li>
                    <li><a href="{{ route('descargas') }}">{{ __('messages.nav_descargas') }}</a></li>
                </ul>

                <ul class="footer-links">
                    <li><a href="{{ route('novedades') }}">{{ __('messages.nav_novedades') }}</a></li>
                    <li><a href="{{ route('rrhh') }}">{{ __('messages.nav_rrhh') }}</a></li>
                    <li><a href="{{ route('cotizacion') }}">{{ __('messages.nav_cotizacion') }}</a></li>
                    <li><a href="{{ route('contacto') }}">{{ __('messages.nav_contacto') }}</a></li>
                </ul>
            </div>
        </div>

        {{-- NEWSLETTER --}}
        <div class="footer-col--newsletter">
            <h4 class="footer-heading">
                {{ $footer['newsletter_title'][$locale] ?? __('messages.newsletter_subscribe') }}
            </h4>

            <form
                action="{{ route('newsletter.subscribe') }}"
                method="POST"
                class="footer-newsletter"
                id="newsletterForm">
                @csrf

                <input
                    type="email"
                    name="email"
                    required
                    placeholder="{{ __('messages.enter_email') }}">

                <button type="submit" aria-label="Suscribirse" id="newsletterBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </form>
        </div>

        {{-- CONTACTO --}}
        <div class="footer-col--contact">
            <h4 class="footer-heading">
                {{ $footer['contact_title'][$locale] ?? 'Contacto' }}
            </h4>

            {{-- Dirección --}}
            <div class="footer-contact-item">
                <a href="{{ $footer['map_url'] ?? '#' }}" target="_blank" class="footer-contact-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="footer-contact-icon">
                        <path d="M20 10C20 14.993 14.461 20.193 12.601 21.799C12.4277 21.9293 12.2168 21.9998 12 21.9998C11.7832 21.9998 11.5723 21.9293 11.399 21.799C9.539 20.193 4 14.993 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z" stroke="#25A7CA" stroke-width="2"/>
                        <circle cx="12" cy="10" r="3" stroke="#25A7CA" stroke-width="2"/>
                    </svg>
                    <span>{{ $footer['address'][$locale] ?? '' }}</span>
                </a>
            </div>

            {{-- TELÉFONO --}}
            <div class="footer-contact-item">
                <a href="https://wa.me/{{ preg_replace('/\D/', '', $footer['whatsapp'] ?? '') }}" target="_blank" class="footer-contact-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="footer-contact-icon">
                        <path d="M13.832 16.568C14.0385 16.6628 14.2712 16.6845 14.4917 16.6294C14.7122 16.5744 14.9073 16.4458 15.045 16.265L15.4 15.8C15.5863 15.5516 15.8279 15.35 16.1056 15.2111C16.3833 15.0723 16.6895 15 17 15H20C20.5304 15 21.0391 15.2107 21.4142 15.5858C21.7893 15.9609 22 16.4696 22 17V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22C15.2261 22 10.6477 20.1036 7.27208 16.7279C3.89642 13.3523 2 8.7739 2 4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7C9 7.31049 8.92771 7.61672 8.78885 7.89443C8.65 8.17214 8.44839 8.41371 8.2 8.6L7.732 8.951C7.54842 9.09118 7.41902 9.29059 7.36579 9.51535C7.31256 9.74012 7.33878 9.97638 7.44 10.184C8.80668 12.9599 11.0544 15.2048 13.832 16.568Z" stroke="#25A7CA" stroke-width="2"/>
                    </svg>
                    <span>{{ $footer['phone'] ?? '' }}</span>
                </a>
            </div>

            {{-- EMAILS --}}
            @foreach($footerEmails as $email)
                <div class="footer-contact-item">
                    <a href="mailto:{{ $email }}" class="footer-contact-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="footer-contact-icon">
                            <path d="M22 7L13.009 12.727C12.7039 12.9042 12.3573 12.9976 12.0045 12.9976C11.6517 12.9976 11.3051 12.9042 11 12.727L2 7M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z" stroke="#25A7CA" stroke-width="2"/>
                        </svg>
                        <span>{{ $email }}</span>
                    </a>
                </div>
            @endforeach

        </div>
    </div>

    <div class="footer-bottom">
        <div class="footer-bottom-inner">
            <span>
                &copy; Copyright {{ date('Y') }} {{ __('messages.copyright') }}
            </span>
            <span>By <a href="https://osole.com.ar/" target="_blank" rel="noopener noreferrer"><strong>Osole</strong></a></span>
        </div>
    </div>
</footer>

{{-- TOAST --}}
<div id="newsletter-toast" class="newsletter-toast">
    ¡Te suscribiste correctamente!
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    const form  = document.getElementById('newsletterForm');
    const toast = document.getElementById('newsletter-toast');
    const button = document.getElementById('newsletterBtn');
    const defaultToastMessage = '¡Te suscribiste correctamente!';

    function showToast(message = defaultToastMessage) {
        toast.textContent = message;
        toast.style.display = 'block';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.style.display = 'none';
            }, 180);
        }, 3500);
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (button?.disabled) {
                return;
            }

            const data     = new FormData(form);
            const token    = document.querySelector('meta[name="csrf-token"]')?.content
                          || data.get('_token');

            if (button) {
                button.disabled = true;
            }

            fetch(form.action, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token,
                    'Accept': 'application/json',
                },
                body: data,
            })
            .then(async res => {
                const json = await res.json().catch(() => ({}));

                if (!res.ok) {
                    const message =
                        json.message ||
                        json.errors?.email?.[0] ||
                        'No pudimos procesar la suscripción. Intentá nuevamente en unos minutos.';

                    throw new Error(message);
                }

                return json;
            })
            .then(json => {
                if (json.success) {
                    form.reset();
                    showToast(json.message || defaultToastMessage);
                }
            })
            .catch(error => showToast(error.message || 'No pudimos procesar la suscripción. Intentá nuevamente en unos minutos.'))
            .finally(() => {
                if (button) {
                    button.disabled = false;
                }
            });
        });
    }
});
</script>
