<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use App\Models\Order;
use App\Traits\ApiResponseTrait;

class DashboardController extends Controller
{
    use ApiResponseTrait;
    // Trạng thái được ghi nhận doanh thu (paid + status hợp lệ)
    private array $orderStatusesForRevenue = ['delivered', 'completed'];

    // Gom nhóm trạng thái cho thống kê đơn
    private array $statusBuckets = [
        'placed'     => ['confirmed'],
        'processing' => ['preparing', 'shipping'],
        'delivered'  => ['delivered'],
        'canceled'   => ['canceled'],
    ];

    private function revenueOrderFilter($q)
    {
        return $q->whereIn('shop_order.order_status', $this->orderStatusesForRevenue)
            ->where('shop_order.payment_status', 'paid');
    }

    private function orderFinalAmountSql(): string
    {
        return 'COALESCE(shop_order.final_amount, (shop_order.total_price - COALESCE(shop_order.discount_amount,0)))';
    }

    private function itemFinalPriceSql(): string
    {
        return 'COALESCE(shop_order_items.price)';
    }

    // Parse khoảng thời gian theo day|month, trả về from/to + biểu thức group-by
    private function buildPeriodFilter(Request $request, string $timeType = 'day'): array
    {
        $from = $request->input('from');
        $to   = $request->input('to');

        $periodExpr = $timeType === 'month'
            ? 'DATE_FORMAT(date_order, "%Y-%m")'
            : 'DATE(date_order)';

        if (!$from && !$to) {
            return [
                'ok'         => true,
                'from'       => null,
                'to'         => null,
                'periodExpr' => $periodExpr,
            ];
        }

        try {
            if ($timeType === 'month') {
                $fromDate = $from ? Carbon::createFromFormat('Y-m', $from)->startOfMonth() : null;
                $toDate   = $to   ? Carbon::createFromFormat('Y-m', $to)->endOfMonth()   : null;
            } else {
                $fromDate = $from ? Carbon::createFromFormat('Y-m-d', $from)->startOfDay() : null;
                $toDate   = $to   ? Carbon::createFromFormat('Y-m-d', $to)->endOfDay()     : null;
            }

            if (!$fromDate || !$toDate) {
                return ['ok' => false, 'error' => 'Thiếu ngày bắt đầu hoặc kết thúc'];
            }

            return [
                'ok'         => true,
                'from'       => $fromDate,
                'to'         => $toDate,
                'periodExpr' => $periodExpr,
            ];
        } catch (\Exception $e) {
            return [
                'ok'    => false,
                'error' => $timeType === 'month'
                    ? 'Định dạng tháng không hợp lệ (YYYY-MM)'
                    : 'Định dạng ngày không hợp lệ (YYYY-MM-DD)',
            ];
        }
    }

    // =========================================================
    // ======================== PHẦN DOANH THU =================
    // =========================================================

    /**
     * API: Tổng doanh thu (snapshot)
     * GET /dashboard/total-revenue
     */
    public function getTotalRevenue(Request $request)
    {
        $query = DB::table('shop_order');
        $this->revenueOrderFilter($query);

        $now = Carbon::now();
        $filter = $request->input('filter');

        switch ($filter) {
            case 'today':
                $query->whereDate('date_order', $now->toDateString());
                break;

            case 'yesterday':
                $yesterday = $now->copy()->subDay();
                $query->whereDate('date_order', $yesterday->toDateString());
                break;

            case 'this_week':
                $query->whereBetween('date_order', [
                    $now->copy()->startOfWeek(),
                    $now->copy()->endOfWeek()
                ]);
                break;

            case 'last_week':
                $lastWeekStart = $now->copy()->subWeek()->startOfWeek();
                $lastWeekEnd   = $now->copy()->subWeek()->endOfWeek();
                $query->whereBetween('date_order', [$lastWeekStart, $lastWeekEnd]);
                break;

            case 'this_month':
                $query->whereYear('date_order', $now->year)
                    ->whereMonth('date_order', $now->month);
                break;

            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $query->whereYear('date_order', $lastMonth->year)
                    ->whereMonth('date_order', $lastMonth->month);
                break;

            case 'month':
                $month = $request->input('value');
                if ($month) {
                    try {
                        $parsed = Carbon::createFromFormat('Y-m', $month);
                        $query->whereYear('date_order', $parsed->year)
                            ->whereMonth('date_order', $parsed->month);
                    } catch (\Exception $e) {
                        return response()->json(['error' => 'Tháng không hợp lệ (định dạng YYYY-MM)'], 400);
                    }
                }
                break;

            case 'range':
                $from = $request->input('from');
                $to   = $request->input('to');
                if (!$from || !$to) {
                    return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
                }
                try {
                    $fromDate = Carbon::parse($from)->startOfDay();
                    $toDate   = Carbon::parse($to)->endOfDay();
                    $query->whereBetween('date_order', [$fromDate, $toDate]);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
                }
                break;
        }

        $total = $query->sum(DB::raw('final_amount - discount_amount - shipping_fee'));

        return response()->json([
            'total_revenue' => (float) $total
        ]);
    }


    /**
     * API: Tổng số đơn hàng
     * GET /dashboard/total-orders
     */
    public function getTotalOrders(Request $request)
    {
        $query = DB::table('shop_order');

        $now = Carbon::now();

        switch ($request->input('filter')) {
            case 'today':
                $query->whereDate('date_order', $now->toDateString());
                break;
            case 'yesterday':
                $yesterday = $now->copy()->subDay();
                $query->whereDate('date_order', $yesterday->toDateString());
                break;
            case 'this_week':
                $query->whereBetween('date_order', [
                    $now->copy()->startOfWeek(),
                    $now->copy()->endOfWeek()
                ]);
                break;
            case 'last_week':
                $lastWeekStart = $now->copy()->subWeek()->startOfWeek();
                $lastWeekEnd   = $now->copy()->subWeek()->endOfWeek();
                $query->whereBetween('date_order', [$lastWeekStart, $lastWeekEnd]);
                break;
            case 'this_month':
                $query->whereYear('date_order', $now->year)
                    ->whereMonth('date_order', $now->month);
                break;
            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $query->whereYear('date_order', $lastMonth->year)
                    ->whereMonth('date_order', $lastMonth->month);
                break;
            case 'month':
                $month = $request->input('value');
                if ($month) {
                    try {
                        $parsed = Carbon::createFromFormat('Y-m', $month);
                        $query->whereYear('date_order', $parsed->year)
                            ->whereMonth('date_order', $parsed->month);
                    } catch (\Exception $e) {
                        return response()->json(['error' => 'Tháng không hợp lệ (YYYY-MM)'], 400);
                    }
                }
                break;
            case 'range':
                $from = $request->input('from');
                $to   = $request->input('to');
                if (!$from || !$to) {
                    return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
                }
                try {
                    $fromDate = Carbon::parse($from)->startOfDay();
                    $toDate   = Carbon::parse($to)->endOfDay();
                    $query->whereBetween('date_order', [$fromDate, $toDate]);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
                }
                break;
        }

        $total = $query->count();

        return response()->json([
            'total_orders' => $total
        ]);
    }


