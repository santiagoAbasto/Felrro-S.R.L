<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductImportBatch;
use App\Models\ProductTechnicalSection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class InstrumentationImportService
{
    private const SHEETS = [
        '300v' => ['cover' => ['start' => 1, 'end' => 10]],
        '300v arm' => ['cover' => ['start' => 12, 'end' => 21]],
        'ls0h' => ['cover' => ['start' => 23, 'end' => 32]],
        'ls0h arm' => ['cover' => ['start' => 23, 'end' => 32]],
        'res fuego' => ['cover' => ['start' => 34, 'end' => 43]],
        'res fue arm' => ['cover' => ['start' => 34, 'end' => 43]],
        '600v' => ['cover' => ['start' => 45, 'end' => 54]],
        '600v arm' => ['cover' => ['start' => 45, 'end' => 54]],
    ];

    public function __construct(private AflamexPotenciaPdfService $pdfService)
    {
    }

    public function supports(array $sheetNames): bool
    {
        $normalized = collect($sheetNames)
            ->map(fn ($name) => $this->normalizeSheetName($name))
            ->all();

        return empty(array_diff(array_keys(self::SHEETS), $normalized));
    }

    public function import(ProductCategory $category, UploadedFile $technicalFile, ?UploadedFile $coverFile, array $iconIds = [], ?UploadedFile $colorTableFile = null): array
    {
        return DB::transaction(function () use ($category, $technicalFile, $coverFile, $iconIds, $colorTableFile) {
            $batch = ProductImportBatch::create([
                'user_id' => auth()->id(),
                'technical_file' => $technicalFile->getClientOriginalName(),
                'cover_file' => $coverFile?->getClientOriginalName(),
                'status' => 'processing',
            ]);

            $coverData = $coverFile ? $this->readCoverData($coverFile->getRealPath()) : [];
            $technicalBook = IOFactory::load($technicalFile->getRealPath());
            $summary = [];
            $warnings = [];

            foreach ($technicalBook->getWorksheetIterator() as $sheet) {
                $sheetName = $sheet->getTitle();
                $normalizedSheetName = $this->normalizeSheetName($sheetName);

                if (!isset(self::SHEETS[$normalizedSheetName])) {
                    continue;
                }

                $cover = $coverData[$normalizedSheetName] ?? [];
                $product = $this->upsertProduct($category, $sheetName, $cover);

                if (!empty($cover['image_path'])) {
                    $product->update(['image' => $cover['image_path']]);
                }

                if ($colorTableFile) {
                    $this->syncPdfColorTable($product, $colorTableFile);
                }

                $this->syncProductBlocks($product, $cover);
                $this->syncProductIcons($product, $iconIds);
                $technicalStats = $this->syncTechnicalData($product, $sheet, $batch);

                $this->pdfService->generate($product);

                $summary[] = [
                    'id' => $product->id,
                    'name' => $product->getName(),
                    'slug' => $product->slug,
                    'sheet' => $sheetName,
                    'sections' => $technicalStats['sections'],
                    'rows' => $technicalStats['rows'],
                    'expected_sections' => $technicalStats['expected_sections'],
                    'expected_rows' => $technicalStats['expected_rows'],
                    'empty_sections' => $technicalStats['empty_sections'],
                    'complete' => $technicalStats['complete'],
                    'pdf' => $product->fresh()->ficha_tecnica_url,
                ];
            }

            $batch->update([
                'status' => 'processed',
                'summary' => $summary,
                'errors' => $warnings,
            ]);

            return [
                'batch' => $batch->fresh(),
                'summary' => $summary,
                'warnings' => $warnings,
            ];
        });
    }

    private function readCoverData(string $path): array
    {
        $workbook = IOFactory::load($path);
        $sheet = $workbook->getActiveSheet();
        $data = [];

        foreach (self::SHEETS as $sheetName => $definition) {
            $bounds = $definition['cover'];
            $start = $bounds['start'];
            $end = $bounds['end'];

            $applications = $this->coverApplications($sheet, $start, $end);
            $extras = $this->coverExtras($sheet, $start, $end);

            $data[$sheetName] = [
                'short_description' => $this->firstNonEmptyInRange($sheet, $start, $end, 19),
                'description' => $applications,
                'applications' => $applications === '' ? [] : [[
                    'title' => ['es' => 'Aplicaciones', 'en' => 'Applications'],
                    'content' => ['es' => $applications, 'en' => $applications],
                ]],
                'construction' => $this->coverConstruction($sheet, $start, $end),
                'extras' => $extras === '' ? [] : [[
                    'title' => ['es' => 'Opcionales', 'en' => 'Options'],
                    'content' => ['es' => $extras, 'en' => $extras],
                ]],
                'image_path' => $this->extractProductImage($sheet, $sheetName, $bounds),
            ];
        }

        return $data;
    }

    private function upsertProduct(ProductCategory $category, string $sheetName, array $cover): Product
    {
        $name = $this->fallbackTitle($sheetName);
        $slug = $this->safeSlug($name);

        $product = Product::withTrashed()->where('slug', $slug)->first();

        if ($product?->trashed()) {
            $product->restore();
        }

        $shortDescription = $cover['short_description'] ?? '';
        $description = $cover['description'] ?? '';

        $payload = [
            'category_id' => $category->id,
            'name' => ['es' => $name, 'en' => $name],
            'short_description' => [
                'es' => $shortDescription !== '' ? $shortDescription : 'Cable de instrumentación industrial FECORON.',
                'en' => $shortDescription !== '' ? $shortDescription : 'FECORON industrial instrumentation cable.',
            ],
            'description' => [
                'es' => $description !== '' ? $description : 'Cable de instrumentación para control, señal y monitoreo industrial.',
                'en' => $description !== '' ? $description : 'Instrumentation cable for control, signaling and industrial monitoring.',
            ],
            'featured' => false,
            'is_active' => true,
        ];

        if ($product) {
            $product->update($payload);

            return $product->fresh();
        }

        return Product::create($payload);
    }

    private function syncProductBlocks(Product $product, array $cover): void
    {
        $product->applications()->delete();

        foreach (($cover['construction'] ?? []) as $index => $item) {
            $product->applications()->create([
                'type' => 'construction',
                'title' => $item['title'],
                'content' => $item['content'],
                'order' => $index + 1,
            ]);
        }

        foreach (($cover['applications'] ?? []) as $index => $item) {
            $product->applications()->create([
                'type' => 'application',
                'title' => $item['title'],
                'content' => $item['content'],
                'order' => $index + 1,
            ]);
        }

        foreach (($cover['extras'] ?? []) as $index => $item) {
            $product->applications()->create([
                'type' => 'extra',
                'title' => $item['title'],
                'content' => $item['content'],
                'order' => $index + 1,
            ]);
        }
    }

    private function syncProductIcons(Product $product, array $iconIds): void
    {
        $sync = [];
        $icons = \App\Models\ProductIcon::query()
            ->whereIn('id', array_values(array_unique(array_filter($iconIds))))
            ->get()
            ->keyBy('id');

        foreach (array_values(array_unique(array_filter($iconIds))) as $index => $iconId) {
            $icon = $icons->get((int) $iconId);

            $sync[(int) $iconId] = [
                'order' => $index + 1,
                'show_in_pdf' => true,
                'pdf_group' => $icon?->placement === 'footer' ? 'footer' : 'main',
            ];
        }

        $product->icons()->sync($sync);
    }

    private function syncPdfColorTable(Product $product, UploadedFile $file): void
    {
        if ($product->pdf_color_table && Storage::disk('public')->exists($product->pdf_color_table)) {
            Storage::disk('public')->delete($product->pdf_color_table);
        }

        $product->update([
            'pdf_color_table' => $file->storeAs(
                'products/pdf-color-tables',
                $product->slug . '.' . strtolower($file->extension()),
                'public'
            ),
        ]);
    }

    private function syncTechnicalData(Product $product, Worksheet $sheet, ProductImportBatch $batch): array
    {
        $product->technicalSections()->delete();

        $electricalRows = $this->extractElectricalRows($sheet);
        $dimensionBlocks = $this->extractDimensionBlocks($sheet);

        $sections = 0;
        $rows = 0;

        if ($electricalRows !== []) {
            $electrical = $product->technicalSections()->create([
                'product_import_batch_id' => $batch->id,
                'type' => 'electrical',
                'title' => ['es' => 'Características eléctricas', 'en' => 'Electrical characteristics'],
                'sheet_name' => $sheet->getTitle(),
                'source_row' => 4,
                'order' => 1,
            ]);

            foreach ($electricalRows as $index => $payload) {
                $electrical->rows()->create($payload + ['order' => $index + 1]);
            }

            $sections++;
            $rows += count($electricalRows);
        }

        foreach ($dimensionBlocks as $blockIndex => $block) {
            $section = $product->technicalSections()->create([
                'product_import_batch_id' => $batch->id,
                'type' => 'dimensions',
                'title' => ['es' => $block['title'], 'en' => $block['title']],
                'sheet_name' => $sheet->getTitle(),
                'source_row' => $block['header_row'],
                'order' => $sections + $blockIndex + 1,
            ]);

            foreach ($block['rows'] as $rowIndex => $payload) {
                $section->rows()->create($payload + ['order' => $rowIndex + 1]);
            }

            $sections++;
            $rows += count($block['rows']);
        }

        return [
            'sections' => $sections,
            'rows' => $rows,
            'expected_sections' => $sections,
            'expected_rows' => $rows,
            'empty_sections' => [],
            'complete' => true,
        ];
    }

    private function extractElectricalRows(Worksheet $sheet): array
    {
        $descriptorHeaders = [];
        $valueHeaders = [];

        for ($column = 1; $column <= 3; $column++) {
            $descriptorHeaders[] = $this->normalizeHeaderLabel(
                $this->cellText($sheet, $column, 5),
                $this->cellText($sheet, $column, 6)
            );
        }

        for ($column = 4; $column <= 7; $column++) {
            $valueHeaders[] = $this->normalizeHeaderLabel(
                $this->cellText($sheet, $column, 5),
                $this->cellText($sheet, $column, 6)
            );
        }

        $lastDescriptorValues = array_fill(0, count($descriptorHeaders), '');
        $rows = [];

        for ($row = 7; $row <= 22; $row++) {
            $descriptorValues = [];

            for ($column = 1; $column <= 3; $column++) {
                $value = $this->cellText($sheet, $column, $row);

                if ($value === '') {
                    $value = $lastDescriptorValues[$column - 1];
                } else {
                    $lastDescriptorValues[$column - 1] = $value;
                }

                $descriptorValues[] = $value;
            }

            $rawValues = [];
            $hasValue = false;

            for ($column = 4; $column <= 7; $column++) {
                $value = $this->cellText($sheet, $column, $row);
                $rawValues[] = $value;
                $hasValue = $hasValue || $value !== '';
            }

            if (!$hasValue) {
                continue;
            }

            $rows[] = [
                'nominal_section' => $descriptorValues[0] ?? null,
                'formation' => $descriptorValues[1] ?? null,
                'values' => [
                    'descriptor_headers' => $descriptorHeaders,
                    'descriptor_values' => $descriptorValues,
                    'headers' => $valueHeaders,
                    'raw' => $rawValues,
                ],
            ];
        }

        return $rows;
    }

    private function extractDimensionBlocks(Worksheet $sheet): array
    {
        $blocks = [];
        $highestRow = $sheet->getHighestRow();
        $startRow = $this->findDimensionStartRow($sheet);

        if ($startRow === null) {
            return $blocks;
        }

        $row = $startRow;

        while ($row <= $highestRow) {
            $current = $this->cellText($sheet, 1, $row);

            if ($current === '') {
                $row++;
                continue;
            }

            if ($this->looksLikeDimensionHeaderRow($sheet, $row + 1)) {
                $title = $this->normalizeTechnicalTitle($current);
                $headerRow = $row + 1;
                $headers = $this->rowTexts($sheet, $headerRow);
                $leadHeader = array_shift($headers);
                $lastLeadValue = '';
                $dataRows = [];

                for ($dataRow = $headerRow + 1; $dataRow <= $highestRow; $dataRow++) {
                    if ($this->cellText($sheet, 1, $dataRow) !== '' && $this->looksLikeDimensionHeaderRow($sheet, $dataRow + 1)) {
                        break;
                    }

                    $values = $this->rowTexts($sheet, $dataRow, count($headers) + 1);
                    $hasValue = collect($values)->contains(fn ($value) => $value !== '');

                    if (!$hasValue) {
                        continue;
                    }

                    $leadValue = array_shift($values);

                    if ($leadValue === '') {
                        $leadValue = $lastLeadValue;
                    } else {
                        $lastLeadValue = $leadValue;
                    }

                    $dataRows[] = $this->buildDimensionRow($leadHeader, $leadValue, $headers, $values);
                }

                if ($dataRows !== []) {
                    $blocks[] = [
                        'title' => $title,
                        'header_row' => $headerRow,
                        'rows' => $dataRows,
                    ];
                }

                $row = $headerRow + max(count($dataRows), 1);
            }

            $row++;
        }

        return $blocks;
    }

    private function buildDimensionRow(string $leadHeader, string $leadValue, array $headers, array $values): array
    {
        $normalizedHeaders = array_map(fn ($header) => $this->normalizeTechnicalTitle($header), $headers);
        $payload = [
            'formation' => $leadValue,
            'values' => [
                'lead_header' => $this->normalizeTechnicalTitle($leadHeader),
                'headers' => $normalizedHeaders,
                'raw' => array_slice(array_pad($values, count($normalizedHeaders), ''), 0, count($normalizedHeaders)),
            ],
        ];

        foreach ($normalizedHeaders as $index => $header) {
            $value = $values[$index] ?? '';
            $normalized = Str::lower($header);

            if (($payload['code'] ?? null) === null && (str_contains($normalized, 'código') || str_contains($normalized, 'codigo'))) {
                $payload['code'] = $this->nullableText($value);
            }

            if (($payload['diameter'] ?? null) === null && (str_contains($normalized, 'ø') || str_contains($normalized, 'diam'))) {
                $payload['diameter'] = $this->decimalOrNull($value);
            }

            if (($payload['weight'] ?? null) === null && str_contains($normalized, 'peso')) {
                $payload['weight'] = $this->decimalOrNull($value);
            }
        }

        return $payload;
    }

    private function findDimensionStartRow(Worksheet $sheet): ?int
    {
        for ($row = 20; $row <= $sheet->getHighestRow(); $row++) {
            if (str_contains(Str::lower($this->cellText($sheet, 1, $row)), 'información dimensional')) {
                return $row + 1;
            }
        }

        return null;
    }

    private function looksLikeDimensionHeaderRow(Worksheet $sheet, int $row): bool
    {
        if ($row > $sheet->getHighestRow()) {
            return false;
        }

        $headers = collect($this->rowTexts($sheet, $row))
            ->filter(fn ($value) => $value !== '')
            ->values();

        if ($headers->count() < 4) {
            return false;
        }

        $first = Str::lower($headers->first() ?? '');

        return str_contains($first, 'awg') || str_contains($first, 'nro.');
    }

    private function rowTexts(Worksheet $sheet, int $row, ?int $limit = null): array
    {
        $values = [];
        $highestColumn = $limit ?? Coordinate::columnIndexFromString($sheet->getHighestColumn());

        for ($column = 1; $column <= $highestColumn; $column++) {
            $values[] = $this->cellText($sheet, $column, $row);
        }

        while ($values !== [] && trim((string) end($values)) === '') {
            array_pop($values);
        }

        return $values;
    }

    private function coverApplications(Worksheet $sheet, int $start, int $end): string
    {
        $lines = [];

        for ($row = 24; $row <= 30; $row++) {
            $text = $this->firstNonEmptyInRange($sheet, $start, $end, $row);

            if ($text === '') {
                continue;
            }

            if ($row >= 30 && str_contains($text, ':')) {
                break;
            }

            $lines[] = $text;
        }

        return implode(' ', $lines);
    }

    private function coverConstruction(Worksheet $sheet, int $start, int $end): array
    {
        $items = [];

        for ($row = 30; $row <= 45; $row++) {
            $text = $this->firstNonEmptyInRange($sheet, $start, $end, $row);

            if ($text === '') {
                continue;
            }

            if (!str_contains($text, ':')) {
                if ($items !== []) {
                    $lastIndex = array_key_last($items);
                    $current = $items[$lastIndex]['content']['es'] ?? '';
                    $items[$lastIndex]['content']['es'] = trim($current . ' ' . $text);
                    $items[$lastIndex]['content']['en'] = trim($current . ' ' . $text);
                }

                continue;
            }

            [$title, $content] = $this->splitLabel($text);

            $items[] = [
                'title' => ['es' => $title, 'en' => $title],
                'content' => ['es' => $content, 'en' => $content],
            ];
        }

        return $items;
    }

    private function coverExtras(Worksheet $sheet, int $start, int $end): string
    {
        $lines = [];

        for ($row = 50; $row <= 55; $row++) {
            $text = $this->firstNonEmptyInRange($sheet, $start, $end, $row);

            if ($text !== '') {
                $lines[] = $this->cleanComment($text);
            }
        }

        return implode(' ', $lines);
    }

    private function firstNonEmptyInRange(Worksheet $sheet, int $start, int $end, int $row): string
    {
        for ($column = $start; $column <= $end; $column++) {
            $text = $this->cellText($sheet, $column, $row);

            if ($text !== '') {
                return $text;
            }
        }

        return '';
    }

    private function extractProductImage(Worksheet $sheet, string $sheetName, array $bounds): ?string
    {
        foreach ($sheet->getDrawingCollection() as $drawing) {
            $coordinate = $drawing->getCoordinates();
            [$columnLetters, $row] = Coordinate::coordinateFromString($coordinate);
            $column = Coordinate::columnIndexFromString($columnLetters);

            if ($column < $bounds['start'] || $column > $bounds['end'] || $row < 8 || $row > 18) {
                continue;
            }

            if (method_exists($drawing, 'getWidth') && $drawing->getWidth() < 430) {
                continue;
            }

            return $this->storeDrawing($drawing, $this->safeSlug($sheetName));
        }

        return null;
    }

    private function storeDrawing(Drawing|MemoryDrawing $drawing, string $slug): ?string
    {
        $path = 'products/main/' . $slug . '.png';

        if ($drawing instanceof MemoryDrawing) {
            ob_start();
            imagepng($drawing->getImageResource());
            $contents = ob_get_clean();
        } else {
            $contents = @file_get_contents($drawing->getPath());
        }

        if (!$contents) {
            return null;
        }

        Storage::disk('public')->put($path, $contents);

        return $path;
    }

    private function fallbackTitle(string $sheetName): string
    {
        return match ($this->normalizeSheetName($sheetName)) {
            '300v arm' => 'FAMILIA FECORON. INSTRUMENTACIÓN ARMADO. GAMA FRE',
            'ls0h' => 'FAMILIA FECORON. INSTRUMENTACIÓN. LIBRE DE HALOGENOS. GAMA FH',
            'ls0h arm' => 'FAMILIA FECORON. INSTRUMENTACIÓN ARMADO. LIBRE DE HALOGENOS. GAMA FHE',
            'res fuego' => 'FAMILIA FECORON. INSTRUMENTACIÓN. RESISTENTE AL FUEGO. GAMA FZ',
            'res fue arm' => 'FAMILIA FECORON. INSTRUMENTACIÓN ARMADO. RESISTENTE AL FUEGO. GAMA FZE',
            '600v' => 'FAMILIA FECORON. INSTRUMENTACIÓN 600V TRAY CABLE. GAMA FN',
            '600v arm' => 'FAMILIA FECORON. INSTRUMENTACIÓN 600V TRAY CABLE ARMADO. GAMA FNE',
            default => 'FAMILIA FECORON. INSTRUMENTACIÓN SIMPLE. GAMA FR',
        };
    }

    private function normalizeHeaderLabel(string $header, string $unit = ''): string
    {
        $header = trim($header);
        $unit = trim($unit);

        if ($header === '') {
            return $unit;
        }

        if ($unit === '') {
            return $header;
        }

        return $header . ' (' . $unit . ')';
    }

    private function safeSlug(string $value): string
    {
        $normalized = trim($value);

        if ($normalized === '') {
            return 'producto-importado';
        }

        $normalized = strtr($normalized, [
            'Á' => 'A', 'À' => 'A', 'Ä' => 'A', 'Â' => 'A',
            'á' => 'a', 'à' => 'a', 'ä' => 'a', 'â' => 'a',
            'É' => 'E', 'È' => 'E', 'Ë' => 'E', 'Ê' => 'E',
            'é' => 'e', 'è' => 'e', 'ë' => 'e', 'ê' => 'e',
            'Í' => 'I', 'Ì' => 'I', 'Ï' => 'I', 'Î' => 'I',
            'í' => 'i', 'ì' => 'i', 'ï' => 'i', 'î' => 'i',
            'Ó' => 'O', 'Ò' => 'O', 'Ö' => 'O', 'Ô' => 'O',
            'ó' => 'o', 'ò' => 'o', 'ö' => 'o', 'ô' => 'o',
            'Ú' => 'U', 'Ù' => 'U', 'Ü' => 'U', 'Û' => 'U',
            'ú' => 'u', 'ù' => 'u', 'ü' => 'u', 'û' => 'u',
            'Ñ' => 'N', 'ñ' => 'n',
        ]);

        $ascii = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $normalized);
        $ascii = is_string($ascii) && $ascii !== '' ? $ascii : $normalized;
        $ascii = strtolower($ascii);
        $ascii = preg_replace('/[^a-z0-9]+/i', '-', $ascii) ?? '';
        $ascii = trim($ascii, '-');

        return $ascii !== '' ? $ascii : 'producto-importado';
    }

    private function normalizeSheetName(string $value): string
    {
        return Str::of($value)
            ->lower()
            ->replaceMatches('/\s+/', ' ')
            ->trim()
            ->value();
    }

    private function cellText(Worksheet $sheet, int $column, int $row): string
    {
        $coordinate = Coordinate::stringFromColumnIndex($column) . $row;
        $cell = $sheet->getCell($coordinate);
        $value = $cell->getCalculatedValue();

        foreach ([$value, $cell->getFormattedValue(), $cell->getValue()] as $candidate) {
            $text = trim((string) Str::of((string) ($candidate ?? ''))->replaceMatches('/\s+/', ' '));

            if (Str::startsWith($text, '=')) {
                continue;
            }

            if ($text !== '') {
                return $text;
            }
        }

        return '';
    }

    private function splitLabel(string $text): array
    {
        $clean = $this->cleanComment($text);

        if (!Str::contains($clean, ':')) {
            return [$clean, $clean];
        }

        [$title, $content] = explode(':', $clean, 2);

        return [trim($title), trim($content)];
    }

    private function normalizeTechnicalTitle(string $value): string
    {
        $title = trim((string) Str::of($value)->replaceMatches('/\s+/', ' '));

        if ($title === '') {
            return $title;
        }

        $title = str_replace(['//', '≥ 50%', '? AL 50%', '? 50%'], [' / ', '≥ AL 50%', '≥ AL 50%', '≥ AL 50%'], $title);
        $title = preg_replace('/[?¿�]\s*(?:AL\s*)?50%/iu', '≥ AL 50%', $title) ?? $title;
        $title = preg_replace('/\s*\+\s*/u', ' + ', $title) ?? $title;
        $title = preg_replace('/≥\s*(?:AL\s*)?50%/iu', '≥ AL 50%', $title) ?? $title;
        $title = preg_replace('/\s+/u', ' ', $title) ?? $title;

        return trim($title);
    }

    private function cleanComment(string $text): string
    {
        return trim((string) Str::of($text)
            ->replaceMatches('/\s*\/\/\s*/u', ' / ')
            ->replaceMatches('/\s+/', ' '));
    }

    private function nullableText(string $value): ?string
    {
        $value = trim($value);

        return $value === '' || Str::upper($value) === 'NO VA' ? null : $value;
    }

    private function decimalOrNull(string $value): ?float
    {
        $value = str_replace(',', '.', trim($value));

        if ($value === '' || Str::upper($value) === 'NO VA' || !is_numeric($value)) {
            return null;
        }

        return round((float) $value, 3);
    }
}
