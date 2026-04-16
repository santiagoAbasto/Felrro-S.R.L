<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoMeta;
use App\Support\SeoPageResolver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SeoController extends Controller
{
    public function index(): Response
    {
        $stored = Schema::hasTable((new SeoMeta())->getTable())
            ? SeoMeta::query()->get()->keyBy('page')
            : collect();

        $pages = collect(SeoPageResolver::pages())
            ->map(function (array $config, string $key) use ($stored): array {
                $meta = $stored->get($key);

                return [
                    'key' => $key,
                    'label' => $config['label'],
                    'recommended_title' => $config['recommended_title'],
                    'recommended_description' => $config['recommended_description'],
                    'recommended_keywords' => $config['recommended_keywords'],
                    'title' => $meta?->title,
                    'description' => $meta?->description,
                    'keywords' => $meta?->keywords,
                    'og_image_url' => $meta?->og_image_url,
                ];
            })
            ->values()
            ->all();

        return Inertia::render('Admin/Seo/Index', [
            'pages' => $pages,
        ]);
    }

    public function upsert(Request $request): RedirectResponse
    {
        abort_unless(Schema::hasTable((new SeoMeta())->getTable()), 503, 'La tabla de SEO todavía no existe. Ejecutá las migraciones antes de guardar metadatos.');

        $validated = $request->validate([
            'page' => ['required', 'string', 'max:100'],
            'title' => ['nullable', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:500'],
            'keywords' => ['nullable', 'string', 'max:500'],
            'og_image' => ['nullable', 'image', 'max:5120'],
            'remove_og_image' => ['nullable', 'boolean'],
        ]);

        abort_unless(array_key_exists($validated['page'], SeoPageResolver::pages()), 404);

        $meta = SeoMeta::query()->firstOrNew([
            'page' => $validated['page'],
        ]);

        $meta->title = $this->sanitize($validated['title'] ?? null);
        $meta->description = $this->sanitize($validated['description'] ?? null);
        $meta->keywords = $this->sanitize($validated['keywords'] ?? null);

        if ($request->boolean('remove_og_image') && $meta->og_image) {
            Storage::disk('public')->delete($meta->og_image);
            $meta->og_image = null;
        }

        if ($request->hasFile('og_image')) {
            if ($meta->og_image) {
                Storage::disk('public')->delete($meta->og_image);
            }

            $meta->og_image = $request->file('og_image')->store('seo', 'public');
        }

        $meta->save();

        return redirect()
            ->route('admin.seo.index')
            ->with('success', 'Metadatos actualizados correctamente.');
    }

    private function sanitize(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $clean = trim(Str::of(strip_tags($value))->squish()->value());

        return $clean !== '' ? $clean : null;
    }
}
