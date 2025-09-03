<!DOCTYPE html>
<html>
<head>
    <title>{{ $title }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 14px; }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .invoice-box table {
            width: 100%;
            border-collapse: collapse;
        }
        .invoice-box table td, .invoice-box table th {
            padding: 8px;
            vertical-align: top;
        }
        .invoice-box table th {
            background: #f4f4f4;
            border-bottom: 2px solid #ddd;
            font-weight: bold;
        }
        .invoice-box table td {
            border-bottom: 1px solid #eee;
        }
        .invoice-box .title {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
        }
        .invoice-box .info {
            margin-bottom: 20px;
        }
        .invoice-box .summary {
            margin-top: 20px;
            width: 40%;
            float: right;
            border: 1px solid #ddd;
            padding: 10px;
        }
        .invoice-box .summary p {
            margin: 5px 0;
        }
        .invoice-box .summary .final {
            font-size: 16px;
            font-weight: bold;
            color: red;
        }
        
    </style>
</head>
<body>
    <div class="invoice-box">

        <div class="title">{{ $title }}</div>

        <div style="text-align: center; margin-bottom: 20px;">
            <img src="{{ public_path('logo/logo.png') }}" style="max-width: 150px;">
        </div>
        <div class="info">
            <table>
                <tr>
                    <td>
                        <strong>Khách hàng :</strong> {{ $order->recipient_name }}<br>
                        <strong>Số điện thoại :</strong> {{ $order->recipient_phone }}<br>
                        <strong>Địa chỉ :</strong>
                        {{ implode(', ', array_filter([
                            $order->detailed_address ?? '',
                            $order->ward_name ?? '',
                            $order->district_name ?? '',
                            $order->province_name ?? '',
                        ])) }}
                    </td>
                    <td>
                        <strong>Ngày đặt:</strong> {{ $date }}<br>
                        <strong>Trạng thái :</strong> {{ $order->order_status }}<br>
                        <strong>Đơn vị vận chuyển:</strong> {{ $order->shipping->name ?? '' }}
                    </td>
                </tr>
            </table>
        </div>

        <h4>Mã giảm giá</h4>
        <p>
            Mã voucher: {{ $order->voucher_code }} <br>
            Giá trị giảm: {{ number_format($order->discount_amount, 0, ',', '.') }} đ
        </p>

        <h4>Sản phẩm trong đơn hàng</h4>
        <table class="table table-bordered text-center align-middle">
    <thead class="table-light">
        <tr>
            <th>Tên sản phẩm</th>
            <th>Kích cỡ</th>
            <th>Màu sắc</th>
            <th>Giá tiền</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
        </tr>
    </thead>
    <tbody>
        @foreach($order->orderItems as $item)
        <tr>
            <td>{{ $item->product->name ?? '' }}</td>

            {{-- Cột kích cỡ --}}
            <td>
                @if($item->variant && $item->variant->size)
                    {{ $item->variant->size->name }}
                @else
                    N/A
                @endif
            </td>

            {{-- Cột màu sắc --}}
            <td>
                @if($item->variant && $item->variant->color)
                    {{ $item->variant->color->name }}
                @else
                    N/A
                @endif
            </td>

            <td>{{ number_format($item->price, 0, ',', '.') }} đ</td>
            <td>{{ $item->quantity }}</td>
            <td>{{ number_format($item->price * $item->quantity, 0, ',', '.') }} đ</td>
        </tr>
        @endforeach

        <tr>
            <td colspan="5" class="text-end fw-bold">Tổng cộng</td>
            <td class="fw-bold">{{ number_format($order->total_price, 0, ',', '.') }} đ</td>
        </tr>
    </tbody>
</table>


        <div class="summary">
            <p>Tiền hàng: {{ number_format($order->total_price, 0, ',', '.') }} đ</p>
            <p>Phí vận chuyển: {{ number_format($shipping_fee, 0, ',', '.') }} đ</p>
            <p>Giảm giá: {{ number_format($discount, 0, ',', '.') }} đ</p>
            <p class="final">Thành tiền: {{ number_format($final_amount, 0, ',', '.') }} đ</p>
        </div>
        <!-- Lời cảm ơn -->
        <div style="clear: both; margin-top: 50px; text-align: center;">
            <p>Cảm ơn bạn đã mua hàng!</p>

    </div>
</body>
</html>
