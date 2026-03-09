<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewsletterMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subjectText;
    public $contentText;

    public function __construct($subjectText, $contentText)
    {
        $this->subjectText = $subjectText;
        $this->contentText = $contentText;
    }

    public function build()
    {
        return $this->subject($this->subjectText)
                    ->view('emails.newsletter');
    }
}