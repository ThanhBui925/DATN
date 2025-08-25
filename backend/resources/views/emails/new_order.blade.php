<h2>Đơn hàng mới</h2>
<p>Mã đơn hàng: {{ $order->id }}</p>
<p>Tổng tiền: {{ number_format($order->final_amount) }} VNĐ</p>
<p>Khách hàng: {{ $order->user->name ?? 'N/A' }}</p>
<p>Ngày đặt: {{ $order->created_at->format('d/m/Y H:i') }}</p>
<a href="{{ 'http://localhost:3000/admin/orders/show/' . $order->id }}">Xem chi tiết</a>

