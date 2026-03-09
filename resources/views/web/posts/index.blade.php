@extends('web.layouts.app')

@section('title', __('messages.news') . ' - Felrro')

@section('content')

@php
$locale = app()->getLocale();
@endphp

<section class="novedades-page">

    <div class="novedades-container">

        {{-- ================= BREADCRUMB ================= --}}
        <div class="novedades-breadcrumb">
            <a href="{{ route('home') }}">{{ __('messages.home') }}</a>
            <span>›</span>
            <span>{{ __('messages.news') }}</span>
        </div>

        {{-- ================= GRID ================= --}}
        @if($posts->count())

        <div class="novedades-grid">

            @foreach($posts as $post)

            <article class="novedad-card">

                <a href="{{ route('novedades.show', $post->slug) }}"
                    class="novedad-card-link"></a>

                {{-- IMAGE --}}
                @if($post->image_url)
                <div class="novedad-card-image">
                    <img src="{{ $post->image_url }}"
                        alt="{{ $post->getTitle() }}"
                        loading="lazy">
                </div>
                @endif

                {{-- CONTENT --}}
                <div class="novedad-card-body">

                    <span class="novedad-card-tag">
                        {{ strtoupper($post->getCategory()) }}
                    </span>

                    <h2 class="novedad-card-title">
                        {{ $post->getTitle() }}
                    </h2>

                    <p class="novedad-card-excerpt">
                        {{ $post->getExcerpt() }}
                    </p>

                    <div class="novedad-card-link-ui">
                        <span>{{ __('messages.news_read_more') }}</span>

                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19"
                                stroke="#101010"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>

                </div>

            </article>

            @endforeach

        </div>

        {{-- PAGINATION --}}
        @if($posts->hasPages())
        <div class="novedades-pagination">
            {{ $posts->links() }}
        </div>
        @endif

        @else

        <div class="novedades-empty">
            {{ __('messages.news_empty') }}
        </div>

        @endif

    </div>

</section>

@endsection