    /**
     * API: Tổng số khách hàng
     * GET /dashboard/total-customers
     */
    public function getTotalCustomers(Request $request)
    {
        $query = DB::table('customers');
        $now = Carbon::now();

        switch ($request->input('filter')) {
            case 'today':
                $query->whereDate('created_at', $now->toDateString());
                break;
            case 'yesterday':
                $yesterday = $now->copy()->subDay();
                $query->whereDate('created_at', $yesterday->toDateString());
                break;
            case 'this_week':
                $query->whereBetween('created_at', [
                    $now->copy()->startOfWeek(),
                    $now->copy()->endOfWeek()
                ]);
                break;
            case 'last_week':
                $lastWeekStart = $now->copy()->subWeek()->startOfWeek();
                $lastWeekEnd   = $now->copy()->subWeek()->endOfWeek();
                $query->whereBetween('created_at', [$lastWeekStart, $lastWeekEnd]);
                break;
            case 'this_month':
                $query->whereYear('created_at', $now->year)
                    ->whereMonth('created_at', $now->month);
                break;
            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $query->whereYear('created_at', $lastMonth->year)
                    ->whereMonth('created_at', $lastMonth->month);
                break;
            case 'month':
                $month = $request->input('value');
                if ($month) {
                    try {
                        $parsed = Carbon::createFromFormat('Y-m', $month);
                        $query->whereYear('created_at', $parsed->year)
                            ->whereMonth('created_at', $parsed->month);
                    } catch (\Exception $e) {
                        return response()->json(['error' => 'Tháng không hợp lệ (YYYY-MM)'], 400);
                    }
                }
                break;
            case 'range':
                $from = $request->input('from');
                $to   = $request->input('to');
                if (!$from || !$to) {
                    return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
                }
                try {
                    $fromDate = Carbon::parse($from)->startOfDay();
                    $toDate   = Carbon::parse($to)->endOfDay();
                    $query->whereBetween('created_at', [$fromDate, $toDate]);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
                }
                break;
        }

        $total = $query->count();

        return response()->json([
            'total_customers' => $total
        ]);
    }


    /**
     * API: Giá trị trung bình mỗi đơn hàng (AOV)
     * GET /dashboard/average-order-value
     */
    public function getAverageOrderValue(Request $request)
    {
        $base = DB::table('shop_order');
        // $this->revenueOrderFilter($base);

        $now = Carbon::now();

        switch ($request->input('filter')) {
            case 'today':
                $base->whereDate('date_order', $now->toDateString());
                break;
            case 'yesterday':
                $yesterday = $now->copy()->subDay();
                $base->whereDate('date_order', $yesterday->toDateString());
                break;
            case 'this_week':
                $base->whereBetween('date_order', [
                    $now->copy()->startOfWeek(),
                    $now->copy()->endOfWeek()
                ]);
                break;
            case 'last_week':
                $lastWeekStart = $now->copy()->subWeek()->startOfWeek();
                $lastWeekEnd   = $now->copy()->subWeek()->endOfWeek();
                $base->whereBetween('date_order', [$lastWeekStart, $lastWeekEnd]);
                break;
            case 'this_month':
                $base->whereYear('date_order', $now->year)
                    ->whereMonth('date_order', $now->month);
                break;
            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $base->whereYear('date_order', $lastMonth->year)
                    ->whereMonth('date_order', $lastMonth->month);
                break;
            case 'month':
                $month = $request->input('value');
                if ($month) {
                    try {
                        $parsed = Carbon::createFromFormat('Y-m', $month);
                        $base->whereYear('date_order', $parsed->year)
                            ->whereMonth('date_order', $parsed->month);
                    } catch (\Exception $e) {
                        return response()->json(['error' => 'Tháng không hợp lệ (YYYY-MM)'], 400);
                    }
                }
                break;
            case 'range':
                $from = $request->input('from');
                $to   = $request->input('to');
                if (!$from || !$to) {
                    return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
                }
                try {
                    $fromDate = Carbon::parse($from)->startOfDay();
                    $toDate   = Carbon::parse($to)->endOfDay();
                    $base->whereBetween('date_order', [$fromDate, $toDate]);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
                }
                break;
        }

        $totalRevenue = (clone $base)->sum(DB::raw('final_amount - discount_amount - shipping_fee'));
        $totalOrders  = (clone $base)->count();

        $average = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        return response()->json([
            'average_order_value' => round($average, 2)
        ]);
    }


    /**
     * API: Đánh giá trung bình
     * GET /dashboard/average-rating
     */
    public function getAverageRating(Request $request)
    {
        $query = DB::table('reviews');

        $now = Carbon::now();

        switch ($request->input('filter')) {
            case 'today':
                $query->whereDate('created_at', $now->toDateString());
                break;
            case 'yesterday':
                $yesterday = $now->copy()->subDay();
                $query->whereDate('created_at', $yesterday->toDateString());
                break;
            case 'this_week':
                $query->whereBetween('created_at', [
                    $now->copy()->startOfWeek(),
                    $now->copy()->endOfWeek()
                ]);
                break;
            case 'last_week':
                $lastWeekStart = $now->copy()->subWeek()->startOfWeek();
                $lastWeekEnd   = $now->copy()->subWeek()->endOfWeek();
                $query->whereBetween('created_at', [$lastWeekStart, $lastWeekEnd]);
                break;
            case 'this_month':
                $query->whereYear('created_at', $now->year)
                    ->whereMonth('created_at', $now->month);
                break;
            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $query->whereYear('created_at', $lastMonth->year)
                    ->whereMonth('created_at', $lastMonth->month);
                break;
            case 'month':
                $month = $request->input('value');
                if ($month) {
                    try {
                        $parsed = Carbon::createFromFormat('Y-m', $month);
                        $query->whereYear('created_at', $parsed->year)
                            ->whereMonth('created_at', $parsed->month);
                    } catch (\Exception $e) {
                        return response()->json(['error' => 'Tháng không hợp lệ (YYYY-MM)'], 400);
                    }
                }
                break;
            case 'range':
                $from = $request->input('from');
                $to   = $request->input('to');
                if (!$from || !$to) {
                    return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
                }
                try {
                    $fromDate = Carbon::parse($from)->startOfDay();
                    $toDate   = Carbon::parse($to)->endOfDay();
                    $query->whereBetween('created_at', [$fromDate, $toDate]);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
                }
                break;
        }

        $averageRating = $query->avg('rating');

        return response()->json([
            'average_rating' => round($averageRating, 2)
        ]);
    }


