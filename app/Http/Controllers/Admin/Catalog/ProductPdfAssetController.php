<?php

namespace App\Http\Controllers\Admin\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductIcon;
use App\Services\AflamexPotenciaPdfService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductPdfAssetController extends Controller
{
    public function edit(Product $product)
    {
        $product->load(['category', 'icons', 'technicalSections']);

        return Inertia::render('Admin/Catalog/ProductPdfAssets/Edit', [
            'product' => [
                ...$product->toArray(),
                'icons' => $product->icons->map(fn ($icon) => [
                    'id' => $icon->id,
                    'name' => $icon->name,
                    'slug' => $icon->slug,
                    'image_url' => $icon->image_url,
                    'placement' => $icon->placement,
                    'footer_side' => $icon->footer_side,
                    'order' => $icon->pivot->order,
                    'show_in_pdf' => (bool) $icon->pivot->show_in_pdf,
                    'pdf_group' => $icon->pivot->pdf_group ?: 'main',
                ])->values(),
                'technical_sections_count' => $product->technicalSections->count(),
            ],
            'availableIcons' => ProductIcon::query()
                ->where('is_active', true)
                ->orderBy('order')
                ->orderBy('name->es')
                ->get(),
        ]);
    }

    public function update(Request $request, Product $product, AflamexPotenciaPdfService $pdfService)
    {
        $validated = $request->validate([
            'pdf_graphic' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'pdf_color_table' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'remove_pdf_graphic' => ['nullable', 'boolean'],
            'remove_pdf_color_table' => ['nullable', 'boolean'],
            'icon_settings' => ['nullable', 'array'],
            'icon_settings.*.id' => ['required', 'integer', 'exists:product_icons,id'],
            'icon_settings.*.show_in_pdf' => ['nullable', 'boolean'],
            'icon_settings.*.pdf_group' => ['nullable', 'in:main,optional,footer'],
            'icon_settings.*.order' => ['nullable', 'integer', 'min:0', 'max:999'],
        ]);

        if ($request->boolean('remove_pdf_graphic') && $product->pdf_graphic) {
            Storage::disk('public')->delete($product->pdf_graphic);
            $product->update(['pdf_graphic' => null]);
        }

        if ($request->boolean('remove_pdf_color_table') && $product->pdf_color_table) {
            Storage::disk('public')->delete($product->pdf_color_table);
            $product->update(['pdf_color_table' => null]);
        }

        if ($request->hasFile('pdf_graphic') && $request->file('pdf_graphic')->isValid()) {
            if ($product->pdf_graphic) {
                Storage::disk('public')->delete($product->pdf_graphic);
            }

            $product->update([
                'pdf_graphic' => $request->file('pdf_graphic')
                    ->storeAs('products/pdf-graphics', $product->slug . '.' . $request->file('pdf_graphic')->extension(), 'public'),
            ]);
        }

        if ($request->hasFile('pdf_color_table') && $request->file('pdf_color_table')->isValid()) {
            if ($product->pdf_color_table) {
                Storage::disk('public')->delete($product->pdf_color_table);
            }

            $product->update([
                'pdf_color_table' => $request->file('pdf_color_table')
                    ->storeAs('products/pdf-color-tables', $product->slug . '.' . $request->file('pdf_color_table')->extension(), 'public'),
            ]);
        }

        $sync = [];

        foreach ($validated['icon_settings'] ?? [] as $index => $item) {
            $sync[(int) $item['id']] = [
                'order' => $item['order'] ?? $index + 1,
                'show_in_pdf' => (bool) ($item['show_in_pdf'] ?? false),
                'pdf_group' => $item['pdf_group'] ?? 'main',
            ];
        }

        $product->icons()->sync($sync);

        if ($product->technicalSections()->exists()) {
            $pdfService->generate($product->fresh());
        }

        return redirect()
            ->route('admin.products.pdf-assets.edit', $product)
            ->with('success', 'Assets del PDF actualizados correctamente.');
    }
}
