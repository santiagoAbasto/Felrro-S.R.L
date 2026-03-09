<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = strtolower(trim($request->get('q')));

        $products = Product::query()
            ->where('is_active', true)

            ->when($query, function ($q) use ($query) {

                $q->where(function ($search) use ($query) {

                    $search->whereRaw('LOWER(name->>"$.es") LIKE ?', ["%{$query}%"])
                        ->orWhereRaw('LOWER(name->>"$.en") LIKE ?', ["%{$query}%"])

                        ->orWhereRaw('LOWER(short_description->>"$.es") LIKE ?', ["%{$query}%"])
                        ->orWhereRaw('LOWER(short_description->>"$.en") LIKE ?', ["%{$query}%"])

                        ->orWhereRaw('LOWER(description->>"$.es") LIKE ?', ["%{$query}%"])
                        ->orWhereRaw('LOWER(description->>"$.en") LIKE ?', ["%{$query}%"])

                        ->orWhereHas('category', function ($cat) use ($query) {
                            $cat->whereRaw('LOWER(name->>"$.es") LIKE ?', ["%{$query}%"])
                                ->orWhereRaw('LOWER(name->>"$.en") LIKE ?', ["%{$query}%"]);
                        });

                });

            })

            ->with('category')
            ->paginate(12)
            ->withQueryString();

        return view('web.search.index', [
            'products' => $products,
            'query' => $query
        ]);
    }
}