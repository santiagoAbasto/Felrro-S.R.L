<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255'
        ]);

        $subscriber = NewsletterSubscriber::firstOrNew(
            ['email' => $request->email],
        );
        $subscriber->markSubscribed();

        try {
            Mail::mailer('failover')->raw(
                "Nueva suscripción a newsletter\n\n" .
                    "Email: {$request->email}\n" .
                    "Fecha: " . now()->format('Y-m-d H:i:s'),
                function ($mail) use ($request) {
                    $mail->to(config('mail.recipients.newsletter'))
                        ->replyTo($request->email)
                        ->subject('Nueva suscripción al newsletter');
                }
            );
        } catch (Throwable $exception) {
            Log::warning('No se pudo enviar la notificación de newsletter.', [
                'email' => $request->email,
                'error' => $exception->getMessage(),
            ]);
        }

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Te suscribiste correctamente.',
            ]);
        }

        return back()->with('newsletter_success', true);
    }

    public function unsubscribe(Request $request, string $token)
    {
        $subscriber = NewsletterSubscriber::query()
            ->where('unsubscribe_token', $token)
            ->firstOrFail();

        if ($subscriber->is_active) {
            $subscriber->markUnsubscribed();
        }

        if ($request->isMethod('post')) {
            return response()->noContent();
        }

        return redirect()
            ->route('home')
            ->with('newsletter_success_message', 'Tu suscripción fue dada de baja correctamente.');
    }
}