    /**
     * API: Doanh thu theo tháng
     * GET /dashboard/monthly-revenue
     */
    public function getMonthlyRevenue(Request $request)
    {
        $query = DB::table('shop_order');
        $this->revenueOrderFilter($query);

        $now = Carbon::now();

        switch ($request->input('filter')) {
            case 'today':
                $query->whereDate('date_order', $now->toDateString());
                break;
            case 'yesterday':
                $yesterday = $now->copy()->subDay();
                $query->whereDate('date_order', $yesterday->toDateString());
                break;
            case 'this_week':
                $query->whereBetween('date_order', [
                    $now->startOfWeek(),
                    $now->endOfWeek()
                ]);
                break;
            case 'last_week':
                $start = $now->copy()->subWeek()->startOfWeek();
                $end   = $now->copy()->subWeek()->endOfWeek();
                $query->whereBetween('date_order', [$start, $end]);
                break;
            case 'this_month':
                $query->whereYear('date_order', $now->year)
                    ->whereMonth('date_order', $now->month);
                break;
            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $query->whereYear('date_order', $lastMonth->year)
                    ->whereMonth('date_order', $lastMonth->month);
                break;
            case 'range':
                $from = $request->input('from');
                $to   = $request->input('to');
                if (!$from || !$to) {
                    return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
                }
                try {
                    $fromDate = Carbon::parse($from)->startOfDay();
                    $toDate   = Carbon::parse($to)->endOfDay();
                    $query->whereBetween('date_order', [$fromDate, $toDate]);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
                }
                break;
        }

        $revenues = $query
            ->selectRaw('DATE_FORMAT(date_order, "%Y-%m") as month, SUM(final_amount - discount_amount - shipping_fee) as total')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return response()->json(['monthly_revenue' => $revenues]);
    }


    /**
     * API: Tăng trưởng người dùng
     * GET /dashboard/user-growth
     */
    public function getUserGrowth(Request $request)
    {
        $query = DB::table('users');

        $now = Carbon::now();

        switch ($request->input('filter')) {
            case 'today':
                $query->whereDate('created_at', $now->toDateString());
                break;
            case 'yesterday':
                $yesterday = $now->copy()->subDay();
                $query->whereDate('created_at', $yesterday->toDateString());
                break;
            case 'this_week':
                $query->whereBetween('created_at', [
                    $now->startOfWeek(),
                    $now->endOfWeek()
                ]);
                break;
            case 'last_week':
                $start = $now->copy()->subWeek()->startOfWeek();
                $end   = $now->copy()->subWeek()->endOfWeek();
                $query->whereBetween('created_at', [$start, $end]);
                break;
            case 'this_month':
                $query->whereYear('created_at', $now->year)
                    ->whereMonth('created_at', $now->month);
                break;
            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $query->whereYear('created_at', $lastMonth->year)
                    ->whereMonth('created_at', $lastMonth->month);
                break;
            case 'range':
                $from = $request->input('from');
                $to   = $request->input('to');
                if (!$from || !$to) {
                    return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
                }
                try {
                    $fromDate = Carbon::parse($from)->startOfDay();
                    $toDate   = Carbon::parse($to)->endOfDay();
                    $query->whereBetween('created_at', [$fromDate, $toDate]);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
                }
                break;
        }

        $growth = $query
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as total_users')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return response()->json(['user_growth' => $growth]);
    }


    /**
     * API: Doanh thu theo danh mục
     * GET /dashboard/revenue-by-category
     */
    public function getRevenueByCategory(Request $request)
    {
        $sortBy  = 'total_revenue';
        $sortDir = 'desc';

        $q = DB::table('shop_order_items')
            ->join('shop_order', 'shop_order.id', '=', 'shop_order_items.order_id')
            ->join('products', 'products.id', '=', 'shop_order_items.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id');

        $this->revenueOrderFilter($q);

        $now = Carbon::now();
        $filter = $request->input('filter');

        switch ($filter) {
            case 'today':
                $q->whereDate('shop_order.date_order', $now->toDateString());
                break;
            case 'yesterday':
                $yesterday = $now->copy()->subDay();
                $q->whereDate('shop_order.date_order', $yesterday->toDateString());
                break;
            case 'this_week':
                $q->whereBetween('shop_order.date_order', [$now->startOfWeek(), $now->endOfWeek()]);
                break;
            case 'last_week':
                $start = $now->copy()->subWeek()->startOfWeek();
                $end   = $now->copy()->subWeek()->endOfWeek();
                $q->whereBetween('shop_order.date_order', [$start, $end]);
                break;
            case 'this_month':
                $q->whereYear('shop_order.date_order', $now->year)
                    ->whereMonth('shop_order.date_order', $now->month);
                break;
            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $q->whereYear('shop_order.date_order', $lastMonth->year)
                    ->whereMonth('shop_order.date_order', $lastMonth->month);
                break;
            case 'range':
                $from = $request->input('from');
                $to   = $request->input('to');
                if (!$from || !$to) {
                    return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
                }
                try {
                    $fromDate = Carbon::parse($from)->startOfDay();
                    $toDate   = Carbon::parse($to)->endOfDay();
                    $q->whereBetween('shop_order.date_order', [$fromDate, $toDate]);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
                }
                break;
        }

        $data = $q->groupBy('categories.id', 'categories.name')
            ->select([
                'categories.name as category_name',
                DB::raw('SUM(' . $this->itemFinalPriceSql() . ' * shop_order_items.quantity) as total_revenue'),
            ])
            ->orderBy($sortBy, $sortDir)
            ->get();

        return response()->json(['revenue_by_category' => $data]);
    }

