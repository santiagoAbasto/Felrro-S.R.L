<?php

namespace App\Http\Controllers\Admin\Comercial;

use App\Http\Controllers\Controller;
use App\Models\Quotation;
use Inertia\Inertia;

class QuotationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Comercial/Quotations/Index', [
            'quotations' => Quotation::withCount('items')
                ->orderByDesc('created_at')
                ->get()
        ]);
    }

    public function show(Quotation $quotation)
    {
        $quotation->load([
            'items.product.category'
        ]);

        return Inertia::render('Admin/Comercial/Quotations/Show', [
            'quotation' => $quotation
        ]);
    }

    public function destroy(Quotation $quotation)
    {
        $quotation->delete();

        return back()->with('success', 'Cotización eliminada correctamente.');
    }
}
