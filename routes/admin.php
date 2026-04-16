<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Controllers
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SeoController;

/* Catalog */
use App\Http\Controllers\Admin\Catalog\ProductController;
use App\Http\Controllers\Admin\Catalog\ProductCategoryController;
use App\Http\Controllers\Admin\Catalog\ProductApplicationController;
use App\Http\Controllers\Admin\Catalog\ProductImageController;
use App\Http\Controllers\Admin\Catalog\ProductSpecificationController;

/* CMS */
use App\Http\Controllers\Admin\CMS\PostController;
use App\Http\Controllers\Admin\CMS\CertificateController;
use App\Http\Controllers\Admin\CMS\DownloadController;
use App\Http\Controllers\Admin\CMS\VideoController;
use App\Http\Controllers\Admin\CMS\PageController;
use App\Http\Controllers\Admin\CMS\PageSectionController;
use App\Http\Controllers\Admin\CMS\CalidadController;
use App\Http\Controllers\Admin\HR\JobPositionController;
use App\Http\Controllers\Admin\HR\JobSectorController;
use App\Http\Controllers\Admin\Newsletter\AdminNewsletterController;


/* Comercial */
use App\Http\Controllers\Admin\Comercial\QuotationController;

/* Contact */
use App\Http\Controllers\Admin\Contact\ContactMessageController;

/* Clients */
use App\Http\Controllers\Admin\Client\ClientController;

/* Sector */
use App\Http\Controllers\Admin\Sector\SectorController;

/* HR */
use App\Http\Controllers\Admin\HR\JobApplicationController;

