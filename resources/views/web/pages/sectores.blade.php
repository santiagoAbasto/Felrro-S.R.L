@extends('web.layouts.app')

@section('content')

@php
    $sectorPayloads = $sectors->mapWithKeys(function ($sector) {
        return [
            $sector->id => [
                'id' => $sector->id,
                'name' => $sector->getName(),
                'description' => $sector->getDescription(),
                'products' => $sector->relatedProducts->map(fn ($product) => [
                    'id' => $product->id,
                    'name' => $product->getName(),
                    'category' => $product->category?->getName(),
                    'description' => $product->getShortDescription(),
                    'image' => $product->image_url,
                    'url' => route('productos.show', $product->slug),
                ])->values()->all(),
            ],
        ];
    });
@endphp

<div class="felrro-sectors-wrapper">

    <div class="felrro-sectors-container">

        <div class="felrro-sectors-breadcrumb">
            <a href="{{ route('home') }}">{{ __('messages.home') }}</a>
            <span>›</span>
            <span>{{ __('messages.sectors') }}</span>
        </div>

        <div class="felrro-sectors-grid">

            @foreach($sectors as $sector)
            @php $relatedCount = $sector->relatedProducts->count(); @endphp
            <button
                type="button"
                class="felrro-sector-card{{ $relatedCount === 0 ? ' felrro-sector-card--disabled' : '' }}"
                data-sector-trigger
                data-sector-id="{{ $sector->id }}"
                @disabled($relatedCount === 0)
                aria-haspopup="dialog"
                aria-label="{{ $relatedCount > 0 ? 'Ver productos relacionados de ' . $sector->getName() : $sector->getName() . ' sin productos relacionados' }}">

                <div class="felrro-sector-image-wrapper">
                    <img
                        src="{{ $sector->image_url }}"
                        alt="{{ $sector->getName() }}">
                    <div class="felrro-sector-overlay"></div>
                </div>

                <div class="felrro-sector-title">
                    {{ $sector->getName() }}
                </div>

            </button>
            @endforeach

        </div>

    </div>

</div>

<div class="felrro-sector-modal" data-sector-modal hidden>
    <div class="felrro-sector-modal__backdrop" data-sector-modal-close></div>

    <div
        class="felrro-sector-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="felrro-sector-modal-title"
    >
        <button type="button" class="felrro-sector-modal__close" data-sector-modal-close aria-label="Cerrar modal">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
        </button>

        <div class="felrro-sector-modal__header">
            <p class="felrro-sector-modal__eyebrow">Sector industrial</p>
            <h2 id="felrro-sector-modal-title" class="felrro-sector-modal__title"></h2>
            <p class="felrro-sector-modal__description" data-sector-modal-description hidden></p>
        </div>

        <div class="felrro-sector-modal__body">
            <div class="felrro-sector-modal__products" data-sector-modal-products></div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const sectors = @json($sectorPayloads);
    const modal = document.querySelector('[data-sector-modal]');

    if (!modal) {
        return;
    }

    const title = modal.querySelector('.felrro-sector-modal__title');
    const description = modal.querySelector('[data-sector-modal-description]');
    const productsContainer = modal.querySelector('[data-sector-modal-products]');
    const closeElements = modal.querySelectorAll('[data-sector-modal-close]');
    const triggers = document.querySelectorAll('[data-sector-trigger]');
    let lastTrigger = null;

    const closeModal = () => {
        modal.hidden = true;
        document.body.classList.remove('felrro-modal-open');

        if (lastTrigger) {
            lastTrigger.focus();
        }
    };

    const openModal = (sectorId, trigger) => {
        const sector = sectors[String(sectorId)];

        if (!sector || !Array.isArray(sector.products) || sector.products.length === 0) {
            return;
        }

        lastTrigger = trigger;
        title.textContent = sector.name || '';

        if (sector.description) {
            description.hidden = false;
            description.textContent = sector.description;
        } else {
            description.hidden = true;
            description.textContent = '';
        }

        productsContainer.innerHTML = sector.products.map((product) => `
            <a href="${product.url}" class="felrro-sector-product-card">
                <div class="felrro-sector-product-card__media">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="felrro-sector-product-card__content">
                    ${product.category ? `<p class="felrro-sector-product-card__category">${product.category}</p>` : ''}
                    <h3 class="felrro-sector-product-card__title">${product.name}</h3>
                    <p class="felrro-sector-product-card__text">${product.description || 'Ver ficha del producto relacionado.'}</p>
                    <span class="felrro-sector-product-card__link">Ver producto</span>
                </div>
            </a>
        `).join('');

        modal.hidden = false;
        document.body.classList.add('felrro-modal-open');
    };

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            openModal(trigger.dataset.sectorId, trigger);
        });
    });

    closeElements.forEach((element) => {
        element.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.hidden) {
            closeModal();
        }
    });
});
</script>

@endsection
