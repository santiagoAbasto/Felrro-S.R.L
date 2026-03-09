<?php

namespace App\Http\Controllers\Admin\Catalog;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | INDEX
    |--------------------------------------------------------------------------
    */
    public function index()
    {
        return Inertia::render('Admin/Catalog/Categories/Index', [
            'categories' => ProductCategory::orderBy('order')->get()
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE
    |--------------------------------------------------------------------------
    */
    public function create()
    {
        return Inertia::render('Admin/Catalog/Categories/Create');
    }

    /*
    |--------------------------------------------------------------------------
    | STORE
    |--------------------------------------------------------------------------
    */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name.es' => 'required|string|max:255',
            'name.en' => 'required|string|max:255',

            'description.es' => 'nullable|string',
            'description.en' => 'nullable|string',

            'order' => [
                'nullable',
                'string',
                'max:10',
                Rule::unique('product_categories', 'order'),
            ],

            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'featured_order' => 'nullable|string|max:10',

            // 🔥 IMAGEN
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
        ]);

        $slug = Str::slug($validated['name']['es']);
        $slug = $this->generateUniqueSlug($slug);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')
                ->store('categories', 'public');
        }

        ProductCategory::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'slug' => $slug,
            'order' => $validated['order'] ?? ProductCategory::nextOrder(),
            'is_active' => $request->boolean('is_active'),
            'is_featured' => $request->boolean('is_featured'),
            'featured_order' => $request->boolean('is_featured')
                ? ($validated['featured_order'] ?? null)
                : null,
            'image' => $imagePath,
        ]);

        return redirect()
            ->route('admin.product-categories.index')
            ->with('success', 'Categoría creada correctamente.');
    }

    /*
    |--------------------------------------------------------------------------
    | EDIT
    |--------------------------------------------------------------------------
    */
    public function edit(ProductCategory $productCategory)
    {
        return Inertia::render('Admin/Catalog/Categories/Edit', [
            'category' => $productCategory
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */
    public function update(Request $request, ProductCategory $productCategory)
    {
        $validated = $request->validate([
            'name.es' => 'required|string|max:255',
            'name.en' => 'required|string|max:255',

            'description.es' => 'nullable|string',
            'description.en' => 'nullable|string',

            'order' => [
                'nullable',
                'string',
                'max:10',
                Rule::unique('product_categories', 'order')
                    ->ignore($productCategory->id),
            ],

            'is_active' => 'boolean',
            'is_featured' => 'sometimes|boolean',
            'featured_order' => 'nullable|string|max:10',

            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
            'delete_image' => 'nullable|boolean',
        ]);

        $slug = Str::slug($validated['name']['es']);
        $slug = $this->generateUniqueSlug($slug, $productCategory->id);

        $productCategory->name = $validated['name'];
        $productCategory->description = $validated['description'] ?? null;
        $productCategory->slug = $slug;

        if (!empty($validated['order'])) {
            $productCategory->order = $validated['order'];
        }

        $productCategory->is_active = $request->boolean('is_active');
        $productCategory->is_featured = $request->boolean('is_featured');

        $productCategory->featured_order =
            $productCategory->is_featured
                ? ($validated['featured_order'] ?? null)
                : null;

        /* =========================================
           🔥 ELIMINAR IMAGEN
        ========================================== */
        if ($request->boolean('delete_image') && $productCategory->image) {

            if (Storage::disk('public')->exists($productCategory->image)) {
                Storage::disk('public')->delete($productCategory->image);
            }

            $productCategory->image = null;
        }

        /* =========================================
           🔥 REEMPLAZAR IMAGEN
        ========================================== */
        if ($request->hasFile('image')) {

            if ($productCategory->image &&
                Storage::disk('public')->exists($productCategory->image)) {

                Storage::disk('public')->delete($productCategory->image);
            }

            $productCategory->image = $request
                ->file('image')
                ->store('categories', 'public');
        }

        $productCategory->save();

        return redirect()
            ->route('admin.product-categories.index')
            ->with('success', 'Categoría actualizada correctamente.');
    }

    /*
    |--------------------------------------------------------------------------
    | DESTROY
    |--------------------------------------------------------------------------
    */
    public function destroy(ProductCategory $productCategory)
    {
        if ($productCategory->image &&
            Storage::disk('public')->exists($productCategory->image)) {

            Storage::disk('public')->delete($productCategory->image);
        }

        $productCategory->delete();

        return back()->with('success', 'Categoría eliminada correctamente.');
    }

    /*
    |--------------------------------------------------------------------------
    | HELPER SLUG
    |--------------------------------------------------------------------------
    */
    private function generateUniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $original = $slug;
        $counter = 1;

        while (
            ProductCategory::where('slug', $slug)
                ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $original . '-' . $counter++;
        }

        return $slug;
    }
}