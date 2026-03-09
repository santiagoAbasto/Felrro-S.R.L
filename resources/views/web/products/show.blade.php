@extends('web.layouts.app')

@section('content')

<section class="product-page">

    <div class="container">

        {{-- =========================================
            BREADCRUMB
        ========================================== --}}
        <div class="breadcrumb">
            <a href="{{ route('home') }}">{{ __('messages.nav_home') }}</a>
            <span>›</span>
            <a href="{{ route('productos.index') }}">{{ __('messages.nav_productos') }}</a>
            <span>›</span>
            <a href="{{ route('productos.category', $product->category->slug) }}">
                {{ $product->category->getName() }}
            </a>
            <span>›</span>
            <span>{{ mb_convert_case($product->getName(), MB_CASE_TITLE, 'UTF-8') }}</span>
        </div>

        {{-- =========================================
            HERO PRODUCTO
        ========================================== --}}
        <div class="product-top">

            {{-- GALERÍA --}}
            <div class="product-gallery">

                <div class="gallery-thumbs" data-category="{{ $product->category->slug }}">

                    <img
                        src="{{ $product->image_url }}"
                        alt="{{ $product->getName() }}"
                        class="thumb active"
                        onclick="changeImage('{{ $product->image_url }}', this)">

                    @foreach($product->images as $image)
                    <img
                        src="{{ $image->image_url }}"
                        alt="{{ $product->getName() }}"
                        class="thumb"
                        onclick="changeImage('{{ $image->image_url }}', this)">
                    @endforeach

                </div>

                <div class="gallery-main">
                    <img id="mainImage"
                        src="{{ $product->image_url }}"
                        alt="{{ $product->getName() }}">
                </div>

            </div>

            {{-- INFO --}}
            <div class="product-info">

                <span class="product-category">
                    {{ strtoupper($product->category->getName()) }}
                </span>

                <h1>{{ $product->getName() }}</h1>


                <p class="product-full-description">
                    {{ $product->getDescription() }}
                </p>

                <div class="product-actions">
                    @if($product->ficha_tecnica_url)
                    <a href="{{ $product->ficha_tecnica_url }}"
                        target="_blank"
                        class="btn-outline">
                        {{ __('messages.technical_sheet') }}
                    </a>
                    @endif

                    <form action="{{ route('cotizacion.add', $product->id) }}" method="POST">
                        @csrf
                        <button type="submit" class="btn-product">
                            {{ __('messages.quote') }}
                        </button>
                    </form>
                </div>

            </div>

        </div>

        {{-- =========================================
            PRODUCT CONTENT
        ========================================== --}}
        <div class="product-content">

            <div class="tabs-nav">
                <button class="tab active" data-scroll="#applications">
                    {{ __('messages.applications') }}
                </button>

                <button class="tab" data-scroll="#construction">
                    {{ __('messages.construction') }}
                </button>

                <button class="tab" data-scroll="#extra">
                    {{ __('messages.additional_information') }}
                </button>
            </div>

            {{-- ================= APLICACIONES ================= --}}
            <section id="applications" class="content-section">

                <h3 class="section-title">{{ __('messages.applications') }}</h3>

                @if($product->getDescription())
                <p class="applications-intro">
                    {{ $product->getDescription() }}
                </p>
                @endif

                <div class="applications-grid">
                    @foreach($applications as $app)
                    <div class="application-card">
                        <h4>{{ $app->getTitle() }}</h4>
                        <p>{{ $app->getContent() }}</p>
                    </div>
                    @endforeach
                </div>

            </section>

            {{-- ================= CONSTRUCCIÓN ================= --}}
            <section id="construction" class="content-section">

                <h3 class="section-title">{{ __('messages.construction') }}</h3>

                <div class="grid-3">
                    @foreach($construction as $item)
                    <div class="info-card">
                        <h4>{{ $item->getTitle() }}</h4>
                        <p>{{ $item->getContent() }}</p>
                    </div>
                    @endforeach
                </div>

            </section>

            {{-- ================= EXTRA ================= --}}
            <section id="extra" class="content-section">

                <h3 class="section-title">{{ __('messages.additional_information') }}</h3>

                <div class="grid-3">
                    @foreach($extra as $item)
                    <div class="info-card">
                        <h4>{{ $item->getTitle() }}</h4>
                        <p>{{ $item->getContent() }}</p>
                    </div>
                    @endforeach
                </div>

            </section>

        </div>

        {{-- ================= ESPECIFICACIONES TÉCNICAS ================= --}}
        @if($specifications->count())
        <section id="specifications" class="content-section">

            <h3 class="section-title">{{ __('messages.technical_specifications') }}</h3>

            <div class="specifications-grid">
                @foreach($specifications as $spec)
                <div class="spec-card">
                    <h4>{{ $spec->getTitle() }}</h4>
                    <p>{{ $spec->getContent() }}</p>
                </div>
                @endforeach
            </div>

        </section>
        @endif

        {{-- =========================================
            PRODUCTOS DESTACADOS
        ========================================== --}}
        @if($featuredProducts->count())
        <section class="featured-products">

            <div class="section-header">
                <h2>{{ __('messages.featured_products') }}</h2>
            </div>

            <div class="featured-products-grid">
                @foreach($featuredProducts as $item)
                <a href="{{ route('productos.show', $item->slug) }}"
                    class="featured-product-card">

                    <div class="featured-img">
                        <img src="{{ $item->image_url }}"
                            alt="{{ $item->getName() }}">
                    </div>

                    <div class="featured-content">
                        <span class="featured-category">
                            {{ strtoupper($item->category->getName()) }}
                        </span>

                        <h3 class="featured-title">
                            {{ $item->getName() }}
                        </h3>

                        <p class="featured-desc">
                            {{ $item->getShortDescription() }}
                        </p>
                    </div>

                </a>
                @endforeach
            </div>

        </section>
        @endif

    </div>

</section>

{{-- =========================================
    SCRIPT
========================================== --}}
<script>
    function changeImage(src, element) {

        const mainImage = document.getElementById('mainImage');
        mainImage.src = src;

        document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        element.classList.add('active');
    }

    document.querySelectorAll('.tab').forEach(tab => {

        tab.addEventListener('click', function() {

            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const target = document.querySelector(this.dataset.scroll);

            window.scrollTo({
                top: target.offsetTop - 120,
                behavior: 'smooth'
            });

        });

    });
</script>

@endsection