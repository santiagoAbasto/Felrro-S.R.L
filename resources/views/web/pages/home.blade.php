@extends('web.layouts.app')

@section('content')

@php
// Todos los hero sections activos (el controller ya filtra is_active=true)
$heroSections = $page->sections
->where('type', 'hero')
->sortBy('order');

$primaryHero = $heroSections->first();

// Combinar slides de TODOS los hero sections activos, en orden
$allSlides = collect();
foreach ($heroSections as $section) {
foreach ($section->images->sortBy('order') as $image) {
$allSlides->push([
'image' => $image,
'title' => $image->getTitle() ?: $section->getTitle(),
'subtitle' => $image->getSubtitle() ?: $section->getSubtitle(),
'btn_text' => $image->getButtonText() ?: $section->getButtonText(),
'btn_link' => $image->button_link ?: $section->button_link,
]);
}
}
@endphp

@if($primaryHero && $allSlides->count())

<section class="hero">

    {{-- MEDIA SLIDES (fondo: imagen o video) --}}
    @foreach($allSlides as $index => $slide)
    @php $img = $slide['image']; @endphp
    <div class="hero-slide {{ $index === 0 ? 'active' : '' }}"
        @if(!$img->isVideo())
        style="background-image: url('{{ $img->image_url }}');"
        @endif>
        @if($img->isVideo() && $img->video_url)
        <div class="hero-video-wrap">
            <iframe
                src="{{ $img->video_url }}?autoplay=1&mute=1&loop=1&controls=0&playlist={{ basename(parse_url($img->video_url, PHP_URL_PATH)) }}"
                frameborder="0"
                allow="autoplay; fullscreen; muted"
                allowfullscreen>
            </iframe>
        </div>
        @endif
    </div>
    @endforeach

    {{-- CONTENT LAYERS (texto por slide) --}}
    @foreach($allSlides as $index => $slide)
    <div class="hero-inner {{ $index === 0 ? 'active' : '' }}">
        <div class="hero-content">

            @if($slide['title'])
            <h1 class="hero-title">
                {!! nl2br(e($slide['title'])) !!}
            </h1>
            @endif

            @if($slide['subtitle'])
            <p class="hero-subtitle">
                {!! nl2br(e($slide['subtitle'])) !!}
            </p>
            @endif

            @if($slide['btn_text'])
            <a href="{{ $slide['btn_link'] && $slide['btn_link'] !== '#'
                            ? url($slide['btn_link'])
                            : route('productos.index') }}"
                class="btn-primary">
                {{ $slide['btn_text'] }}
            </a>
            @endif

        </div>
    </div>
    @endforeach

    {{-- INDICADORES --}}
    @if($allSlides->count() > 1)
    <div class="hero-indicators">
        @foreach($allSlides as $index => $slide)
        <span class="indicator {{ $index === 0 ? 'active' : '' }}"
            data-index="{{ $index }}">
        </span>
        @endforeach
    </div>
    @endif

</section>

@elseif($primaryHero && $primaryHero->image)

{{-- FALLBACK: imagen simple sin slides --}}
<section class="hero">

    <div class="hero-slide active"
        style="background-image: url('{{ asset($primaryHero->image) }}');">
    </div>

    <div class="hero-inner active">
        <div class="hero-content">

            @if($primaryHero->getTitle())
            <h1 class="hero-title">
                {!! nl2br(e($primaryHero->getTitle())) !!}
            </h1>
            @endif

            @if($primaryHero->getSubtitle())
            <p class="hero-subtitle">
                {!! nl2br(e($primaryHero->getSubtitle())) !!}
            </p>
            @endif

            @if($primaryHero->getButtonText())
            <a href="{{ $primaryHero->button_link && $primaryHero->button_link !== '#'
                            ? url($primaryHero->button_link)
                            : route('productos.index') }}"
                class="btn-primary">
                {{ $primaryHero->getButtonText() }}
            </a>
            @endif

        </div>
    </div>

</section>

@endif

{{-- =========================================================
    CATEGORÍAS DESTACADAS
========================================================= --}}
<section class="featured-categories">

    <div class="fc-container">

        <div class="fc-header">
            <h2>{{ __('messages.featured_categories') }}</h2>

            <a href="{{ route('productos.index') }}" class="btn-categories">
                {{ __('messages.view_all') }}
            </a>
        </div>

        <div class="fc-grid">

            @forelse($featuredCategories as $category)

            <a href="{{ route('productos.category', $category->slug) }}" class="fc-card" data-category="{{ $category->slug }}">

                <div class="fc-card__img">
                    <img
                        src="{{ $category->image_url }}"
                        alt="{{ $category->getName() ?? 'Categoría' }}"
                        loading="lazy"
                        decoding="async"
                        fetchpriority="low">
                </div>

                <div class="fc-card__footer">
                    <h5 class="fc-card__title">
                        {{ $category->getName() }}
                    </h5>
                    <svg class="fc-card__icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </div>
            </a>

            @empty
            <div class="fc-empty">
                {{ __('messages.no_featured_categories') }}
            </div>
            @endforelse

        </div>

    </div>

</section>
{{-- =========================================================
    SOBRE NOSOTROS (HOME PREVIEW)
    Archivo: resources/views/web/home.blade.php
========================================================= --}}
@if($aboutPreview && $aboutPreview->is_active)

