<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255'
        ]);

        NewsletterSubscriber::updateOrCreate(
            ['email' => $request->email],
            [
                'is_active' => true,
                'subscribed_at' => now()
            ]
        );

        if ($request->expectsJson()) {
            return response()->json(['success' => true]);
        }

        return back()->with('newsletter_success', true);
    }
}