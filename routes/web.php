<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Controllers
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\PageController;
use App\Http\Controllers\Web\WebProductController;
use App\Http\Controllers\Web\PostController;
use App\Http\Controllers\Web\JobApplicationController;
use App\Http\Controllers\Web\ContactMessageController;
use App\Http\Controllers\Web\NewsletterController;
use App\Http\Controllers\Web\SearchController;


/*
|--------------------------------------------------------------------------
| WEB PÚBLICA
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/nosotros', [PageController::class, 'nosotros'])->name('nosotros');
Route::get('/sectores', [PageController::class, 'sectores'])->name('sectores');
Route::get('/calidad', [PageController::class, 'calidad'])->name('calidad');
Route::get('/descargas', [PageController::class, 'descargas'])->name('descargas');
Route::get('/clientes', [PageController::class, 'clientes'])->name('clientes');

/*
|--------------------------------------------------------------------------
| PRODUCTOS
|--------------------------------------------------------------------------
*/
Route::get('/productos', [WebProductController::class, 'index'])->name('productos.index');
Route::get('/productos/{categoria}', [WebProductController::class, 'category'])->name('productos.category');
Route::get('/producto/{producto}', [WebProductController::class, 'show'])->name('productos.show');

/*
|--------------------------------------------------------------------------
| NOVEDADES
|--------------------------------------------------------------------------
*/
Route::get('/novedades', [PostController::class, 'index'])->name('novedades');
Route::get('/novedades/{slug}', [PostController::class, 'show'])->name('novedades.show');

/*
|--------------------------------------------------------------------------
| RRHH
|--------------------------------------------------------------------------
*/
Route::get('/rrhh', [PageController::class, 'rrhh'])->name('rrhh');
Route::post('/rrhh', [JobApplicationController::class, 'store'])
    ->middleware('throttle:5,1')  // 5 submissions per minute
    ->name('rrhh.store');

/*
|--------------------------------------------------------------------------
| CONTACTO
|--------------------------------------------------------------------------
*/
Route::get('/contacto', [PageController::class, 'contacto'])->name('contacto');
Route::post('/contacto', [ContactMessageController::class, 'store'])
    ->middleware('throttle:30,1')  // 30 contact forms per minute
    ->name('contacto.store');

/*
|--------------------------------------------------------------------------
| COTIZACIÓN MULTIPRODUCTO
|--------------------------------------------------------------------------
*/
Route::get('/cotizacion', [PageController::class, 'cotizacion'])->name('cotizacion');

Route::post('/cotizacion/add/{product}', [PageController::class, 'addToQuotation'])
    ->name('cotizacion.add');

Route::post('/cotizacion/remove/{itemKey}', [PageController::class, 'removeFromQuotation'])
    ->name('cotizacion.remove');

Route::post('/cotizacion/update/{itemKey}', [PageController::class, 'updateQuotation'])
    ->name('cotizacion.update');

Route::post('/cotizacion/send', [PageController::class, 'sendQuotation'])
    ->middleware('throttle:30,1')  // 30 quotation requests per minute
    ->name('cotizacion.send');

/*
|--------------------------------------------------------------------------
| suscribe a newsletter
|--------------------------------------------------------------------------
*/

Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])
    ->middleware('throttle:10,1')  // 10 subscriptions per minute
    ->name('newsletter.subscribe');

Route::match(['get', 'post'], '/newsletter/unsubscribe/{token}', [NewsletterController::class, 'unsubscribe'])
    ->name('newsletter.unsubscribe');

/*
|--------------------------------------------------------------------------
| Buscador
|--------------------------------------------------------------------------
*/

Route::get('/buscador', [SearchController::class, 'index'])
    ->name('buscador');

/*
|--------------------------------------------------------------------------
| LANGUAGE SWITCH
|--------------------------------------------------------------------------
*/
Route::get('/lang/{locale}', function ($locale) {

    if (!in_array($locale, ['es', 'en'])) {
        abort(400);
    }

    session(['locale' => $locale]);

    return back();
})->name('lang.switch');

require __DIR__ . '/auth.php';
