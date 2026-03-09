<?php

namespace App\Http\Controllers\Admin\CMS;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CalidadController extends Controller
{
    public function edit()
    {
        $page = Page::where('slug', 'calidad')->firstOrFail();

        $section = PageSection::where('page_id', $page->id)
            ->where('type', 'calidad_main')
            ->firstOrFail();

        return inertia('Admin/CMS/Calidad/Edit', [
            'section' => $section
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'title.es' => 'required|string|max:255',
            'title.en' => 'nullable|string|max:255',
            'subtitle.es' => 'required|string',
            'subtitle.en' => 'nullable|string',
            'content.es' => 'required|string',
            'content.en' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'is_active' => 'boolean'
        ]);

        DB::transaction(function () use ($request) {

            $section = PageSection::where('type', 'calidad_main')->firstOrFail();

            $section->title = $request->title;
            $section->subtitle = $request->subtitle;
            $section->content = $request->content;
            $section->is_active = $request->boolean('is_active');

            if ($request->hasFile('image')) {

                if ($section->image && Storage::disk('public')->exists($section->image)) {
                    Storage::disk('public')->delete($section->image);
                }

                $path = $request->file('image')
                    ->store('pages/calidad', 'public');

                $section->image = $path;
            }

            $section->save();
        });

        return redirect()
            ->route('admin.cms.calidad.edit')
            ->with('success', 'Sección Calidad actualizada correctamente.');
    }
}
