<?php

namespace App\Http\Controllers\Admin\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductApplicationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Catalog/Applications/Index', [
            'applications' => ProductApplication::with('product')
                ->orderByDesc('created_at')
                ->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Catalog/Applications/Create', [
            'products' => Product::orderBy('name->es')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'content.es' => 'required|string',
            'content.en' => 'required|string',
        ]);

        ProductApplication::create([
            'product_id' => $validated['product_id'],
            'content' => $validated['content'],
        ]);

        return redirect()
            ->route('admin.product-applications.index')
            ->with('success', 'Aplicación creada correctamente.');
    }

    public function edit(ProductApplication $productApplication)
    {
        return Inertia::render('Admin/Catalog/Applications/Edit', [
            'application' => $productApplication,
            'products' => Product::orderBy('name->es')->get()
        ]);
    }

    public function update(Request $request, ProductApplication $productApplication)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'content.es' => 'required|string',
            'content.en' => 'required|string',
        ]);

        $productApplication->update([
            'product_id' => $validated['product_id'],
            'content' => $validated['content'],
        ]);

        return redirect()
            ->route('admin.product-applications.index')
            ->with('success', 'Aplicación actualizada.');
    }

    public function destroy(ProductApplication $productApplication)
    {
        $productApplication->delete();

        return back()->with('success', 'Aplicación eliminada.');
    }
}