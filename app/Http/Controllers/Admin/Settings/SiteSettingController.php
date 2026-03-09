<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SiteSettingController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | INDEX GENERAL (settings simples si los usas)
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        return Inertia::render('Admin/Settings/SiteSettings/Index', [
            'settings' => SiteSetting::all()->keyBy('key')
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | EDIT FOOTER (JSON estructurado)
    |--------------------------------------------------------------------------
    */

    public function editFooter()
    {
        return Inertia::render('Admin/Settings/Footer/Edit', [
            'footer' => SiteSetting::getRaw('footer')
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE FOOTER (JSON estructurado)
    |--------------------------------------------------------------------------
    */

    public function updateFooter(Request $request)
    {
        $validated = $request->validate([
            'sections_title.es' => 'required|string|max:255',
            'sections_title.en' => 'required|string|max:255',

            'newsletter_title.es' => 'required|string|max:255',
            'newsletter_title.en' => 'required|string|max:255',

            'contact_title.es' => 'required|string|max:255',
            'contact_title.en' => 'required|string|max:255',

            'address.es' => 'required|string|max:500',
            'address.en' => 'required|string|max:500',

            'map_url' => 'nullable|url|max:500',

            'phone' => 'required|string|max:50',
            'whatsapp' => 'required|string|max:50',
            'email' => 'required|email|max:255',

            'copyright.es' => 'required|string|max:255',
            'copyright.en' => 'required|string|max:255',
        ]);

        SiteSetting::updateOrCreate(
            ['key' => 'footer'],
            ['value' => $validated]
        );

        return redirect()
            ->route('admin.settings.footer.edit')
            ->with('success', 'Footer actualizado correctamente.');
    }
}