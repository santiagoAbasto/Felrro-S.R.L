@extends('web.layouts.app')

@section('content')
@php
    $formatTechnicalCell = function ($value) {
        $value = trim((string) ($value ?? ''));

        if ($value === '') {
            return '--';
        }

        if (mb_strtoupper($value) === 'NO VA') {
            return 'NO VA';
        }

        $normalized = str_replace(',', '.', $value);

        if (is_numeric($normalized)) {
            $number = (float) $normalized;
            $decimals = abs($number - round($number)) < 0.001 ? 0 : 2;

            return number_format($number, $decimals, ',', '.');
        }

        return $value;
    };

    $formatTechnicalTitle = function ($value) {
        $title = trim((string) preg_replace('/\s+/u', ' ', (string) ($value ?? '')));

        if ($title === '') {
            return '';
        }

        $title = str_replace(['//', '≥ 50%', '? AL 50%', '? 50%'], [' / ', '≥ AL 50%', '≥ AL 50%', '≥ AL 50%'], $title);
        $title = preg_replace('/[?¿�]\s*(?:AL\s*)?50%/iu', '≥ AL 50%', $title) ?? $title;
        $title = preg_replace('/\s*\+\s*/u', ' + ', $title) ?? $title;
        $title = preg_replace('/≥\s*(?:AL\s*)?50%/iu', '≥ AL 50%', $title) ?? $title;

        if (str_contains(mb_strtoupper($title), 'TETRAPOLARES + PE Y NEUTRO REDUCIDO')) {
            $title = preg_replace(
                '/TETRAPOLARES\s*\+\s*PE\s+y\s+NEUTRO\s+REDUCIDO/iu',
                'TRIPOLARES + PE O + NEUTRO REDUCIDO',
                $title
            ) ?? $title;
        }

        return trim($title);
    };

    $quoteableSectionIds = [];
    $passedElectricalSection = false;

    foreach ($technicalSections as $technicalSection) {
        if ($technicalSection->type === 'electrical') {
            $passedElectricalSection = true;
            continue;
        }

        if ($passedElectricalSection && $technicalSection->rows->isNotEmpty()) {
            $quoteableSectionIds[] = (int) $technicalSection->id;
        }
    }
