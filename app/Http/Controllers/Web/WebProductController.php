<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;

class WebProductController extends Controller
{
    /* =======================================================
       /categorias
    ======================================================= */
    public function index()
    {
        $categories = ProductCategory::query()
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return view('web.categories.index', [
            'categories' => $categories
        ]);
    }

    /* =======================================================
       /categorias/{categoria}
    ======================================================= */
    public function category($slug)
    {
        $category = ProductCategory::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $products = $category->products()
            ->where('is_active', true)
            ->orderBy('featured_order')
            ->orderBy('id')
            ->get();

        $allCategories = ProductCategory::query()
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return view('web.categories.category', [
            'category'      => $category,
            'products'      => $products,
            'allCategories' => $allCategories,
        ]);
    }

    /* =======================================================
       /productos/{producto}
    ======================================================= */
    public function show($productSlug)
    {
        $product = Product::query()
            ->with([
                'category',
                'images',
                'specifications',
                'applications'
            ])
            ->where('slug', $productSlug)
            ->where('is_active', true)
            ->firstOrFail();

        /*
    |--------------------------------------------------------------------------
    | Separación limpia por tipo (SIN lógica en Blade)
    |--------------------------------------------------------------------------
    */

        $construction = $product->applications
            ->where('type', 'construction')
            ->sortBy('order')
            ->values();

        $applications = $product->applications
            ->where('type', 'application')
            ->sortBy('order')
            ->values();

        $extra = $product->applications
            ->where('type', 'extra')
            ->sortBy('order')
            ->values();

        $specifications = $product->specifications
            ->sortBy('order')
            ->values();

        /*
    |--------------------------------------------------------------------------
    | Productos destacados (excluyendo el actual)
    |--------------------------------------------------------------------------
    */

        $featuredProducts = Product::query()
            ->with('category')
            ->where('featured', true)
            ->where('is_active', true)
            ->where('id', '!=', $product->id)
            ->whereNotNull('featured_order')
            ->orderBy('featured_order')
            ->take(4)
            ->get();

        return view('web.products.show', [
            'product'          => $product,
            'construction'     => $construction,
            'applications'     => $applications,
            'extra'            => $extra,
            'specifications'   => $specifications, // 🔥 ahora sí explícito
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