    /**
     * API: Doanh thu theo sản phẩm
     * GET /dashboard/revenue/by-product
     */
    public function getRevenueByProduct(Request $request)
{
    $search  = $request->input('search');
    $sortBy  = $request->input('sortBy', 'total_revenue'); // đổi default theo interface
    $sortDir = $request->input('sortDir', 'desc') === 'asc' ? 'asc' : 'desc';

    $q = DB::table('shop_order_items')
        ->join('shop_order', 'shop_order.id', '=', 'shop_order_items.order_id')
        ->join('products', 'products.id', '=', 'shop_order_items.product_id');

    $this->revenueOrderFilter($q);

    // Filter ngày
    $now = Carbon::now();
    $filter = $request->input('filter');

    switch ($filter) {
        case 'today':
            $q->whereDate('shop_order.date_order', $now->toDateString());
            break;
        case 'yesterday':
            $q->whereDate('shop_order.date_order', $now->copy()->subDay()->toDateString());
            break;
        case 'this_week':
            $q->whereBetween('shop_order.date_order', [$now->startOfWeek(), $now->endOfWeek()]);
            break;
        case 'last_week':
            $start = $now->copy()->subWeek()->startOfWeek();
            $end   = $now->copy()->subWeek()->endOfWeek();
            $q->whereBetween('shop_order.date_order', [$start, $end]);
            break;
        case 'this_month':
            $q->whereYear('shop_order.date_order', $now->year)
                ->whereMonth('shop_order.date_order', $now->month);
            break;
        case 'last_month':
            $lastMonth = $now->copy()->subMonth();
            $q->whereYear('shop_order.date_order', $lastMonth->year)
                ->whereMonth('shop_order.date_order', $lastMonth->month);
            break;
        case 'range':
            $from = $request->input('from');
            $to   = $request->input('to');
            if (!$from || !$to) {
                return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
            }
            try {
                $q->whereBetween('shop_order.date_order', [
                    Carbon::parse($from)->startOfDay(),
                    Carbon::parse($to)->endOfDay(),
                ]);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
            }
            break;
    }

    // Tìm kiếm
    if ($search) {
        $q->where('products.name', 'like', "%{$search}%");
    }

    // Group và select
    $q->groupBy('shop_order_items.product_id', 'products.name')
        ->select([
            'shop_order_items.product_id as product_id',
            'products.name as product_name',
            DB::raw('SUM(' . $this->itemFinalPriceSql() . ' * shop_order_items.quantity) as total_revenue'), // đổi alias
            DB::raw('SUM(shop_order_items.quantity) as quantity'),
            DB::raw('COUNT(DISTINCT shop_order.id) as orders_count'),
        ]);

    // Sắp xếp
    $allowed = ['total_revenue', 'quantity', 'orders_count', 'product_name'];
    if (!in_array($sortBy, $allowed)) $sortBy = 'total_revenue';
    $q->orderBy($sortBy, $sortDir);

    return response()->json([
        'revenue_by_product' => $q->get(),
    ]);
}


    /**
     * API: Số lượng sản phẩm theo danh mục (catalog)
     * GET /dashboard/products-by-category
     */
    public function getProductsByCategory(Request $request)
    {
        $includeInactive = (int) $request->input('include_inactive', 0) === 1;
        $includeDeleted  = (int) $request->input('include_deleted', 0) === 1;

        // Nhận filter danh mục (1 hoặc nhiều)
        $categoryId   = $request->input('category_id');
        $categoryIds  = $request->input('category_ids');

        // Chuẩn hóa category_ids: nhận mảng hoặc CSV -> mảng số nguyên
        if (is_string($categoryIds)) {
            $categoryIds = array_filter(array_map('trim', explode(',', $categoryIds)), fn($v) => $v !== '');
        }
        if (is_array($categoryIds)) {
            $categoryIds = array_values(array_unique(array_map('intval', $categoryIds)));
        } else {
            $categoryIds = [];
        }
        if ($categoryId) {
            $categoryIds[] = (int) $categoryId;
            $categoryIds = array_values(array_unique($categoryIds));
        }

        $q = DB::table('categories')
            ->leftJoin('products', 'products.category_id', '=', 'categories.id');

        // Lọc theo danh mục nếu có
        if (!empty($categoryIds)) {
            $q->whereIn('categories.id', $categoryIds);
        }

        // Mặc định chỉ đếm sản phẩm active
        if (!$includeInactive) {
            $q->where(function ($w) {
                // Nếu status null thì vẫn tính (phòng DB cũ chưa set), hoặc status = 1
                $w->whereNull('products.status')->orWhere('products.status', 1);
            });
        }

        // Mặc định loại sản phẩm đã xóa mềm
        if (!$includeDeleted) {
            $q->whereNull('products.deleted_at');
        }

        $rows = $q->groupBy('categories.id', 'categories.name')
            ->select([
                'categories.id as category_id',
                'categories.name as category_name',
                DB::raw('COUNT(products.id) as products_count'),
            ])
            ->orderBy('products_count', 'desc')
            ->get();

        return response()->json([
            'products_by_category' => $rows
        ]);
    }


    /**
     * API: Tổng doanh thu theo thời gian
     * GET /dashboard/revenue/summary
     */
    public function getRevenueSummary(Request $request)
    {
        $timeType = $request->input('timeType', 'day');

        $query = DB::table('shop_order');
        $this->revenueOrderFilter($query);

        // Áp dụng filter ngày (switch-case)
        $filter = $request->input('filter');
        $now = Carbon::now();

        switch ($filter) {
            case 'today':
                $query->whereDate('shop_order.date_order', $now->toDateString());
                break;
            case 'yesterday':
                $query->whereDate('shop_order.date_order', $now->copy()->subDay()->toDateString());
                break;
            case 'this_week':
                $query->whereBetween('shop_order.date_order', [$now->startOfWeek(), $now->endOfWeek()]);
                break;
            case 'last_week':
                $start = $now->copy()->subWeek()->startOfWeek();
                $end   = $now->copy()->subWeek()->endOfWeek();
                $query->whereBetween('shop_order.date_order', [$start, $end]);
                break;
            case 'this_month':
                $query->whereYear('shop_order.date_order', $now->year)
                    ->whereMonth('shop_order.date_order', $now->month);
                break;
            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $query->whereYear('shop_order.date_order', $lastMonth->year)
                    ->whereMonth('shop_order.date_order', $lastMonth->month);
                break;
            case 'range':
                $from = $request->input('from');
                $to   = $request->input('to');
                if (!$from || !$to) {
                    return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
                }
                try {
                    $query->whereBetween('shop_order.date_order', [
                        Carbon::parse($from)->startOfDay(),
                        Carbon::parse($to)->endOfDay(),
                    ]);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
                }
                break;
        }

        // Xác định cách group theo thời gian
        if ($timeType === 'day') {
            $select = DB::raw('DATE(shop_order.date_order) as period, SUM(' . $this->orderFinalAmountSql() . ') as revenue');
            $group  = DB::raw('DATE(shop_order.date_order)');
            $order  = $group;
        } elseif ($timeType === 'week') {
            $select = DB::raw('YEARWEEK(shop_order.date_order, 3) as k, CONCAT("Tuần ", WEEK(shop_order.date_order,3), " - ", DATE_FORMAT(shop_order.date_order, "%Y-%m")) as period, SUM(' . $this->orderFinalAmountSql() . ') as revenue');
            $group  = DB::raw('YEARWEEK(shop_order.date_order, 3)');
            $order  = $group;
        } elseif ($timeType === 'month') {
            $select = DB::raw('DATE_FORMAT(shop_order.date_order, "%Y-%m") as period, SUM(' . $this->orderFinalAmountSql() . ') as revenue');
            $group  = DB::raw('DATE_FORMAT(shop_order.date_order, "%Y-%m")');
            $order  = $group;
        } else { // year
            $select = DB::raw('YEAR(shop_order.date_order) as period, SUM(' . $this->orderFinalAmountSql() . ') as revenue');
            $group  = DB::raw('YEAR(shop_order.date_order)');
            $order  = $group;
        }

        $summary = $query->select($select)
            ->groupBy($group)
            ->orderBy($order)
            ->get()
            ->map(fn($r) => ['time' => $r->period, 'revenue' => (float)$r->revenue]);

        // Tổng doanh thu
        $totalQuery = DB::table('shop_order');
        $this->revenueOrderFilter($totalQuery);

        // Áp dụng lại filter ngày cho totalQuery
        switch ($filter) {
            case 'today':
                $totalQuery->whereDate('shop_order.date_order', $now->toDateString());
                break;
            case 'yesterday':
                $totalQuery->whereDate('shop_order.date_order', $now->copy()->subDay()->toDateString());
                break;
            case 'this_week':
                $totalQuery->whereBetween('shop_order.date_order', [$now->startOfWeek(), $now->endOfWeek()]);
                break;
            case 'last_week':
                $start = $now->copy()->subWeek()->startOfWeek();
                $end   = $now->copy()->subWeek()->endOfWeek();
                $totalQuery->whereBetween('shop_order.date_order', [$start, $end]);
                break;
            case 'this_month':
                $totalQuery->whereYear('shop_order.date_order', $now->year)
                    ->whereMonth('shop_order.date_order', $now->month);
                break;
            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $totalQuery->whereYear('shop_order.date_order', $lastMonth->year)
                    ->whereMonth('shop_order.date_order', $lastMonth->month);
                break;
            case 'range':
                $from = $request->input('from');
                $to   = $request->input('to');
                if ($from && $to) {
                    $totalQuery->whereBetween('shop_order.date_order', [
                        Carbon::parse($from)->startOfDay(),
                        Carbon::parse($to)->endOfDay(),
                    ]);
                }
                break;
        }

        $total = $totalQuery->sum(DB::raw($this->orderFinalAmountSql()));

        return response()->json([
            'revenue_summary' => [
                'summary' => $summary,
                'total'   => (float) $total,
            ]
        ]);
    }


