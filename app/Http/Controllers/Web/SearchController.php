<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = mb_strtolower(trim((string) $request->get('q')));

        $products = Product::query()
            ->where('is_active', true)

            ->when($query, function ($q) use ($query) {
                $q->where(function ($search) use ($query) {
                    $search->where(function ($localeSearch) use ($query) {
                        $this->addJsonLocaleSearch($localeSearch, 'name', $query);
                    })->orWhere(function ($localeSearch) use ($query) {
                        $this->addJsonLocaleSearch($localeSearch, 'short_description', $query);
                    })->orWhere(function ($localeSearch) use ($query) {
                        $this->addJsonLocaleSearch($localeSearch, 'description', $query);
                    });

                    $search->orWhereHas('category', function ($cat) use ($query) {
                        $this->addJsonLocaleSearch($cat, 'name', $query);
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

    protected function addJsonLocaleSearch(Builder $query, string $column, string $term): Builder
    {
        $like = "%{$term}%";
        $column = '`' . str_replace('`', '``', $column) . '`';

        return $query
            ->whereRaw(
                "LOWER(COALESCE(JSON_UNQUOTE(JSON_EXTRACT({$column}, '$.es')), '')) LIKE ?",
                [$like]
            )
            ->orWhereRaw(
                "LOWER(COALESCE(JSON_UNQUOTE(JSON_EXTRACT({$column}, '$.en')), '')) LIKE ?",
                [$like]
            );
    }
}