/* Settings */
use App\Http\Controllers\Admin\Settings\SiteSettingController;


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->name('admin.')
    ->group(function () {

        /*
        |--------------------------------------------------------------------------
        | ROOT REDIRECT
        |--------------------------------------------------------------------------
        */
        Route::get('/', function () {
            if (auth()->check()) {
                if (! auth()->user()->isAdmin()) {
                    return redirect()->route('home');
                }

                return redirect()->route('admin.dashboard');
            }
            return redirect()->route('admin.login');
        });

        /*
        |--------------------------------------------------------------------------
        | GUEST (LOGIN)
        |--------------------------------------------------------------------------
        */
        Route::middleware('guest')->group(function () {

            Route::get('/login', fn() => Inertia::render('Auth/Login'))
                ->name('login');

            Route::post('/login', [AuthenticatedSessionController::class, 'store'])
                ->name('login.store');
        });

        /*
        |--------------------------------------------------------------------------
        | AUTHENTICATED ADMIN
        |--------------------------------------------------------------------------
        */
        Route::middleware(['auth', 'verified', 'admin'])->group(function () {

            /*
            |--------------------------------------------------------------------------
            | DASHBOARD
            |--------------------------------------------------------------------------
            */
            Route::get('/dashboard', [DashboardController::class, 'index'])
                ->name('dashboard');

            Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
                ->name('logout');

            /*
            |--------------------------------------------------------------------------
            | PROFILE
            |--------------------------------------------------------------------------
            */
            Route::get('/profile', [ProfileController::class, 'edit'])
                ->name('profile.edit');

            Route::patch('/profile', [ProfileController::class, 'update'])
                ->name('profile.update');

            Route::delete('/profile', [ProfileController::class, 'destroy'])
                ->name('profile.destroy');

            /*
            |--------------------------------------------------------------------------
            | CMS
            |--------------------------------------------------------------------------
            */
            Route::get('/cms/home', [PageSectionController::class, 'editHome'])
                ->name('cms.home.edit');

            Route::put('/cms/home', [PageSectionController::class, 'updateHome'])
                ->name('cms.home.update');

            Route::get('/hero', [PageSectionController::class, 'hero'])
                ->name('hero.index');

            Route::get('/hero/create', [PageSectionController::class, 'createHero'])
                ->name('hero.create');

            Route::post('/hero', [PageSectionController::class, 'storeHero'])
                ->name('hero.store');

            Route::get('/hero/{section}/edit', [PageSectionController::class, 'editHero'])
                ->whereNumber('section')
                ->name('hero.edit');

            Route::put('/hero/{section}', [PageSectionController::class, 'updateHero'])
                ->whereNumber('section')
                ->name('hero.update');

            Route::delete('/hero/{section}', [PageSectionController::class, 'destroyHero'])
                ->whereNumber('section')
                ->name('hero.destroy');

            Route::get('/about', [PageSectionController::class, 'editAboutPage'])
                ->name('about.edit');

            Route::put('/about', [PageSectionController::class, 'updateAboutPage'])
                ->name('about.update');

            Route::get('/cms/calidad', [CalidadController::class, 'edit'])
                ->name('cms.calidad.edit');

            Route::put('/cms/calidad', [CalidadController::class, 'update'])
                ->name('cms.calidad.update');

            Route::get('/seo', [SeoController::class, 'index'])
                ->name('seo.index');

            Route::post('/metadatos', [SeoController::class, 'upsert'])
                ->name('seo.upsert');

            Route::resource('posts', PostController::class);
            Route::resource('certificates', CertificateController::class);
            Route::resource('downloads', DownloadController::class);
            Route::resource('videos', VideoController::class);

            /*
            |--------------------------------------------------------------------------
            | CATÁLOGO
            |--------------------------------------------------------------------------
            */
            Route::get('/products/featured', [ProductController::class, 'featured'])
                ->name('products.featured');

            Route::patch(
                '/products/{product}/toggle-featured',
                [ProductController::class, 'toggleFeatured']
            )
                ->name('products.toggleFeatured');

            Route::resource('products', ProductController::class)
                ->whereNumber('product');

            Route::resource('product-categories', ProductCategoryController::class);
            Route::resource('product-applications', ProductApplicationController::class);
            Route::resource('product-images', ProductImageController::class);
            Route::resource('product-specifications', ProductSpecificationController::class);

            /*
            |--------------------------------------------------------------------------
            | SECTORES
            |--------------------------------------------------------------------------
            */
            Route::resource('sectors', SectorController::class)
                ->except(['show']);

            /*
            |--------------------------------------------------------------------------
            | NEWSLETTER
            |--------------------------------------------------------------------------
            */
            Route::get('/newsletter', [AdminNewsletterController::class, 'index'])
                ->name('newsletter.index');

            Route::delete('/newsletter/{subscriber}', [AdminNewsletterController::class, 'destroy'])
                ->name('newsletter.destroy');

            Route::patch('/newsletter/{subscriber}/toggle', [AdminNewsletterController::class, 'toggle'])
                ->name('newsletter.toggle');

            Route::get('/newsletter/send', [AdminNewsletterController::class, 'create'])
                ->name('newsletter.create');

            Route::post('/newsletter/send', [AdminNewsletterController::class, 'send'])
                ->name('newsletter.send');

            Route::get('/newsletter/create', [AdminNewsletterController::class, 'create'])
                ->name('newsletter.create');

            Route::post('/newsletter', [AdminNewsletterController::class, 'store'])
                ->name('newsletter.store');


            /*
            |--------------------------------------------------------------------------
            | CLIENTES
            |--------------------------------------------------------------------------
            */
            Route::resource('clients', ClientController::class);

            /*
            |--------------------------------------------------------------------------
            | COMERCIAL
            |--------------------------------------------------------------------------
            */
            Route::prefix('comercial')
                ->name('comercial.')
                ->group(function () {

                    Route::get('/quotations', [QuotationController::class, 'index'])
                        ->name('quotations.index');

                    Route::get('/quotations/{quotation}', [QuotationController::class, 'show'])
                        ->name('quotations.show');

                    Route::delete('/quotations/{quotation}', [QuotationController::class, 'destroy'])
                        ->name('quotations.destroy');
                });

            /*
            |--------------------------------------------------------------------------
            | CONTACTO
            |--------------------------------------------------------------------------
            */
            Route::resource('contact-messages', ContactMessageController::class)
                ->only(['index', 'show', 'destroy']);

            Route::get('/contacto', [PageSectionController::class, 'editContacto'])
                ->name('contacto.edit');

            Route::put('/contacto', [PageSectionController::class, 'updateContacto'])
                ->name('contacto.update');

            /*
            |--------------------------------------------------------------------------
            | RRHH
            |--------------------------------------------------------------------------
            */
            Route::prefix('hr')
                ->name('hr.')
                ->group(function () {

                    Route::get('/applications', [JobApplicationController::class, 'index'])
                        ->name('applications.index');

                    Route::get('/applications/{jobApplication}', [JobApplicationController::class, 'show'])
                        ->name('applications.show');

                    Route::post(
                        '/applications/{jobApplication}/reviewed',
                        [JobApplicationController::class, 'markReviewed']
                    )
                        ->name('applications.markReviewed');

                    Route::post(
                        '/applications/{jobApplication}/contacted',
                        [JobApplicationController::class, 'markContacted']
                    )
                        ->name('applications.markContacted');

                    Route::get(
                        '/applications/{jobApplication}/download-cv',
                        [JobApplicationController::class, 'downloadCv']
                    )
                        ->name('applications.downloadCv');

                    Route::get(
                        '/applications/{jobApplication}/download-cover',
                        [JobApplicationController::class, 'downloadCoverLetter']
                    )
                        ->name('applications.downloadCoverLetter');

                    Route::delete(
                        '/applications/{jobApplication}',
                        [JobApplicationController::class, 'destroy']
                    )
                        ->name('applications.destroy');
                });

            /*
            |--------------------------------------------------------------------------
            | SETTINGS
            |--------------------------------------------------------------------------
            */
            Route::prefix('settings')
                ->name('settings.')
                ->group(function () {

                    Route::get('/footer', [SiteSettingController::class, 'editFooter'])
                        ->name('footer.edit');

                    Route::put('/footer', [SiteSettingController::class, 'updateFooter'])
                        ->name('footer.update');
                });

            /*
            |--------------------------------------------------------------------------
            | CMS GENERAL
            |--------------------------------------------------------------------------
            */
            Route::resource('pages', PageController::class);
            Route::resource('page-sections', PageSectionController::class);

            Route::prefix('hr')
                ->name('hr.')
                ->group(function () {

                    Route::get('/applications', [JobApplicationController::class, 'index'])
                        ->name('applications.index');

                    Route::get('/applications/{jobApplication}', [JobApplicationController::class, 'show'])
                        ->name('applications.show');

                    Route::resource('positions', JobPositionController::class);
                    Route::resource('sectors', JobSectorController::class);
                });
        });
    });
