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
            <span>{{ __('messages.search_results') }}</span>
        </div>


        {{-- =========================================
            BUSCADOR
        ========================================== --}}
        <div style="margin-bottom:40px">

            <form action="{{ route('buscador') }}" method="GET">

                <input
                    type="text"
                    name="q"
                    value="{{ $query }}"
                    placeholder="{{ __('messages.search_products') }}"
                    style="width:100%; padding:14px 18px; border-radius:12px; border:1px solid #E5E7EB;"
                >

            </form>

        </div>


        {{-- =========================================
            RESULTADOS
        ========================================== --}}

        @if($products->count())

        <div class="featured-products-grid">

            @foreach($products as $product)

            <a href="{{ route('productos.show', $product->slug) }}"
               class="featured-product-card">

                <div class="featured-img">
                    <img
                        src="{{ $product->image_url }}"
                        alt="{{ $product->getName() }}"
                    >
                </div>

                <div class="featured-content">

                    <span class="featured-category">
                        {{ strtoupper($product->category->getName()) }}
                    </span>

                    <h3 class="featured-title">
                        {{ $product->getName() }}
                    </h3>

                    <p class="featured-desc">
                        {{ $product->getShortDescription() }}
                    </p>

                </div>

            </a>

            @endforeach

        </div>

        <div style="margin-top:40px">
            {{ $products->links() }}
        </div>

        @else

        <p style="margin-top:40px">
            {{ __('messages.no_results') }}
        </p>

        @endif

    </div>

</section>

@endsection