    /**
     * Áp dụng filter ngày cho query
     */


    // =========================================================
    // ======================== PHẦN ĐƠN HÀNG ==================
    // =========================================================

    /**
     * API: Thống kê đơn hàng theo trạng thái
     * GET /dashboard/orders/status-counters
     */
    public function getOrderStatusCounters(Request $request)
{
    $q = DB::table('shop_order');

    // Áp dụng filter ngày (switch-case)
    $filter = $request->input('filter');
    $now = Carbon::now();

    switch ($filter) {
        case 'today':
            $q->whereDate('shop_order.date_order', $now->toDateString());
            break;
        case 'yesterday':
            $q->whereDate('shop_order.date_order', $now->copy()->subDay()->toDateString());
            break;
        case 'this_week':
            $q->whereBetween('shop_order.date_order', [$now->startOfWeek(), $now->endOfWeek()]);
            break;
        case 'last_week':
            $start = $now->copy()->subWeek()->startOfWeek();
            $end   = $now->copy()->subWeek()->endOfWeek();
            $q->whereBetween('shop_order.date_order', [$start, $end]);
            break;
        case 'this_month':
            $q->whereYear('shop_order.date_order', $now->year)
              ->whereMonth('shop_order.date_order', $now->month);
            break;
        case 'last_month':
            $lastMonth = $now->copy()->subMonth();
            $q->whereYear('shop_order.date_order', $lastMonth->year)
              ->whereMonth('shop_order.date_order', $lastMonth->month);
            break;
        case 'range':
            $from = $request->input('from');
            $to   = $request->input('to');
            if (!$from || !$to) {
                return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
            }
            try {
                $q->whereBetween('shop_order.date_order', [
                    Carbon::parse($from)->startOfDay(),
                    Carbon::parse($to)->endOfDay(),
                ]);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
            }
            break;
    }

    // Đếm số lượng theo trạng thái
    $rows = $q->select(
            'order_status',
            DB::raw('COUNT(*) as total')
        )
        ->groupBy('order_status')
        ->get();

    $result = $rows->map(fn($row) => [
        'status' => $row->order_status,
        'count'  => (int) $row->total,
    ])->values();

    return response()->json($result);
}




    /**
     * API: Thống kê đơn hàng theo ngày/tháng
     * GET /dashboard/orders/by-period
     */
  public function getOrdersByPeriod(Request $request)
{
    $timeType = $request->input('timeType', 'day');
    $filter   = $request->input('filter'); 
    $now      = Carbon::now();

    $q = DB::table('shop_order');

    // Filter ngày
    switch ($filter) {
        case 'today':
            $q->whereDate('date_order', $now->toDateString());
            break;
        case 'yesterday':
            $q->whereDate('date_order', $now->copy()->subDay()->toDateString());
            break;
        case 'this_week':
            $q->whereBetween('date_order', [$now->startOfWeek(), $now->endOfWeek()]);
            break;
        case 'last_week':
            $start = $now->copy()->subWeek()->startOfWeek();
            $end   = $now->copy()->subWeek()->endOfWeek();
            $q->whereBetween('date_order', [$start, $end]);
            break;
        case 'this_month':
            $q->whereYear('date_order', $now->year)
              ->whereMonth('date_order', $now->month);
            break;
        case 'last_month':
            $lastMonth = $now->copy()->subMonth();
            $q->whereYear('date_order', $lastMonth->year)
              ->whereMonth('date_order', $lastMonth->month);
            break;
    }

    // Xác định periodExpr theo timeType
    switch ($timeType) {
        case 'week':
            $periodExpr = 'YEARWEEK(date_order, 3)';
            break;
        case 'month':
            $periodExpr = 'DATE_FORMAT(date_order, "%Y-%m")';
            break;
        case 'year':
            $periodExpr = 'YEAR(date_order)';
            break;
        default: // day
            $periodExpr = 'DATE(date_order)';
            break;
    }

    // Lấy dữ liệu
    $rows = $q->select([
            'order_status as status',
            DB::raw('COUNT(*) as count'),
            DB::raw($periodExpr . ' as date'),
        ])
        ->groupBy('order_status', DB::raw($periodExpr))
        ->orderBy(DB::raw($periodExpr))
        ->get();

    // Re-map sang object phẳng
    $data = [];
    foreach ($rows as $r) {
        $data[$r->status] = (int)$r->count;
    }

    return response()->json([
        $data
    ]);
}







