<?php

namespace App\Http\Controllers\Admin\Catalog;

use App\Http\Controllers\Controller;
use App\Models\ProductIcon;
use App\Services\ProductIconImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductIconController extends Controller
{
    public function __construct(private readonly ProductIconImageService $iconImageService)
    {
    }

    public function index()
    {
        return Inertia::render('Admin/Catalog/ProductIcons/Index', [
            'icons' => ProductIcon::query()
                ->orderBy('order')
                ->orderBy('name->es')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        if ($request->has('icon_items')) {
            $validated = $request->validate([
                'icon_items' => ['required', 'array', 'min:1'],
                'icon_items.*.name_es' => ['required', 'string', 'max:120'],
                'icon_items.*.name_en' => ['nullable', 'string', 'max:120'],
                'icon_items.*.slug' => ['nullable', 'string', 'max:140'],
                'icon_items.*.order' => ['nullable', 'string', 'max:10'],
                'icon_items.*.placement' => ['nullable', 'in:icon,footer'],
                'icon_items.*.footer_side' => ['nullable', 'in:left,right'],
                'icon_items.*.is_active' => ['nullable', 'boolean'],
                'icon_items.*.image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            ]);

            foreach ($validated['icon_items'] as $item) {
                $this->createIcon($item);
            }

            return back()->with('success', count($validated['icon_items']) . ' icono(s) guardado(s) correctamente.');
        }

        $validated = $request->validate([
            'name.es' => ['required', 'string', 'max:120'],
            'name.en' => ['nullable', 'string', 'max:120'],
            'slug' => ['nullable', 'string', 'max:140', Rule::unique('product_icons', 'slug')],
            'order' => ['nullable', 'string', 'max:10'],
            'placement' => ['nullable', 'in:icon,footer'],
            'footer_side' => ['nullable', 'in:left,right'],
            'is_active' => ['nullable', 'boolean'],
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $this->createIcon([
            'name_es' => $validated['name']['es'],
            'name_en' => $validated['name']['en'] ?? null,
            'slug' => $validated['slug'] ?? null,
            'order' => $validated['order'] ?? null,
            'placement' => $validated['placement'] ?? 'icon',
            'footer_side' => $validated['footer_side'] ?? 'left',
            'is_active' => $request->boolean('is_active', true),
            'image' => $request->file('image'),
        ]);

        return back()->with('success', 'Icono guardado correctamente.');
    }

    public function destroy(ProductIcon $productIcon)
    {
        if ($productIcon->image && Storage::disk('public')->exists($productIcon->image)) {
            Storage::disk('public')->delete($productIcon->image);
        }

        $productIcon->delete();

        return back()->with('success', 'Icono eliminado correctamente.');
    }

    public function update(Request $request, ProductIcon $productIcon)
    {
        $validated = $request->validate([
            'name.es' => ['required', 'string', 'max:120'],
            'name.en' => ['nullable', 'string', 'max:120'],
            'slug' => ['nullable', 'string', 'max:140', Rule::unique('product_icons', 'slug')->ignore($productIcon)],
            'order' => ['nullable', 'string', 'max:10'],
            'placement' => ['nullable', 'in:icon,footer'],
            'footer_side' => ['nullable', 'in:left,right'],
            'is_active' => ['nullable', 'boolean'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $slug = Str::slug($validated['slug'] ?: $validated['name']['es']);

        $payload = [
            'name' => [
                'es' => $validated['name']['es'],
                'en' => $validated['name']['en'] ?: $validated['name']['es'],
            ],
            'slug' => $slug,
            'order' => $validated['order'] ?? null,
            'placement' => $validated['placement'] ?? 'icon',
            'footer_side' => ($validated['placement'] ?? 'icon') === 'footer'
                ? ($validated['footer_side'] ?? 'left')
                : null,
            'is_active' => $request->boolean('is_active', true),
        ];

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            if ($productIcon->image && Storage::disk('public')->exists($productIcon->image)) {
                Storage::disk('public')->delete($productIcon->image);
            }

            $payload['image'] = $this->iconImageService->storeClean($request->file('image'), $slug);
        }

        $productIcon->update($payload);

        return back()->with('success', 'Icono actualizado correctamente.');
    }

    private function uniqueSlug(string $slug): string
    {
        $base = $slug ?: 'icono';
        $candidate = $base;
        $counter = 1;

        while (ProductIcon::where('slug', $candidate)->exists()) {
            $candidate = $base . '-' . $counter++;
        }

        return $candidate;
    }

    private function createIcon(array $item): ProductIcon
    {
        $slug = $this->uniqueSlug(Str::slug($item['slug'] ?: $item['name_es']));
        $path = $this->iconImageService->storeClean($item['image'], $slug);

        return ProductIcon::create([
            'name' => [
                'es' => $item['name_es'],
                'en' => $item['name_en'] ?: $item['name_es'],
            ],
            'slug' => $slug,
            'image' => $path,
            'order' => $item['order'] ?? null,
            'placement' => $item['placement'] ?? 'icon',
            'footer_side' => ($item['placement'] ?? 'icon') === 'footer'
                ? ($item['footer_side'] ?? 'left')
                : null,
            'is_active' => filter_var($item['is_active'] ?? true, FILTER_VALIDATE_BOOLEAN),
        ]);
    }
}
