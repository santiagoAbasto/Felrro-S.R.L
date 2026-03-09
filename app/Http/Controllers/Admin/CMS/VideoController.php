<?php

namespace App\Http\Controllers\Admin\CMS;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideoController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/CMS/Videos/Index', [
            'videos' => Video::orderByDesc('created_at')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/CMS/Videos/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title.es' => 'required|string|max:255',
            'title.en' => 'required|string|max:255',

            'file' => 'required|string|max:255',

            'format.es' => 'nullable|string|max:50',
            'format.en' => 'nullable|string|max:50',

            'weight.es' => 'nullable|string|max:50',
            'weight.en' => 'nullable|string|max:50',

            'duration' => 'nullable|string|max:50',
            'thumbnail' => 'nullable|string|max:255',
            'page_slug' => 'required|string|max:255',
            'is_active' => 'boolean'
        ]);

        Video::create([
            'title' => $validated['title'],
            'file' => $validated['file'],
            'format' => $validated['format'] ?? null,
            'weight' => $validated['weight'] ?? null,
            'duration' => $validated['duration'] ?? null,
            'thumbnail' => $validated['thumbnail'] ?? null,
            'page_slug' => $validated['page_slug'],
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()
            ->route('admin.videos.index')
            ->with('success', 'Video creado correctamente.');
    }

    public function edit(Video $video)
    {
        return Inertia::render('Admin/CMS/Videos/Edit', [
            'video' => $video
        ]);
    }

    public function update(Request $request, Video $video)
    {
        $validated = $request->validate([
            'title.es' => 'required|string|max:255',
            'title.en' => 'required|string|max:255',

            'file' => 'required|string|max:255',

            'format.es' => 'nullable|string|max:50',
            'format.en' => 'nullable|string|max:50',

            'weight.es' => 'nullable|string|max:50',
            'weight.en' => 'nullable|string|max:50',

            'duration' => 'nullable|string|max:50',
            'thumbnail' => 'nullable|string|max:255',
            'page_slug' => 'required|string|max:255',
            'is_active' => 'boolean'
        ]);

        $video->update([
            'title' => $validated['title'],
            'file' => $validated['file'],
            'format' => $validated['format'] ?? null,
            'weight' => $validated['weight'] ?? null,
            'duration' => $validated['duration'] ?? null,
            'thumbnail' => $validated['thumbnail'] ?? null,
            'page_slug' => $validated['page_slug'],
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()
            ->route('admin.videos.index')
            ->with('success', 'Video actualizado correctamente.');
    }

    public function destroy(Video $video)
    {
        $video->delete();

        return back()->with('success', 'Video eliminado correctamente.');
    }
}