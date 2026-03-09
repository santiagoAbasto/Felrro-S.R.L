<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Sector;
use App\Models\Certificate;
use App\Models\Download;
use App\Models\Post;
use App\Models\JobPosition;
use App\Models\JobSector;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Quotation;
use App\Models\QuotationItem;
use App\Mail\QuotationReceivedMail;
use Illuminate\Support\Facades\Mail;
use App\Models\Client;



class PageController extends Controller
{
    public function home()
    {
        return view('web.pages.home');
    }

    public function nosotros()
    {
        $page = Page::with(['sections' => function ($q) {
            $q->where('is_active', true)->orderBy('order');
        }])->where('slug', 'nosotros')->firstOrFail();

        return view('web.pages.nosotros', compact('page'));
    }

    public function productos()
    {
        return view('web.pages.productos');
    }
    public function sectores()
    {
        $sectors = Sector::where('is_active', true)
            ->orderBy('order')
            ->get();

        return view('web.pages.sectores', compact('sectors'));
    }

    public function calidad()
    {
        $page = Page::with(['sections' => function ($query) {
            $query->where('is_active', true)
                ->orderBy('order');
        }])
            ->where('slug', 'calidad')
            ->where('is_active', true)
            ->first();

        $certificates = Certificate::where('is_active', true)
            ->orderBy('order')
            ->get();

        return view('web.pages.calidad', compact('page', 'certificates'));
    }

    public function descargas()
    {
        $downloads = Download::query()
            ->where('is_active', true)
            ->orderBy('order')     // Ley A, AA, AB...
            ->orderBy('id')        // respaldo estable
            ->get();

        return view('web.pages.descargas', [
            'downloads' => $downloads
        ]);
    }
    public function novedades()
    {
        $posts = Post::query()
            ->where('is_active', true)
            ->whereNotNull('published_at')
            ->orderBy('order') // Ley A, AA, AB...
            ->orderByDesc('published_at')
            ->paginate(9);

        return view('web.pages.novedades', compact('posts'));
    }

    public function rrhh()
    {
        $positions = JobPosition::where('is_active', true)
            ->orderBy('id')
            ->get();

        $sectors = JobSector::where('is_active', true)
            ->orderBy('id')
            ->get();

        return view('web.pages.rrhh', [
            'positions' => $positions,
            'sectors' => $sectors,
        ]);
    }

    public function clientes()
    {
        $clients = Client::active()
            ->ordered()
            ->get();

        return view('web.pages.clientes', compact('clients'));
    }

    public function contacto()
    {
        $page = \App\Models\Page::with(['sections' => function ($query) {
            $query->where('is_active', true)
                ->orderBy('order');
        }])
            ->where('slug', 'contacto')
            ->where('is_active', true)
            ->first();

        if (!$page) {
            abort(404);
        }

        return view('web.pages.contacto', compact('page'));
    }
    public function cotizacion()
    {
        /*
    |--------------------------------------------------------------------------
    | CARGAR PÁGINA CMS (SIN ROMPER)
    |--------------------------------------------------------------------------
    */

        $page = \App\Models\Page::with([
            'sections' => function ($query) {
                $query->where('is_active', true)
                    ->orderBy('order');
            }
        ])
            ->where('slug', 'cotizacion')
            ->first();

        // Si no existe la página en CMS, abort limpio
        if (!$page) {
            abort(404);
        }

        /*
    |--------------------------------------------------------------------------
    | CARRITO EN SESIÓN
    |--------------------------------------------------------------------------
    */

        $cart = session()->get('quotation_cart', []);

        // Siempre asegurar array
        if (!is_array($cart)) {
            $cart = [];
        }

        $products = collect();

        /*
    |--------------------------------------------------------------------------
    | VALIDAR PRODUCTOS DEL CARRITO
    |--------------------------------------------------------------------------
    */

        if (!empty($cart)) {

            $productIds = array_keys($cart);

            $dbProducts = \App\Models\Product::whereIn('id', $productIds)
                ->where('is_active', true)
                ->with('category')
                ->get()
                ->keyBy('id');

            $cleanCart = [];

            foreach ($cart as $productId => $item) {

                // Si el producto ya no existe o está inactivo, lo ignoramos
                if (!isset($dbProducts[$productId])) {
                    continue;
                }

                $product = $dbProducts[$productId];

                // Seguridad: asegurar metros válido
                $metros = isset($item['metros']) && is_numeric($item['metros'])
                    ? max(1, (int) $item['metros'])
                    : 1;

                $product->metros = $metros;

                $products->push($product);

                // reconstruimos carrito limpio
                $cleanCart[$productId] = [
                    'product_id' => $productId,
                    'metros'     => $metros,
                ];
            }

            // Actualizar sesión con carrito limpio
            session()->put('quotation_cart', $cleanCart);
        }

        /*
    |--------------------------------------------------------------------------
    | RETORNAR VISTA
    |--------------------------------------------------------------------------
    */

        return view('web.pages.cotizacion', [
            'page'     => $page,
            'products' => $products,
        ]);
    }
    public function addToQuotation(Product $product)
    {
        if (!$product->is_active) {
            abort(404);
        }

        $cart = session()->get('quotation_cart', []);

        if (isset($cart[$product->id])) {
            $cart[$product->id]['metros'] += 1;
        } else {
            $cart[$product->id] = [
                'product_id' => $product->id,
                'metros' => 1,
            ];
        }

        session()->put('quotation_cart', $cart);

        return redirect()->route('cotizacion');
    }
    public function removeFromQuotation(Product $product)
    {
        $cart = session()->get('quotation_cart', []);

        unset($cart[$product->id]);

        session()->put('quotation_cart', $cart);

        return back();
    }
    public function updateQuotation(Request $request, Product $product)
    {
        $cart = session()->get('quotation_cart', []);

        if (isset($cart[$product->id])) {
            $cart[$product->id]['metros'] = max(1, (int)$request->metros);
        }

        session()->put('quotation_cart', $cart);

        return back();
    }
    public function sendQuotation(Request $request)
    {
        $validated = $request->validate([
            'nombre'   => 'required|string|max:255',
            'email'    => 'required|email|max:255',
            'telefono' => 'nullable|string|max:255',
            'empresa'  => 'nullable|string|max:255',
            'mensaje'  => 'nullable|string',
        ]);

        $cart = session()->get('quotation_cart', []);

        if (empty($cart)) {
            return back()->withErrors([
                'cart' => 'No hay productos en la cotización.'
            ]);
        }

        // Crear cotización
        $quotation = Quotation::create($validated);

        foreach ($cart as $item) {
            QuotationItem::create([
                'quotation_id' => $quotation->id,
                'product_id'   => $item['product_id'],
                'metros'       => $item['metros'],
            ]);
        }

        // Cargar relaciones para el mail
        $quotation->load('items.product');

        // 🔥 Enviar correo a Mailtrap
        Mail::to('ventas@felrro.com')
            ->send(new QuotationReceivedMail($quotation));

        session()->forget('quotation_cart');

        return redirect()
            ->route('cotizacion')
            ->with('success', 'Cotización enviada correctamente.');
    }
}
