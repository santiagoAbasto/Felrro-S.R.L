<?php

namespace App\Mail;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Symfony\Component\Mime\Email;

class NewsletterMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subjectText;
    public $contentText;
    public $unsubscribeUrl;

    public function __construct($subjectText, $contentText, NewsletterSubscriber $subscriber)
    {
        $this->subjectText = $subjectText;
        $this->contentText = $contentText;
        $this->unsubscribeUrl = route('newsletter.unsubscribe', $subscriber->ensureUnsubscribeToken());
    }

    public function build()
    {
        return $this->subject($this->subjectText)
            ->view('emails.newsletter')
            ->withSymfonyMessage(function (Email $message) {
                $mailtoAddress = config('mail.recipients.newsletter');
                $mailtoUrl = sprintf(
                    'mailto:%s?subject=%s',
                    $mailtoAddress,
                    rawurlencode('Desuscribir newsletter')
                );

                $headers = $message->getHeaders();
                $headers->addTextHeader(
                    'List-Unsubscribe',
                    "<{$this->unsubscribeUrl}>, <{$mailtoUrl}>"
                );
                $headers->addTextHeader('List-Unsubscribe-Post', 'List-Unsubscribe=One-Click');
            });
    }
}
