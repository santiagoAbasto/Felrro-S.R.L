<?php

namespace App\Http\Controllers\Admin\Newsletter;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use App\Mail\NewsletterMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;


class AdminNewsletterController extends Controller
{
    public function index(Request $request)
    {
        $query = NewsletterSubscriber::query();

        if ($request->search) {
            $query->where('email', 'like', "%{$request->search}%")
                ->orWhere('id', $request->search);
        }

        return inertia('Admin/Newsletter/Index', [
            'subscribers' => $query->latest()->paginate(10),
            'filters' => $request->only('search'),
            'activeCount' => NewsletterSubscriber::active()->count()
        ]);
    }
    public function toggle(NewsletterSubscriber $subscriber)
    {
        if ($subscriber->is_active) {
            $subscriber->update([
                'is_active' => false,
                'unsubscribed_at' => null,
            ]);
        } else {
            $subscriber->markSubscribed();
        }

        return back();
    }

    public function destroy(NewsletterSubscriber $subscriber)
    {
        $subscriber->delete();
        return back();
    }

    public function create()
    {
        return inertia('Admin/Newsletter/Create');
    }
    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        $subscribers = NewsletterSubscriber::active()->get();

        foreach ($subscribers as $subscriber) {
            $subscriber->ensureUnsubscribeToken();

            Mail::to($subscriber->email)->send(
                new NewsletterMail($request->subject, $request->message, $subscriber)
            );
        }

        return back()->with('success', 'Newsletter enviado correctamente 🚀');
    }

    public function send(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        $subscribers = NewsletterSubscriber::active()->get();

        foreach ($subscribers as $subscriber) {
            $subscriber->ensureUnsubscribeToken();

            Mail::to($subscriber->email)->send(
                new NewsletterMail($request->subject, $request->message, $subscriber)
            );
        }

        return redirect()
            ->route('admin.comercial.newsletter.index')
            ->with('success', 'Newsletter enviado correctamente');
    }
}
