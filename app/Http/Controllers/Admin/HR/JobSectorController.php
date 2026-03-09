<?php

namespace App\Http\Controllers\Admin\HR;

use App\Http\Controllers\Controller;
use App\Models\JobSector;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobSectorController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/HR/Sectors/Index', [
            'sectors' => JobSector::orderByDesc('created_at')->paginate(15),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/HR/Sectors/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name.es' => 'required|string|max:255',
            'name.en' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        JobSector::create($validated);

        return redirect()
            ->route('admin.hr.sectors.index')
            ->with('success', 'Sector creado correctamente.');
    }

    public function edit(JobSector $sector)
    {
        return Inertia::render('Admin/HR/Sectors/Edit', [
            'sector' => $sector,
        ]);
    }

    public function update(Request $request, JobSector $sector)
    {
        $validated = $request->validate([
            'name.es' => 'required|string|max:255',
            'name.en' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $sector->update($validated);

        return redirect()
            ->route('admin.hr.sectors.index')
            ->with('success', 'Sector actualizado.');
    }

    public function destroy(JobSector $sector)
    {
        $sector->delete();

        return back()->with('success', 'Sector eliminado.');
    }
}