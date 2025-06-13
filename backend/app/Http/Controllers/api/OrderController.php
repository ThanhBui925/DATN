<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\VariantProduct;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query()->with(['customer', 'shipping', 'user']);

        if ($request->has('date')) {
            $date = Carbon::parse($request->input('date'))->format('Y-m-d');
            $query->whereDate('date_order', $date);
        }

        if ($request->has('month') && $request->has('year')) {
            $query->whereMonth('date_order', $request->input('month'))
                  ->whereYear('date_order', $request->input('year'));
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date_order', [
                Carbon::parse($request->input('start_date'))->startOfDay(),
                Carbon::parse($request->input('end_date'))->endOfDay()
            ]);
        }

        $orders = $query->get();

        return response()->json($orders, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'shipping_id' => 'required|exists:shipping,id',
            'shipping_address' => 'required|string|max:255',
            'payment_method' => 'required|in:cash,card,paypal,vnpay',
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|regex:/^0[0-9]{9}$/',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.variant_id' => 'required|exists:variant_products,id',
        ]);

        $slug = 'order-' . time() . '-' . rand(1000, 9999);

        $order = Order::create([
            'slug' => $slug,
            'date_order' => Carbon::now(),
            'total_price' => 0,
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_address' => $request->input('shipping_address'),
            'payment_method' => $request->input('payment_method'),
            'user_id' => auth()->user()->id,
            'customer_id' => $request->input('customer_id'),
            'shipping_id' => $request->input('shipping_id'),
            'recipient_name' => $request->input('recipient_name'),
            'recipient_phone' => $request->input('recipient_phone'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $totalPrice = 0;
        foreach ($request->input('items') as $item) {
            $product = Product::findOrFail($item['product_id']);
            $variant = VariantProduct::findOrFail($item['variant_id']);
            
            $price = $product->sale_price && $product->sale_end > Carbon::now() ? $product->sale_price : $product->price;
            
            OrderItem::create([
                'slug' => 'item-' . time() . '-' . rand(1000, 9999),
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $price,
                'variant_id' => $item['variant_id'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            $totalPrice += $price * $item['quantity'];
        }

        $order->total_price = $totalPrice;
        $order->save();

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order->load(['customer', 'shipping', 'user', 'orderItems.product', 'orderItems.variant'])
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'order_status' => 'required|in:confirming,confirmed,preparing,shipping,delivered,completed,canceled,pending',
            'payment_status' => 'nullable|in:unpaid,paid',
            'cancel_reason' => 'required_if:order_status,canceled|string|max:255',
        ]);

        $order->order_status = $request->input('order_status');
        if ($request->has('payment_status')) {
            $order->payment_status = $request->input('payment_status');
        }
        if ($request->input('order_status') === 'canceled') {
            $order->cancel_reason = $request->input('cancel_reason');
        } else {
            $order->cancel_reason = null;
        }

        if ($request->input('order_status') === 'shipping' && !$order->shipped_at) {
            $order->shipped_at = Carbon::now();
        } elseif ($request->input('order_status') === 'delivered' && !$order->delivered_at) {
            $order->delivered_at = Carbon::now();
        }

        $order->updated_at = Carbon::now();
        $order->save();

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->load(['customer', 'shipping', 'user'])
        ], 200);
    }

    public function searchByProduct(Request $request)
    {
        $request->validate([
            'product_name' => 'required|string|max:255',
        ]);

        $productName = $request->input('product_name');

        $orders = Order::whereHas('orderItems.product', function ($query) use ($productName) {
            $query->where('name', 'like', '%' . $productName . '%');
        })->with(['customer', 'shipping', 'user', 'orderItems.product'])->get();

        return response()->json($orders, 200);
    }

    public function showDetail($id)
    {
        $order = Order::with(['customer', 'shipping', 'user', 'orderItems.product', 'orderItems.variant'])
                      ->find($id);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        return response()->json([
            'message' => 'Order details retrieved successfully',
            'order' => $order
        ], 200);
    }

    public function generatePDF($id)
    {
        $order = Order::with(['customer', 'shipping', 'user', 'orderItems.product', 'orderItems.variant'])
                      ->find($id);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $data = [
            'order' => $order,
            'title' => 'Hóa Đơn #' . $order->id,
            'date' => Carbon::now()->format('Y-m-d H:i:s')
        ];

        $pdf = Pdf::loadView('pdf.invoice', $data);

        return $pdf->download('invoice_' . $order->id . '.pdf');
    }
}