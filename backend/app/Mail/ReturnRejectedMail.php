<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue; // thêm dòng này

class ReturnRejectedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        return $this->subject('Thông báo từ chối yêu cầu trả hàng - Đơn hàng #' . $this->order->id)
                    ->markdown('emails.orders.return_rejected');
    }
}
