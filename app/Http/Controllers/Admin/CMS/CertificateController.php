<?php

namespace App\Http\Controllers\Admin\CMS;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CertificateController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | INDEX
    |--------------------------------------------------------------------------
    */
    public function index()
    {
        return Inertia::render('Admin/CMS/Certificates/Index', [
            'certificates' => Certificate::orderBy('order')->get()
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE
    |--------------------------------------------------------------------------
    */
    public function create()
    {
        return Inertia::render('Admin/CMS/Certificates/Create');
    }

    /*
    |--------------------------------------------------------------------------
    | STORE
    |--------------------------------------------------------------------------
    */
    public function store(Request $request)
    {
        $request->validate([
            'name.es' => 'required|string|max:255',
            'name.en' => 'required|string|max:255',

            'order' => 'required|string|max:10',

            'file' => 'required|file|max:15360',
            'image_logo' => 'nullable|image|max:15360',

            'format' => 'nullable|string|max:50',
            'weight' => 'nullable|string|max:50',
        ], [
            'file.max' => 'El archivo no puede superar los 15MB.',
            'image_logo.max' => 'La imagen no puede superar los 15MB.',
        ]);

        DB::transaction(function () use ($request) {

            $data = [
                'name' => $request->name,
                'order' => strtoupper($request->order),
                'format' => $request->format,
                'weight' => $request->weight,
                'is_active' => $request->boolean('is_active'),
            ];

            $data['file'] = $request->file('file')
                ->store('certificates/files', 'public');

            if ($request->hasFile('image_logo')) {
                $data['image_logo'] = $request->file('image_logo')
                    ->store('certificates/logos', 'public');
            }

            Certificate::create($data);
        });

        return redirect()
            ->route('admin.certificates.index')
            ->with('success', 'Certificado creado correctamente.');
    }

    /*
    |--------------------------------------------------------------------------
    | EDIT
    |--------------------------------------------------------------------------
    */
    public function edit(Certificate $certificate)
    {
        return Inertia::render('Admin/CMS/Certificates/Edit', [
            'certificate' => $certificate
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */
    public function update(Request $request, Certificate $certificate)
    {
        $request->validate([
            'name.es' => 'required|string|max:255',
            'name.en' => 'required|string|max:255',

            'order' => 'required|string|max:10',

            'file' => 'nullable|file|max:15360',
            'image_logo' => 'nullable|image|max:15360',

            'format' => 'nullable|string|max:50',
            'weight' => 'nullable|string|max:50',
        ]);

        DB::transaction(function () use ($request, $certificate) {

            $data = [
                'name' => $request->name,
                'order' => strtoupper($request->order),
                'format' => $request->format,
                'weight' => $request->weight,
                'is_active' => $request->boolean('is_active'),
            ];

            if ($request->hasFile('file')) {

                if ($certificate->file) {
                    Storage::disk('public')->delete($certificate->file);
                }

                $data['file'] = $request->file('file')
                    ->store('certificates/files', 'public');
            }

            if ($request->hasFile('image_logo')) {

                if ($certificate->image_logo) {
                    Storage::disk('public')->delete($certificate->image_logo);
                }

                $data['image_logo'] = $request->file('image_logo')
                    ->store('certificates/logos', 'public');
            }

            $certificate->update($data);
        });

        return redirect()
            ->route('admin.certificates.index')
            ->with('success', 'Certificado actualizado correctamente.');
    }

    /*
    |--------------------------------------------------------------------------
    | DESTROY
    |--------------------------------------------------------------------------
    */
    public function destroy(Certificate $certificate)
    {
        if ($certificate->file) {
            Storage::disk('public')->delete($certificate->file);
        }

        if ($certificate->image_logo) {
            Storage::disk('public')->delete($certificate->image_logo);
        }

        $certificate->delete();

        return redirect()
            ->route('admin.certificates.index')
            ->with('success', 'Certificado eliminado correctamente.');
    }
}