    /**
     * API: Tỷ lệ hủy đơn hàng
     * GET /dashboard/orders/cancel-rate
     */
    public function getCancelRate(Request $request)
    {
        $filter = $request->input('filter');
        $q = DB::table('shop_order');

        // Áp dụng lọc thời gian
        $now = Carbon::now();
        switch ($filter) {
            case 'today':
                $q->whereDate('shop_order.date_order', $now->toDateString());
                break;
            case 'yesterday':
                $q->whereDate('shop_order.date_order', $now->copy()->subDay()->toDateString());
                break;
            case 'this_week':
                $q->whereBetween('shop_order.date_order', [$now->startOfWeek(), $now->endOfWeek()]);
                break;
            case 'last_week':
                $start = $now->copy()->subWeek()->startOfWeek();
                $end   = $now->copy()->subWeek()->endOfWeek();
                $q->whereBetween('shop_order.date_order', [$start, $end]);
                break;
            case 'this_month':
                $q->whereYear('shop_order.date_order', $now->year)
                    ->whereMonth('shop_order.date_order', $now->month);
                break;
            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $q->whereYear('shop_order.date_order', $lastMonth->year)
                    ->whereMonth('shop_order.date_order', $lastMonth->month);
                break;
            case 'range':
                $from = $request->input('from');
                $to   = $request->input('to');
                if (!$from || !$to) {
                    return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
                }
                try {
                    $q->whereBetween('shop_order.date_order', [
                        Carbon::parse($from)->startOfDay(),
                        Carbon::parse($to)->endOfDay(),
                    ]);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
                }
                break;
        }

        // Tổng đơn
        $total = (clone $q)->count();

        // Đơn bị hủy
        $canceled = (clone $q)
            ->whereIn('order_status', $this->statusBuckets['canceled'])
            ->count();

        $rate = $total > 0 ? round($canceled * 100 / $total, 2) : 0.0;

        return response()->json([
            'cancel_rate' => [
                'total_orders' => (int) $total,
                'canceled'     => (int) $canceled,
                'rate_percent' => $rate
            ]
        ]);
    }


    /**
     * API: Timeline trạng thái đơn hàng
     * GET /dashboard/orders/status-timeline
     */
    public function getOrderStatusTimeline(Request $request)
    {
        $timeType = $request->input('timeType', 'day');
        $filter   = $request->input('filter'); // today, yesterday, this_week, last_week, this_month, last_month
        $now      = Carbon::now();

        $q = DB::table('shop_order');

        // Lọc theo filter ngày
        switch ($filter) {
            case 'today':
                $q->whereDate('date_order', $now->toDateString());
                break;
            case 'yesterday':
                $q->whereDate('date_order', $now->copy()->subDay()->toDateString());
                break;
            case 'this_week':
                $q->whereBetween('date_order', [$now->startOfWeek(), $now->endOfWeek()]);
                break;
            case 'last_week':
                $start = $now->copy()->subWeek()->startOfWeek();
                $end   = $now->copy()->subWeek()->endOfWeek();
                $q->whereBetween('date_order', [$start, $end]);
                break;
            case 'this_month':
                $q->whereYear('date_order', $now->year)
                    ->whereMonth('date_order', $now->month);
                break;
            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $q->whereYear('date_order', $lastMonth->year)
                    ->whereMonth('date_order', $lastMonth->month);
                break;
        }

        // Chọn biểu thức group theo timeType
        switch ($timeType) {
            case 'week':
                $periodExpr = 'YEARWEEK(date_order, 3)';
                break;
            case 'month':
                $periodExpr = 'DATE_FORMAT(date_order, "%Y-%m")';
                break;
            case 'year':
                $periodExpr = 'YEAR(date_order)';
                break;
            default: // day
                $periodExpr = 'DATE(date_order)';
                break;
        }

        // Lấy dữ liệu
        $rows = $q->select([
            DB::raw($periodExpr . ' as period'),
            DB::raw("SUM(CASE WHEN order_status IN ('" . implode("','", $this->statusBuckets['placed']) . "') THEN 1 ELSE 0 END) as placed"),
            DB::raw("SUM(CASE WHEN order_status IN ('" . implode("','", $this->statusBuckets['processing']) . "') THEN 1 ELSE 0 END) as processing"),
            DB::raw("SUM(CASE WHEN order_status IN ('" . implode("','", $this->statusBuckets['delivered']) . "') THEN 1 ELSE 0 END) as delivered"),
            DB::raw("SUM(CASE WHEN order_status IN ('" . implode("','", $this->statusBuckets['canceled']) . "') THEN 1 ELSE 0 END) as canceled"),
            DB::raw('COUNT(*) as total'),
        ])
            ->groupBy(DB::raw($periodExpr))
            ->orderBy(DB::raw($periodExpr))
            ->get()
            ->map(fn($r) => [
                'time'       => $r->period,
                'placed'     => (int)$r->placed,
                'processing' => (int)$r->processing,
                'delivered'  => (int)$r->delivered,
                'canceled'   => (int)$r->canceled,
                'total'      => (int)$r->total,
            ]);

        return response()->json(['order_status_timeline' => $rows]);
    }

    //số lượng voucher đã sử dụng
    public function getUsedVoucherCount(Request $request)
    {
        $query = DB::table('shop_order')
            ->whereNotNull('voucher_code'); // Chỉ lấy các đơn có voucher_code

        $now = Carbon::now();

        switch ($request->input('filter')) {
            case 'today':
                $query->whereDate('date_order', $now->toDateString());
                break;
            case 'yesterday':
                $yesterday = $now->copy()->subDay();
                $query->whereDate('date_order', $yesterday->toDateString());
                break;
            case 'this_week':
                $query->whereBetween('date_order', [$now->startOfWeek(), $now->endOfWeek()]);
                break;
            case 'last_week':
                $start = $now->copy()->subWeek()->startOfWeek();
                $end   = $now->copy()->subWeek()->endOfWeek();
                $query->whereBetween('date_order', [$start, $end]);
                break;
            case 'this_month':
                $query->whereYear('date_order', $now->year)
                    ->whereMonth('date_order', $now->month);
                break;
            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $query->whereYear('date_order', $lastMonth->year)
                    ->whereMonth('date_order', $lastMonth->month);
                break;
            case 'range':
                $from = $request->input('from');
                $to   = $request->input('to');
                if (!$from || !$to) {
                    return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
                }
                try {
                    $query->whereBetween('date_order', [
                        Carbon::parse($from)->startOfDay(),
                        Carbon::parse($to)->endOfDay(),
                    ]);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
                }
                break;
        }

        $count = $query->count();

        return response()->json(['voucherUsageCount' => $count]);
    }

