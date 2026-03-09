@extends('web.layouts.app')

@section('content')

<div class="felrro-sectors-wrapper">

    <div class="felrro-sectors-container">

        <div class="felrro-sectors-breadcrumb">
            <a href="{{ route('home') }}">{{ __('messages.home') }}</a>
            <span>›</span>
            <span>{{ __('messages.sectors') }}</span>
        </div>

        <div class="felrro-sectors-grid">

            @foreach($sectors as $sector)
            <a href="#" class="felrro-sector-card">

                <div class="felrro-sector-image-wrapper">
                    <img
                        src="{{ $sector->image_url }}"
                        alt="{{ $sector->getName() }}">
                    <div class="felrro-sector-overlay"></div>
                </div>

                <div class="felrro-sector-title">
                    {{ $sector->getName() }}
                </div>

            </a>
            @endforeach

        </div>

    </div>

</div>

@endsection