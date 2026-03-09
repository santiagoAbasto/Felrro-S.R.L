<?php

namespace App\Http\Controllers\Admin\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
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
    public function store(Request $request)
    {
        $validated = $this->validateProduct($request);

        DB::transaction(function () use ($request, &$validated) {

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

            $product = Product::create($validated);

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
            'applications'
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
            ],

            'categories' => ProductCategory::where('is_active', true)
                ->orderBy('order')
                ->get(),
        ]);
    }

    /* =======================================================
   UPDATE
======================================================= */
    public function update(Request $request, Product $product)
    {
        $validated = $this->validateProduct($request, $product);

        DB::transaction(function () use ($request, $product, &$validated) {

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

                    $validated['image'] = $newImage;
                }
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
                }
            } else {
                unset($validated['ficha_tecnica_file']);
            }

            if (!$validated['featured']) {
                $validated['featured_order'] = null;
            }

            $product->update($validated);

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
        });

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
        if ($product->quotationItems()->exists()) {
            return back()->withErrors(
                'No se puede eliminar un producto con cotizaciones asociadas.'
            );
        }

        DB::transaction(function () use ($product) {

            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            if ($product->ficha_tecnica_file) {
                Storage::disk('public')->delete($product->ficha_tecnica_file);
            }

            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image->image);
            }

            $product->images()->delete();
            $product->specifications()->delete();
            $product->applications()->delete();

            $product->delete();
        });

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

            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048|dimensions:min_width=300,min_height=300',

            'gallery'   => 'nullable|array',
            'gallery.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',

            'ficha_tecnica_file' => 'nullable|file|mimes:pdf|max:5120',

            'featured' => 'nullable|boolean',
            'featured_order' => 'nullable|string|max:10',
            'is_active' => 'nullable|boolean',
        ]);
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
