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

class AflamexPotenciaImportService
{
    private const GROUPS = [
        'PVC' => ['start' => 1, 'end' => 10],
        'PVC ARM SWA' => ['start' => 12, 'end' => 21],
        'PVC ARM FLEJE' => ['start' => 23, 'end' => 32],
        'PVC MALLA Cu' => ['start' => 34, 'end' => 43],
        'PVC CINTA Cu' => ['start' => 45, 'end' => 54],
        'PVC VDF' => ['start' => 56, 'end' => 65],
    ];

    public function __construct(
        private AflamexPotenciaPdfService $pdfService,
        private PdfColorTableService $colorTableService,
    )
    {
    }

    public function import(ProductCategory $category, UploadedFile $technicalFile, ?UploadedFile $coverFile, array $iconSettings = [], ?UploadedFile $colorTableFile = null): array
    {
        return DB::transaction(function () use ($category, $technicalFile, $coverFile, $iconSettings, $colorTableFile) {
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

            foreach (array_keys(self::GROUPS) as $sheetName) {
                $sheet = $technicalBook->getSheetByName($sheetName);

                if (!$sheet) {
                    $warnings[] = "No se encontró la hoja {$sheetName}.";
                    continue;
                }

                $cover = $coverData[$sheetName] ?? [];
                $product = $this->upsertProduct($category, $sheetName, $cover);

                if (!empty($cover['image_path'])) {
                    $product->update(['image' => $cover['image_path']]);
                }

                if ($colorTableFile) {
                    $this->syncPdfColorTable($product, $colorTableFile);
                }

                $this->syncProductBlocks($product, $cover);
                $this->syncProductIcons($product, $iconSettings);
                $technicalStats = $this->syncTechnicalData($product, $sheet, $batch);

                if (! $technicalStats['complete']) {
                    $warnings[] = "{$sheetName}: se importaron {$technicalStats['rows']} filas técnicas de {$technicalStats['expected_rows']} detectadas en la solapa.";
                }

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

        foreach (self::GROUPS as $sheetName => $bounds) {
            $col = $bounds['start'];
            $title = $this->cellText($sheet, $col, 6);

            $data[$sheetName] = [
                'title' => $title ?: $this->fallbackTitle($sheetName),
                'code_note' => $this->cleanComment($this->cellText($sheet, $col + 3, 21)),
                'short_description' => $this->joinRows($sheet, $col, [25]),
                'description' => $this->joinRows($sheet, $col, [27, 28, 29]),
                'applications' => [
                    [
                        'title' => ['es' => 'Aplicaciones', 'en' => 'Applications'],
                        'content' => [
                            'es' => $this->joinRows($sheet, $col, [25, 27, 28, 29]),
                            'en' => $this->joinRows($sheet, $col, [25, 27, 28, 29]),
                        ],
                    ],
                ],
                'construction' => $this->coverConstruction($sheet, $col),
                'extras' => $this->coverExtras($sheet, $col),
                'image_path' => $this->extractProductImage($sheet, $sheetName, $bounds),
            ];
        }

        return $data;
    }

    private function upsertProduct(ProductCategory $category, string $sheetName, array $cover): Product
    {
        $name = $cover['title'] ?? $this->fallbackTitle($sheetName);
        $slug = Str::slug($name);

        $product = Product::withTrashed()->where('slug', $slug)->first();

        if ($product?->trashed()) {
            $product->restore();
        }

        $payload = [
            'category_id' => $category->id,
            'name' => ['es' => $name, 'en' => $name],
            'short_description' => [
                'es' => $cover['short_description'] ?? 'Cable de potencia familia AFLAMEX.',
                'en' => $cover['short_description'] ?? 'AFLAMEX power cable.',
            ],
            'description' => [
                'es' => $cover['description'] ?? 'Cable de energía y distribución de potencia resistente a la propagación de incendios.',
                'en' => $cover['description'] ?? 'Power distribution cable resistant to fire propagation.',
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

    private function syncProductIcons(Product $product, array $iconSettings): void
    {
        $sync = [];
        $selected = collect($iconSettings)
            ->map(function ($item) {
                if (is_array($item)) {
                    $group = strtolower(trim((string) ($item['pdf_group'] ?? 'main')));

                    return [
                        'id' => (int) ($item['id'] ?? 0),
                        'pdf_group' => in_array($group, ['main', 'optional', 'footer'], true) ? $group : 'main',
                        'order' => max(1, min(10, (int) ($item['order'] ?? 1))),
                    ];
                }

                return [
                    'id' => (int) $item,
                    'pdf_group' => 'main',
                    'order' => 1,
                ];
            })
            ->filter(fn ($item) => $item['id'] > 0)
            ->unique('id')
            ->groupBy('pdf_group')
            ->flatMap(fn ($items) => $items->sortBy('order')->take(10))
            ->values();

        $icons = \App\Models\ProductIcon::query()
            ->whereIn('id', $selected->pluck('id')->all())
            ->get()
            ->keyBy('id');

        foreach ($selected as $index => $item) {
            $icon = $icons->get($item['id']);

            $sync[$item['id']] = [
                'order' => $item['order'],
                'show_in_pdf' => true,
                'pdf_group' => $icon?->placement === 'footer' ? 'footer' : $item['pdf_group'],
            ];
        }

        $product->icons()->sync($sync);
    }

    private function syncPdfColorTable(Product $product, UploadedFile $file): void
    {
        $this->colorTableService->store($product, $file);
    }

    private function syncTechnicalData(Product $product, Worksheet $sheet, ProductImportBatch $batch): array
    {
        $expected = $this->expectedTechnicalStats($sheet);
        $product->technicalSections()->delete();

        $sections = 0;
        $rows = 0;

        $electrical = $product->technicalSections()->create([
            'product_import_batch_id' => $batch->id,
            'type' => 'electrical',
            'title' => ['es' => 'Características eléctricas', 'en' => 'Electrical characteristics'],
            'sheet_name' => $sheet->getTitle(),
            'source_row' => 4,
            'order' => 1,
        ]);

        $sections++;
        $rows += $this->createElectricalRows($electrical, $sheet);

        foreach ($this->dimensionHeaderRows($sheet) as $sectionIndex => $headerRow) {
            $title = $this->dimensionTitle($sheet, $headerRow);
            $section = $product->technicalSections()->create([
                'product_import_batch_id' => $batch->id,
                'type' => 'dimensions',
                'title' => ['es' => $title, 'en' => $title],
                'sheet_name' => $sheet->getTitle(),
                'source_row' => $headerRow,
                'order' => $sectionIndex + 2,
            ]);

            $createdRows = $this->createDimensionRows($section, $sheet, $headerRow);

            if ($createdRows === 0) {
                $section->delete();
                continue;
            }

            $sections++;
            $rows += $createdRows;
        }

        return [
            'sections' => $sections,
            'rows' => $rows,
            'expected_sections' => $expected['sections'],
            'expected_rows' => $expected['rows'],
            'empty_sections' => $expected['empty_sections'],
            'complete' => $sections === $expected['sections'] && $rows === $expected['rows'],
        ];
    }

    private function expectedTechnicalStats(Worksheet $sheet): array
    {
        $sections = 1;
        $rows = $this->countElectricalRows($sheet);
        $emptySections = [];

        foreach ($this->dimensionHeaderRows($sheet) as $headerRow) {
            $title = $this->dimensionTitle($sheet, $headerRow);
            $dimensionRows = $this->countDimensionRows($sheet, $headerRow);

            if ($dimensionRows === 0) {
                $emptySections[] = $title;
                continue;
            }

            $sections++;
            $rows += $dimensionRows;
        }

        return [
            'sections' => $sections,
            'rows' => $rows,
            'empty_sections' => $emptySections,
        ];
    }

    private function createElectricalRows(ProductTechnicalSection $section, Worksheet $sheet): int
    {
        $headers = [
            'resistencia_20_cc' => 'Resistencia eléctrica a 20°C C.C. (Ohm/km)',
            'resistencia_70_ca' => 'Resistencia eléctrica a 70°C C.A. (Ohm/km)',
            'reactancia_c1' => 'Reactancia inductiva 50Hz c1 (Ohm/km)',
            'reactancia_c2' => 'Reactancia inductiva 50Hz c2 (Ohm/km)',
            'aire_bipolar' => 'Intensidad admisible aire bipolar (A)',
            'aire_multipolar' => 'Intensidad admisible aire multipolar (A)',
            'tierra_bipolar' => 'Intensidad admisible tierra bipolar (A)',
            'tierra_multipolar' => 'Intensidad admisible tierra multipolar (A)',
        ];

        $created = 0;

        for ($row = 6; $row <= 22; $row++) {
            $nominal = $this->cellText($sheet, 1, $row);

            if ($nominal === '') {
                continue;
            }

            $values = [];
            $column = 2;

            foreach ($headers as $key => $label) {
                $values[$key] = [
                    'label' => $label,
                    'value' => $this->cellText($sheet, $column, $row),
                ];
                $column++;
            }

            $section->rows()->create([
                'nominal_section' => $nominal,
                'values' => $values,
                'order' => ++$created,
            ]);
        }

        return $created;
    }

    private function countElectricalRows(Worksheet $sheet): int
    {
        $count = 0;

        for ($row = 6; $row <= 22; $row++) {
            if ($this->cellText($sheet, 1, $row) !== '') {
                $count++;
            }
        }

        return $count;
    }

    private function createDimensionRows(ProductTechnicalSection $section, Worksheet $sheet, int $headerRow): int
    {
        $headers = [
            'b' => Str::lower($this->cellText($sheet, 2, $headerRow)),
            'c' => Str::lower($this->cellText($sheet, 3, $headerRow)),
            'd' => Str::lower($this->cellText($sheet, 4, $headerRow)),
            'e' => Str::lower($this->cellText($sheet, 5, $headerRow)),
        ];

        $created = 0;

        for ($row = $headerRow + 1; $row <= $sheet->getHighestRow(); $row++) {
            $formation = $this->cellText($sheet, 1, $row);

            if ($formation === '') {
                break;
            }

            if (Str::startsWith(Str::lower($formation), 'q conductores')) {
                continue;
            }

            $b = $this->cellText($sheet, 2, $row);
            $c = $this->cellText($sheet, 3, $row);
            $d = $this->cellText($sheet, 4, $row);
            $e = $this->cellText($sheet, 5, $row);

            if ($b === '' && $c === '' && $d === '' && $e === '') {
                continue;
            }

            $payload = [
                'formation' => $formation,
                'values' => [
                    'headers' => $headers,
                    'raw' => [$b, $c, $d, $e],
                ],
                'order' => ++$created,
            ];

            if (Str::contains($headers['b'], 'código') || Str::contains($headers['b'], 'codigo')) {
                $payload['code'] = $this->nullableText($b);
                $payload['diameter'] = $this->decimalOrNull($c);
                $payload['weight'] = $this->decimalOrNull($d);
            } else {
                $payload['code_pe'] = $this->nullableText($b);
                $payload['code_neutral'] = $this->nullableText($c);
                $payload['diameter'] = $this->decimalOrNull($d);
                $payload['weight'] = $this->decimalOrNull($e);
            }

            $section->rows()->create($payload);
        }

        return $created;
    }

    private function countDimensionRows(Worksheet $sheet, int $headerRow): int
    {
        $count = 0;

        for ($row = $headerRow + 1; $row <= $sheet->getHighestRow(); $row++) {
            $formation = $this->cellText($sheet, 1, $row);

            if ($formation === '') {
                break;
            }

            if (Str::startsWith(Str::lower($formation), 'q conductores')) {
                continue;
            }

            $hasValues = false;

            foreach ([2, 3, 4, 5] as $column) {
                if ($this->cellText($sheet, $column, $row) !== '') {
                    $hasValues = true;
                    break;
                }
            }

            if ($hasValues) {
                $count++;
            }
        }

        return $count;
    }

    private function dimensionHeaderRows(Worksheet $sheet): array
    {
        $rows = [];

        for ($row = 36; $row <= $sheet->getHighestRow(); $row++) {
            $value = Str::lower($this->cellText($sheet, 1, $row));

            if (Str::startsWith($value, 'q conductores')) {
                $rows[] = $row;
            }
        }

        return $rows;
    }

    private function dimensionTitle(Worksheet $sheet, int $headerRow): string
    {
        for ($row = $headerRow - 1; $row >= max(35, $headerRow - 8); $row--) {
            $value = $this->cellText($sheet, 1, $row);
            $lower = Str::lower($value);

            if ($value === '' || Str::startsWith($lower, 'q conductores') || Str::contains($lower, 'dimensiones')) {
                continue;
            }

            if (preg_match('/^\d/', $value)) {
                continue;
            }

            return $this->normalizeTechnicalTitle($value);
        }

        return 'Formaciones especiales';
    }

    private function coverConstruction(Worksheet $sheet, int $col): array
    {
        $items = [];

        foreach ([31, 32, 33, 34, 35, 36, 37, 38, 39, 40] as $row) {
            $text = $this->cellText($sheet, $col, $row);

            if ($text === '') {
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

    private function coverExtras(Worksheet $sheet, int $col): array
    {
        $optional = $this->cleanComment($this->joinRows($sheet, $col, [50, 51, 52, 53]));
        $items = [];

        if ($optional !== '') {
            $items[] = [
                'title' => ['es' => 'Opcionales', 'en' => 'Options'],
                'content' => ['es' => $optional, 'en' => $optional],
            ];
        }

        foreach ([55, 56] as $row) {
            $text = $this->cellText($sheet, $col, $row);

            if ($text === '') {
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

    private function extractProductImage(Worksheet $sheet, string $sheetName, array $bounds): ?string
    {
        foreach ($sheet->getDrawingCollection() as $drawing) {
            $coordinate = $drawing->getCoordinates();
            [$columnLetters, $row] = Coordinate::coordinateFromString($coordinate);
            $column = Coordinate::columnIndexFromString($columnLetters);

            if ($column < $bounds['start'] || $column > $bounds['end'] || $row < 6 || $row > 22) {
                continue;
            }

            if (method_exists($drawing, 'getWidth') && $drawing->getWidth() < 500) {
                continue;
            }

            return $this->storeDrawing($drawing, Str::slug($sheetName));
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
        return match ($sheetName) {
            'PVC ARM SWA' => 'FAMILIA AFLAMEX. POTENCIA MULTIPOLAR. ARMADURA DE ALAMBRES. GAMA NDE',
            'PVC ARM FLEJE' => 'FAMILIA AFLAMEX. POTENCIA MULTIPOLAR. ARMADURA DE FLEJES. GAMA NDF',
            'PVC MALLA Cu' => 'FAMILIA AFLAMEX. POTENCIA MULTIPOLAR. BLINDAJE TRENZA. GAMA NDB',
            'PVC CINTA Cu' => 'FAMILIA AFLAMEX. POTENCIA MULTIPOLAR. BLINDAJE CINTA. GAMA NDG',
            'PVC VDF' => 'FAMILIA AFLAMEX. POTENCIA MULTIPOLAR. BLINDAJE VDF. GAMA NDY',
            default => 'FAMILIA AFLAMEX. POTENCIA MULTIPOLAR. GAMA ND',
        };
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

    private function joinRows(Worksheet $sheet, int $column, array $rows): string
    {
        return collect($rows)
            ->map(fn (int $row) => $this->cellText($sheet, $column, $row))
            ->filter()
            ->implode(' ');
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

        if (str_contains(mb_strtoupper($title), 'TETRAPOLARES + PE Y NEUTRO REDUCIDO')) {
            $title = preg_replace(
                '/TETRAPOLARES\s*\+\s*PE\s+y\s+NEUTRO\s+REDUCIDO/iu',
                'TRIPOLARES + PE O + NEUTRO REDUCIDO',
                $title
            ) ?? $title;
        }

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
