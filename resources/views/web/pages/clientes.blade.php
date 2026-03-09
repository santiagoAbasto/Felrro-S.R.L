@extends('web.layouts.app')

@section('title', __('messages.clients') . ' - Felrro')

@section('content')

@php
    $locale = app()->getLocale();
@endphp

<section class="clients-page">

    <div class="clients-container">

        {{-- Breadcrumb --}}
        <div class="clients-breadcrumb">
            <a href="{{ route('home') }}">
                {{ __('messages.home') }}
            </a>
            <span>›</span>
            <span>{{ __('messages.clients') }}</span>
        </div>

        {{-- Grid Logos --}}
        <div class="clients-grid">
            @forelse($clients as $client)

                <div class="client-card">

                    @if($client->logo_url)
                        <img 
                            src="{{ $client->logo_url }}"
                            alt="{{ $client->getNameLocale() }}"
                            loading="lazy"
                        >
                    @endif

                </div>

            @empty

                <div class="clients-empty">
                    {{ __('messages.no_clients_available') }}
                </div>

            @endforelse
        </div>

    </div>

</section>

@endsection