@extends('web.layouts.app')

@section('content')

{{-- ================================================================
     PRODUCTOS — ÍNDICE DE CATEGORÍAS
================================================================ --}}
<section class="pi-section">
    <div class="pi-container">

        {{-- BREADCRUMB --}}
        <nav class="pi-breadcrumb">
            <a href="{{ route('home') }}">{{ __('messages.nav_home') }}</a>
            <span>›</span>
            <span>{{ __('messages.nav_productos') }}</span>
        </nav>

        {{-- GRID CATEGORÍAS --}}
        <div class="pi-grid">

            @forelse($categories as $category)

            <a href="{{ route('productos.category', $category->slug) }}" class="pi-card" data-category="{{ $category->slug }}">

                {{-- IMAGEN: 390×217px --}}
                <div class="pi-card__img">
                    <img src="{{ $category->image_url }}"
                         alt="{{ $category->getName() }}"
                         loading="lazy">
                </div>

                {{-- FOOTER: nombre + flecha --}}
                <div class="pi-card__footer">
                    <h3 class="pi-card__name">{{ strtoupper($category->getName()) }}</h3>
                    <svg class="pi-card__arrow" xmlns="http://www.w3.org/2000/svg"
                         width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor"
                              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>

            </a>

            @empty
            <div class="pi-empty">{{ __('messages.no_categories') }}</div>
            @endforelse

        </div>

    </div>
</section>

@endsection
