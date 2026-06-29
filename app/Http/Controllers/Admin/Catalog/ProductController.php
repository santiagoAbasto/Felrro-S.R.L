<?php

namespace App\Http\Controllers\Admin\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Services\AflamexPotenciaPdfService;
use App\Services\PdfColorTableService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Validation\Rule;



class ProductController extends Controller
{
    /* =======================================================
       INDEX (ORDEN EMPRESARIAL REAL)
    ======================================================= */
    public function index()
    {
        return Inertia::render('Admin/Catalog/Products/Index', [
            'products' => Product::with('category')
                ->orderByRaw('featured DESC')
                ->orderBy('featured_order')
                ->get(),

            'stats' => [
                'total' => Product::count(),
                'featured' => Product::where('featured', true)->count(),
                'active' => Product::where('is_active', true)->count(),
            ]
        ]);
    }

    /* =======================================================
       CREATE
    ======================================================= */
    public function create()
    {
        return Inertia::render('Admin/Catalog/Products/Create', [
            'categories' => ProductCategory::where('is_active', true)
                ->orderBy('order')
                ->get()
        ]);
    }

    /* =======================================================
   STORE - ENTERPRISE SAFE SLUG VERSION
======================================================= */
    public function store(Request $request, PdfColorTableService $colorTableService)
    {
        $validated = $this->validateProduct($request);

        DB::transaction(function () use ($request, &$validated, $colorTableService) {

            $validated['featured']  = $request->boolean('featured');
            $validated['is_active'] = $request->boolean('is_active');

            /*
        |--------------------------------------------------------------------------
        | GENERACIÓN DE SLUG ÚNICO (SOFT DELETE SAFE)
        |--------------------------------------------------------------------------
        */

            $validated['slug'] = $this->generateUniqueSlug(
                $validated['name']['es']
            );

            /*
        |--------------------------------------------------------------------------
        | IMAGEN PRINCIPAL
        |--------------------------------------------------------------------------
        */

            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $validated['image'] = $request->file('image')
                    ->store('products/main', 'public');
            }

            /*
        |--------------------------------------------------------------------------
        | FICHA TÉCNICA
        |--------------------------------------------------------------------------
        */

            if ($request->hasFile('ficha_tecnica_file') && $request->file('ficha_tecnica_file')->isValid()) {

                $file = $request->file('ficha_tecnica_file');

                $validated['ficha_tecnica_file']   = $file->store('products/fichas', 'public');
                $validated['ficha_tecnica_weight'] = $file->getSize();
                $validated['ficha_tecnica_format'] = $file->getClientOriginalExtension();
            }

            if (!$validated['featured']) {
                $validated['featured_order'] = null;
            }

            unset($validated['pdf_color_table'], $validated['remove_pdf_color_table']);

            $product = Product::create($validated);

            if ($request->hasFile('pdf_color_table') && $request->file('pdf_color_table')->isValid()) {
                $colorTableService->store($product, $request->file('pdf_color_table'));
            }

            /*
        |--------------------------------------------------------------------------
        | GALERÍA
        |--------------------------------------------------------------------------
        */

            if ($request->hasFile('gallery')) {

                foreach ($request->file('gallery') as $index => $file) {

                    if ($file->isValid()) {

                        $product->images()->create([
                            'image' => $file->store('products/gallery', 'public'),
                            'order' => $index + 1
                        ]);
                    }
                }
            }

            /*
        |--------------------------------------------------------------------------
        | SPECIFICATIONS
        |--------------------------------------------------------------------------
        */

            foreach ($request->specifications ?? [] as $index => $spec) {

                $product->specifications()->create([
                    'title'   => $spec['title'],
                    'content' => $spec['content'],
                    'order'   => $index + 1
                ]);
            }

            $this->syncApplications($product, $request);
        });

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Producto creado correctamente.');
    }

    /* =======================================================
   EDIT
======================================================= */
    public function edit(Product $product)
    {
        $product->load([
            'category',
            'images',
            'specifications',
            'applications',
            'technicalSections.rows',
        ]);

        return Inertia::render('Admin/Catalog/Products/Edit', [
            'product' => [
                ...$product->toArray(),

                'ficha_tecnica_url' => $product->ficha_tecnica_file
                    ? asset('storage/' . $product->ficha_tecnica_file)
                    : null,

                'constructions' => $product->applications
                    ->where('type', 'construction')
                    ->values(),

                'applications' => $product->applications
                    ->where('type', 'application')
                    ->values(),

                'extras' => $product->applications
                    ->where('type', 'extra')
                    ->values(),

                'technical_sections' => $this->serializeTechnicalSections($product),
            ],

            'categories' => ProductCategory::where('is_active', true)
                ->orderBy('order')
                ->get(),
        ]);
    }

    /* =======================================================
   UPDATE
======================================================= */
    public function update(Request $request, Product $product, AflamexPotenciaPdfService $pdfService, PdfColorTableService $colorTableService)
    {
        $validated = $this->validateProduct($request, $product);
        $uploadedManualFicha = false;

        DB::transaction(function () use ($request, $product, &$validated, &$uploadedManualFicha, $colorTableService) {

            $validated['featured']  = $request->boolean('featured');
            $validated['is_active'] = $request->boolean('is_active');

            /*
        |--------------------------------------------------------------------------
        | IMAGEN PRINCIPAL (ULTRA PROTEGIDA)
        |--------------------------------------------------------------------------
        */
            if ($request->hasFile('image') && $request->file('image')->isValid()) {

                $newImage = $request->file('image')->store('products/main', 'public');

                // Solo borrar si se guardó correctamente la nueva
                if ($newImage) {

                    if ($product->image && Storage::disk('public')->exists($product->image)) {
                        Storage::disk('public')->delete($product->image);
                    }

                    if ($product->pdf_graphic && Storage::disk('public')->exists($product->pdf_graphic)) {
                        Storage::disk('public')->delete($product->pdf_graphic);
                    }

                    $validated['image'] = $newImage;
                    $validated['pdf_graphic'] = null;
                }
            } elseif ($request->boolean('remove_image')) {
                if ($product->image && Storage::disk('public')->exists($product->image)) {
                    Storage::disk('public')->delete($product->image);
                }

                if ($product->pdf_graphic && Storage::disk('public')->exists($product->pdf_graphic)) {
                    Storage::disk('public')->delete($product->pdf_graphic);
                }

                $validated['image'] = null;
                $validated['pdf_graphic'] = null;
            } else {
                // ⚠️ CRÍTICO: preservar imagen actual
                unset($validated['image']);
            }

            /*
        |--------------------------------------------------------------------------
        | FICHA TÉCNICA
        |--------------------------------------------------------------------------
        */
            if ($request->hasFile('ficha_tecnica_file') && $request->file('ficha_tecnica_file')->isValid()) {

                $newFile = $request->file('ficha_tecnica_file')
                    ->store('products/fichas', 'public');

                if ($newFile) {

                    if (
                        $product->ficha_tecnica_file &&
                        Storage::disk('public')->exists($product->ficha_tecnica_file)
                    ) {

                        Storage::disk('public')->delete($product->ficha_tecnica_file);
                    }

                    $validated['ficha_tecnica_file']   = $newFile;
                    $validated['ficha_tecnica_weight'] = $request->file('ficha_tecnica_file')->getSize();
                    $validated['ficha_tecnica_format'] = $request->file('ficha_tecnica_file')->getClientOriginalExtension();
                    $uploadedManualFicha = true;
                }
            } else {
                unset($validated['ficha_tecnica_file']);
            }

            if (!$validated['featured']) {
                $validated['featured_order'] = null;
            }

            unset($validated['pdf_color_table'], $validated['remove_pdf_color_table']);

            $product->update($validated);

            if ($request->boolean('remove_pdf_color_table') && $product->pdf_color_table) {
                Storage::disk('public')->delete($product->pdf_color_table);
                $product->update(['pdf_color_table' => null]);
            }

            if ($request->hasFile('pdf_color_table') && $request->file('pdf_color_table')->isValid()) {
                $colorTableService->store($product, $request->file('pdf_color_table'));
            }

            /*
        |--------------------------------------------------------------------------
        | GALERÍA (SOLO SI SUBEN NUEVAS)
        |--------------------------------------------------------------------------
        */
            if ($request->hasFile('gallery')) {

                // Borrar imágenes físicas anteriores
                foreach ($product->images as $image) {
                    if ($image->image && Storage::disk('public')->exists($image->image)) {
                        Storage::disk('public')->delete($image->image);
                    }
                }

                $product->images()->delete();

                foreach ($request->file('gallery') as $index => $file) {

                    if ($file->isValid()) {

                        $product->images()->create([
                            'image' => $file->store('products/gallery', 'public'),
                            'order' => $index + 1
                        ]);
                    }
                }
            }

            if (!$request->hasFile('gallery') && $request->filled('deleted_gallery_images')) {
                $imagesToDelete = $product->images()
                    ->whereIn('id', $request->input('deleted_gallery_images', []))
                    ->get();

                foreach ($imagesToDelete as $image) {
                    if ($image->image && Storage::disk('public')->exists($image->image)) {
                        Storage::disk('public')->delete($image->image);
                    }

                    $image->delete();
                }
            }

            /*
        |--------------------------------------------------------------------------
        | SPECIFICATIONS RESET CONTROLADO
        |--------------------------------------------------------------------------
        */
            $product->specifications()->delete();

            foreach ($request->specifications ?? [] as $index => $spec) {
                $product->specifications()->create([
                    'title'   => $spec['title'],
                    'content' => $spec['content'],
                    'order'   => $index + 1
                ]);
            }

            /*
        |--------------------------------------------------------------------------
        | APPLICATIONS
        |--------------------------------------------------------------------------
        */
            $product->applications()->delete();
            $this->syncApplications($product, $request);

            if ($request->has('technical_sections')) {
                $this->syncTechnicalSections($product, $request->input('technical_sections', []));
            }
        });

        if (!$uploadedManualFicha && $product->fresh()->technicalSections()->exists()) {
            $pdfService->generate($product->fresh());
        }

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Producto actualizado correctamente.');
    }
    /* =======================================================
       APPLICATION BLOCKS
    ======================================================= */
    private function syncApplications(Product $product, Request $request): void
    {
        $blocks = [
            'constructions' => 'construction',
            'applications'  => 'application',
            'extras'        => 'extra',
        ];

        foreach ($blocks as $key => $type) {

            foreach ($request->$key ?? [] as $index => $item) {

                $product->applications()->create([
                    'type'    => $type,
                    'title'   => $item['title'] ?? null,
                    'content' => $item['content'] ?? null,
                    'order'   => $index + 1,
                ]);
            }
        }
    }

    /* =======================================================
       TOGGLE FEATURED (ORDEN MANTENIDO)
    ======================================================= */
    public function toggleFeatured(Product $product)
    {
        DB::transaction(function () use ($product) {

            if ($product->featured) {

                $product->update([
                    'featured' => false,
                    'featured_order' => null
                ]);
            } else {

                $product->update([
                    'featured' => true
                ]);
            }
        });

        return back()->with('success', 'Estado destacado actualizado.');
    }

    /* =======================================================
       DESTROY
    ======================================================= */
    public function destroy(Product $product)
    {
        try {
            DB::transaction(function () use ($product) {
                $product->loadMissing([
                    'images',
                    'technicalSections.rows',
                    'icons',
                    'sectors',
                ]);

                foreach ([
                    $product->image,
                    $product->ficha_tecnica_file,
                    $product->pdf_graphic,
                    $product->pdf_color_table,
                ] as $path) {
                    if ($path) {
                        Storage::disk('public')->delete($path);
                    }
                }

                foreach ($product->images as $image) {
                    if ($image->image) {
                        Storage::disk('public')->delete($image->image);
                    }
                }

                $product->icons()->detach();
                $product->sectors()->detach();
                $product->technicalSections()->delete();
                $product->images()->delete();
                $product->specifications()->delete();
                $product->applications()->delete();

                // Soft delete: mantiene integridad del historial comercial
                // y deja el catálogo limpio para el admin.
                $product->delete();
            });
        } catch (\Throwable $exception) {
            report($exception);

            return back()->with('error', 'No se pudo eliminar el producto. Intentá nuevamente.');
        }

        return back()->with('success', 'Producto eliminado correctamente.');
    }

    private function validateProduct(Request $request, ?Product $product = null): array
    {
        return $request->validate([
            'category_id' => 'required|exists:product_categories,id',

            'name.es' => 'required|string|max:255',
            'name.en' => 'required|string|max:255',

            'short_description.es' => 'nullable|string|max:500',
            'short_description.en' => 'nullable|string|max:500',

            'description.es' => 'nullable|string',
            'description.en' => 'nullable|string',

            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'remove_image' => 'nullable|boolean',

            'gallery'   => 'nullable|array',
            'gallery.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'deleted_gallery_images' => 'nullable|array',
            'deleted_gallery_images.*' => [
                'integer',
                Rule::exists('product_images', 'id')->where(fn ($query) => $product
                    ? $query->where('product_id', $product->id)
                    : $query),
            ],

            'ficha_tecnica_file' => 'nullable|file|mimes:pdf|max:5120',
            'pdf_color_table' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:10240',
            'remove_pdf_color_table' => 'nullable|boolean',

            'featured' => 'nullable|boolean',
            'featured_order' => 'nullable|string|max:10',
            'is_active' => 'nullable|boolean',
        ]);
    }

    private function serializeTechnicalSections(Product $product)
    {
        return $product->technicalSections
            ->sortBy('order')
            ->values()
            ->map(function ($section) {
                $firstRow = $section->rows->first();

                return [
                    'id' => $section->id,
                    'type' => $section->type,
                    'title' => $section->title ?? ['es' => '', 'en' => ''],
                    'headers' => $section->type === 'electrical'
                        ? []
                        : collect($firstRow?->values['headers'] ?? [])
                            ->map(fn ($header) => (string) $header)
                            ->values()
                            ->all(),
                    'rows' => $section->rows
                        ->sortBy('order')
                        ->values()
                        ->map(function ($row) use ($section) {
                            return [
                                'id' => $row->id,
                                'nominal_section' => $row->nominal_section,
                                'formation' => $row->formation,
                                'values' => $section->type === 'electrical'
                                    ? collect([
                                        'resistencia_20_cc',
                                        'resistencia_70_ca',
                                        'reactancia_c1',
                                        'reactancia_c2',
                                        'aire_bipolar',
                                        'aire_multipolar',
                                        'tierra_bipolar',
                                        'tierra_multipolar',
                                    ])->mapWithKeys(fn ($key) => [$key => (string) ($row->values[$key]['value'] ?? '')])->all()
                                    : collect($row->values['raw'] ?? [])
                                        ->map(fn ($value) => (string) $value)
                                        ->values()
                                        ->all(),
                            ];
                        })
                        ->all(),
                ];
            });
    }

    private function syncTechnicalSections(Product $product, array $sections): void
    {
        $existingIds = $product->technicalSections()->pluck('id')->all();
        $keptIds = [];

        foreach ($sections as $sectionIndex => $sectionData) {
            $sectionId = isset($sectionData['id']) ? (int) $sectionData['id'] : null;
            $section = $sectionId
                ? $product->technicalSections()->whereKey($sectionId)->first()
                : null;

            if (!$section) {
                $section = $product->technicalSections()->make([
                    'product_import_batch_id' => null,
                    'sheet_name' => null,
                    'source_row' => null,
                ]);
            }

            $section->fill([
                'type' => $sectionData['type'] ?? 'dimensions',
                'title' => $sectionData['title'] ?? ['es' => '', 'en' => ''],
                'order' => $sectionIndex + 1,
            ]);
            $section->save();
            $keptIds[] = $section->id;

            $headers = collect($sectionData['headers'] ?? [])
                ->map(fn ($header) => trim((string) $header))
                ->filter(fn ($header) => $header !== '')
                ->values()
                ->all();

            $section->rows()->delete();

            foreach (($sectionData['rows'] ?? []) as $rowIndex => $rowData) {
                if (($sectionData['type'] ?? 'dimensions') === 'electrical') {
                    $values = collect([
                        'resistencia_20_cc',
                        'resistencia_70_ca',
                        'reactancia_c1',
                        'reactancia_c2',
                        'aire_bipolar',
                        'aire_multipolar',
                        'tierra_bipolar',
                        'tierra_multipolar',
                    ])->mapWithKeys(function ($key) use ($rowData) {
                        return [$key => ['value' => trim((string) ($rowData['values'][$key] ?? ''))]];
                    })->all();

                    $section->rows()->create([
                        'nominal_section' => trim((string) ($rowData['nominal_section'] ?? '')),
                        'formation' => null,
                        'values' => $values,
                        'order' => $rowIndex + 1,
                    ]);

                    continue;
                }

                $rawValues = collect($rowData['values'] ?? [])
                    ->take(count($headers))
                    ->pad(count($headers), '')
                    ->map(fn ($value) => trim((string) $value))
                    ->values()
                    ->all();

                $technicalMeta = $this->extractTechnicalRowMetaFromHeaders($headers, $rawValues);

                $section->rows()->create([
                    'formation' => trim((string) ($rowData['formation'] ?? '')),
                    'code' => $technicalMeta['code'],
                    'code_pe' => $technicalMeta['code_pe'],
                    'code_neutral' => $technicalMeta['code_neutral'],
                    'diameter' => $technicalMeta['diameter'],
                    'weight' => $technicalMeta['weight'],
                    'values' => [
                        'headers' => $headers,
                        'raw' => $rawValues,
                    ],
                    'order' => $rowIndex + 1,
                ]);
            }
        }

        $idsToDelete = array_diff($existingIds, $keptIds);

        if ($idsToDelete) {
            $product->technicalSections()->whereIn('id', $idsToDelete)->delete();
        }
    }

    private function extractTechnicalRowMetaFromHeaders(array $headers, array $rawValues): array
    {
        $meta = [
            'code' => null,
            'code_pe' => null,
            'code_neutral' => null,
            'diameter' => null,
            'weight' => null,
        ];

        foreach ($headers as $index => $header) {
            $normalizedHeader = Str::lower(trim((string) $header));
            $value = trim((string) ($rawValues[$index] ?? ''));

            if ($value === '') {
                continue;
            }

            if (str_contains($normalizedHeader, 'código') || str_contains($normalizedHeader, 'codigo')) {
                if (str_contains($normalizedHeader, 'neut')) {
                    $meta['code_neutral'] = $value;
                } elseif (str_contains($normalizedHeader, 'pe') || str_contains($normalizedHeader, 'tierra')) {
                    $meta['code_pe'] = $value;
                } else {
                    $meta['code'] = $value;
                }

                continue;
            }

            if (str_contains($normalizedHeader, 'ø') || str_contains($normalizedHeader, 'diam')) {
                $meta['diameter'] = $value;
                continue;
            }

            if (str_contains($normalizedHeader, 'peso')) {
                $meta['weight'] = $value;
            }
        }

        return $meta;
    }

    /* =======================================================
   GENERADOR DE SLUG ÚNICO ENTERPRISE
======================================================= */
    private function generateUniqueSlug(string $name): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (
            Product::withTrashed()
            ->where('slug', $slug)
            ->exists()
        ) {
            $slug = $baseSlug . '-' . $counter++;
        }

        return $slug;
    }

    public function featured()
    {
        return Inertia::render('Admin/Catalog/Products/Index', [
            'products' => Product::with('category')
                ->where('featured', true)
                ->orderBy('featured_order')
                ->get(),

            'stats' => [
                'total' => Product::where('featured', true)->count(),
                'featured' => Product::where('featured', true)->count(),
                'active' => Product::where('featured', true)->where('is_active', true)->count(),
            ]
        ]);
    }
}
