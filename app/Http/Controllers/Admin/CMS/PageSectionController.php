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

    public function update(Request $request, PageSection $pageSection)
    {
        $validated = $request->validate([
            'page_id' => ['required', 'exists:pages,id'],
            'type' => ['required', 'string', 'max:100'],
            'title' => ['nullable', 'array'],
            'title.es' => ['nullable', 'string', 'max:255'],
            'title.en' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'array'],
            'subtitle.es' => ['nullable', 'string', 'max:255'],
            'subtitle.en' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'array'],
            'content.es' => ['nullable', 'string'],
            'content.en' => ['nullable', 'string'],
            'button_text' => ['nullable', 'array'],
            'button_text.es' => ['nullable', 'string', 'max:255'],
            'button_text.en' => ['nullable', 'string', 'max:255'],
            'button_link' => ['nullable', 'string', 'max:255'],
            'order' => ['nullable', 'string', 'max:10'],
            'is_active' => ['nullable', 'boolean'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            if ($pageSection->image && Storage::disk('public')->exists($pageSection->image)) {
                Storage::disk('public')->delete($pageSection->image);
            }

            $validated['image'] = $request->file('image')->store('page-sections', 'public');
        }

        $validated['is_active'] = $request->boolean('is_active');

        $pageSection->update($validated);

        return redirect()
            ->route('admin.page-sections.index')
            ->with('success', 'Sección actualizada correctamente.');
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
            'slides'         => 'nullable|array',
            'slides.*.media_type' => 'required_with:slides|in:image,video',
            'slides.*.image'      => 'nullable|image|max:4096',
            'slides.*.video_file' => 'nullable|file|mimes:mp4,mov,webm|max:102400',
            'slides.*.video_url'  => 'nullable|string|max:500',
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

            $order = 1;

            if ($request->filled('slides')) {
                foreach ($request->input('slides', []) as $index => $slide) {
                    $mediaType = $slide['media_type'] ?? 'image';

                    if ($mediaType === 'video') {
                        $videoFile = $request->file("slides.$index.video_file");
                        $videoUrl = $slide['video_url'] ?? null;

                        if ($videoFile) {
                            $path = $videoFile->store('page-sections/hero/videos', 'public');
                            $section->images()->create([
                                'image'      => $path,
                                'order'      => $order++,
                                'media_type' => 'video',
                                'video_url'  => null,
                            ]);
                        } elseif (!empty($videoUrl)) {
                            $section->images()->create([
                                'image'      => '',
                                'order'      => $order++,
                                'media_type' => 'video',
                                'video_url'  => $this->normalizeVideoUrl($videoUrl),
                            ]);
                        }

                        continue;
                    }

                    $file = $request->file("slides.$index.image");
                    if (!$file) continue;
                    $path = $file->store('page-sections/hero', 'public');
                    $section->images()->create([
                        'image'      => $path,
                        'order'      => $order++,
                        'media_type' => 'image',
                    ]);
                }
            } elseif ($request->hasFile('images')) {
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
            'is_active'                    => 'boolean',
            'images.*'                     => 'nullable|image|max:4096',
            'video_files.*'                => 'nullable|file|mimes:mp4,mov,webm|max:102400',
            'video_urls.*'                 => 'nullable|string|max:500',
            'new_video_url'                => 'nullable|string|max:500',
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
            'slide_data.*.image_file'      => 'nullable|image|max:4096',
            'slide_data.*.video_file'      => 'nullable|file|mimes:mp4,mov,webm|max:102400',
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

            // Subir nuevos videos locales
            if ($request->hasFile('video_files')) {
                foreach ($request->file('video_files') as $file) {
                    if (!$file) continue;

                    $path = $file->store('page-sections/hero/videos', 'public');
                    $maxOrder = $section->images()->max('order') ?? 0;

                    $section->images()->create([
                        'image'      => $path,
                        'order'      => $maxOrder + 1,
                        'media_type' => 'video',
                        'video_url'  => null,
                    ]);
                }
            }

            // Crear nuevos videos embebidos
            $newVideoUrls = array_filter([
                ...$request->input('video_urls', []),
                $request->input('new_video_url'),
            ]);

            foreach ($newVideoUrls as $videoUrl) {
                if (!$videoUrl) continue;

                $maxOrder = $section->images()->max('order') ?? 0;

                $section->images()->create([
                    'image'      => '',
                    'order'      => $maxOrder + 1,
                    'media_type' => 'video',
                    'video_url'  => $this->normalizeVideoUrl($videoUrl),
                ]);
            }

            // Actualizar contenido por slide
            foreach ($request->input('slide_data', []) as $index => $slideData) {
                $slideId = $slideData['id'] ?? null;
                if (!$slideId) continue;

                $slide = $section->images()->find($slideId);
                if (!$slide) continue;

                $mediaType = $slideData['media_type'] ?? 'image';
                $imageFile = $request->file("slide_data.$index.image_file");
                $videoFile = $request->file("slide_data.$index.video_file");
                $storedMediaPath = $slide->image;

                if ($imageFile) {
                    if ($slide->image) {
                        Storage::disk('public')->delete($slide->image);
                    }

                    $storedMediaPath = $imageFile->store('page-sections/hero', 'public');
                    $mediaType = 'image';
                } elseif ($videoFile) {
                    if ($slide->image) {
                        Storage::disk('public')->delete($slide->image);
                    }

                    $storedMediaPath = $videoFile->store('page-sections/hero/videos', 'public');
                    $mediaType = 'video';
                }

                $slide->update([
                    'title'       => $slideData['title'] ?? null,
                    'subtitle'    => $slideData['subtitle'] ?? null,
                    'button_text' => $slideData['button_text'] ?? null,
                    'button_link' => $slideData['button_link'] ?? null,
                    'image'       => $storedMediaPath,
                    'media_type'  => $mediaType,
                    'video_url'   => $mediaType === 'video' && !empty($slideData['video_url'])
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
                'is_active'   => $request->boolean('is_active', $section->is_active),
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

        if (preg_match('/youtu\.be\/([^?&\/]+)/', $url, $matches)) {
            return 'https://www.youtube.com/embed/' . $matches[1];
        }

        if (preg_match('/youtube\.com\/shorts\/([^?&\/]+)/', $url, $matches)) {
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
        $normalizedEmails = collect($request->input('info.emails', []))
            ->map(fn ($email) => is_string($email) ? trim($email) : '')
            ->filter()
            ->values()
            ->all();

        $request->merge([
            'info' => array_merge($request->input('info', []), [
                'emails' => $normalizedEmails,
            ]),
        ]);

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
            'info.emails'          => 'required|array|min:1',
            'info.emails.*'        => 'required|email|max:255|distinct',
            'info.schedule.es'     => 'nullable|string',
            'info.schedule.en'     => 'nullable|string',
            'info.is_active'       => 'nullable|boolean',

            // Map - Only allow Google Maps or Mapbox iframe embeds
            'map.iframe'           => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    $allowedHosts = [
                        'www.google.com',
                        'google.com',
                        'www.google.com.ar',
                        'google.com.ar',
                        'maps.google.com',
                        'api.mapbox.com',
                        'embed.maps.arcgis.com',
                    ];

                    if (!preg_match('/<iframe\b[^>]*\bsrc=["\']([^"\']+)["\'][^>]*>.*?<\/iframe>/is', $value, $matches)) {
                        $fail('El mapa debe ser un iframe válido.');
                        return;
                    }

                    $src = $matches[1] ?? '';
                    $host = parse_url($src, PHP_URL_HOST);

                    if (!is_string($host) || !in_array(strtolower($host), $allowedHosts, true)) {
                        $fail('El iframe debe ser de Google Maps, Mapbox o ArcGIS.');
                    }

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
                        'email'    => $validated['info']['emails'][0],
                        'emails'   => $validated['info']['emails'],
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
