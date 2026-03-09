<?php

namespace App\Http\Controllers\Admin\HR;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobSector;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class JobApplicationController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | INDEX
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        $query = JobApplication::with(['position', 'sector']);

        // Filtro estado revisado
        if ($request->has('reviewed') && $request->reviewed !== '') {
            $query->where('is_reviewed', (bool) $request->reviewed);
        }

        // Filtro sector
        if ($request->filled('sector_id')) {
            $query->where('job_sector_id', $request->sector_id);
        }

        $applications = $query
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/HR/Applications/Index', [
            'applications' => $applications,
            'filters' => $request->only(['reviewed', 'sector_id']),
            'sectors' => JobSector::where('is_active', true)->get(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | SHOW
    |--------------------------------------------------------------------------
    */

    public function show(JobApplication $jobApplication)
    {
        $jobApplication->load(['position', 'sector']);

        return Inertia::render('Admin/HR/Applications/Show', [
            'application' => $jobApplication,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | MARCAR REVISADO
    |--------------------------------------------------------------------------
    */

    public function markReviewed(JobApplication $jobApplication)
    {
        if (!$jobApplication->is_reviewed) {
            $jobApplication->update([
                'is_reviewed' => true,
            ]);
        }

        return back()->with('success', 'Postulación marcada como revisada.');
    }

    /*
    |--------------------------------------------------------------------------
    | MARCAR CONTACTADO
    |--------------------------------------------------------------------------
    */

    public function markContacted(JobApplication $jobApplication)
    {
        if (!$jobApplication->is_contacted) {
            $jobApplication->update([
                'is_contacted' => true,
            ]);
        }

        return back()->with('success', 'Postulante marcado como contactado.');
    }

    /*
    |--------------------------------------------------------------------------
    | DESCARGAR CV
    |--------------------------------------------------------------------------
    */

    public function downloadCv(JobApplication $jobApplication)
    {
        if (
            !$jobApplication->cv_path ||
            !Storage::disk('public')->exists($jobApplication->cv_path)
        ) {
            abort(404);
        }

        $extension = pathinfo($jobApplication->cv_path, PATHINFO_EXTENSION);

        return Storage::disk('public')->download(
            $jobApplication->cv_path,
            'CV-' . str_replace(' ', '-', $jobApplication->full_name) . '.' . $extension
        );
    }

    /*
    |--------------------------------------------------------------------------
    | DESCARGAR CARTA
    |--------------------------------------------------------------------------
    */

    public function downloadCoverLetter(JobApplication $jobApplication)
    {
        if (
            !$jobApplication->cover_letter_path ||
            !Storage::disk('public')->exists($jobApplication->cover_letter_path)
        ) {
            abort(404);
        }

        $extension = pathinfo($jobApplication->cover_letter_path, PATHINFO_EXTENSION);

        return Storage::disk('public')->download(
            $jobApplication->cover_letter_path,
            'Carta-' . str_replace(' ', '-', $jobApplication->full_name) . '.' . $extension
        );
    }

    /*
    |--------------------------------------------------------------------------
    | ELIMINAR
    |--------------------------------------------------------------------------
    */

    public function destroy(JobApplication $jobApplication)
    {
        // Eliminación física archivos
        if (
            $jobApplication->cv_path &&
            Storage::disk('public')->exists($jobApplication->cv_path)
        ) {
            Storage::disk('public')->delete($jobApplication->cv_path);
        }

        if (
            $jobApplication->cover_letter_path &&
            Storage::disk('public')->exists($jobApplication->cover_letter_path)
        ) {
            Storage::disk('public')->delete($jobApplication->cover_letter_path);
        }

        $jobApplication->delete();

        return back()->with('success', 'Postulación eliminada correctamente.');
    }
}