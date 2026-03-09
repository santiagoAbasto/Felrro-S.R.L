<?php

namespace App\Http\Controllers\Admin\CMS;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/CMS/Pages/Index', [
            'pages' => Page::orderByDesc('created_at')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/CMS/Pages/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title.es' => 'required|string|max:255',
            'title.en' => 'required|string|max:255',

            'meta_title.es' => 'nullable|string|max:255',
            'meta_title.en' => 'nullable|string|max:255',

            'meta_description.es' => 'nullable|string',
            'meta_description.en' => 'nullable|string',

            'is_active' => 'boolean'
        ]);

        /*
    |--------------------------------------------------------------------------
    | Generar slug base
    |--------------------------------------------------------------------------
    */

        $baseSlug = Str::slug($validated['title']['es']);

        /*
    |--------------------------------------------------------------------------
    | 🔒 No permitir crear otra home
    |--------------------------------------------------------------------------
    */

        if ($baseSlug === 'home' && Page::where('slug', 'home')->exists()) {
            return back()->withErrors([
                'title.es' => 'Ya existe la página principal.'
            ]);
        }

        /*
    |--------------------------------------------------------------------------
    | Generar slug único
    |--------------------------------------------------------------------------
    */

        $slug = $baseSlug;
        $counter = 1;

        while (Page::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        /*
    |--------------------------------------------------------------------------
    | Crear página
    |--------------------------------------------------------------------------
    */

        $page = Page::create([
            'title' => $validated['title'],
            'meta_title' => $validated['meta_title'] ?? null,
            'meta_description' => $validated['meta_description'] ?? null,
            'slug' => $slug,
            'is_active' => $request->boolean('is_active', false)
        ]);

        /*
    |--------------------------------------------------------------------------
    | Si se activa esta página, desactivar otras con mismo slug base
    |--------------------------------------------------------------------------
    */

        if ($page->is_active) {
            Page::where('slug', $slug)
                ->where('id', '!=', $page->id)
                ->update(['is_active' => false]);
        }

        return redirect()
            ->route('admin.pages.index')
            ->with('success', 'Página creada correctamente.');
    }

    public function edit(Page $page)
    {
        return Inertia::render('Admin/CMS/Pages/Edit', [
            'page' => $page
        ]);
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title.es' => 'required|string|max:255',
            'title.en' => 'required|string|max:255',

            'meta_title.es' => 'nullable|string|max:255',
            'meta_title.en' => 'nullable|string|max:255',

            'meta_description.es' => 'nullable|string',
            'meta_description.en' => 'nullable|string',

            'is_active' => 'boolean'
        ]);

        /*
    |--------------------------------------------------------------------------
    | 🔒 PROTECCIÓN ESPECIAL PARA HOME
    |--------------------------------------------------------------------------
    */
        if ($page->slug === 'home') {

            $page->update([
                'title' => $validated['title'],
                'meta_title' => $validated['meta_title'] ?? null,
                'meta_description' => $validated['meta_description'] ?? null,
                'slug' => 'home', // 🔥 Nunca cambia
                'is_active' => true // 🔥 Nunca se desactiva
            ]);

            return redirect()
                ->route('admin.pages.index')
                ->with('success', 'Página principal actualizada correctamente.');
        }

        /*
    |--------------------------------------------------------------------------
    | SLUG DINÁMICO PARA PÁGINAS NORMALES
    |--------------------------------------------------------------------------
    */

        $baseSlug = Str::slug($validated['title']['es']);
        $slug = $baseSlug;
        $counter = 1;

        while (
            Page::where('slug', $slug)
            ->where('id', '!=', $page->id)
            ->exists()
        ) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $page->update([
            'title' => $validated['title'],
            'meta_title' => $validated['meta_title'] ?? null,
            'meta_description' => $validated['meta_description'] ?? null,
            'slug' => $slug,
            'is_active' => $request->boolean('is_active')
        ]);

        return redirect()
            ->route('admin.pages.index')
            ->with('success', 'Página actualizada correctamente.');
    }

    public function destroy(Page $page)
    {
        if ($page->slug === 'home') {
            return back()->withErrors([
                'delete' => 'No se puede eliminar la página principal.'
            ]);
        }

        $page->delete();

        return back()->with('success', 'Página eliminada correctamente.');
    }
}