@endphp

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
            <a href="{{ route('productos.category', $product->category->slug) }}">
                {{ $product->category->getName() }}
            </a>
            <span>›</span>
            <span>{{ mb_convert_case($product->getName(), MB_CASE_TITLE, 'UTF-8') }}</span>
        </div>

        {{-- =========================================
            HERO PRODUCTO
        ========================================== --}}
        <div class="product-top">

            {{-- GALERÍA --}}
            <div class="product-gallery">

                <div class="gallery-thumbs" data-category="{{ $product->category->slug }}">

                    <img
                        src="{{ $product->image_url }}"
                        alt="{{ $product->getName() }}"
                        class="thumb active"
                        onclick="changeImage('{{ $product->image_url }}', this)">

                    @foreach($product->images as $image)
                    <img
                        src="{{ $image->image_url }}"
                        alt="{{ $product->getName() }}"
                        class="thumb"
                        onclick="changeImage('{{ $image->image_url }}', this)">
                    @endforeach

                </div>

                <div class="gallery-main">
                    <img id="mainImage"
                        src="{{ $product->image_url }}"
                        alt="{{ $product->getName() }}">
                </div>

            </div>

            {{-- INFO --}}
            <div class="product-info">

                <span class="product-category">
                    {{ strtoupper($product->category->getName()) }}
                </span>

                <h1>{{ $product->getName() }}</h1>


                <p class="product-full-description">
                    {{ $product->getDescription() }}
                </p>

                <div class="product-actions">
                    @if($product->ficha_tecnica_url)
                    <a href="{{ $product->ficha_tecnica_url }}"
                        target="_blank"
                        class="btn-outline">
                        {{ __('messages.technical_sheet') }}
                    </a>
                    @endif
                </div>

            </div>

        </div>

        {{-- =========================================
            PRODUCT CONTENT
        ========================================== --}}
        <div class="product-content">

            <div class="tabs-nav">
                <button class="tab active" data-scroll="#applications">
                    {{ __('messages.applications') }}
                </button>

                <button class="tab" data-scroll="#construction">
                    {{ __('messages.construction') }}
                </button>

                <button class="tab" data-scroll="#extra">
                    {{ __('messages.additional_information') }}
                </button>
            </div>

            {{-- ================= APLICACIONES ================= --}}
            <section id="applications" class="content-section">

                <h3 class="section-title">{{ __('messages.applications') }}</h3>

                <div class="applications-grid">
                    @foreach($applications as $app)
                    <div class="application-card">
                        <h4>{{ $app['title'] }}</h4>
                        <p>{!! nl2br(e($app['content'])) !!}</p>
                    </div>
                    @endforeach
                </div>

            </section>

            {{-- ================= CONSTRUCCIÓN ================= --}}
            <section id="construction" class="content-section">

                <h3 class="section-title">{{ __('messages.construction') }}</h3>

                <div class="grid-3">
                    @foreach($construction as $item)
                    <div class="info-card">
                        <h4>{{ $item->getTitle() }}</h4>
                        <p>{{ $item->getContent() }}</p>
                    </div>
                    @endforeach
                </div>

            </section>

            {{-- ================= EXTRA ================= --}}
            <section id="extra" class="content-section">

                <h3 class="section-title">{{ __('messages.additional_information') }}</h3>

                <div class="grid-3">
                    @foreach($extra as $item)
                    <div class="info-card">
                        <h4>{{ $item->getTitle() }}</h4>
                        <p>{{ $item->getContent() }}</p>
                    </div>
                    @endforeach
                </div>

                @if($technicalSections->count())
                    <div class="technical-public">
                        <div class="technical-public__header">
                            <span class="technical-public__eyebrow">Datos técnicos</span>
                            <h3>Tablas técnicas del producto</h3>
                            <p>Información dimensional y eléctrica importada desde la ficha técnica, presentada para consulta rápida en la web.</p>
                            @if($errors->has('technical_rows'))
                                <div class="technical-public__error">
                                    {{ $errors->first('technical_rows') }}
                                </div>
                            @endif
                        </div>

                        <div class="technical-public__list">
                            @foreach($technicalSections as $section)
                                @php
                                    $isQuoteSection = in_array((int) $section->id, $quoteableSectionIds, true);
                                @endphp
                                <article class="technical-public__card">
                                    <div class="technical-public__title">
                                        {{ $formatTechnicalTitle($section->getTitle()) }}
                                    </div>

                                    <div class="technical-public__table-wrap">
                                        @if($section->type === 'electrical')
                                            @php
                                                $firstRow = $section->rows->first();
                                                $descriptorHeaders = collect($firstRow->values['descriptor_headers'] ?? [])
                                                    ->filter(fn ($header) => trim((string) $header) !== '')
                                                    ->values();
                                                $valueHeaders = collect($firstRow->values['headers'] ?? [])
                                                    ->filter(fn ($header) => trim((string) $header) !== '')
                                                    ->values();
                                                $hasGenericElectricalSchema = $descriptorHeaders->isNotEmpty() && $valueHeaders->isNotEmpty();
                                            @endphp
                                            <table class="technical-public__table technical-public__table--electrical">
                                                @if($hasGenericElectricalSchema)
                                                    <thead>
                                                        <tr>
                                                            @foreach($descriptorHeaders as $header)
                                                                <th>{{ $header }}</th>
                                                            @endforeach
                                                            @foreach($valueHeaders as $header)
                                                                <th>{{ $header }}</th>
                                                            @endforeach
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        @foreach($section->rows as $row)
                                                            @php
                                                                $descriptorValues = collect($row->values['descriptor_values'] ?? [])
                                                                    ->take($descriptorHeaders->count())
                                                                    ->pad($descriptorHeaders->count(), '')
                                                                    ->values();
                                                                $rawValues = collect($row->values['raw'] ?? [])
                                                                    ->take($valueHeaders->count())
                                                                    ->pad($valueHeaders->count(), '')
                                                                    ->values();
                                                            @endphp
                                                            <tr>
                                                                @foreach($descriptorValues as $value)
                                                                    <td>{{ $formatTechnicalCell($value) }}</td>
                                                                @endforeach
                                                                @foreach($rawValues as $value)
                                                                    <td>{{ $formatTechnicalCell($value) }}</td>
                                                                @endforeach
                                                            </tr>
                                                        @endforeach
                                                    </tbody>
                                                @else
                                                    <thead>
                                                        <tr>
                                                            <th>Sección nominal <span>mm²</span></th>
                                                            <th>Res. 20°C C.C.</th>
                                                            <th>Res. 70°C C.A.</th>
                                                            <th>React. c1</th>
                                                            <th>React. c2</th>
                                                            <th>Aire bipolar</th>
                                                            <th>Aire multipolar</th>
                                                            <th>Tierra bipolar</th>
                                                            <th>Tierra multipolar</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        @foreach($section->rows as $row)
                                                            <tr>
                                                                <td>{{ $row->nominal_section }}</td>
                                                                @foreach(['resistencia_20_cc','resistencia_70_ca','reactancia_c1','reactancia_c2','aire_bipolar','aire_multipolar','tierra_bipolar','tierra_multipolar'] as $key)
                                                                    <td>{{ $formatTechnicalCell($row->values[$key]['value'] ?? '--') }}</td>
                                                                @endforeach
                                                            </tr>
                                                        @endforeach
                                                    </tbody>
                                                @endif
                                            </table>
                                        @else
                                            @php
                                                $firstRow = $section->rows->first();
                                                $leadHeader = trim((string) ($firstRow->values['lead_header'] ?? 'Formación'));
                                                $headers = collect($firstRow->values['headers'] ?? [])
                                                    ->filter(fn ($header) => trim((string) $header) !== '')
                                                    ->values();
                                            @endphp
                                            <div class="technical-public__table-main">
                                                @if($isQuoteSection)
                                                    <form
                                                        action="{{ route('cotizacion.add', $product->id) }}"
                                                        method="POST"
                                                        class="technical-public__quote-form"
                                                        data-technical-quote-form>
                                                        @csrf
                                                        <input type="hidden" name="requires_technical_selection" value="1">
                                                @endif
                                                <table class="technical-public__table">
                                                    <thead>
                                                        <tr>
                                                            <th>{{ $leadHeader !== '' ? $leadHeader : 'Formación' }}</th>
                                                            @foreach($headers as $header)
                                                                <th>{{ $header }}</th>
                                                            @endforeach
                                                            @if($isQuoteSection)
                                                                <th class="technical-public__table-action-head">Seleccionar</th>
                                                            @endif
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        @foreach($section->rows as $row)
                                                            @php
                                                                $rawValues = collect($row->values['raw'] ?? [])
                                                                    ->take($headers->count())
                                                                    ->pad($headers->count(), '')
                                                                    ->values();
                                                            @endphp
                                                            <tr data-technical-quote-row>
                                                                <td>{{ $row->formation }}</td>
                                                                @foreach($rawValues as $value)
                                                                    <td>{{ $formatTechnicalCell($value) }}</td>
                                                                @endforeach
                                                                @if($isQuoteSection)
                                                                    <td class="technical-public__table-action-cell" data-technical-action-cell>
                                                                        <div class="technical-public__table-action-layout">
                                                                            <label class="technical-public__row-check">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    name="technical_row_ids[]"
                                                                                    value="{{ $row->id }}"
                                                                                    class="technical-public__row-check-input"
                                                                                    data-technical-row-checkbox>
                                                                                <span class="technical-public__row-check-box" aria-hidden="true"></span>
                                                                                <span class="technical-public__row-check-text">Seleccionar</span>
                                                                            </label>
                                                                            <button
                                                                                type="submit"
                                                                                class="btn-product technical-public__row-quote-button"
                                                                                data-technical-row-submit
                                                                                hidden>
                                                                                {{ __('messages.quote') }}
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                @endif
                                                            </tr>
                                                        @endforeach
                                                    </tbody>
                                                </table>
                                                @if($isQuoteSection)
                                                    <div class="technical-public__quote-overlay" data-technical-quote-overlay hidden>
                                                        <button
                                                            type="submit"
                                                            class="btn-product technical-public__quote-overlay-button"
                                                            data-technical-overlay-submit>
                                                            {{ __('messages.quote') }}
                                                        </button>
                                                    </div>
                                                    </form>
                                                @endif
                                            </div>
                                        @endif
                                    </div>
                                </article>
                            @endforeach
                        </div>
                    </div>
                @endif

            </section>

        </div>

        {{-- =========================================
            PRODUCTOS DESTACADOS
        ========================================== --}}
        @if($featuredProducts->count())
        <section class="featured-products">

            <div class="section-header">
                <h2>{{ __('messages.featured_products') }}</h2>
            </div>

            <div class="featured-products-grid">
                @foreach($featuredProducts as $item)
                <a href="{{ route('productos.show', $item->slug) }}"
                    class="featured-product-card">

                    <div class="featured-img">
                        <img src="{{ $item->image_url }}"
                            alt="{{ $item->getName() }}">
                    </div>

                    <div class="featured-content">
                        <span class="featured-category">
                            {{ strtoupper($item->category->getName()) }}
                        </span>

                        <h3 class="featured-title">
                            {{ $item->getName() }}
                        </h3>

                        <p class="featured-desc">
                            {{ $item->getShortDescription() }}
                        </p>
                    </div>

                </a>
                @endforeach
            </div>

        </section>
        @endif

    </div>

