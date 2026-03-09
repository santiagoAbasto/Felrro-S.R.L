<?php

namespace App\Http\Controllers\Admin\HR;

use App\Http\Controllers\Controller;
use App\Models\JobPosition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobPositionController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/HR/Jobs/Index', [
            'positions' => JobPosition::orderByDesc('created_at')->paginate(15),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/HR/Jobs/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title.es' => 'required|string|max:255',
            'title.en' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        JobPosition::create($validated);

        return redirect()
            ->route('admin.hr.positions.index')
            ->with('success', 'Puesto creado correctamente.');
    }

    public function edit(JobPosition $position)
    {
        return Inertia::render('Admin/HR/Jobs/Edit', [
            'position' => $position,
        ]);
    }

    public function update(Request $request, JobPosition $position)
    {
        $validated = $request->validate([
            'title.es' => 'required|string|max:255',
            'title.en' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $position->update($validated);

        return redirect()
            ->route('admin.hr.positions.index')
            ->with('success', 'Puesto actualizado.');
    }

    public function destroy(JobPosition $position)
    {
        $position->delete();

        return back()->with('success', 'Puesto eliminado.');
    }
}