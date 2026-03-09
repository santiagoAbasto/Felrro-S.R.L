<?php

namespace App\Http\Controllers\Admin\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductSpecification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductSpecificationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Catalog/Specifications/Index', [
            'specifications' => ProductSpecification::with('product')
                ->orderBy('order')
                ->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Catalog/Specifications/Create', [
            'products' => Product::orderBy('name->es')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',

            'title.es' => 'required|string|max:255',
            'title.en' => 'required|string|max:255',

            'content.es' => 'required|string',
            'content.en' => 'required|string',

            'order' => 'nullable|integer'
        ]);

        ProductSpecification::create([
            'product_id' => $validated['product_id'],
            'title' => $validated['title'],
            'content' => $validated['content'],
            'order' => $validated['order'] ?? 0
        ]);

        return redirect()
            ->route('admin.product-specifications.index')
            ->with('success', 'Especificación creada correctamente.');
    }

    public function edit(ProductSpecification $productSpecification)
    {
        return Inertia::render('Admin/Catalog/Specifications/Edit', [
            'specification' => $productSpecification,
            'products' => Product::orderBy('name->es')->get()
        ]);
    }

    public function update(Request $request, ProductSpecification $productSpecification)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',

            'title.es' => 'required|string|max:255',
            'title.en' => 'required|string|max:255',

            'content.es' => 'required|string',
            'content.en' => 'required|string',

            'order' => 'nullable|integer'
        ]);

        $productSpecification->update([
            'product_id' => $validated['product_id'],
            'title' => $validated['title'],
            'content' => $validated['content'],
            'order' => $validated['order'] ?? 0
        ]);

        return redirect()
            ->route('admin.product-specifications.index')
            ->with('success', 'Especificación actualizada correctamente.');
    }

    public function destroy(ProductSpecification $productSpecification)
    {
        $productSpecification->delete();

        return back()->with('success', 'Especificación eliminada correctamente.');
    }
}