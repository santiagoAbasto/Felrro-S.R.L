@extends('web.layouts.app')

@section('title', ($page->title[app()->getLocale()] ?? 'Contacto') . ' - Felrro')

@section('content')

@php
    $locale = app()->getLocale();
    $banner = $page->sections->where('type', 'contact_banner')->first();
    $info   = $page->sections->where('type', 'contact_info')->first();
    $map    = $page->sections->where('type', 'contact_map')->first();
@endphp

<section class="contacto-page">
    <div class="contacto-container">

        {{-- BREADCRUMB --}}
        <div class="contacto-breadcrumb">
            <a href="{{ route('home') }}">{{ __('messages.home') }}</a>
            <span>›</span>
            <span>{{ $page->title[$locale] ?? '' }}</span>
        </div>

        {{-- GRID: info izq + form der --}}
        <div class="contacto-grid">

            {{-- COLUMNA IZQUIERDA --}}
            <div class="contacto-left">

                @if($banner && $banner->is_active)
                    <p class="contacto-intro">
                        {{ $banner->subtitle[$locale] ?? '' }}
                    </p>
                @endif

                @if($info && $info->content)
                @php
                    $content = $info->content;
                    $emails = collect($content['emails'] ?? [])
                        ->filter(fn ($email) => filled($email))
                        ->values();

                    if ($emails->isEmpty() && !empty($content['email'])) {
                        $emails = collect([$content['email']]);
                    }
                @endphp

                <div class="contacto-data">

                    @if(!empty($content['address'][$locale]))
                    <div class="contacto-data-item">
                        <span class="contacto-data-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M20 10C20 14.993 14.461 20.193 12.601 21.799C12.4277 21.9293 12.2168 21.9998 12 21.9998C11.7832 21.9998 11.5723 21.9293 11.399 21.799C9.539 20.193 4 14.993 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                        <a href="https://maps.app.goo.gl/4kzgDquprTFAbbQd9"
                           target="_blank"
                           class="contacto-data-text contacto-data-link">{{ $content['address'][$locale] }}</a>
                    </div>
                    @endif

                    @if(!empty($content['phone']))
                    <div class="contacto-data-item">
                        <span class="contacto-data-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M13.832 16.568C14.0385 16.6628 14.2712 16.6845 14.4917 16.6294C14.7122 16.5744 14.9073 16.4458 15.045 16.265L15.4 15.8C15.5863 15.5516 15.8279 15.35 16.1056 15.2111C16.3833 15.0723 16.6895 15 17 15H20C20.5304 15 21.0391 15.2107 21.4142 15.5858C21.7893 15.9609 22 16.4696 22 17V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22C15.2261 22 10.6477 20.1036 7.27208 16.7279C3.89642 13.3523 2 8.7739 2 4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7C9 7.31049 8.92771 7.61672 8.78885 7.89443C8.65 8.17214 8.44839 8.41371 8.2 8.6L7.732 8.951C7.54842 9.09118 7.41902 9.29059 7.36579 9.51535C7.31256 9.74012 7.33878 9.97638 7.44 10.184C8.80668 12.9599 11.0544 15.2048 13.832 16.568Z" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                        <a href="https://wa.me/{{ preg_replace('/\D/', '', $content['phone']) }}"
                           target="_blank" class="contacto-data-text contacto-data-link">
                            {{ $content['phone'] }}
                        </a>
                    </div>
                    @endif

                    @foreach($emails as $email)
                    <div class="contacto-data-item">
                        <span class="contacto-data-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M22 7L13.009 12.727C12.7039 12.9042 12.3573 12.9976 12.0045 12.9976C11.6517 12.9976 11.3051 12.9042 11 12.727L2 7M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z" stroke="#25A7CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                        <a href="mailto:{{ $email }}"
                           class="contacto-data-text contacto-data-link">
                            {{ $email }}
                        </a>
                    </div>
                    @endforeach

                </div>
                @endif
            </div>

            {{-- COLUMNA DERECHA: formulario --}}
            <div class="contacto-right">

                @if(session('success'))
                    <div class="contact-success">{{ session('success') }}</div>
                @endif

                @if($errors->any())
                    <div class="contact-error">
                        <ul>
                            @foreach($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <form action="{{ route('contacto.store') }}" method="POST" class="contacto-form" id="contactForm">
                    @csrf

                    <div class="contacto-form-row">
                        <div class="contacto-form-group">
                            <label>{{ __('messages.name') }}*</label>
                            <input type="text" name="nombre"
                                   value="{{ old('nombre') }}"
                                   placeholder="{{ __('messages.name') }}">
                        </div>
                        <div class="contacto-form-group">
                            <label>Email*</label>
                            <input type="email" name="email"
                                   value="{{ old('email') }}"
                                   placeholder="Email">
                        </div>
                    </div>

                    <div class="contacto-form-row">
                        <div class="contacto-form-group">
                            <label>{{ __('messages.phone') }}*</label>
                            <input type="text" name="telefono"
                                   value="{{ old('telefono') }}"
                                   placeholder="{{ __('messages.phone') }}">
                        </div>
                        <div class="contacto-form-group">
                            <label>{{ __('messages.company') }}</label>
                            <input type="text" name="empresa"
                                   value="{{ old('empresa') }}"
                                   placeholder="{{ __('messages.company') }}">
                        </div>
                    </div>

                    <div class="contacto-form-bottom">
                        <div class="contacto-form-group">
                            <label>{{ __('messages.message') }}*</label>
                            <textarea name="mensaje" rows="5"
                                      placeholder="{{ __('messages.message') }}">{{ old('mensaje') }}</textarea>
                        </div>

                        <div class="contacto-form-footer">
                            <span class="contacto-required-note">
                                *{{ __('messages.required_fields') ?? 'Campos Obligatorios' }}
                            </span>
                            <button type="submit" class="contacto-btn-enviar" id="contactSubmitButton">
                                {{ __('messages.send') ?? 'Enviar' }}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>

        {{-- MAPA --}}
        @if($map && $map->content && !empty($map->content['iframe']))
            <div class="contacto-map">
                {!! $map->content['iframe'] !!}
            </div>
        @endif

    </div>
</section>

<script>
    (function () {
        var contactForm = document.getElementById('contactForm');
        var contactSubmitButton = document.getElementById('contactSubmitButton');

        if (!contactForm || !contactSubmitButton) {
            return;
        }

        contactForm.addEventListener('submit', function () {
            contactSubmitButton.disabled = true;
            contactSubmitButton.setAttribute('aria-disabled', 'true');
            contactSubmitButton.textContent = 'Enviando...';
        });
    })();
</script>

@endsection
