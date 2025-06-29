<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordLinkMail extends Mailable
{
    use Queueable, SerializesModels;


    public $user;
    public $token;

    public function __construct($user, $token)
    {
        $this->user = $user;
        $this->token = $token;
    }

    public function build()
    {
        $link = url('/reset-password?token=' . $this->token . '&email=' . urlencode($this->user->email));

        return $this->subject('Yêu cầu đặt lại mật khẩu')
                    ->view('emails.reset-password-link')
                    ->with([
                        'user' => $this->user,
                        'link' => $link
                    ]);
    }
}