    // ======================== PRODUCT RATINGS ========================
    /**
     * GET /dashboard/product-ratings
     * GET /dashboard/product-ratings/{productId}
     */
    public function getProductRatings(Request $request, $productId = null)
    {
        $productId = $productId ?? $request->input('product_id');

        // Base query
        $q = DB::table('reviews')
            ->join('products', 'products.id', '=', 'reviews.product_id')
            ->where('reviews.is_visible', 1); // chỉ lấy review hiển thị

        // ===== Apply time filter (format cũ – switch case) =====
        $filter = $request->input('filter');
        $now = Carbon::now();

        switch ($filter) {
            case 'today':
                $q->whereDate('reviews.created_at', $now->toDateString());
                break;

            case 'yesterday':
                $q->whereDate('reviews.created_at', $now->copy()->subDay()->toDateString());
                break;

            case 'this_week':
                $q->whereBetween('reviews.created_at', [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()]);
                break;

            case 'last_week':
                $start = $now->copy()->subWeek()->startOfWeek();
                $end   = $now->copy()->subWeek()->endOfWeek();
                $q->whereBetween('reviews.created_at', [$start, $end]);
                break;

            case 'this_month':
                $q->whereYear('reviews.created_at', $now->year)
                    ->whereMonth('reviews.created_at', $now->month);
                break;

            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $q->whereYear('reviews.created_at', $lastMonth->year)
                    ->whereMonth('reviews.created_at', $lastMonth->month);
                break;

            case 'month':
                $month = $request->input('value');
                if ($month) {
                    try {
                        $parsed = Carbon::createFromFormat('Y-m', $month);
                        $q->whereYear('reviews.created_at', $parsed->year)
                            ->whereMonth('reviews.created_at', $parsed->month);
                    } catch (\Exception $e) {
                        return response()->json(['error' => 'Tháng không hợp lệ (YYYY-MM)'], 400);
                    }
                }
                break;

            case 'range':
                $from = $request->input('from');
                $to   = $request->input('to');
                if (!$from || !$to) {
                    return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
                }
                try {
                    $q->whereBetween('reviews.created_at', [
                        Carbon::parse($from)->startOfDay(),
                        Carbon::parse($to)->endOfDay(),
                    ]);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
                }
                break;
        }

        // ===== Nếu truyền product_id -> trả chi tiết một sản phẩm (kèm breakdown) =====
        if ($productId) {
            $row = $q->where('reviews.product_id', $productId)
                ->select([
                    'reviews.product_id',
                    'products.name as product_name',
                    DB::raw('AVG(reviews.rating) as average'),
                    DB::raw('COUNT(*) as total_reviews'),
                    DB::raw("SUM(CASE WHEN reviews.rating = 5 THEN 1 ELSE 0 END) as star_5"),
                    DB::raw("SUM(CASE WHEN reviews.rating = 4 THEN 1 ELSE 0 END) as star_4"),
                    DB::raw("SUM(CASE WHEN reviews.rating = 3 THEN 1 ELSE 0 END) as star_3"),
                    DB::raw("SUM(CASE WHEN reviews.rating = 2 THEN 1 ELSE 0 END) as star_2"),
                    DB::raw("SUM(CASE WHEN reviews.rating = 1 THEN 1 ELSE 0 END) as star_1"),
                ])
                ->groupBy('reviews.product_id', 'products.name')
                ->first();

            if (!$row) {
                return response()->json(['product_ratings' => null]);
            }

            return response()->json([
                'product_ratings' => [
                    'product_id'     => (int)$row->product_id,
                    'product_name'   => $row->product_name,
                    'average'        => round((float)$row->average, 2),
                    'total_reviews'  => (int)$row->total_reviews,
                    'breakdown'      => [
                        '5' => (int)$row->star_5,
                        '4' => (int)$row->star_4,
                        '3' => (int)$row->star_3,
                        '2' => (int)$row->star_2,
                        '1' => (int)$row->star_1,
                    ],
                ]
            ]);
        }

        // ===== Nếu không truyền product_id -> trả danh sách theo avg hoặc count =====
        $orderBy = $request->input('orderBy', 'avg');   // avg|count
        $sortDir = strtolower($request->input('sortDir', 'desc')) === 'asc' ? 'asc' : 'desc';
        $limit   = (int)($request->input('limit', 10));
        $ratingFilter = $request->input('ratingFilter'); // best|worst

        // Xử lý ratingFilter
        if ($ratingFilter === 'best') {
            $orderBy = 'avg';
            $sortDir = 'desc';
        } elseif ($ratingFilter === 'worst') {
            $orderBy = 'avg';
            $sortDir = 'asc';
        }

        $allowed = ['avg', 'count'];
        if (!in_array($orderBy, $allowed)) $orderBy = 'avg';

        $rows = $q->select([
            'reviews.product_id',
            'products.name as product_name',
            DB::raw('AVG(reviews.rating) as average'),
            DB::raw('COUNT(*) as total_reviews'),
        ])
            ->groupBy('reviews.product_id', 'products.name')
            ->orderBy($orderBy === 'avg' ? DB::raw('AVG(reviews.rating)') : DB::raw('COUNT(*)'), $sortDir)
            ->limit($limit)
            ->get()
            ->map(fn($r) => [
                'product_id'    => (int)$r->product_id,
                'product_name'  => $r->product_name,
                'average'       => round((float)$r->average, 2),
                'total_reviews' => (int)$r->total_reviews,
            ]);

        return response()->json(['product_ratings' => $rows]);
    }

    // ======================== THANH TOÁN ========================
    // GET /api/dashboard/payment-methods
    public function getPaymentMethods(Request $request)
    {
        // Chỉ tính các đơn đã thanh toán và đã hoàn tất/giao hàng
        $q = DB::table('shop_order')
            ->where('payment_status', 'paid')
            ->whereIn('order_status', ['delivered', 'completed']);

        $now    = Carbon::now();
        $filter = $request->input('filter');

        switch ($filter) {
            case 'today':
                $q->whereDate('date_order', $now->toDateString());
                break;
            case 'yesterday':
                $q->whereDate('date_order', $now->copy()->subDay()->toDateString());
                break;
            case 'this_week':
                $q->whereBetween('date_order', [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()]);
                break;
            case 'last_week':
                $start = $now->copy()->subWeek()->startOfWeek();
                $end   = $now->copy()->subWeek()->endOfWeek();
                $q->whereBetween('date_order', [$start, $end]);
                break;
            case 'this_month':
                $q->whereYear('date_order', $now->year)->whereMonth('date_order', $now->month);
                break;
            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $q->whereYear('date_order', $lastMonth->year)->whereMonth('date_order', $lastMonth->month);
                break;
            case 'month': // ?value=YYYY-MM
                $month = $request->input('value');
                if ($month) {
                    try {
                        $parsed = Carbon::createFromFormat('Y-m', $month);
                        $q->whereYear('date_order', $parsed->year)->whereMonth('date_order', $parsed->month);
                    } catch (\Exception $e) {
                        return response()->json(['error' => 'Tháng không hợp lệ (YYYY-MM)'], 400);
                    }
                }
                break;
            case 'range': // ?from=YYYY-MM-DD&to=YYYY-MM-DD
                $from = $request->input('from');
                $to   = $request->input('to');
                if (!$from || !$to) {
                    return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
                }
                try {
                    $q->whereBetween('date_order', [
                        Carbon::parse($from)->startOfDay(),
                        Carbon::parse($to)->endOfDay(),
                    ]);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
                }
                break;
        }

        $amountSql = 'COALESCE(final_amount, (total_price - COALESCE(discount_amount,0)))';

        $rows = $q->select([
            'payment_method as method',
            DB::raw('COUNT(*) as orders_count'),
            DB::raw("SUM($amountSql) as total_amount"),
        ])
            ->groupBy('payment_method')
            ->orderBy('method')
            ->get()
            ->map(fn($r) => [
                'method'       => (string)$r->method,
                'orders_count' => (int)$r->orders_count,
                'total_amount' => (float)$r->total_amount,
            ]);

        return response()->json(['payment_methods' => $rows]);
    }