</section>

{{-- =========================================
    SCRIPT
========================================== --}}
<script>
    function changeImage(src, element) {

        const mainImage = document.getElementById('mainImage');
        mainImage.src = src;

        document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        element.classList.add('active');
    }

    document.querySelectorAll('[data-technical-quote-form]').forEach(form => {
        const checkboxes = Array.from(form.querySelectorAll('[data-technical-row-checkbox]'));
        const rowButtons = Array.from(form.querySelectorAll('[data-technical-row-submit]'));
        const overlay = form.querySelector('[data-technical-quote-overlay]');
        const overlayButton = form.querySelector('[data-technical-overlay-submit]');

        if (!checkboxes.length || !overlay || !overlayButton) {
            return;
        }

        const updateQuoteState = () => {
            const selectedRows = checkboxes
                .filter(checkbox => checkbox.checked)
                .map(checkbox => {
                    const row = checkbox.closest('[data-technical-quote-row]');

                    return {
                        checkbox,
                        row,
                        actionCell: row ? row.querySelector('[data-technical-action-cell]') : null,
                    };
                })
                .filter(item => item.row && item.actionCell);

            const selectedCount = selectedRows.length;

            checkboxes.forEach((checkbox, index) => {
                const row = checkbox.closest('[data-technical-quote-row]');
                const rowButton = rowButtons[index];
                if (row) {
                    row.classList.toggle('technical-public__row--selected', checkbox.checked);
                }

                if (rowButton) {
                    rowButton.hidden = !(selectedCount === 1 && checkbox.checked);
                }
            });

            if (selectedCount === 0) {
                overlay.hidden = true;
                overlay.style.removeProperty('top');
                overlay.style.removeProperty('height');
                overlay.style.removeProperty('left');
                overlayButton.textContent = '{{ __('messages.quote') }}';
                return;
            }

            if (selectedCount === 1) {
                overlay.hidden = true;
                overlay.style.removeProperty('top');
                overlay.style.removeProperty('height');
                overlay.style.removeProperty('left');
                overlayButton.textContent = '{{ __('messages.quote') }}';
                return;
            }

            const firstCellRect = selectedRows[0].actionCell.getBoundingClientRect();
            const lastCellRect = selectedRows[selectedRows.length - 1].actionCell.getBoundingClientRect();
            const formRect = form.getBoundingClientRect();
            const overlayWidth = 124;
            const overlayGap = 32;
            const selectorWidth = 144;
            const top = firstCellRect.top - formRect.top;
            const height = lastCellRect.bottom - firstCellRect.top;
            const left = firstCellRect.left - formRect.left + selectorWidth + overlayGap;

            overlay.hidden = false;
            overlay.style.top = top + 'px';
            overlay.style.height = height + 'px';
            overlay.style.left = left + 'px';
            overlayButton.textContent = '{{ __('messages.quote') }}';
        };

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateQuoteState);
        });

        window.addEventListener('resize', updateQuoteState);

        form.addEventListener('submit', event => {
            const selectedCount = checkboxes.filter(checkbox => checkbox.checked).length;

            if (selectedCount === 0) {
                event.preventDefault();
            }
        });

        updateQuoteState();
    });

    document.querySelectorAll('.tab').forEach(tab => {

        tab.addEventListener('click', function() {

            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const target = document.querySelector(this.dataset.scroll);

            window.scrollTo({
                top: target.offsetTop - 120,
                behavior: 'smooth'
            });

        });

    });
</script>

@endsection
