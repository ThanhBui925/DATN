
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Đặt hàng thành công</title>
</head>
<body>
    <h2>Xin chào {{ $order->customer_name ?? 'Quý khách' }},</h2>
    <p>Bạn đã đặt đơn hàng thành công với mã đơn: <strong>#{{ $order->id }}</strong></p>

    <p>Thông tin đơn hàng:</p>
    <ul>
        <li>Ngày đặt: {{ $order->date_order }}</li>
        <li>Tổng tiền: {{ number_format($order->final_amount) }}₫</li>
        <li>Trạng thái: {{ $order->order_status }}</li>
        <li>Địa chỉ nhận hàng : {{$order->detailed_address}}, {{$order->ward_name}}, {{$order->district_name}}, {{$order->province_name}}</li>
    </ul>

    <p>Cảm ơn bạn đã mua sắm tại {{ config('app.name') }}!</p>
</body>
</html>
