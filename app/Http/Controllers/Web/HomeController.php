<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\ProductCategory;
use App\Models\Product;
use App\Models\Post;

class HomeController extends Controller
{
    public function index()
    {
        $page = Page::with([
            'sections' => function ($query) {
                $query->where('is_active', true)
                    ->orderBy('order');
            },
            'sections.images'
        ])
            ->where('slug', 'home')
            ->where('is_active', true)
            ->firstOrFail();

        $aboutPreview = $page->sections
            ->where('type', 'about_preview')
            ->first();

        $featuredCategories = ProductCategory::query()
            ->where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('featured_order')
            ->get();

        if ($featuredCategories->isEmpty()) {
            $featuredCategories = ProductCategory::query()
                ->where('is_active', true)
                ->orderBy('order')
                ->take(4)
                ->get();
        }

        $featuredProducts = Product::query()
            ->with('category')
            ->where('is_active', true)
            ->where('featured', true)
            ->whereNotNull('featured_order')
            ->orderBy('featured_order')
            ->get();

        if ($featuredProducts->isEmpty()) {
            $featuredProducts = Product::query()
                ->with('category')
                ->where('is_active', true)
                ->take(4)
                ->get();
        }

        $latestPosts = Post::published()
            ->where('is_featured', true)
            ->latest('published_at')
            ->take(3)
            ->get();

        return view('web.pages.home', [
            'page' => $page,
            'aboutPreview' => $aboutPreview,
            'featuredCategories' => $featuredCategories,
            'featuredProducts' => $featuredProducts,
            'latestPosts' => $latestPosts,
        ]);
    }
}
