@extends('web.layouts.app')

@section('title', ($page->title[app()->getLocale()] ?? __('messages.quality_policies')))

@section('content')

@php
$locale = app()->getLocale();
$main = $page?->sections->where('type','calidad_main')->first();
@endphp

<section class="calidad-page">

    <div class="calidad-container">

        {{-- ===================== BREADCRUMB ===================== --}}
        <div class="calidad-breadcrumb">
            <a href="{{ route('home') }}">{{ __('messages.home') }}</a>
            <span>›</span>
            <span>{{ __('messages.quality_policies') }}</span>
        </div>

        {{-- ===================== BLOQUE INSTITUCIONAL ===================== --}}
        @if($main)

        <div class="calidad-grid">

            {{-- LEFT COLUMN --}}
            <div class="calidad-left">

                <h1 class="calidad-title">
                    {{ $main->title[$locale] ?? '' }}
                </h1>

                <p class="calidad-intro">
                    {{ $main->subtitle[$locale] ?? '' }}
                </p>

                @php
                $blocks = preg_split('/\r\n\r\n|\n\n/', $main->content[$locale] ?? '');
                @endphp

                <div class="calidad-policies">

                    @foreach($blocks as $block)

                    @php
                    $parts = explode(':', $block, 2);
                    $title = trim($parts[0] ?? '');
                    $text = trim($parts[1] ?? '');
                    @endphp

                    <div class="calidad-item">

                        <div class="calidad-icon">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none">
                                <path d="M7.5 10L9.16667 11.6667L12.5 8.33335M18.3333 10C18.3333 14.6024 14.6024 18.3334 10 18.3334C5.39763 18.3334 1.66667 14.6024 1.66667 10C1.66667 5.39765 5.39763 1.66669 10 1.66669C14.6024 1.66669 18.3333 5.39765 18.3333 10Z"
                                    stroke="#25A7CA"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>

                        <div class="calidad-text">
                            <strong>{{ $title }}:</strong>
                            {{ $text }}
                        </div>

                    </div>

                    @endforeach

                </div>

            </div>

            {{-- RIGHT COLUMN --}}
            <div class="calidad-right">
                @if($main->image)
                <img src="{{ $main->image_url }}" alt="Calidad" loading="lazy" decoding="async">
                @endif
            </div>

        </div>

        @endif


        {{-- ========================================================= --}}
        {{-- ===================== CERTIFICADOS ===================== --}}
        {{-- ========================================================= --}}

        <div class="calidad-certificados">

            <h2 class="calidad-certificados-title">
                {{ __('messages.certificates') }}
            </h2>

            @if(isset($certificates) && $certificates->count())

            <div class="calidad-certificados-grid">

                @foreach($certificates as $certificate)

                <div class="calidad-cert-card">

                    {{-- BLOQUE IZQUIERDO --}}
                    <div class="calidad-cert-content">

                        @if($certificate->image_logo)
                        <div class="calidad-cert-logo">
                            <img
                                src="{{ asset('storage/'.$certificate->image_logo) }}"
                                alt="{{ $certificate->getNameLocale() }}"
                                loading="lazy"
                                decoding="async">
                        </div>
                        @endif

                        <div>
                            <div class="calidad-cert-name">
                                {{ $certificate->getNameLocale() }}
                            </div>

                            <div class="calidad-cert-meta">
                                {{ strtoupper($certificate->format ?? 'PDF') }}
                                @if($certificate->weight)
                                – {{ $certificate->weight }}
                                @endif
                            </div>
                        </div>

                    </div>

                    {{-- BOTÓN DESCARGA --}}
                    @if($certificate->file)
                    <a href="{{ asset('storage/'.$certificate->file) }}"
                        target="_blank"
                        class="calidad-cert-btn">

                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none">
                            <path d="M12 15V3M12 15L7 10M12 15L17 10M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                                stroke="#25A7CA"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                    </a>
                    @endif

                </div>

                @endforeach

            </div>

            @else

            <div class="calidad-empty">
                {{ __('messages.no_certificates_available') }}
            </div>

            @endif

        </div>

    </div>

</section>

@endsection
