<?php

namespace App\Http\Controllers\Admin\Client;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClientController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | INDEX
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        return Inertia::render('Admin/Clients/Index', [
            'clients' => Client::orderBy('order')
                ->orderByDesc('created_at')
                ->get()
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE
    |--------------------------------------------------------------------------
    */

    public function create()
    {
        return Inertia::render('Admin/Clients/Create');
    }

    /*
    |--------------------------------------------------------------------------
    | STORE
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name.es' => 'required|string|max:255',
            'name.en' => 'required|string|max:255',

            'logo' => 'required|image|max:5000',
            'website' => 'nullable|url|max:255',
            'order' => 'required|string|max:10',
            'is_active' => 'boolean'
        ]);

        DB::transaction(function () use ($request, $validated) {

            $logoPath = $request->file('logo')
                ->store('clients', 'public');

            Client::create([
                'name' => $validated['name'],
                'logo' => $logoPath,
                'website' => $validated['website'] ?? null,
                'order' => strtoupper($validated['order']),
                'is_active' => $request->boolean('is_active'),
            ]);
        });

        return redirect()
            ->route('admin.clients.index')
            ->with('success', 'Cliente creado correctamente.');
    }

    /*
    |--------------------------------------------------------------------------
    | EDIT
    |--------------------------------------------------------------------------
    */

    public function edit(Client $client)
    {
        return Inertia::render('Admin/Clients/Edit', [
            'client' => $client
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name.es' => 'required|string|max:255',
            'name.en' => 'required|string|max:255',

            'logo' => 'nullable|image|max:5000',
            'website' => 'nullable|url|max:255',
            'order' => 'required|string|max:10',
            'is_active' => 'boolean'
        ]);

        DB::transaction(function () use ($request, $validated, $client) {

            $data = [
                'name' => $validated['name'],
                'website' => $validated['website'] ?? null,
                'order' => strtoupper($validated['order']),
                'is_active' => $request->boolean('is_active'),
            ];

            if ($request->hasFile('logo')) {

                // eliminar logo anterior
                if ($client->logo && Storage::disk('public')->exists($client->logo)) {
                    Storage::disk('public')->delete($client->logo);
                }

                $data['logo'] = $request->file('logo')
                    ->store('clients', 'public');
            }

            $client->update($data);
        });

        return redirect()
            ->route('admin.clients.index')
            ->with('success', 'Cliente actualizado correctamente.');
    }

    /*
    |--------------------------------------------------------------------------
    | DESTROY
    |--------------------------------------------------------------------------
    */

    public function destroy(Client $client)
    {
        DB::transaction(function () use ($client) {

            if ($client->logo && Storage::disk('public')->exists($client->logo)) {
                Storage::disk('public')->delete($client->logo);
            }

            $client->delete();
        });

        return back()->with('success', 'Cliente eliminado correctamente.');
    }
}
