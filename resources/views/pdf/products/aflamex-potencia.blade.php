@php
    $formatNumber = function ($value) {
        if ($value === null || $value === '') {
            return '--';
        }

        $number = (float) str_replace(',', '.', (string) $value);
        $decimals = abs($number - round($number)) < 0.001 ? 0 : 2;

        return number_format($number, $decimals, ',', '.');
    };

    $formatCell = function ($value) use ($formatNumber) {
        $value = trim((string) ($value ?? ''));

        if ($value === '') {
            return '--';
        }

        if (strtoupper($value) === 'NO VA') {
            return 'NO VA';
        }

        $normalized = str_replace(',', '.', $value);

        return is_numeric($normalized) ? $formatNumber($normalized) : $value;
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
        $title = preg_replace('/\s+/u', ' ', $title) ?? $title;
        $upper = mb_strtoupper($title);

        if (str_contains($upper, 'TETRAPOLARES + PE Y NEUTRO REDUCIDO')) {
            $title = preg_replace(
                '/TETRAPOLARES\s*\+\s*PE\s+y\s+NEUTRO\s+REDUCIDO/iu',
                'TRIPOLARES + PE O + NEUTRO REDUCIDO',
                $title
            ) ?? $title;
        }

        return str_replace('≥', '&#8805;', e(trim($title)));
    };
    $sectionRowCount = fn ($section) => $section->rows?->count() ?? 0;
    $isSmallTechnicalSection = fn ($section) => $section->type !== 'electrical' && $sectionRowCount($section) <= 10;
    $technicalPageRows = fn (array $pageSections) => collect($pageSections)->sum(fn ($section) => $sectionRowCount($section));
    $technicalPageAllowsNotes = fn (array $pageSections) => $technicalPageRows($pageSections) <= 18;
    $technicalPages = [];
    $pendingSmallSection = null;

    foreach ($sections as $section) {
        if ($isSmallTechnicalSection($section)) {
            if ($pendingSmallSection) {
                $technicalPages[] = [$pendingSmallSection, $section];
                $pendingSmallSection = null;
            } else {
                $pendingSmallSection = $section;
            }

            continue;
        }

        if ($pendingSmallSection) {
            $technicalPages[] = [$pendingSmallSection];
            $pendingSmallSection = null;
        }

        $technicalPages[] = [$section];
    }

    if ($pendingSmallSection) {
        $technicalPages[] = [$pendingSmallSection];
    }

    $iconDataUri = function ($icon) use ($product) {
        return app(\App\Services\AflamexPotenciaPdfService::class)->storageDataUri($icon->image);
    };
    $optionalIcons = $icons->filter(function ($icon) {
        if (($icon->pivot->pdf_group ?? null) === 'footer' || ($icon->placement ?? null) === 'footer') {
            return false;
        }

        if (($icon->pivot->pdf_group ?? 'main') === 'optional') {
            return true;
        }

        $slug = strtolower($icon->slug ?? '');

        return str_contains($slug, 'aceite')
            || str_contains($slug, 'hidrocarburo')
            || str_contains($slug, 'solar');
    })->values();
    $footerIcons = $icons->filter(
        fn ($icon) => ($icon->pivot->pdf_group ?? null) === 'footer' || ($icon->placement ?? null) === 'footer'
    )->values();
    $footerLeftIcons = $footerIcons->filter(fn ($icon) => ($icon->footer_side ?? 'left') !== 'right')->values();
    $footerRightIcons = $footerIcons->filter(fn ($icon) => ($icon->footer_side ?? 'left') === 'right')->values();
    $mainIcons = $icons
        ->reject(fn ($icon) => $optionalIcons->contains('id', $icon->id) || $footerIcons->contains('id', $icon->id))
        ->values();