    // ======================== BEST SELLING PRODUCTS ========================
    // GET /dashboard/best-selling-products
     public function getBestSellingProducts(Request $request)
    {
        $limit = $request->input('limit', 10);
        $filter = $request->input('filter');

        $q = DB::table('shop_order_items')
            ->join('shop_order', 'shop_order.id', '=', 'shop_order_items.order_id')
            ->join('products', 'products.id', '=', 'shop_order_items.product_id')
            ->leftJoin('categories', 'categories.id', '=', 'products.category_id')
            ->leftJoin('images', function ($join) {
                $join->on('images.product_id', '=', 'products.id');
            })
            ->leftJoin(
                DB::raw('(SELECT product_id, AVG(rating) as avg_rating, COUNT(*) as review_count 
                      FROM reviews 
                      WHERE is_visible = 1 
                      GROUP BY product_id) as product_ratings'),
                'product_ratings.product_id',
                '=',
                'products.id'
            );

        $this->revenueOrderFilter($q);

        $now = Carbon::now();

        switch ($filter) {
            case 'today':
                $q->whereDate('shop_order.date_order', $now->toDateString());
                break;
            case 'yesterday':
                $q->whereDate('shop_order.date_order', $now->copy()->subDay()->toDateString());
                break;
            case 'this_week':
                $q->whereBetween('shop_order.date_order', [$now->startOfWeek(), $now->endOfWeek()]);
                break;
            case 'last_week':
                $start = $now->copy()->subWeek()->startOfWeek();
                $end = $now->copy()->subWeek()->endOfWeek();
                $q->whereBetween('shop_order.date_order', [$start, $end]);
                break;
            case 'this_month':
                $q->whereYear('shop_order.date_order', $now->year)
                    ->whereMonth('shop_order.date_order', $now->month);
                break;
            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $q->whereYear('shop_order.date_order', $lastMonth->year)
                    ->whereMonth('shop_order.date_order', $lastMonth->month);
                break;
            case 'range':
                $from = $request->input('from');
                $to = $request->input('to');
                if (!$from || !$to) {
                    return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
                }
                try {
                    $q->whereBetween('shop_order.date_order', [
                        Carbon::parse($from)->startOfDay(),
                        Carbon::parse($to)->endOfDay(),
                    ]);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
                }
                break;
        }

        $data = $q->groupBy(
            'shop_order_items.product_id',
            'products.id',
            'products.name',
            'products.price',
            'products.sale_price',
            'products.sale_end',
            'categories.name',
            'images.url',
            'product_ratings.avg_rating',
            'product_ratings.review_count'
        )
            ->select([
                'products.id as id',
                'products.name as name',
                DB::raw('CONCAT("/storage/", COALESCE(images.url, "default.jpg")) as image_url'),
                DB::raw('SUM(shop_order_items.quantity) as total_sold'),
                DB::raw('SUM(shop_order_items.quantity * shop_order_items.price) as total_revenue'),
                DB::raw('COUNT(DISTINCT shop_order.id) as orders_count'),
                'products.price as price',
                'products.sale_price as original_price',
                DB::raw('CASE WHEN products.sale_price > 0 
                       AND (products.sale_end IS NULL OR products.sale_end >= CURDATE()) 
                       THEN ROUND((products.sale_price - products.price) / products.sale_price * 100, 1) 
                       ELSE 0 END as discount_percent'),
                'categories.name as category_name',
                DB::raw('COALESCE(product_ratings.avg_rating, 0) as rating'),
                DB::raw('COALESCE(product_ratings.review_count, 0) as review_count'),
            ])
            ->orderBy('total_sold', 'desc')
            ->limit(1)
            ->get()
            ->map(function ($item) {
                $item->slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $item->name));
                return $item;
            });
        return response()->json(['best_selling_products' => $data]);
    }


    // ======================== SHIPPING STATUS ========================
    // GET /dashboard/shipping-status
    public function getShippingStatus(Request $request)
    {
        $statuses = ['pending', 'ready_to_pick', 'picking', 'picked', 'delivering', 'delivered'];

        $q = DB::table('shop_order');
        $this->revenueOrderFilter($q);

        $filter = $request->input('filter');
        $now = Carbon::now();

        switch ($filter) {
            case 'today':
                $q->whereDate('shop_order.date_order', $now->toDateString());
                break;
            case 'yesterday':
                $q->whereDate('shop_order.date_order', $now->copy()->subDay()->toDateString());
                break;
            case 'this_week':
                $q->whereBetween('shop_order.date_order', [$now->startOfWeek(), $now->endOfWeek()]);
                break;
            case 'last_week':
                $start = $now->copy()->subWeek()->startOfWeek();
                $end   = $now->copy()->subWeek()->endOfWeek();
                $q->whereBetween('shop_order.date_order', [$start, $end]);
                break;
            case 'this_month':
                $q->whereYear('shop_order.date_order', $now->year)
                    ->whereMonth('shop_order.date_order', $now->month);
                break;
            case 'last_month':
                $lastMonth = $now->copy()->subMonth();
                $q->whereYear('shop_order.date_order', $lastMonth->year)
                    ->whereMonth('shop_order.date_order', $lastMonth->month);
                break;
            case 'month': // ?filter=month&value=YYYY-MM
                $value = $request->input('value');
                if ($value) {
                    try {
                        $parsed = Carbon::createFromFormat('Y-m', $value);
                        $q->whereYear('shop_order.date_order', $parsed->year)
                            ->whereMonth('shop_order.date_order', $parsed->month);
                    } catch (\Exception $e) {
                        return response()->json(['error' => 'Tháng không hợp lệ (YYYY-MM)'], 400);
                    }
                }
                break;
            case 'range': // ?filter=range&from=YYYY-MM-DD&to=YYYY-MM-DD
                $from = $request->input('from');
                $to   = $request->input('to');
                if (!$from || !$to) {
                    return response()->json(['error' => 'Thiếu ngày bắt đầu hoặc kết thúc'], 400);
                }
                try {
                    $q->whereBetween('shop_order.date_order', [
                        Carbon::parse($from)->startOfDay(),
                        Carbon::parse($to)->endOfDay(),
                    ]);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
                }
                break;
        }

        // Đếm theo shipping_status
        $rows = $q->select([
            'shipping_status',
            DB::raw('COUNT(*) as orders_count'),
        ])
            ->groupBy('shipping_status')
            ->get()
            ->keyBy('shipping_status');

        // Đảm bảo trả đủ các trạng thái với count = 0 nếu không có dữ liệu
        $data = [];
        foreach ($statuses as $st) {
            $data[] = [
                'status'       => $st,
                'orders_count' => (int)($rows[$st]->orders_count ?? 0),
            ];
        }

        return response()->json(['shipping_status' => $data]);
    }
}
