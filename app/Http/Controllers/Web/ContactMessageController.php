<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactMessageController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'   => 'required|string|max:255',
            'email'    => 'required|email|max:255',
            'telefono' => 'required|string|max:255',
            'empresa'  => 'nullable|string|max:255',
            'mensaje'  => 'required|string|max:2000',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Guardar en base de datos
        |--------------------------------------------------------------------------
        */

        $contact = ContactMessage::create($validated);

        /*
        |--------------------------------------------------------------------------
        | Enviar correo (Mailtrap)
        |--------------------------------------------------------------------------
        */

        Mail::raw(
            "Nuevo mensaje de contacto\n\n" .
                "Nombre: {$contact->nombre}\n" .
                "Email: {$contact->email}\n" .
                "Teléfono: {$contact->telefono}\n" .
                "Empresa: {$contact->empresa}\n\n" .
                "Mensaje:\n{$contact->mensaje}",
            function ($mail) {
                $mail->to(config('mail.from.address'))
                    ->subject('Nuevo mensaje desde formulario de contacto');
            }
        );

        return back()->with('success', 'Mensaje enviado correctamente.');
    }
}
