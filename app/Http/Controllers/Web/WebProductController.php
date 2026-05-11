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
                'applications',
                'technicalSections.rows',
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
        $applicationCards = $this->splitApplicationCards($applications);

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
            'applications'     => $applicationCards,
            'extra'            => $extra,
            'specifications'   => $specifications, // 🔥 ahora sí explícito
            'technicalSections' => $product->technicalSections
                ->sortBy('order')
                ->values(),
            'featuredProducts' => $featuredProducts,
        ]);
    }

    private function splitApplicationCards($applications)
    {
        return $applications->flatMap(function ($application) {
            $title = $application->getTitle();
            $content = trim((string) $application->getContent());

            if ($content === '') {
                return [];
            }

            $paragraphs = collect(preg_split('/\R{1,}/u', $content))
                ->map(fn ($paragraph) => trim($paragraph))
                ->filter()
                ->values();

            if ($paragraphs->count() > 1) {
                return collect($paragraphs->chunk(3))->map(fn ($chunk) => [
                    'title' => $title,
                    'content' => $chunk->implode("\n\n"),
                ]);
            }

            $sentences = collect(preg_split('/(?<=[.!?])\s+/u', $content))
                ->map(fn ($sentence) => trim($sentence))
                ->filter()
                ->values();

            if ($sentences->count() >= 3) {
                return $this->distributeApplicationParts($sentences, $title);
            }

            $words = collect(preg_split('/\s+/u', $content))
                ->map(fn ($word) => trim($word))
                ->filter()
                ->values();

            if ($words->count() > 18) {
                return $this->distributeApplicationParts($words, $title, ' ');
            }

            return [[
                'title' => $title,
                'content' => $content,
            ]];
        })->values();
    }

    private function distributeApplicationParts($parts, ?string $title, string $separator = ' ')
    {
        $cardCount = min(3, max(1, $parts->count()));
        $baseSize = intdiv($parts->count(), $cardCount);
        $remainder = $parts->count() % $cardCount;
        $offset = 0;
        $cards = collect();

        for ($index = 0; $index < $cardCount; $index++) {
            $size = $baseSize + ($index < $remainder ? 1 : 0);
            $chunk = $parts->slice($offset, $size)->values();
            $offset += $size;

            $cards->push([
                'title' => $title,
                'content' => $chunk->implode($separator),
            ]);
        }

        return $cards;
    }
}
