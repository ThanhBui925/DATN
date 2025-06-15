<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getTotalRevenue()
    {
        $total = DB::table('shop_order')
            ->where('order_status', '!=', 'cancelled')
            ->sum('total_price');

        return response()->json([
            'total_revenue' => $total
        ]);
    }

    public function getTotalOrders()
    {
        $total = DB::table('shop_order')->count();

        return response()->json([
            'total_orders' => $total
        ]);
    }

    public function getTotalCustomers()
    {
        $total = DB::table('customers')->count();

        return response()->json([
            'total_customers' => $total
        ]);
    }

    public function getAverageOrderValue()
    {
        $totalRevenue = DB::table('shop_order')
            ->where('order_status', '!=', 'cancelled')
            ->sum('total_price');

        $totalOrders = DB::table('shop_order')
            ->where('order_status', '!=', 'cancelled')
            ->count();

        $average = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        return response()->json([
            'average_order_value' => round($average, 2) // làm tròn 2 số thập phân
        ]);
    }

    public function getAverageRating()
    {
        $averageRating = DB::table('reviews')->avg('rating');

        return response()->json([
            'average_rating' => round($averageRating, 2)
        ]);
    }

    public function getMonthlyRevenue()
    {
        $revenues = DB::table('shop_order')
            ->selectRaw('DATE_FORMAT(date_order, "%Y-%m") as month, SUM(total_price) as total')
            ->where('order_status', '!=', 'cancelled') // bỏ qua đơn bị hủy nếu có
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return response()->json([
            'monthly_revenue' => $revenues
        ]);
    }

    public function getUserGrowth()
    {
        $growth = DB::table('users')
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as total_users')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return response()->json([
            'user_growth' => $growth
        ]);
    }

    public function getRevenueByCategory()
    {
        $data = DB::table('shop_order_items')
            ->join('products', 'shop_order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->join('shop_order', 'shop_order.id', '=', 'shop_order_items.order_id')
            ->where('shop_order.order_status', '!=', 'cancelled') // nếu có trạng thái hủy
            ->select(
                'categories.name as category_name',
                DB::raw('SUM(shop_order_items.price * shop_order_items.quantity) as total_revenue')
            )
            ->groupBy('categories.name')
            ->orderByDesc('total_revenue')
            ->get();

        return response()->json([
            'revenue_by_category' => $data
        ]);
    }
}
