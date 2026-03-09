@extends('web.layouts.app')

@section('title', __('messages.news') . ' - Felrro')

@section('meta_description', __('messages.news_meta_description') ?? 'Últimas novedades y noticias de Felrro.')

@section('content')

<section class="novedades-page">

    <div class="novedades-container">

        {{-- ================= BREADCRUMB ================= --}}
        <div class="novedad-breadcrumb">
            <a href="{{ route('home') }}">{{ __('messages.home') }}</a>
            <span>›</span>
            <span>{{ __('messages.news') }}</span>
        </div>

        {{-- ================= TITULO ================= --}}
        <h1 class="novedades-title">
            {{ __('messages.news') }}
        </h1>

        {{-- ================= GRID ================= --}}
        <div class="novedades-grid">

            @forelse($posts as $post)

            <article class="novedad-card">

                {{-- IMAGEN --}}
                <img src="{{ $post->image_url }}"
                    alt="{{ $post->getTitle() }}">

                <div class="novedad-content">

                    {{-- CATEGORIA --}}
                    @if($post->getCategory())
                    <span class="novedad-tag">
                        {{ strtoupper($post->getCategory()) }}
                    </span>
                    @endif

                    {{-- TITULO --}}
                    <h4>{{ $post->getTitle() }}</h4>

                    {{-- EXCERPT --}}
                    @if($post->getExcerpt())
                    <p>{{ $post->getExcerpt() }}</p>
                    @endif

                    {{-- LINK --}}
                    <a href="{{ route('novedades.show', $post->slug) }}" class="novedad-card-link">

                        <article class="novedad-card">

                            {{-- IMAGEN --}}
                            <img src="{{ $post->image_url }}"
                                alt="{{ $post->getTitle() }}">

                            <div class="novedad-content">

                                @if($post->getCategory())
                                <span class="novedad-tag">
                                    {{ strtoupper($post->getCategory()) }}
                                </span>
                                @endif

                                <h4>{{ $post->getTitle() }}</h4>

                                @if($post->getExcerpt())
                                <p>{{ $post->getExcerpt() }}</p>
                                @endif

                                <span class="leer-mas">
                                    <span>{{ __('messages.read_more') ?? 'Leer más' }}</span>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19"
                                            stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>

                            </div>

                        </article>

                    </a>

                </div>

            </article>

            @empty

            <p class="no-news">
                {{ __('messages.no_news_available') ?? 'No hay novedades publicadas.' }}
            </p>

            @endforelse

        </div>

        {{-- ================= PAGINACIÓN ================= --}}
        @if($posts->hasPages())
        <div class="pagination-wrapper">
            {{ $posts->links() }}
        </div>
        @endif

    </div>

</section>

@endsection