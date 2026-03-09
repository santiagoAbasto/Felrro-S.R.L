@extends('web.layouts.app')

@section('title', __('messages.downloads') . ' - Felrro')

@section('content')

@php
    $locale = app()->getLocale();
@endphp

<section class="downloads-page">

    <div class="downloads-container">

        {{-- ================= BREADCRUMB ================= --}}
        <div class="downloads-breadcrumb">
            <a href="{{ route('home') }}">{{ __('messages.home') }}</a>
            <span>›</span>
            <span>{{ __('messages.downloads') }}</span>
        </div>

        {{-- ================= CABECERA TABLA ================= --}}
        <div class="downloads-header">
            <span></span>
            <span>{{ __('messages.downloads_name') }}</span>
            <span>{{ __('messages.downloads_format') }}</span>
            <span>{{ __('messages.downloads_weight') }}</span>
            <span></span>
        </div>

        {{-- ================= LISTADO ================= --}}
        <div class="downloads-list">

            @forelse($downloads as $download)

                <div class="download-card">

                    {{-- ÍCONO --}}
                    <div class="download-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
                            <path d="M25.0827 3.58337V10.75C25.0827 11.7004 25.4602 12.6118 26.1322 13.2838C26.8042 13.9558 27.7157 14.3334 28.666 14.3334H35.8327M17.916 16.125H14.3327M28.666 23.2917H14.3327M28.666 30.4584H14.3327M26.8743 3.58337H10.7493C9.79899 3.58337 8.88755 3.9609 8.21555 4.63291C7.54354 5.30491 7.16602 6.21635 7.16602 7.16671V35.8334C7.16602 36.7837 7.54354 37.6952 8.21555 38.3672C8.88755 39.0392 9.79899 39.4167 10.7493 39.4167H32.2493C33.1997 39.4167 34.1111 39.0392 34.7831 38.3672C35.4552 37.6952 35.8327 36.7837 35.8327 35.8334V12.5417L26.8743 3.58337Z"
                                  stroke="#25A7CA" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>

                    {{-- NOMBRE --}}
                    <h3 class="download-name">
                        {{ $download->getNameLocale() }}
                    </h3>

                    {{-- FORMATO --}}
                    <span class="download-format">
                        {{ strtoupper($download->format ?? 'PDF') }}
                    </span>

                    {{-- PESO --}}
                    <span class="download-weight">
                        {{ $download->weight ?? '' }}
                    </span>

                    {{-- ACCIONES --}}
                    <div class="download-actions">

                        <a href="{{ $download->file_url }}"
                           target="_blank"
                           class="btn-ver-online">
                            {{ __('messages.downloads_view_online') }}
                        </a>

                        <a href="{{ $download->file_url }}"
                           download="{{ $download->getNameLocale() }}.{{ strtolower($download->format ?? 'pdf') }}"
                           class="btn-descargar">
                            {{ __('messages.downloads_download') }}
                        </a>

                    </div>

                </div>

            @empty

                <div class="downloads-empty">
                    {{ __('messages.downloads_empty') }}
                </div>

            @endforelse

        </div>

    </div>

</section>

@endsection
