@extends('web.layouts.app')

@section('content')

<section class="product-detail">
    <div class="container">

        {{-- =========================
            BREADCRUMB
        ========================== --}}
        <div class="breadcrumb">
            <a href="{{ route('home') }}">{{ __('messages.nav_home') }}</a>
            <span>›</span>
            <a href="{{ route('productos.index') }}">{{ __('messages.nav_productos') }}</a>
            <span>›</span>
            <a href="{{ route('productos.category', $product->category->slug) }}">
                {{ $product->category->getName() }}
            </a>
            <span>›</span>
            <span>{{ $product->getName() }}</span>
        </div>

        {{-- =========================
            HERO PRODUCTO
        ========================== --}}
        <div class="detail-layout">

            {{-- IMAGEN --}}
            <div class="detail-gallery">
                <div class="main-image">
                    <img src="{{ $product->image_url ?? asset('images/default-product.png') }}"
                         alt="{{ $product->getName() }}">
                </div>
            </div>

            {{-- INFO --}}
            <div class="detail-info">

                <span class="detail-category">
                    {{ strtoupper($product->category->getName()) }}
                </span>

                <h1>{{ $product->getName() }}</h1>

                <p class="detail-description">
                    {{ $product->getDescription() }}
                </p>

                <div class="detail-buttons">

                    @if($product->ficha_tecnica_url)
                        <a href="{{ $product->ficha_tecnica_url }}"
                           class="btn-outline"
                           target="_blank"
                           download>
                            {{ __('messages.technical_sheet') }}
                        </a>
                    @endif

                    <a href="{{ route('cotizacion') }}" class="btn-primary">
                        {{ __('messages.quote') }}
                    </a>

                </div>
            </div>
        </div>

        {{-- =========================
            ESPECIFICACIONES
        ========================== --}}
        @if($product->specifications->count())
            <div class="spec-grid">
                @foreach($product->specifications->sortBy('order') as $spec)
                    <div class="spec-card highlight">
                        <h4>{{ $spec->getTitle() }}</h4>
                        <p>{{ $spec->getContent() }}</p>
                    </div>
                @endforeach
            </div>
        @endif

        {{-- =========================
            CONSTRUCCIÓN
        ========================== --}}
        @if($construction->count())
            <div class="product-section">
                <h2>{{ __('messages.construction') }}</h2>
                <ul class="construction-list">
                    @foreach($construction as $item)
                        <li>
                            <strong>{{ $item->getTitle() }}:</strong>
                            {{ $item->getContent() }}
                        </li>
                    @endforeach
                </ul>
            </div>
        @endif

        {{-- =========================
            APLICACIONES
        ========================== --}}
        @if($applications->count())
            <div class="product-section">
                <h2>{{ __('messages.applications') }}</h2>
                @foreach($applications as $item)
                    <p>{{ $item->getContent() }}</p>
                @endforeach
            </div>
        @endif

        {{-- =========================
            INFORMACIÓN ADICIONAL
        ========================== --}}
        @if($extra->count())
            <div class="product-section">
                <h2>{{ __('messages.additional_information') }}</h2>
                @foreach($extra as $item)
                    <p>{{ $item->getContent() }}</p>
                @endforeach
            </div>
        @endif

    </div>
</section>


{{-- =========================
    PRODUCTOS DESTACADOS
========================== --}}
@if($featuredProducts->count())
<section class="featured-products">
    <div class="container">

        <h2>{{ __('messages.featured_products') }}</h2>

        <div class="products-grid">
            @foreach($featuredProducts as $item)
                <a href="{{ route('productos.show', $item->slug) }}"
                   class="product-card">

                    <div class="card-image">
                        <img src="{{ $item->image_url }}"
                             alt="{{ $item->getName() }}">
                    </div>

                    <div class="card-content">
                        <span class="product-category">
                            {{ strtoupper($item->category->getName()) }}
                        </span>
                        <h3>{{ $item->getName() }}</h3>
                        <p>{{ $item->getShortDescription() }}</p>
                    </div>

                </a>
            @endforeach
        </div>

    </div>
</section>
@endif

@endsection