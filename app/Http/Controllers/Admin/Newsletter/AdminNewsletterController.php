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
        $subscriber->update([
            'is_active' => !$subscriber->is_active
        ]);

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

        $emails = NewsletterSubscriber::active()->pluck('email');

        foreach ($emails as $email) {
            Mail::to($email)->send(
                new NewsletterMail($request->subject, $request->message)
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

        $emails = NewsletterSubscriber::active()->pluck('email');

        foreach ($emails as $email) {
            Mail::to($email)->send(
                new NewsletterMail($request->subject, $request->message)
            );
        }

        return redirect()
            ->route('admin.comercial.newsletter.index')
            ->with('success', 'Newsletter enviado correctamente');
    }
}
