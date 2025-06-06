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
        .invoice-box .total {
            font-weight: bold;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="title">Invoice #{{ $order->id }}</div>
        <div class="info">
            <table>
                <tr>
                    <td>
                        <strong>Customer:</strong> {{ $order->recipient_name }}<br>
                        <strong>Phone:</strong> {{ $order->recipient_phone }}<br>
                        <strong>Address:</strong> {{ $order->shipping_address }}
                    </td>
                    <td>
                        <strong>Date:</strong> {{ $date }}<br>
                        <strong>Status:</strong> {{ $order->order_status }}<br>
                        <strong>Shipping:</strong> {{ $order->shipping->name }}
                    </td>
                </tr>
            </table>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->orderItems as $item)
                <tr>
                    <td>{{ $item->product->name }}</td>
                    <td>{{ $item->variant ? $item->variant->name : 'N/A' }}</td>
                    <td>{{ number_format($item->price, 2) }} USD</td>
                    <td>{{ $item->quantity }}</td>
                    <td>{{ number_format($item->price * $item->quantity, 2) }} USD</td>
                </tr>
                @endforeach
                <tr>
                    <td colspan="4" class="total">Total</td>
                    <td class="total">{{ number_format($order->total_price, 2) }} USD</td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>