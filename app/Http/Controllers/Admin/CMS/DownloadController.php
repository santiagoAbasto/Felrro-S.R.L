<?php

namespace App\Http\Controllers\Admin\CMS;
use App\Http\Controllers\Controller;
use App\Models\Download;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DownloadController extends Controller
{
    /* =====================================================
       INDEX
    ===================================================== */
    public function index()
    {
        $downloads = Download::orderBy('order')
            ->orderBy('id')
            ->get();

        return Inertia::render('Admin/CMS/Downloads/Index', [
            'downloads' => $downloads
        ]);
    }

    /* =====================================================
       CREATE
    ===================================================== */
    public function create()
    {
        return Inertia::render('Admin/CMS/Downloads/Create');
    }

    /* =====================================================
       STORE
    ===================================================== */
    public function store(Request $request)
    {
        $request->validate([
            'name.es'   => 'required|string|max:255',
            'name.en'   => 'nullable|string|max:255',
            'file'      => 'required|file|max:20480',
            'order'     => 'nullable|string|max:10',
            'is_active' => 'boolean'
        ]);

        DB::transaction(function () use ($request) {

            $uploadedFile = $request->file('file');

            $filePath = $uploadedFile->store('downloads', 'public');

            Download::create([
                'name'      => $request->name,
                'format'    => strtoupper($uploadedFile->getClientOriginalExtension()),
                'weight'    => round($uploadedFile->getSize() / 1024) . ' KB',
                'file'      => $filePath,
                'order'     => $request->order,
                'is_active' => $request->boolean('is_active'),
            ]);
        });

        return redirect()->route('admin.downloads.index')
            ->with('success', 'Descarga creada correctamente.');
    }

    /* =====================================================
       EDIT
    ===================================================== */
    public function edit(Download $download)
    {
        return Inertia::render('Admin/CMS/Downloads/Edit', [
            'download' => $download
        ]);
    }

    /* =====================================================
       UPDATE
    ===================================================== */
    public function update(Request $request, Download $download)
    {
        $request->validate([
            'name.es'   => 'required|string|max:255',
            'name.en'   => 'nullable|string|max:255',
            'file'      => 'nullable|file|max:20480',
            'order'     => 'nullable|string|max:10',
            'is_active' => 'boolean'
        ]);

        DB::transaction(function () use ($request, $download) {

            $data = [
                'name'      => $request->name,
                'order'     => $request->order,
                'is_active' => $request->boolean('is_active'),
            ];

            if ($request->hasFile('file')) {

                if ($download->file && Storage::disk('public')->exists($download->file)) {
                    Storage::disk('public')->delete($download->file);
                }

                $uploadedFile = $request->file('file');

                $data['file']   = $uploadedFile->store('downloads', 'public');
                $data['format'] = strtoupper($uploadedFile->getClientOriginalExtension());
                $data['weight'] = round($uploadedFile->getSize() / 1024) . ' KB';
            }

            $download->update($data);
        });

        return redirect()->route('admin.downloads.index')
            ->with('success', 'Descarga actualizada correctamente.');
    }

    /* =====================================================
       DESTROY
    ===================================================== */
    public function destroy(Download $download)
    {
        DB::transaction(function () use ($download) {

            if ($download->file && Storage::disk('public')->exists($download->file)) {
                Storage::disk('public')->delete($download->file);
            }

            $download->delete();
        });

        return redirect()->route('admin.downloads.index')
            ->with('success', 'Descarga eliminada correctamente.');
    }
}
