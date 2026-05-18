<?php

namespace App\Http\Controllers\Admin\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductIcon;
use App\Models\ProductImportBatch;
use App\Services\AflamexPotenciaImportService;
use App\Services\InstrumentationImportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ProductTechnicalImportController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Catalog/TechnicalImport/Index', [
            'icons' => ProductIcon::query()
                ->where('is_active', true)
                ->orderBy('order')
                ->orderBy('name->es')
                ->get(),
            'categories' => ProductCategory::query()
                ->where('is_active', true)
                ->orderBy('order')
                ->orderBy('name->es')
                ->get(),
            'batches' => ProductImportBatch::query()
                ->latest()
                ->take(8)
                ->get(),
            'products' => Product::query()
                ->with('category')
                ->withCount('technicalSections')
                ->whereHas('technicalSections')
                ->latest()
                ->take(12)
                ->get(),
        ]);
    }

    public function store(
        Request $request,
        AflamexPotenciaImportService $potenciaImportService,
        InstrumentationImportService $instrumentationImportService
    )
    {
        $validated = $request->validate([
            'category_id' => ['required', 'integer', 'exists:product_categories,id'],
            'technical_excel' => ['required', 'file', 'mimes:xlsx', 'max:10240'],
            'cover_excel' => ['nullable', 'file', 'mimes:xlsx', 'max:10240'],
            'pdf_color_table' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'icon_ids' => ['nullable', 'array'],
            'icon_ids.*' => ['integer', 'exists:product_icons,id'],
        ]);

        $category = ProductCategory::query()->findOrFail($validated['category_id']);
        $technicalPath = $request->file('technical_excel')->getRealPath();
        $reader = IOFactory::createReaderForFile($technicalPath);
        $sheetNames = $reader->listWorksheetNames($technicalPath);
        $importService = $instrumentationImportService->supports($sheetNames)
            ? $instrumentationImportService
            : $potenciaImportService;

        $result = $importService->import(
            $category,
            $request->file('technical_excel'),
            $request->file('cover_excel'),
            $validated['icon_ids'] ?? [],
            $request->file('pdf_color_table')
        );

        $count = count($result['summary']);
        $categoryName = $category->name['es'] ?? $category->name ?? 'la categoría seleccionada';

        return back()->with('success', "Importación completada: {$count} productos de {$categoryName} procesados.");
    }

    public function destroy(ProductImportBatch $batch)
    {
        $deleted = $this->cleanBatch($batch);

        return back()->with('success', "Importación limpiada: {$deleted} producto(s) removido(s) de la vista pública.");
    }

    public function destroyLatest()
    {
        $batch = ProductImportBatch::query()
            ->where('status', 'processed')
            ->latest()
            ->first();

        if (!$batch) {
            return back()->with('error', 'No hay importaciones procesadas para limpiar.');
        }

        $deleted = $this->cleanBatch($batch);

        return back()->with('success', "Última importación limpiada: {$deleted} producto(s) removido(s) de la vista pública.");
    }

    private function cleanBatch(ProductImportBatch $batch): int
    {
        return DB::transaction(function () use ($batch) {
            $ids = collect($batch->summary ?? [])
                ->pluck('id')
                ->filter()
                ->map(fn ($id) => (int) $id)
                ->merge(
                    Product::withTrashed()
                        ->whereHas('technicalSections', fn ($query) => $query->where('product_import_batch_id', $batch->id))
                        ->pluck('id')
                )
                ->unique()
                ->values();

            $deleted = 0;

            Product::withTrashed()
                ->whereIn('id', $ids)
                ->get()
                ->each(function (Product $product) use (&$deleted) {
                    foreach ([$product->ficha_tecnica_file, $product->pdf_graphic, $product->pdf_color_table, $product->image] as $path) {
                        if ($path && Storage::disk('public')->exists($path)) {
                            Storage::disk('public')->delete($path);
                        }
                    }

                    $product->technicalSections()->delete();
                    $product->applications()->delete();
                    $product->icons()->detach();

                    $product->update([
                        'is_active' => false,
                        'featured' => false,
                        'ficha_tecnica_file' => null,
                        'ficha_tecnica_weight' => null,
                        'ficha_tecnica_format' => null,
                        'pdf_graphic' => null,
                        'pdf_color_table' => null,
                        'image' => null,
                    ]);

                    if (!$product->trashed()) {
                        $product->delete();
                    }

                    $deleted++;
                });

            $batch->update(['status' => 'cleaned']);

            return $deleted;
        });
    }
}