@endphp
<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        @page { margin: 14px 18px 88px; }
        * { box-sizing: border-box; }
        html,
        body {
            background: #fff;
        }
        body {
            margin: 0;
            color: #172033;
            font-family: "DejaVu Sans", Helvetica, sans-serif;
            font-size: 9.5px;
            line-height: 1.42;
        }
        .document-header {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
            border-bottom: 1px solid #d8e3ea;
        }
        .document-header td {
            vertical-align: middle;
            padding: 0 0 18px;
        }
        .document-label {
            color: #0e6f8c;
            font-size: 7.5px;
            font-weight: 800;
            letter-spacing: 1.8px;
            text-transform: uppercase;
        }
        .document-sub {
            margin-top: 3px;
            color: #748391;
            font-size: 7px;
            letter-spacing: .4px;
            text-transform: uppercase;
        }
        .header-logo {
            text-align: right;
        }
        .logo {
            width: 104px;
            height: auto;
        }
        .title-block {
            margin-bottom: 12px;
            padding: 2px 0 10px 12px;
            border-left: 4px solid #21a7c9;
            border-bottom: 1px solid #d9e2e8;
        }
        .title-kicker {
            margin-bottom: 4px;
            color: #0e6f8c;
            font-size: 7px;
            font-weight: 800;
            letter-spacing: 1.4px;
            text-transform: uppercase;
        }
        .title {
            color: #071529;
            font-size: 14.5px;
            font-weight: 800;
            letter-spacing: 1px;
            line-height: 1.16;
            text-transform: uppercase;
        }
        .hero-card {
            height: 155px;
            margin: 0 0 12px;
            padding: 12px 18px;
            text-align: center;
            background: #f5fafc;
            border-top: 1px solid #dce8ee;
            border-bottom: 1px solid #dce8ee;
        }
        .hero-card img {
            max-width: 675px;
            max-height: 128px;
            width: auto;
            height: auto;
        }
        .section-heading {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0 6px;
        }
        .section-heading td {
            vertical-align: middle;
            padding: 0;
        }
        .section-heading-title {
            width: 1%;
            white-space: nowrap;
            color: #071529;
            font-size: 10.5px;
            font-weight: 800;
            letter-spacing: .8px;
            text-transform: uppercase;
            padding-right: 9px !important;
        }
        .section-heading-rule {
            height: 1px;
            border-top: 1px solid #d8e3ea;
        }
        .two-col {
            width: 100%;
            border-collapse: collapse;
        }
        .two-col td {
            vertical-align: top;
        }
        .main-copy {
            width: 60%;
            padding-right: 15px;
        }
        .color-table {
            width: 40%;
            padding-top: 1px;
        }
        .copy-card {
            padding: 8px 10px 6px;
            background: #fbfdfe;
            border-left: 2px solid #21a7c9;
        }
        .copy p {
            margin: 0 0 4px;
        }
        .copy strong {
            color: #071529;
            font-weight: 800;
        }
        .visual-card {
            padding: 6px;
            background: #fff;
            border: 1px solid #dfe7ec;
        }
        .color-table-art {
            display: block;
            width: 100%;
            height: auto;
        }
        .icons {
            margin-top: 12px;
            width: 100%;
            border-collapse: collapse;
        }
        .icons td {
            width: 12.5%;
            text-align: center;
            vertical-align: top;
            padding: 0 4px 5px;
            font-size: 6.5px;
            line-height: 1.15;
        }
        .icon-image-frame {
            width: 52px;
            height: 52px;
            margin: 0 auto 3px;
            text-align: center;
            line-height: 52px;
            overflow: hidden;
        }
        .icons img {
            display: inline-block;
            width: 46px;
            height: 46px;
            object-fit: contain;
            vertical-align: middle;
        }
        .icon-title {
            display: block;
            margin-top: 3px;
            color: #071529;
            font-size: 6px;
            font-weight: 700;
            line-height: 1.05;
        }
        .options-card {
            margin-top: 0;
            padding: 7px 9px;
            background: #fbfdfe;
            border-left: 2px solid #7f8790;
        }
        .options {
            margin-top: 0;
        }
        .footer-note {
            position: fixed;
            left: 18px;
            right: 18px;
            bottom: -52px;
            color: #7a8793;
            font-size: 6.7px;
            line-height: 1.15;
        }
        .footer-note-left-icon {
            left: 176px;
        }
        .footer-icons {
            position: fixed;
            left: 0;
            right: 0;
            bottom: -70px;
            height: 48px;
        }
        .footer-icons-table {
            width: 100%;
            border-collapse: collapse;
        }
        .footer-icons-table td {
            width: 50%;
            vertical-align: middle;
        }
        .footer-icons-table img {
            max-height: 48px;
            width: auto;
            height: auto;
            margin-right: 8px;
            vertical-align: middle;
        }
        .footer-icons-left {
            text-align: left;
            padding-left: 18px;
        }
        .footer-icons-right {
            text-align: right;
            padding-right: 18px;
        }
        .cover-page {
            min-height: 650px;
        }
        .technical-flow {
            margin: 0;
        }
        .technical-page {
            page-break-before: always;
            padding-top: 18px;
            min-height: 660px;
        }
        .technical-page .document-header {
            margin-bottom: 10px;
        }
        .technical-page .document-header td {
            padding-bottom: 19px;
        }
        .technical-page .title-block {
            margin-bottom: 14px;
        }
        .section-title {
            margin: 0 0 5px;
            padding-left: 10px;
            border-left: 4px solid #21a7c9;
            color: #071529;
            font-size: 14px;
            font-weight: 800;
            letter-spacing: .9px;
            line-height: 1.15;
            text-transform: uppercase;
        }
        .section-subtitle {
            margin: 0 0 10px 14px;
            color: #0e6f8c;
            font-size: 9.5px;
            font-weight: 800;
            letter-spacing: .7px;
            text-transform: uppercase;
            page-break-after: avoid;
        }
        .tech-section {
            margin-bottom: 15px;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        table.tech {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            margin-bottom: 12px;
            page-break-inside: auto;
            border-top: 1px solid #cfdde6;
            border-bottom: 1px solid #cfdde6;
        }
        .tech th,
        .tech td {
            border-right: 1px solid #e2e9ee;
            border-bottom: 1px solid #e7edf1;
            padding: 5px 5px;
            text-align: center;
            vertical-align: middle;
            font-size: 7.7px;
            line-height: 1.2;
        }
        .tech th:last-child,
        .tech td:last-child {
            border-right: 0;
        }
        .tech th {
            background: #eef6f9;
            color: #0b2437;
            font-weight: 800;
            letter-spacing: .15px;
        }
        .tech thead tr:last-child th {
            height: 26px;
        }
        .tech tbody td {
            height: 21px;
            white-space: nowrap;
        }
        .tech-product-title {
            background: #fff !important;
            color: #071529 !important;
            font-size: 10.4px !important;
            letter-spacing: .8px !important;
            line-height: 1.15;
            height: 29px;
            padding: 7px 8px !important;
            text-align: center !important;
            text-transform: uppercase;
            border-bottom: 1px solid #cfdde6 !important;
            white-space: normal !important;
        }
        .tech-section-name {
            background: #f7fbfd !important;
            color: #0e6f8c !important;
            font-size: 8.5px !important;
            letter-spacing: .7px !important;
            line-height: 1.2;
            height: 25px;
            padding: 5px 8px !important;
            text-align: center !important;
            text-transform: uppercase;
            white-space: normal !important;
        }
        .tech td:first-child {
            color: #0b2437;
            font-weight: 800;
            text-align: center;
            background: #fff;
        }
        .tech tr {
            page-break-inside: avoid;
        }
        .tech tbody tr:nth-child(even) td {
            background: #fff;
        }
        .tech tbody tr:nth-child(even) td:first-child {
            background: #fff;
        }
        .muted {
            color: #667085;
        }
        .note-card {
            margin: 18px 0 0;
            padding: 8px 12px 9px;
            background: #fbfdfe;
            border-top: 1px solid #d8e3ea;
            border-bottom: 1px solid #edf2f5;
            color: #566575;
            font-size: 8px;
            line-height: 1.35;
            page-break-inside: avoid;
        }
        .note-card strong {
            color: #0b2437;
            letter-spacing: .35px;
            text-transform: uppercase;
        }
        .note-line {
            display: block;
            height: 11px;
            border-bottom: 1px solid #d9e2e8;
        }
        .color-ref {
            width: 100%;
            border-collapse: collapse;
            font-size: 7px;
        }
        .color-ref th,
        .color-ref td {
            border: 1px solid #d4dde4;
            padding: 3px;
            text-align: center;
        }
        .color-ref th {
            background: #eef6f9;
            color: #0b2437;
            font-weight: 800;
        }
        .empty-visual-card {
            min-height: 92px;
            border: 0;
            background: transparent;
        }
        .swatch {
            display: inline-block;
            width: 16px;
            height: 12px;
            border: 1px solid #888;
        }
    </style>
</head>
<body>
    <div class="cover-page">
        <table class="document-header">
            <tr>
                <td>
                    <div class="document-label">Ficha técnica corporativa</div>
                    <div class="document-sub">Potencia · Cables especiales</div>
                </td>
                <td class="header-logo">
                    @if($logoDataUri)
                        <img class="logo" src="{{ $logoDataUri }}" alt="Felrro">
                    @endif
                </td>
            </tr>
        </table>

        <div class="title-block">
            <div class="title-kicker">Familia técnica</div>
            <div class="title">{{ $product->getName() }}</div>
        </div>

        @if($productImageDataUri)
            <div class="hero-card">
                <img src="{{ $productImageDataUri }}" alt="{{ $product->getName() }}">
            </div>
        @endif

        <table class="section-heading">
            <tr>
                <td class="section-heading-title">Aplicaciones / constructividad</td>
                <td class="section-heading-rule"></td>
            </tr>
        </table>

        <table class="two-col">
            <tr>
                <td class="main-copy">
                    <div class="copy copy-card">
                        <p>{{ $product->getDescription() }}</p>
                        @foreach($construction as $item)
                            <p><strong>{{ $item->getTitle() }}:</strong> {{ $item->getContent() }}</p>
                        @endforeach
                    </div>
                </td>
                <td class="color-table">
                    <div class="{{ $colorTableDataUri ? 'visual-card' : 'empty-visual-card' }}">
                        @if($colorTableDataUri)
                            <img class="color-table-art" src="{{ $colorTableDataUri }}" alt="Formación, conductores y vaina">
                        @endif
                    </div>
                </td>
            </tr>
        </table>

        @if($mainIcons->count())
            <table class="icons">
                <tr>
                    @foreach($mainIcons->take(8) as $index => $icon)
                        @if($mainIcons->count() === 7 && $index === 5)
                            <td>&nbsp;</td>
                        @endif
                        <td>
                            <div class="icon-image-frame">
                                @if($iconDataUri($icon))
                                    <img src="{{ $iconDataUri($icon) }}" alt="{{ $icon->getName() }}">
                                @endif
                            </div>
                            <span class="icon-title">{{ $icon->getName() }}</span>
                        </td>
                    @endforeach
                    @for($i = $mainIcons->take(8)->count() + ($mainIcons->count() === 7 ? 1 : 0); $i < 8; $i++)
                        <td>&nbsp;</td>
                    @endfor
                </tr>
            </table>
        @endif

        @if($extras->count())
            <table class="section-heading">
                <tr>
                    <td class="section-heading-title">Opcionales</td>
                    <td class="section-heading-rule"></td>
                </tr>
            </table>
            <div class="options-card">
                <div class="copy options">
                    @foreach($extras as $item)
                        <p><strong>{{ $item->getTitle() }}:</strong> {{ $item->getContent() }}</p>
                    @endforeach
                </div>
            </div>
        @endif

        @if($optionalIcons->count())
            <table class="icons" style="width: 38%; margin-top: 18px;">
                <tr>
                    @foreach($optionalIcons->take(3) as $icon)
                        <td style="width: 33.33%;">
                            <div class="icon-image-frame">
                                @if($iconDataUri($icon))
                                    <img src="{{ $iconDataUri($icon) }}" alt="{{ $icon->getName() }}">
                                @endif
                            </div>
                            <span class="icon-title">{{ $icon->getName() }}</span>
                        </td>
                    @endforeach
                </tr>
            </table>
        @endif
    </div>

    @if($footerIcons->count())
        <div class="footer-icons">
            <table class="footer-icons-table">
                <tr>
                    <td class="footer-icons-left">
                        @foreach($footerLeftIcons as $icon)
                            @if($iconDataUri($icon))
                                <img src="{{ $iconDataUri($icon) }}" alt="">
                            @endif
                        @endforeach
                    </td>
                    <td class="footer-icons-right">
                        @foreach($footerRightIcons as $icon)
                            @if($iconDataUri($icon))
                                <img src="{{ $iconDataUri($icon) }}" alt="">
                            @endif
                        @endforeach
                    </td>
                </tr>
            </table>
        </div>
    @endif

    <div class="footer-note {{ $footerLeftIcons->count() ? 'footer-note-left-icon' : '' }}">* Especificaciones a título informativo. Sujetas a modificaciones sin previo aviso.</div>

    @if(count($technicalPages))
        <div class="technical-flow">
        @foreach($technicalPages as $sectionsOnPage)
            <div class="technical-page">
                <table class="document-header">
                    <tr>
                        <td>
                            <div class="document-label">Ficha técnica corporativa</div>
                            <div class="document-sub">Potencia · Datos técnicos</div>
                        </td>
                        <td class="header-logo">
                            @if($logoDataUri)
                                <img class="logo" src="{{ $logoDataUri }}" alt="Felrro">
                            @endif
                        </td>
                    </tr>
                </table>

                <div class="title-block">
                    <div class="title-kicker">Familia técnica</div>
                    <div class="title">{{ $product->getName() }}</div>
                </div>

                @foreach($sectionsOnPage as $section)
                    <div class="tech-section">
                    @if($section->type === 'electrical')
                        <table class="tech">
                            <colgroup>
                                @foreach(range(1, 9) as $column)
                                    <col style="width: 11.111%;">
                                @endforeach
                            </colgroup>
                            <thead>
                                <tr>
                                    <th class="tech-section-name" colspan="9">{!! $formatTechnicalTitle($section->getTitle()) !!}</th>
                                </tr>
                                <tr>
                                    <th>Sección nominal (mm²)</th>
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
                                            <td>{{ $row->values[$key]['value'] ?? '--' }}</td>
                                        @endforeach
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    @else
                        @php
                            $firstRow = $section->rows->first();
                            $headers = collect($firstRow->values['headers'] ?? [])
                                ->filter(fn ($header) => trim((string) $header) !== '')
                                ->values();
                            $columnCount = $headers->count() + 1;
                            $columnWidth = $columnCount > 0 ? (100 / $columnCount) : 100;
                        @endphp
                        <table class="tech">
                            <colgroup>
                                @foreach(range(1, $columnCount) as $column)
                                    <col style="width: {{ number_format($columnWidth, 4, '.', '') }}%;">
                                @endforeach
                            </colgroup>
                            <thead>
                                <tr>
                                    <th class="tech-section-name" colspan="{{ $headers->count() + 1 }}">{!! $formatTechnicalTitle($section->getTitle()) !!}</th>
                                </tr>
                                <tr>
                                    <th>Formación</th>
                                    @foreach($headers as $header)
                                        <th>{{ $header }}</th>
                                    @endforeach
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
                                    <tr>
                                        <td>{{ $row->formation }}</td>
                                        @foreach($rawValues as $value)
                                            <td>{{ $formatCell($value) }}</td>
                                        @endforeach
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    @endif
                    </div>
                @endforeach

                @if($technicalPageAllowsNotes($sectionsOnPage))
                    <div class="note-card">
                        <strong>Notas:</strong>
                        <span class="note-line"></span>
                        <span class="note-line"></span>
                        <span class="note-line"></span>
                    </div>
                @endif
            </div>
        @endforeach
        </div>
    @endif
</body>
</html>
