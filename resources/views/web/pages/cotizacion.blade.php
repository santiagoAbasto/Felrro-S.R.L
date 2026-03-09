@extends('web.layouts.app')

@section('title', ($page->title[app()->getLocale()] ?? 'Cotización') . ' - Felrro')

@section('content')

@php
$locale = app()->getLocale();
$banner = $page->sections->where('type', 'quote_banner')->first();
@endphp

<section class="cot-page">
    <div class="cot-container">

        <div class="cot-breadcrumb">
            <a href="{{ route('home') }}">{{ __('messages.home') }}</a>
            <span>›</span>
            <span>{{ $page->title[$locale] ?? '' }}</span>
        </div>

        @if(session('success'))
        <div class="cot-success">{{ session('success') }}</div>
        @endif

        <div class="cot-products">
            @forelse($products as $product)
            <div class="cot-card">

                <div class="cot-card__img">
                    @if($product->image_url)
                    <img src="{{ $product->image_url }}" alt="{{ $product->getName() }}">
                    @endif
                </div>

                <div class="cot-card__info">

                    <div class="cot-card__text">

                        @if($product->category)
                        <span class="cot-card__cat">{{ strtoupper($product->category->getName()) }}</span>
                        @endif

                        <div class="cot-card__name-row">

                            <span class="cot-card__title">{{ $product->getName() }}</span>

                            @if($product->getShortDescription())
                            <span class="cot-card__dot">{{ $product->getShortDescription() }}</span>
                            @endif

                        </div>

                    </div>

                </div>

                <div class="cot-metros">
                    <span class="cot-metros__label">{{ __('messages.meters') ?? 'Metros' }}</span>

                    <div class="cot-metros__box">
                        <input
                            type="number"
                            id="metros-{{ $product->id }}"
                            min="0"
                            value="{{ $product->metros ?? 0 }}"
                            class="cot-metros__input"
                            onchange="submitMetros({{ $product->id }})">

                        <div class="cot-metros__arrows">
                            <button type="button" class="cot-metros__btn" onclick="stepMetros({{ $product->id }}, 1)">
                                <svg width="9" height="5" viewBox="0 0 9 5" fill="none">
                                    <path d="M1 4.5L4.5 1L8 4.5" stroke="#888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>

                            <button type="button" class="cot-metros__btn" onclick="stepMetros({{ $product->id }}, -1)">
                                <svg width="9" height="5" viewBox="0 0 9 5" fill="none">
                                    <path d="M1 1L4.5 4.5L8 1" stroke="#888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <form id="form-metros-{{ $product->id }}"
                            action="{{ route('cotizacion.update', $product->id) }}"
                            method="POST"
                            style="display:none">
                            @csrf
                            <input type="hidden" name="metros" id="hmetros-{{ $product->id }}" value="{{ $product->metros ?? 0 }}">
                        </form>

                    </div>
                </div>

                <form action="{{ route('cotizacion.remove', $product->id) }}" method="POST">
                    @csrf

                    <button type="submit" class="cot-card__del" aria-label="Eliminar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M10 11V17M14 11V17M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M3 6H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                                stroke="#C8C8C8"
                                stroke-width="1.8"
                                stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>

                </form>

            </div>

            @empty
            <div class="cot-empty">
                {{ __('messages.no_products_quote') ?? 'No hay productos agregados.' }}
            </div>
            @endforelse
        </div>

        <hr class="cot-divider">

        <form action="{{ route('cotizacion.send') }}" method="POST" class="cot-form">
            @csrf

            <div class="cot-form__grid">

                <div class="cot-form__left">

                    <div class="cot-form__row">

                        <div class="cot-form__group">
                            <label>{{ __('messages.name') }}*</label>
                            <input type="text" name="nombre" value="{{ old('nombre') }}" required>
                        </div>

                        <div class="cot-form__group">
                            <label>Email*</label>
                            <input type="email" name="email" value="{{ old('email') }}" required>
                        </div>

                    </div>

                    <div class="cot-form__row">

                        <div class="cot-form__group">
                            <label>{{ __('messages.phone') }}*</label>
                            <input type="text" name="telefono" value="{{ old('telefono') }}">
                        </div>

                        <div class="cot-form__group">
                            <label>{{ __('messages.company') }}</label>
                            <input type="text" name="empresa" value="{{ old('empresa') }}">
                        </div>

                    </div>

                    <div class="cot-form__group">
                        <label>{{ __('messages.message') }}*</label>
                        <textarea name="mensaje" rows="5">{{ old('mensaje') }}</textarea>
                    </div>

                </div>

                <div class="cot-form__right">
                    <span class="cot-form__note">
                        *{{ __('messages.required_fields') ?? 'Campos Obligatorios' }}
                    </span>

                    <button type="submit" class="cot-btn-cotizar">
                        {{ __('messages.quote') ?? 'Cotizar' }}
                    </button>
                </div>

            </div>
        </form>

    </div>
</section>

<script>
    function stepMetros(id, delta) {
        var input = document.getElementById('metros-' + id);
        var val = Math.max(0, (parseInt(input.value) || 0) + delta);
        input.value = val;
        scheduleSubmit(id, val);
    }

    function submitMetros(id) {
        scheduleSubmit(id, document.getElementById('metros-' + id).value);
    }

    function scheduleSubmit(id, val) {
        document.getElementById('hmetros-' + id).value = val;

        clearTimeout(window['_mt' + id]);

        window['_mt' + id] = setTimeout(function() {
            document.getElementById('form-metros-' + id).submit();
        }, 700);
    }
</script>

@endsection