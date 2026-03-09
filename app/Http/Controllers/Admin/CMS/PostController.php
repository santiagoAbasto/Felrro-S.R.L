<?php

namespace App\Http\Controllers\Admin\CMS;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    /* =====================================================
       INDEX
    ===================================================== */
    public function index()
    {
        $posts = Post::query()
            ->orderBy('order')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Admin/CMS/Posts/Index', [
            'posts' => $posts
        ]);
    }

    /* =====================================================
       CREATE
    ===================================================== */
    public function create()
    {
        return Inertia::render('Admin/CMS/Posts/Create');
    }

    /* =====================================================
       STORE
    ===================================================== */
    public function store(Request $request)
    {
        $validated = $request->validate([

            'category.es' => 'required|string|max:255',
            'category.en' => 'required|string|max:255',

            'title.es' => 'required|string|max:255',
            'title.en' => 'required|string|max:255',

            'excerpt.es' => 'nullable|string|max:500',
            'excerpt.en' => 'nullable|string|max:500',

            'content.es' => 'required|string',
            'content.en' => 'required|string',

            'image' => 'nullable|image|max:5120',

            'order' => 'nullable|string|max:10',

            'is_featured' => 'boolean',
            'is_active' => 'boolean',

            'published_at' => 'nullable|date'
        ]);

        DB::transaction(function () use ($request, $validated) {

            $slug = $this->generateUniqueSlug($validated['title']['es']);

            $imagePath = null;

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')
                    ->store('posts', 'public');
            }

            Post::create([
                'category' => $validated['category'],
                'title' => $validated['title'],
                'excerpt' => $validated['excerpt'] ?? null,
                'content' => $validated['content'],
                'slug' => $slug,
                'image' => $imagePath,
                'order' => isset($validated['order'])
                    ? strtoupper($validated['order'])
                    : null,
                'is_featured' => $request->boolean('is_featured'),
                'is_active' => $request->boolean('is_active'),
                'published_at' => $validated['published_at'] ?? null,
            ]);
        });

        return redirect()
            ->route('admin.posts.index')
            ->with('success', 'Novedad creada correctamente.');
    }

    /* =====================================================
       EDIT
    ===================================================== */
    public function edit(Post $post)
    {
        return Inertia::render('Admin/CMS/Posts/Edit', [
            'post' => $post
        ]);
    }

    /* =====================================================
       UPDATE
    ===================================================== */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([

            'category.es' => 'required|string|max:255',
            'category.en' => 'required|string|max:255',

            'title.es' => 'required|string|max:255',
            'title.en' => 'required|string|max:255',

            'excerpt.es' => 'nullable|string|max:500',
            'excerpt.en' => 'nullable|string|max:500',

            'content.es' => 'required|string',
            'content.en' => 'required|string',

            'image' => 'nullable|image|max:5120',

            'order' => 'nullable|string|max:10',

            'is_featured' => 'boolean',
            'is_active' => 'boolean',

            'published_at' => 'nullable|date'
        ]);

        DB::transaction(function () use ($request, $post, $validated) {

            $data = [
                'category' => $validated['category'],
                'title' => $validated['title'],
                'excerpt' => $validated['excerpt'] ?? null,
                'content' => $validated['content'],
                'order' => isset($validated['order'])
                    ? strtoupper($validated['order'])
                    : null,
                'is_featured' => $request->boolean('is_featured'),
                'is_active' => $request->boolean('is_active'),
                'published_at' => $validated['published_at'] ?? null,
            ];

            // 🔥 Regenerar slug solo si cambia el título ES
            if (
                isset($post->title['es']) &&
                $post->title['es'] !== $validated['title']['es']
            ) {
                $data['slug'] = $this->generateUniqueSlug(
                    $validated['title']['es'],
                    $post->id
                );
            }

            // 🔥 Reemplazar imagen
            if ($request->hasFile('image')) {

                if (
                    $post->image &&
                    Storage::disk('public')->exists($post->image)
                ) {
                    Storage::disk('public')->delete($post->image);
                }

                $data['image'] = $request->file('image')
                    ->store('posts', 'public');
            }

            $post->update($data);
        });

        return redirect()
            ->route('admin.posts.index')
            ->with('success', 'Novedad actualizada correctamente.');
    }

    /* =====================================================
       DESTROY
    ===================================================== */
    public function destroy(Post $post)
    {
        DB::transaction(function () use ($post) {

            if (
                $post->image &&
                Storage::disk('public')->exists($post->image)
            ) {
                Storage::disk('public')->delete($post->image);
            }

            $post->delete();
        });

        return back()->with('success', 'Novedad eliminada correctamente.');
    }

    /* =====================================================
       SLUG GENERATOR ENTERPRISE
    ===================================================== */
    private function generateUniqueSlug(string $title, $ignoreId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while (
            Post::where('slug', $slug)
                ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $originalSlug . '-' . $count++;
        }

        return $slug;
    }
}