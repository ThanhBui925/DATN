<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query()->with(['customer', 'shipping', 'user']);

        if ($request->has('date')) {
            $date = Carbon::parse($request->date)->format('Y-m-d');
            $query->whereDate('date_order', $date);
        }

        if ($request->has('month') && $request->has('year')) {
            $query->whereMonth('date_order', $request->month)
                  ->whereYear('date_order', $request->year);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date_order', [
                Carbon::parse($request->start_date)->startOfDay(),
                Carbon::parse($request->end_date)->endOfDay()
            ]);
        }

        $orders = $query->get();

        return response()->json($orders, 200);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'order_status' => 'required|in:confirming,confirmed,preparing,shipping,delivered,completed,canceled,pending',
            'payment_status' => 'nullable|in:unpaid,paid',
            'cancel_reason' => 'required_if:order_status,canceled|string|max:255',
        ]);

        $order->order_status = $request->order_status;
        if ($request->has('payment_status')) {
            $order->payment_status = $request->payment_status;
        }
        if ($request->order_status === 'canceled') {
            $order->cancel_reason = $request->cancel_reason;
        } else {
            $order->cancel_reason = null;
        }

        if ($request->order_status === 'shipping' && !$order->shipped_at) {
            $order->shipped_at = Carbon::now();
        } elseif ($request->order_status === 'delivered' && !$order->delivered_at) {
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