<section class="about-section">
    <div class="about-wrapper">

        {{-- IMAGEN --}}
        <div class="about-image"
            style="background-image: url('{{ $aboutPreview->image_url ?: asset('images/logo.png') }}');">
        </div>

        {{-- CONTENIDO --}}
        <div class="about-content">
            <div>
                @if(!empty($aboutPreview->title[app()->getLocale()]))
                <h3 class="about-title">
                    {{ $aboutPreview->title[app()->getLocale()] }}
                </h3>
                @endif

                @if(!empty($aboutPreview->content[app()->getLocale()]))
                <div class="about-text">
                    @foreach(
                    preg_split('/\r\n|\r|\n/', $aboutPreview->content[app()->getLocale()]) as $paragraph
                    )
                    @if(trim($paragraph) !== '')
                    <p>{{ $paragraph }}</p>
                    @endif
                    @endforeach
                </div>
                @endif
            </div>

            @if(!empty($aboutPreview->button_text[app()->getLocale()]))
            <a href="{{ $aboutPreview->button_link ?? route('nosotros') }}"
                class="about-btn">
                {{ $aboutPreview->button_text[app()->getLocale()] }}
            </a>
            @endif

        </div>

    </div>
</section>

@endif
{{-- =========================================================
    PRODUCTOS DESTACADOS
    → resources/views/web/home.blade.php
========================================================= --}}
@if($featuredProducts->isNotEmpty())
<section class="fp-section">

    <div class="fp-container">

        <h2 class="fp-title">
            {{ __('messages.featured_products') }}
        </h2>

        <div class="fp-grid">

            @foreach($featuredProducts as $product)

            <a href="{{ route('productos.show', $product->slug) }}" class="fp-card">

                <div class="fp-card__img">
                    <img src="{{ $product->image_url ?? asset('images/default-product.png') }}"
                        alt="{{ $product->getName() ?? 'Producto' }}"
                        loading="lazy"
                        decoding="async"
                        fetchpriority="low">
                </div>

                <div class="fp-card__content">

                    <span class="fp-card__category">
                        {{ $product->category?->getName() }}
                    </span>

                    <h3 class="fp-card__name">
                        {{ $product->getName() }}
                    </h3>

                    <p class="fp-card__desc">
                        {{ $product->getShortDescription() }}
                    </p>

                </div>

            </a>

            @endforeach

        </div>

    </div>

</section>
@endif


{{-- =========================================================
    NOVEDADES
    → resources/views/web/home.blade.php
========================================================= --}}
<section class="nv-section">

    <div class="nv-container">

        <div class="nv-header">
            <h2 class="nv-title">{{ __('messages.news') }}</h2>

            <a href="{{ route('novedades') }}" class="nv-btn-all">
                {{ __('messages.view_all_fem') }}
            </a>
        </div>

        <div class="nv-grid">

            @forelse($latestPosts as $post)

            <a href="{{ route('novedades.show', $post->slug) }}" style="text-decoration:none; color:inherit; display:block;">

                <article class="nv-card">

                    {{-- IMAGEN --}}
                    <div class="nv-card__img">
                        <img src="{{ $post->image_url }}"
                            alt="{{ $post->getTitle() ?? 'Noticia' }}"
                            loading="lazy"
                            decoding="async"
                            fetchpriority="low">
                    </div>

                    <div class="nv-card__content">

                        {{-- CATEGORÍA --}}
                        @if($post->getCategory())
                        <span class="nv-card__tag">
                            {{ strtoupper($post->getCategory()) }}
                        </span>
                        @endif

                        {{-- TÍTULO --}}
                        <h3 class="nv-card__title">{{ $post->getTitle() }}</h3>

                        {{-- EXCERPT --}}
                        @if($post->getExcerpt())
                        <p class="nv-card__excerpt">{{ $post->getExcerpt() }}</p>
                        @endif

                        {{-- LEER MÁS --}}
                        <span class="nv-card__link">
                            <span>{{ __('messages.read_more') ?? 'Leer más' }}</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19"
                                    stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </span>

                    </div>

                </article>

            </a>

            @empty
            <p class="nv-empty">{{ __('messages.no_news_available') ?? 'No hay novedades publicadas.' }}</p>
            @endforelse

        </div>

    </div>

</section>

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', () => {

        const slides = document.querySelectorAll('.hero-slide');
        const contents = document.querySelectorAll('.hero-inner');
        const indicators = document.querySelectorAll('.indicator');

        if (!slides.length) return;

        let current = 0;
        let timer;

        function goTo(index) {
            slides[current].classList.remove('active');
            if (contents[current]) contents[current].classList.remove('active');
            if (indicators[current]) indicators[current].classList.remove('active');

            current = index;

            slides[current].classList.add('active');
            if (contents[current]) contents[current].classList.add('active');
            if (indicators[current]) indicators[current].classList.add('active');
        }

        function next() {
            goTo((current + 1) % slides.length);
        }

        function startAuto() {
            timer = setInterval(next, 6000);
        }

        indicators.forEach((ind, i) => {
            ind.addEventListener('click', () => {
                clearInterval(timer);
                goTo(i);
                startAuto();
            });
        });

        startAuto();

    });
</script>
@endpush
