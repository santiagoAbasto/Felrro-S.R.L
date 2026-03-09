@extends('web.layouts.app')

@section('title', $post->getTitle() . ' - Felrro')

@section('content')

@php
$locale = app()->getLocale();
@endphp

<section class="novedad-detalle-page">

    <div class="novedad-detalle-container">

        {{-- ================= BREADCRUMB ================= --}}
        <div class="novedad-detalle-breadcrumb">
            <a href="{{ route('home') }}">{{ __('messages.home') }}</a>
            <span>›</span>
            <a href="{{ route('novedades') }}">{{ __('messages.news') }}</a>
            <span>›</span>
            <span>{{ $post->getTitle() }}</span>
        </div>

        {{-- CATEGORY --}}
        <span class="novedad-detalle-tag">
            {{ strtoupper($post->getCategory()) }}
        </span>

        {{-- TITLE --}}
        <h1 class="novedad-detalle-title">
            {{ $post->getTitle() }}
        </h1>

        {{-- DATE --}}
        @if($post->published_at)
        <div class="novedad-detalle-date">
            {{ $post->published_at->format('d M Y') }}
        </div>
        @endif

        {{-- IMAGE --}}
        @if($post->image_url)
        <div class="novedad-detalle-image">
            <img src="{{ $post->image_url }}" alt="{{ $post->getTitle() }}">
        </div>
        @endif

        {{-- CONTENT --}}
        <div class="novedad-detalle-content">
            {!! nl2br(e($post->getContent())) !!}
        </div>

        {{-- VOLVER --}}
        <div class="novedad-detalle-back">
            <a href="{{ route('novedades') }}">{{ __('messages.news') }}</a> 
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5"
                    stroke="#25A7CA" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>{{ __('messages.news_back') }}</span>
            </a>
        </div>

    </div>

</section>

@endsection