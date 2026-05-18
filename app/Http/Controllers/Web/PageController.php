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
use App\Models\ProductTechnicalRow;
use App\Mail\QuotationReceivedMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Models\Client;
use Illuminate\Support\Str;
use Throwable;



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
            ->with([
                'relatedProducts' => function ($query) {
                    $query->with('category')
                        ->where('is_active', true)
                        ->orderBy('featured_order')
                        ->orderBy('id');
                }
            ])
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

        $cart = $this->normalizeQuotationCart(session()->get('quotation_cart', []));
        $items = collect();

        /*
    |--------------------------------------------------------------------------
    | VALIDAR PRODUCTOS DEL CARRITO
    |--------------------------------------------------------------------------
    */

        if (!empty($cart)) {
            $productIds = collect($cart)
                ->pluck('product_id')
                ->filter()
                ->unique()
                ->values()
                ->all();

            $dbProducts = \App\Models\Product::whereIn('id', $productIds)
                ->where('is_active', true)
                ->with('category')
                ->get()
                ->keyBy('id');

            $cleanCart = [];

            foreach ($cart as $itemKey => $item) {
                $productId = (int) ($item['product_id'] ?? 0);

                if (!isset($dbProducts[$productId])) {
                    continue;
                }

                $product = $dbProducts[$productId];
                $metros = isset($item['metros']) && is_numeric($item['metros'])
                    ? max(1, (int) $item['metros'])
                    : 1;

                $variantSnapshot = $this->sanitizeVariantSnapshot($item['variant_snapshot'] ?? null);

                $items->push((object) [
                    'item_key' => $itemKey,
                    'product' => $product,
                    'metros' => $metros,
                    'variant_snapshot' => $variantSnapshot,
                    'dom_id' => Str::slug($itemKey, '-'),
                ]);

                $cleanCart[$itemKey] = [
                    'item_key' => $itemKey,
                    'product_id' => $productId,
                    'metros' => $metros,
                    'variant_snapshot' => $variantSnapshot,
                ];
            }

            session()->put('quotation_cart', $cleanCart);
        }

        /*
    |--------------------------------------------------------------------------
    | RETORNAR VISTA
    |--------------------------------------------------------------------------
    */

        return view('web.pages.cotizacion', [
            'page'     => $page,
            'items' => $items,
        ]);
    }
    public function addToQuotation(Request $request, Product $product)
    {
        if (!$product->is_active) {
            abort(404);
        }

        $cart = $this->normalizeQuotationCart(session()->get('quotation_cart', []));
        $variantSnapshots = $this->resolveVariantSnapshots($product, $request);
        $metros = max(1, (int) $request->input('metros', 1));

        if ($request->boolean('requires_technical_selection') && $variantSnapshots === []) {
            return back()->withErrors([
                'technical_rows' => 'Seleccioná al menos una variante para cotizar.'
            ]);
        }

        if ($variantSnapshots === []) {
            $variantSnapshots = [null];
        }

        foreach ($variantSnapshots as $variantSnapshot) {
            $itemKey = $this->buildQuotationItemKey($product->id, $variantSnapshot);

            if (isset($cart[$itemKey])) {
                $cart[$itemKey]['metros'] += $metros;
                continue;
            }

            $cart[$itemKey] = [
                'item_key' => $itemKey,
                'product_id' => $product->id,
                'metros' => $metros,
                'variant_snapshot' => $variantSnapshot,
            ];
        }

        session()->put('quotation_cart', $cart);

        return redirect()->route('cotizacion');
    }
    public function removeFromQuotation(string $itemKey)
    {
        $cart = $this->normalizeQuotationCart(session()->get('quotation_cart', []));

        unset($cart[$itemKey]);

        session()->put('quotation_cart', $cart);

        return back();
    }
    public function updateQuotation(Request $request, string $itemKey)
    {
        $cart = $this->normalizeQuotationCart(session()->get('quotation_cart', []));

        if (isset($cart[$itemKey])) {
            $cart[$itemKey]['metros'] = max(1, (int) $request->input('metros', 1));
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

        $cart = $this->normalizeQuotationCart(session()->get('quotation_cart', []));

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
                'variant_snapshot' => $this->sanitizeVariantSnapshot($item['variant_snapshot'] ?? null),
            ]);
        }

        // Cargar relaciones para el mail
        $quotation->load('items.product');

        // 🔥 Enviar correo a Mailtrap
        try {
            Mail::mailer('failover')
                ->to(config('mail.recipients.quotation'))
                ->send(new QuotationReceivedMail($quotation));
        } catch (Throwable $exception) {
            Log::warning('No se pudo enviar el correo de cotización.', [
                'quotation_id' => $quotation->id,
                'email' => $quotation->email,
                'error' => $exception->getMessage(),
            ]);
        }

        session()->forget('quotation_cart');

        return redirect()
            ->route('cotizacion')
            ->with('success', 'Cotización enviada correctamente.');
    }

    private function normalizeQuotationCart($cart): array
    {
        if (!is_array($cart)) {
            return [];
        }

        $normalized = [];

        foreach ($cart as $key => $item) {
            if (!is_array($item)) {
                continue;
            }

            $productId = (int) ($item['product_id'] ?? (is_numeric($key) ? $key : 0));

            if ($productId <= 0) {
                continue;
            }

            $variantSnapshot = $this->sanitizeVariantSnapshot($item['variant_snapshot'] ?? null);
            $itemKey = is_string($key) && $key !== ''
                ? $key
                : $this->buildQuotationItemKey($productId, $variantSnapshot);

            $normalized[$itemKey] = [
                'item_key' => $itemKey,
                'product_id' => $productId,
                'metros' => isset($item['metros']) && is_numeric($item['metros'])
                    ? max(1, (int) $item['metros'])
                    : 1,
                'variant_snapshot' => $variantSnapshot,
            ];
        }

        return $normalized;
    }

    private function resolveVariantSnapshot(Product $product, Request $request): ?array
    {
        return $this->resolveVariantSnapshots($product, $request)[0] ?? null;
    }

    private function resolveVariantSnapshots(Product $product, Request $request): array
    {
        $technicalRowIds = collect($request->input('technical_row_ids', []));

        if ($technicalRowIds->isEmpty()) {
            $fallbackRowId = (int) $request->input('technical_row_id', 0);

            if ($fallbackRowId > 0) {
                $technicalRowIds = collect([$fallbackRowId]);
            }
        }

        $technicalRowIds = $technicalRowIds
            ->map(fn ($rowId) => (int) $rowId)
            ->filter(fn ($rowId) => $rowId > 0)
            ->unique()
            ->values();

        if ($technicalRowIds->isEmpty()) {
            return [];
        }

        $technicalRows = ProductTechnicalRow::query()
            ->with('section')
            ->whereIn('id', $technicalRowIds)
            ->whereHas('section', fn ($query) => $query->where('product_id', $product->id))
            ->get()
            ->keyBy('id');

        return $technicalRowIds
            ->map(function (int $technicalRowId) use ($technicalRows) {
                $technicalRow = $technicalRows->get($technicalRowId);

                if (!$technicalRow) {
                    return null;
                }

                $leadHeader = trim((string) ($technicalRow->values['lead_header'] ?? ''));
                $formation = trim((string) $technicalRow->formation);
                $technicalMeta = $this->extractTechnicalRowMeta($technicalRow);

                if ($leadHeader !== '' && !str_contains(Str::lower($leadHeader), 'formación')) {
                    $formation = trim($leadHeader . ': ' . $formation);
                }

                return $this->sanitizeVariantSnapshot([
                    'section_title' => $technicalRow->section?->getTitle(),
                    'formation' => $formation,
                    'code' => $technicalMeta['code'],
                    'diameter' => $technicalMeta['diameter'],
                    'weight' => $technicalMeta['weight'],
                ]);
            })
            ->filter()
            ->values()
            ->all();
    }

    private function extractTechnicalRowMeta(ProductTechnicalRow $technicalRow): array
    {
        $meta = [
            'code' => trim((string) ($technicalRow->code ?? '')),
            'diameter' => trim((string) ($technicalRow->diameter ?? '')),
            'weight' => trim((string) ($technicalRow->weight ?? '')),
        ];

        if ($meta['code'] === '') {
            $meta['code'] = trim((string) ($technicalRow->code_pe ?? $technicalRow->code_neutral ?? ''));
        }

        if ($meta['code'] !== '' && $meta['diameter'] !== '' && $meta['weight'] !== '') {
            return $meta;
        }

        $headers = collect($technicalRow->values['headers'] ?? [])
            ->map(fn ($header) => trim((string) $header))
            ->values();

        $rawValues = collect($technicalRow->values['raw'] ?? [])
            ->map(fn ($value) => trim((string) $value))
            ->values();

        foreach ($headers as $index => $header) {
            $normalizedHeader = Str::lower($header);
            $value = $rawValues->get($index, '');

            if ($value === '') {
                continue;
            }

            if ($meta['code'] === '' && str_contains($normalizedHeader, 'código')) {
                $meta['code'] = $value;
                continue;
            }

            if ($meta['diameter'] === '' && (str_contains($normalizedHeader, 'ø') || str_contains($normalizedHeader, 'diam'))) {
                $meta['diameter'] = $value;
                continue;
            }

            if ($meta['weight'] === '' && str_contains($normalizedHeader, 'peso')) {
                $meta['weight'] = $value;
            }
        }

        return $meta;
    }

    private function sanitizeVariantSnapshot($variantSnapshot): ?array
    {
        if (!is_array($variantSnapshot)) {
            return null;
        }

        $snapshot = [
            'section_title' => trim((string) ($variantSnapshot['section_title'] ?? '')),
            'formation' => trim((string) ($variantSnapshot['formation'] ?? '')),
            'code' => trim((string) ($variantSnapshot['code'] ?? '')),
            'diameter' => trim((string) ($variantSnapshot['diameter'] ?? '')),
            'weight' => trim((string) ($variantSnapshot['weight'] ?? '')),
        ];

        return collect($snapshot)->filter(fn ($value) => $value !== '')->isEmpty()
            ? null
            : $snapshot;
    }

    private function buildQuotationItemKey(int $productId, ?array $variantSnapshot): string
    {
        if (!$variantSnapshot) {
            return 'p' . $productId . '-base';
        }

        return 'p' . $productId . '-' . substr(
            md5(json_encode($variantSnapshot, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)),
            0,
            12
        );
    }
}
