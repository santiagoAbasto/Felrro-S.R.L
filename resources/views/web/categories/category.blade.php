@extends('web.layouts.app')

@section('content')

{{-- ================================================================
     PRODUCTOS — CATEGORÍA
     → resources/views/web/productos/category.blade.php
================================================================ --}}
<section class="pc-section">
    <div class="pc-container">

        {{-- BREADCRUMB --}}
        <nav class="pc-breadcrumb">
            <a href="{{ route('home') }}">{{ __('messages.nav_home') }}</a>
            <span>›</span>
            <a href="{{ route('productos.index') }}">{{ __('messages.nav_productos') }}</a>
            <span>›</span>
            <span>{{ $category->getName() }}</span>
        </nav>

        <div class="pc-layout">

            {{-- SIDEBAR --}}
            <aside class="pc-sidebar">
                <h3 class="pc-sidebar__title">{{ __('messages.categories') }}</h3>

                <ul class="pc-sidebar__list">
                    @foreach($allCategories as $cat)
                    <li class="pc-sidebar__divider" role="separator">
                        <svg width="100%" height="1" viewBox="0 0 1 1" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="0.5" x2="1" y2="0.5" stroke="#D9D9D9" stroke-width="1" vector-effect="non-scaling-stroke"/>
                        </svg>
                    </li>
                    <li class="pc-sidebar__item {{ $cat->id === $category->id ? 'is-active' : '' }}">
                        <span class="pc-sidebar__bar pc-bar--{{ Str::slug($cat->slug) }}"></span>
                        <a href="{{ route('productos.category', $cat->slug) }}"
                           class="pc-sidebar__link">
                            {{ strtoupper($cat->getName()) }}
                        </a>
                    </li>
                    @if($loop->last)
                    <li class="pc-sidebar__divider" role="separator">
                        <svg width="100%" height="1" viewBox="0 0 1 1" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="0.5" x2="1" y2="0.5" stroke="#D9D9D9" stroke-width="1" vector-effect="non-scaling-stroke"/>
                        </svg>
                    </li>
                    @endif
                    @endforeach
                </ul>
            </aside>

            {{-- GRID PRODUCTOS --}}
            <div class="pc-products">
                <div class="pc-grid">

                    @forelse($products as $product)

                    <a href="{{ route('productos.show', $product->slug) }}" class="pc-card">

                        {{-- IMAGEN: 288×288px --}}
                        <div class="pc-card__img">
                            <img src="{{ $product->image_url ?? asset('images/default-product.png') }}"
                                 alt="{{ $product->getName() }}"
                                 loading="lazy">
                        </div>

                        {{-- CONTENIDO --}}
                        <div class="pc-card__content">
                            <div class="pc-card__heading">
                                <span class="pc-card__category">
                                    {{ strtoupper($category->getName()) }}
                                </span>
                                <h3 class="pc-card__name">{{ $product->getName() }}</h3>
                            </div>
                            <p class="pc-card__desc">{{ $product->getShortDescription() }}</p>
                        </div>

                    </a>

                    @empty
                    <div class="pc-empty">{{ __('messages.no_products_category') }}</div>
                    @endforelse

                </div>

                {{-- PAGINACIÓN --}}
                @if($products instanceof IlluminatePaginationengthawarepaginator && $products->haspages())
                <div class="pc-pagination">
                    {{ $products->links() }}
                </div>
                @endif

            </div>

        </div>
    </div>
</section>

@endsection
