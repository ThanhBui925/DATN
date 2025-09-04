@component('mail::message')
# Thông báo từ chối trả hàng

Kính gửi **{{ $order->recipient_name }}**,

Chúng tôi đã nhận được yêu cầu trả hàng của bạn cho đơn hàng **#{{ $order->id }}** đặt ngày **{{ $order->created_at->format('d/m/Y') }}**.

Rất tiếc, sau khi kiểm tra, chúng tôi không thể chấp nhận yêu cầu trả hàng của bạn vì lý do sau:  
**{{ $order->return_reject_reason ?? 'Không đáp ứng đủ điều kiện trả hàng' }}**

Nếu bạn cần thêm thông tin chi tiết, vui lòng liên hệ với bộ phận chăm sóc khách hàng qua:  
📞 Hotline: 1900-1234
📧 Email: sportwolkofficial@gmail.com  

---

Cảm ơn bạn đã tin tưởng và mua sắm tại **{{ config('app.name') }}**.

Trân trọng,  
{{ config('app.name') }}
@endcomponent
