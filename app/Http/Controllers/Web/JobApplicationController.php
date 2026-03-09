<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;

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

            'cv_path'           => 'required|file|mimes:pdf,doc,docx|max:5120',
            'cover_letter_path' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        // Guardar CV
        $validated['cv_path'] = $request
            ->file('cv_path')
            ->store('job-applications/cvs', 'public');

        // Guardar Carta
        if ($request->hasFile('cover_letter_path')) {
            $validated['cover_letter_path'] = $request
                ->file('cover_letter_path')
                ->store('job-applications/letters', 'public');
        }

        JobApplication::create($validated);

        return back()->with('success', __('messages.application_sent_successfully'));
    }
}
