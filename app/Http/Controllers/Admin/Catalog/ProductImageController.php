<?php

namespace App\Http\Controllers\Admin\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductImageController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Catalog/Images/Index', [
            'images' => ProductImage::with('product')
                ->orderBy('order')
                ->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Catalog/Images/Create', [
            'products' => Product::orderBy('name->es')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
            'order' => 'nullable|integer'
        ]);

        $imagePath = $request->file('image')->store(
            'products/images',
            'public'
        );

        ProductImage::create([
            'product_id' => $validated['product_id'],
            'image' => $imagePath,
            'order' => $validated['order'] ?? 0
        ]);

        return redirect()
            ->route('admin.product-images.index')
            ->with('success', 'Imagen subida correctamente.');
    }

    public function edit(ProductImage $productImage)
    {
        return Inertia::render('Admin/Catalog/Images/Edit', [
            'image' => $productImage,
            'products' => Product::orderBy('name->es')->get()
        ]);
    }

    public function update(Request $request, ProductImage $productImage)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'order' => 'nullable|integer'
        ]);

        if ($request->hasFile('image')) {

            if ($productImage->image && Storage::disk('public')->exists($productImage->image)) {
                Storage::disk('public')->delete($productImage->image);
            }

            $productImage->image = $request
                ->file('image')
                ->store('products/images', 'public');
        }

        $productImage->product_id = $validated['product_id'];
        $productImage->order = $validated['order'] ?? 0;
        $productImage->save();

        return redirect()
            ->route('admin.product-images.index')
            ->with('success', 'Imagen actualizada.');
    }

    public function destroy(ProductImage $productImage)
    {
        if ($productImage->image && Storage::disk('public')->exists($productImage->image)) {
            Storage::disk('public')->delete($productImage->image);
        }

        $productImage->delete();

        return back()->with('success', 'Imagen eliminada.');
    }
}
