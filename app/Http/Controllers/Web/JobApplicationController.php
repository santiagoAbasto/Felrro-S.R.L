<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class JobApplicationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'        => 'required|string|max:255',
            'last_name'         => 'required|string|max:255',
            'email'             => 'required|email|max:255',
            'phone'             => 'required|string|max:255',
            'document_type'     => 'required|string|max:255',
            'document_number'   => 'required|string|max:255',
            'genero'            => 'required|string|max:255',
            'nacionalidad'      => 'required|string|max:255',
            'country'           => 'required|string|max:255',
            'provincia'         => 'required|string|max:255',
            'localidad'         => 'required|string|max:255',
            'fecha_nacimiento'  => 'required|date',

            'job_position_id'   => 'required|exists:job_positions,id',
            'job_sector_id'     => 'required|exists:job_sectors,id',

            'cv_path'           => 'required|file|mimes:pdf,doc,docx|max:10240',
            'cover_letter_path' => 'required|file|mimes:pdf,doc,docx|max:10240',
        ], [
            'cv_path.required' => __('messages.upload_cv_required'),
            'cv_path.mimes' => __('messages.upload_allowed_files'),
            'cv_path.max' => __('messages.upload_max_size'),
            'cover_letter_path.required' => __('messages.upload_cover_letter_required'),
            'cover_letter_path.mimes' => __('messages.upload_allowed_files'),
            'cover_letter_path.max' => __('messages.upload_max_size'),
        ]);

        // Guardar CV en almacenamiento privado (no accesible vía URL pública)
        $validated['cv_path'] = $request
            ->file('cv_path')
            ->store('job-applications/cvs', 'private');

        // Guardar Carta en almacenamiento privado
        if ($request->hasFile('cover_letter_path')) {
            $validated['cover_letter_path'] = $request
                ->file('cover_letter_path')
                ->store('job-applications/letters', 'private');
        }

        JobApplication::create($validated);

        return back()->with('success', __('messages.application_sent_successfully'));
    }

    /**
     * Descargar CV de una aplicación (solo para admins autenticados)
     */
    public function downloadCv(JobApplication $application)
    {
        // Verificar que el usuario está autenticado y es admin
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            abort(403, 'No tienes permiso para descargar este archivo.');
        }

        if (!$application->cv_path || !Storage::disk('private')->exists($application->cv_path)) {
            abort(404, 'El archivo CV no existe.');
        }

        return Storage::disk('private')->download(
            $application->cv_path,
            "CV-{$application->first_name}-{$application->last_name}.pdf"
        );
    }

    /**
     * Descargar Carta de presentación (solo para admins autenticados)
     */
    public function downloadCoverLetter(JobApplication $application)
    {
        // Verificar que el usuario está autenticado y es admin
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            abort(403, 'No tienes permiso para descargar este archivo.');
        }

        if (!$application->cover_letter_path || !Storage::disk('private')->exists($application->cover_letter_path)) {
            abort(404, 'El archivo no existe.');
        }

        return Storage::disk('private')->download(
            $application->cover_letter_path,
            "CoverLetter-{$application->first_name}-{$application->last_name}.pdf"
        );
    }
}
