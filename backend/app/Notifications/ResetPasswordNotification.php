<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    public $token;
    public $email;

    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $resetUrl = url("/reset-password?token={$this->token}&email={$this->email}");

        return (new MailMessage)
            ->subject('Yêu cầu đặt lại mật khẩu')
            ->line('Bạn nhận được email này vì chúng tôi nhận được yêu cầu đặt lại mật khẩu từ tài khoản của bạn.')
            ->action('Đặt lại mật khẩu', $resetUrl)
            ->line('Nếu bạn không yêu cầu, vui lòng bỏ qua email này.');
    }
}

