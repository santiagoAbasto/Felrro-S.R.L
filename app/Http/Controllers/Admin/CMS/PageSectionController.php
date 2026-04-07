<?php

namespace App\Http\Controllers\Admin\CMS;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PageSectionController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | 1️⃣ CRUD GENERAL (SECCIONES NORMALES)
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $sections = PageSection::with('page')
            ->whereNotIn('type', ['hero'])
            ->orderBy('order')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Admin/CMS/Sections/Index', [
            'sections' => $sections
        ]);
    }

    public function edit(PageSection $pageSection)
    {
        $pageSection->load(['images' => fn($q) => $q->orderBy('order')]);

        return Inertia::render('Admin/CMS/Sections/Edit', [
            'section' => $pageSection,
            'pages' => Page::where('is_active', true)->orderBy('slug')->get()
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | 2️⃣ HERO GLOBAL
    |--------------------------------------------------------------------------
    */

    /*
|--------------------------------------------------------------------------
| HERO INDEX
|--------------------------------------------------------------------------
*/
    public function hero()
    {
        $sections = PageSection::where('type', 'hero')
            ->with('images')
            ->orderBy('order')
            ->get();

        return Inertia::render('Admin/CMS/Hero/Index', [
            'sections' => $sections
        ]);
    }

    public function editHero(PageSection $section)
    {
        abort_unless($section->type === 'hero', 403);

        $section->load(['images' => fn($q) => $q->orderBy('order')]);

        return Inertia::render('Admin/CMS/Hero/Edit', [
            'section' => $section
        ]);
    }

    public function createHero()
    {
        return Inertia::render('Admin/CMS/Hero/Create');
    }

    public function storeHero(Request $request)
    {
        $request->validate([
            'title.es'       => 'nullable|string|max:255',
            'title.en'       => 'nullable|string|max:255',
            'subtitle.es'    => 'nullable|string|max:255',
            'subtitle.en'    => 'nullable|string|max:255',
            'button_text.es' => 'nullable|string|max:255',
            'button_text.en' => 'nullable|string|max:255',
            'button_link'    => 'nullable|string|max:255',
            'is_active'      => 'boolean',
            'images.*'       => 'nullable|image|max:4096',
        ]);

        DB::transaction(function () use ($request) {

            $homePage = Page::where('slug', 'home')->firstOrFail();
            $maxOrder = PageSection::where('type', 'hero')->max('order') ?? 0;

            $section = PageSection::create([
                'page_id'     => $homePage->id,
                'type'        => 'hero',
                'title'       => $request->input('title', ['es' => '', 'en' => '']),
                'subtitle'    => $request->input('subtitle', ['es' => '', 'en' => '']),
                'content'     => ['es' => '', 'en' => ''],
                'button_text' => $request->input('button_text', ['es' => '', 'en' => '']),
                'button_link' => $request->input('button_link'),
                'order'       => $maxOrder + 1,
                'is_active'   => $request->boolean('is_active', true),
            ]);

            if ($request->hasFile('images')) {
                $order = 1;
                foreach ($request->file('images') as $file) {
                    if (!$file) continue;
                    $path = $file->store('page-sections/hero', 'public');
                    $section->images()->create([
                        'image'      => $path,
                        'order'      => $order++,
                        'media_type' => 'image',
                    ]);
                }
            }
        });

        return redirect()->route('admin.hero.index')
            ->with('success', 'Nuevo slider hero creado correctamente.');
    }

    public function destroyHero(PageSection $section)
    {
        abort_unless($section->type === 'hero', 403);

        DB::transaction(function () use ($section) {
            foreach ($section->images as $image) {
                if ($image->image) {
                    Storage::disk('public')->delete($image->image);
                }
                $image->delete();
            }
            $section->delete();
        });

        return redirect()->route('admin.hero.index')
            ->with('success', 'Slider eliminado correctamente.');
    }

    public function updateHero(Request $request, PageSection $section)
    {
        abort_unless($section->type === 'hero', 403);

        $request->validate([
            'title.es'                     => 'nullable|string|max:255',
            'title.en'                     => 'nullable|string|max:255',
            'subtitle.es'                  => 'nullable|string|max:255',
            'subtitle.en'                  => 'nullable|string|max:255',
            'content.es'                   => 'nullable|string',
            'content.en'                   => 'nullable|string',
            'button_text.es'               => 'nullable|string|max:255',
            'button_text.en'               => 'nullable|string|max:255',
            'button_link'                  => 'nullable|string|max:255',
            'images.*'                     => 'nullable|image|max:4096',
            'deleted_images'               => 'nullable|array',
            'deleted_images.*'             => 'integer|exists:page_section_images,id',
            // Per-slide content
            'slide_data'                   => 'nullable|array',
            'slide_data.*.id'              => 'nullable|integer|exists:page_section_images,id',
            'slide_data.*.title.es'        => 'nullable|string|max:255',
            'slide_data.*.title.en'        => 'nullable|string|max:255',
            'slide_data.*.subtitle.es'     => 'nullable|string|max:255',
            'slide_data.*.subtitle.en'     => 'nullable|string|max:255',
            'slide_data.*.button_text.es'  => 'nullable|string|max:255',
            'slide_data.*.button_text.en'  => 'nullable|string|max:255',
            'slide_data.*.button_link'     => 'nullable|string|max:255',
            'slide_data.*.media_type'      => 'nullable|in:image,video',
            'slide_data.*.video_url'       => 'nullable|string|max:500',
        ]);

        DB::transaction(function () use ($request, $section) {

            // Eliminar imágenes/slides
            if ($request->filled('deleted_images')) {
                foreach ($request->deleted_images as $imageId) {
                    $image = $section->images()->find($imageId);
                    if ($image) {
                        if ($image->image) {
                            Storage::disk('public')->delete($image->image);
                        }
                        $image->delete();
                    }
                }
            }

            // Subir nuevas imágenes
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {

                    if (!$file) continue;

                    $path = $file->store('page-sections/hero', 'public');
                    $maxOrder = $section->images()->max('order') ?? 0;

                    $section->images()->create([
                        'image'      => $path,
                        'order'      => $maxOrder + 1,
                        'media_type' => 'image',
                    ]);
                }
            }

            // Actualizar contenido por slide
            foreach ($request->input('slide_data', []) as $slideData) {
                $slideId = $slideData['id'] ?? null;
                if (!$slideId) continue;

                $slide = $section->images()->find($slideId);
                if (!$slide) continue;

                $slide->update([
                    'title'       => $slideData['title'] ?? null,
                    'subtitle'    => $slideData['subtitle'] ?? null,
                    'button_text' => $slideData['button_text'] ?? null,
                    'button_link' => $slideData['button_link'] ?? null,
                    'media_type'  => $slideData['media_type'] ?? 'image',
                    'video_url'   => !empty($slideData['video_url'])
                                     ? $this->normalizeVideoUrl($slideData['video_url'])
                                     : null,
                ]);
            }

            // Actualizar campos globales del hero
            $section->update([
                'title'       => $request->input('title', $section->title),
                'subtitle'    => $request->input('subtitle', $section->subtitle),
                'content'     => $request->input('content', $section->content),
                'button_text' => $request->input('button_text', $section->button_text),
                'button_link' => $request->input('button_link', $section->button_link),
            ]);
        });

        return back()->with('success', 'Hero actualizado correctamente.');
    }

    /*
    |--------------------------------------------------------------------------
    | 3️⃣ ABOUT – SLUG /nosotros
    |--------------------------------------------------------------------------
    */

    public function editAboutPage()
    {
        $page = Page::where('slug', 'nosotros')
            ->with(['sections' => fn($q) => $q->orderBy('order')])
            ->firstOrFail();

        return Inertia::render('Admin/CMS/About/Edit', [
            'page' => $page
        ]);
    }

    public function updateAboutPage(Request $request)
    {
        $validated = $request->validate([
            'main.id' => 'required|exists:page_sections,id',
            'main.title.es' => 'nullable|string|max:255',
            'main.title.en' => 'nullable|string|max:255',
            'main.content.es' => 'nullable|string',
            'main.content.en' => 'nullable|string',
            'main.image' => 'nullable|image|max:5120',

            'metrics.id' => 'nullable|exists:page_sections,id',
            'metrics.items' => 'nullable|array',

            'values.id' => 'nullable|exists:page_sections,id',
            'values.mission.es' => 'nullable|string',
            'values.mission.en' => 'nullable|string',
            'values.vision.es' => 'nullable|string',
            'values.vision.en' => 'nullable|string',
            'values.values.es' => 'nullable|string',
            'values.values.en' => 'nullable|string',

            'video.id' => 'nullable|exists:page_sections,id',
            'video.title.es' => 'nullable|string|max:255',
            'video.title.en' => 'nullable|string|max:255',
            'video.url' => 'nullable|string|max:1000',
            'video.video_file' => 'nullable|file|mimes:mp4,mov,avi,webm|max:51200',
        ]);

        DB::transaction(function () use ($request, $validated) {

            /*
        |--------------------------------------------------------------------------
        | MAIN
        |--------------------------------------------------------------------------
        */

            $main = PageSection::findOrFail($validated['main']['id']);

            if ($request->hasFile('main.image')) {

                if ($main->image && Storage::disk('public')->exists($main->image)) {
                    Storage::disk('public')->delete($main->image);
                }

                $main->image = $request->file('main.image')
                    ->store('pages/about', 'public');
            }

            $main->update([
                'title' => $validated['main']['title'] ?? $main->title,
                'content' => $validated['main']['content'] ?? $main->content,
            ]);

            /*
        |--------------------------------------------------------------------------
        | METRICS
        |--------------------------------------------------------------------------
        */

            if (!empty($validated['metrics']['id'])) {

                $metrics = PageSection::findOrFail($validated['metrics']['id']);

                $metrics->update([
                    'content' => [
                        'items' => $validated['metrics']['items'] ?? []
                    ]
                ]);
            }

            /*
        |--------------------------------------------------------------------------
        | VALUES
        |--------------------------------------------------------------------------
        */

            if (!empty($validated['values']['id'])) {

                $values = PageSection::findOrFail($validated['values']['id']);

                $values->update([
                    'content' => [
                        'mission' => $validated['values']['mission'] ?? ['es' => null, 'en' => null],
                        'vision'  => $validated['values']['vision'] ?? ['es' => null, 'en' => null],
                        'values'  => $validated['values']['values'] ?? ['es' => null, 'en' => null],
                    ]
                ]);
            }

            /*
        |--------------------------------------------------------------------------
        | VIDEO
        |--------------------------------------------------------------------------
        */

            if (!empty($validated['video']['id'])) {

                $videoSection = PageSection::findOrFail($validated['video']['id']);
                $videoContent = $videoSection->content ?? [];

                // VIDEO LOCAL
                if ($request->hasFile('video.video_file')) {

                    if (
                        !empty($videoContent['video_path']) &&
                        Storage::disk('public')->exists($videoContent['video_path'])
                    ) {
                        Storage::disk('public')->delete($videoContent['video_path']);
                    }

                    $videoContent['video_path'] = $request->file('video.video_file')
                        ->store('pages/about/videos', 'public');

                    $videoContent['url'] = null;
                    $videoContent['type'] = 'file';
                }

                // URL YOUTUBE
                if (!empty($validated['video']['url'])) {

                    if (
                        !empty($videoContent['video_path']) &&
                        Storage::disk('public')->exists($videoContent['video_path'])
                    ) {
                        Storage::disk('public')->delete($videoContent['video_path']);
                    }

                    $videoContent['video_path'] = null;
                    $videoContent['url'] = $this->normalizeVideoUrl($validated['video']['url']);
                    $videoContent['type'] = 'embed';
                }

                $videoContent['title'] = $validated['video']['title'] ?? ['es' => null, 'en' => null];

                $videoSection->update([
                    'content' => $videoContent
                ]);
            }
        });

        return back()->with('success', 'Página Nosotros actualizada correctamente.');
    }

    /*
    |--------------------------------------------------------------------------
    | 4️⃣ HOME – SLUG home
    |--------------------------------------------------------------------------
    */

    public function editHome()
    {
        $page = Page::where('slug', 'home')
            ->with(['sections' => function ($query) {
                $query->where('type', 'about_preview')
                    ->orderBy('order');
            }])
            ->firstOrFail();

        $aboutPreview = $page->sections->first();

        return Inertia::render('Admin/CMS/Home/Edit', [
            'section' => $aboutPreview
        ]);
    }

    public function updateHome(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:page_sections,id',

            'title.es' => 'nullable|string|max:255',
            'title.en' => 'nullable|string|max:255',

            'subtitle.es' => 'nullable|string|max:255',
            'subtitle.en' => 'nullable|string|max:255',

            'content.es' => 'nullable|string',
            'content.en' => 'nullable|string',

            'button_text.es' => 'nullable|string|max:255',
            'button_text.en' => 'nullable|string|max:255',

            'button_link' => 'nullable|string|max:255',

            'image' => 'nullable|image|max:5120',
        ]);

        $section = PageSection::where('id', $validated['id'])
            ->where('type', 'about_preview')
            ->whereHas('page', function ($q) {
                $q->where('slug', 'home');
            })
            ->firstOrFail();

        DB::transaction(function () use ($request, $section, $validated) {

            /*
        |--------------------------------------------------------------------------
        | IMAGEN
        |--------------------------------------------------------------------------
        */

            if ($request->hasFile('image')) {

                if ($section->image && Storage::disk('public')->exists($section->image)) {
                    Storage::disk('public')->delete($section->image);
                }

                $section->image = $request->file('image')
                    ->store('pages/home/about', 'public');
            }

            /*
        |--------------------------------------------------------------------------
        | UPDATE CAMPOS
        |--------------------------------------------------------------------------
        */

            $section->update([
                'title' => $validated['title'] ?? $section->title,
                'subtitle' => $validated['subtitle'] ?? $section->subtitle,
                'content' => $validated['content'] ?? $section->content,
                'button_text' => $validated['button_text'] ?? $section->button_text,
                'button_link' => $validated['button_link'] ?? $section->button_link,
            ]);
        });

        return back()->with('success', 'Sección Nosotros (Home) actualizada correctamente.');
    }

    /*
    |--------------------------------------------------------------------------
    | NORMALIZADOR YOUTUBE / VIMEO
    |--------------------------------------------------------------------------
    */

    private function normalizeVideoUrl($url)
    {
        if (!$url) return null;

        if (preg_match('/youtu\.be\/([^\?]+)/', $url, $matches)) {
            return 'https://www.youtube.com/embed/' . $matches[1];
        }

        if (preg_match('/v=([^&]+)/', $url, $matches)) {
            return 'https://www.youtube.com/embed/' . $matches[1];
        }

        if (str_contains($url, '/embed/')) {
            return $url;
        }

        if (preg_match('/vimeo\.com\/(\d+)/', $url, $matches)) {
            return 'https://player.vimeo.com/video/' . $matches[1];
        }

        return $url;
    }

    public function editContacto()
    {
        $page = \App\Models\Page::where('slug', 'contacto')
            ->with('sections')
            ->firstOrFail();

        return \Inertia\Inertia::render('Admin/CMS/Contacto/Edit', [
            'page' => $page
        ]);
    }


    public function updateContacto(Request $request)
    {
        /*
    |--------------------------------------------------------------------------
    | VALIDACIÓN
    |--------------------------------------------------------------------------
    */

        $validated = $request->validate([
            // Banner
            'banner.title.es'      => 'required|string|max:255',
            'banner.title.en'      => 'required|string|max:255',
            'banner.subtitle.es'   => 'nullable|string',
            'banner.subtitle.en'   => 'nullable|string',
            'banner.is_active'     => 'nullable|boolean',

            // Info
            'info.address.es'      => 'required|string',
            'info.address.en'      => 'required|string',
            'info.phone'           => 'required|string|max:255',
            'info.email'           => 'required|email|max:255',
            'info.schedule.es'     => 'nullable|string',
            'info.schedule.en'     => 'nullable|string',
            'info.is_active'       => 'nullable|boolean',

            // Map - Only allow Google Maps or Mapbox iframe embeds
            'map.iframe'           => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    // Only allow Google Maps and Mapbox embed iframes
                    if (!preg_match('/<iframe[^>]+(src=["\'](https:\/\/(www\.)?google\.com\/maps|https:\/\/api\.mapbox\.com|https:\/\/embed\.maps\.arcgis\.com)[^"\']*["\'][^>]*>.*?<\/iframe>/is', $value)) {
                        // If not a full iframe, try to validate just the src attribute
                        if (!preg_match('/(https:\/\/(www\.)?google\.com\/maps|https:\/\/api\.mapbox\.com|https:\/\/embed\.maps\.arcgis\.com)/i', $value)) {
                            $fail('El iframe debe ser de Google Maps, Mapbox o ArcGIS.');
                        }
                    }
                    // Additional security: strip any script tags or event handlers
                    if (preg_match('/<script|on\w+\s*=/i', $value)) {
                        $fail('El iframe no puede contener scripts o manejadores de eventos.');
                    }
                },
            ],
            'map.is_active'        => 'nullable|boolean',
        ]);

        /*
    |--------------------------------------------------------------------------
    | TRANSACCIÓN SEGURA
    |--------------------------------------------------------------------------
    */

        DB::transaction(function () use ($validated) {

            $page = Page::where('slug', 'contacto')->firstOrFail();

            $banner = $page->sections()->where('type', 'contact_banner')->first();
            $info   = $page->sections()->where('type', 'contact_info')->first();
            $map    = $page->sections()->where('type', 'contact_map')->first();

            /*
        |--------------------------------------------------------------------------
        | UPDATE BANNER
        |--------------------------------------------------------------------------
        */

            if ($banner) {
                $banner->update([
                    'title'     => $validated['banner']['title'],
                    'subtitle'  => $validated['banner']['subtitle'] ?? ['es' => null, 'en' => null],
                    'is_active' => $validated['banner']['is_active'] ?? true,
                ]);
            }

            /*
        |--------------------------------------------------------------------------
        | UPDATE INFO
        |--------------------------------------------------------------------------
        */

            if ($info) {
                $info->update([
                    'content' => [
                        'address'  => $validated['info']['address'],
                        'phone'    => $validated['info']['phone'],
                        'email'    => $validated['info']['email'],
                        'schedule' => $validated['info']['schedule'] ?? ['es' => null, 'en' => null],
                    ],
                    'is_active' => $validated['info']['is_active'] ?? true,
                ]);
            }

            /*
        |--------------------------------------------------------------------------
        | UPDATE MAP
        |--------------------------------------------------------------------------
        */

            if ($map) {
                $map->update([
                    'content' => [
                        'iframe' => $validated['map']['iframe'],
                    ],
                    'is_active' => $validated['map']['is_active'] ?? true,
                ]);
            }
        });

        return back()->with('success', 'Contacto actualizado correctamente.');
    }
}
