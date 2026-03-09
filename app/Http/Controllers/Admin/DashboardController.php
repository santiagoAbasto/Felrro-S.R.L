<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Post;
use App\Models\Quotation;
use App\Models\ContactMessage;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'products' => Product::count(),
                'categories' => ProductCategory::count(),
                'posts' => Post::count(),
                'quotations' => Quotation::count(),
                'messages' => ContactMessage::count(),
            ],
            'latestQuotations' => Quotation::latest()->take(5)->get(),
            'latestMessages' => ContactMessage::latest()->take(5)->get(),
        ]);
    }
}