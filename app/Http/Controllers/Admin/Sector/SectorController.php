<?php

namespace App\Http\Controllers\Admin\Sector;

use App\Http\Controllers\Controller;
use App\Models\Sector;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SectorController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Sector/Index', [
            'sectors' => Sector::orderBy('order')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Sector/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name.es' => 'required|string|max:255',
            'name.en' => 'required|string|max:255',

            'description.es' => 'nullable|string',
            'description.en' => 'nullable|string',

            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',

            'is_active' => 'boolean',
        ]);

        DB::transaction(function () use ($request, $validated) {

            $slug = $this->generateUniqueSlug($validated['name']['es']);

            $sector = new Sector();

            $sector->name = $validated['name'];
            $sector->slug = $slug;
            $sector->description = $validated['description'] ?? null;
            $sector->order = Sector::nextOrder();
            $sector->is_active = $request->boolean('is_active');

            if ($request->hasFile('image')) {
                $path = $request->file('image')
                    ->store('sectors', 'public');

                $sector->image = $path;
            }

            $sector->save();
        });

        return redirect()
            ->route('admin.sectors.index')
            ->with('success', 'Sector creado correctamente.');
    }

    public function edit(Sector $sector)
    {
        return Inertia::render('Admin/Sector/Edit', [
            'sector' => $sector
        ]);
    }

    public function update(Request $request, Sector $sector)
    {
        $validated = $request->validate([
            'name.es' => 'required|string|max:255',
            'name.en' => 'required|string|max:255',
            'description.es' => 'nullable|string',
            'description.en' => 'nullable|string',
            'order' => 'required|string|max:10',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'is_active' => 'boolean',
        ]);

        DB::transaction(function () use ($request, $sector, $validated) {

            // 🔥 Slug si cambia nombre
            if ($sector->name['es'] !== $validated['name']['es']) {
                $sector->slug = $this->generateUniqueSlug($validated['name']['es']);
            }

            // 🔥 Imagen solo si viene nueva
            if ($request->hasFile('image')) {

                if ($sector->image && Storage::disk('public')->exists($sector->image)) {
                    Storage::disk('public')->delete($sector->image);
                }

                $validated['image'] = $request->file('image')
                    ->store('sectors', 'public');
            } else {
                unset($validated['image']);
            }

            $sector->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'order' => strtoupper($validated['order']),
                'image' => $validated['image'] ?? $sector->image,
                'is_active' => $request->boolean('is_active'),
            ]);
        });

        return redirect()
            ->route('admin.sectors.index')
            ->with('success', 'Sector actualizado correctamente.');
    }

    public function destroy(Sector $sector)
    {
        DB::transaction(function () use ($sector) {

            if ($sector->image && Storage::disk('public')->exists($sector->image)) {
                Storage::disk('public')->delete($sector->image);
            }

            $sector->delete();
        });

        return back()->with('success', 'Sector eliminado correctamente.');
    }

    private function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        while (Sector::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        return $slug;
    }
}
