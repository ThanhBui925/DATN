<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    // Trạng thái được ghi nhận doanh thu (paid + status hợp lệ)
    private array $orderStatusesForRevenue = ['confirmed','preparing','shipping','delivered'];

    // Gom nhóm trạng thái cho thống kê đơn
    private array $statusBuckets = [
        'placed'     => ['confirmed'],
        'processing' => ['preparing','shipping'],
        'delivered'  => ['delivered'],
        'canceled'   => ['canceled'],
    ];

    private function revenueOrderFilter($q) {
        return $q->whereIn('shop_order.order_status', $this->orderStatusesForRevenue)
                 ->where('shop_order.payment_status', 'paid');
    }

    private function orderFinalAmountSql(): string {
        return 'COALESCE(shop_order.final_amount, (shop_order.total_price - COALESCE(shop_order.discount_amount,0)))';
    }

    private function itemFinalPriceSql(): string {
        return 'COALESCE(shop_order_items.final_price, shop_order_items.price)';
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

        if ($request->input('filter') === 'today') {
            $query->whereDate('date_order', $now->toDateString());
        } elseif ($request->input('filter') === 'yesterday') {
            $yesterday = $now->copy()->subDay();
            $query->whereDate('date_order', $yesterday->toDateString());
        } elseif ($request->input('filter') === 'month') {
            $month = $request->input('value');
            if ($month) {
                try {
                    $parsed = Carbon::createFromFormat('Y-m', $month);
                    $query->whereYear('date_order', $parsed->year)
                          ->whereMonth('date_order', $parsed->month);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Tháng không hợp lệ (định dạng YYYY-MM)'], 400);
                }
            } else {
                $query->whereYear('date_order', $now->year)
                      ->whereMonth('date_order', $now->month);
            }
        } elseif ($request->input('filter') === 'range') {
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
        }

        $total = $query->sum(DB::raw($this->orderFinalAmountSql()));

        return response()->json([
            'total_revenue' => (float) $total
        ]);
    }

    /**
     * API: Tổng số đơn hàng
     * GET /dashboard/total-orders
     */
    public function getTotalOrders()
    {
        $total = DB::table('shop_order')->count();
        return response()->json(['total_orders' => $total]);
    }

    /**
     * API: Tổng số khách hàng
     * GET /dashboard/total-customers
     */
    public function getTotalCustomers()
    {
        $total = DB::table('customers')->count();
        return response()->json(['total_customers' => $total]);
    }

    /**
     * API: Giá trị trung bình mỗi đơn hàng (AOV)
     * GET /dashboard/average-order-value
     */
    public function getAverageOrderValue()
    {
        $base = DB::table('shop_order');
        $this->revenueOrderFilter($base);

        $totalRevenue = (clone $base)->sum(DB::raw($this->orderFinalAmountSql()));
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
    public function getAverageRating()
    {
        $averageRating = DB::table('reviews')->avg('rating');
        return response()->json(['average_rating' => round($averageRating, 2)]);
    }

    /**
     * API: Doanh thu theo tháng
     * GET /dashboard/monthly-revenue
     */
    public function getMonthlyRevenue()
    {
        $revenues = DB::table('shop_order')
            ->tap(fn($q) => $this->revenueOrderFilter($q))
            ->selectRaw('DATE_FORMAT(date_order, "%Y-%m") as month, SUM('.$this->orderFinalAmountSql().') as total')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return response()->json(['monthly_revenue' => $revenues]);
    }

    /**
     * API: Tăng trưởng người dùng
     * GET /dashboard/user-growth
     */
    public function getUserGrowth()
    {
        $growth = DB::table('users')
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
        $from    = $request->input('from');
        $to      = $request->input('to');
        $sortBy  = 'total_revenue';
        $sortDir = 'desc';

        $q = DB::table('shop_order_items')
            ->join('shop_order','shop_order.id','=','shop_order_items.order_id')
            ->join('products','products.id','=','shop_order_items.product_id')
            ->join('categories','categories.id','=','products.category_id');

        $this->revenueOrderFilter($q);

        if ($from && $to) {
            try {
                $q->whereBetween('shop_order.date_order', [
                    Carbon::parse($from)->startOfDay(),
                    Carbon::parse($to)->endOfDay(),
                ]);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
            }
        }

        $data = $q->groupBy('categories.id','categories.name')
            ->select([
                'categories.name as category_name',
                DB::raw('SUM('.$this->itemFinalPriceSql().' * shop_order_items.quantity) as total_revenue'),
            ])
            ->orderBy($sortBy,$sortDir)
            ->get();

        return response()->json(['revenue_by_category' => $data]);
    }

    /**
     * API: Doanh thu theo sản phẩm
     * GET /dashboard/revenue/by-product
     */
    public function getRevenueByProduct(Request $request)
    {
        $from    = $request->input('from');
        $to      = $request->input('to');
        $search  = $request->input('search');
        $sortBy  = $request->input('sortBy', 'revenue');
        $sortDir = $request->input('sortDir', 'desc') === 'asc' ? 'asc' : 'desc';

        $q = DB::table('shop_order_items')
            ->join('shop_order','shop_order.id','=','shop_order_items.order_id')
            ->join('products','products.id','=','shop_order_items.product_id');

        $this->revenueOrderFilter($q);

        if ($from && $to) {
            try {
                $q->whereBetween('shop_order.date_order', [
                    Carbon::parse($from)->startOfDay(),
                    Carbon::parse($to)->endOfDay(),
                ]);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
            }
        }
        if ($search) {
            $q->where('products.name','like',"%{$search}%");
        }

        $q->groupBy('shop_order_items.product_id','products.name','products.sku')
          ->select([
              'shop_order_items.product_id as product_id',
              'products.name as product_name',
              'products.sku as sku',
              DB::raw('SUM('.$this->itemFinalPriceSql().' * shop_order_items.quantity) as revenue'),
              DB::raw('SUM(shop_order_items.quantity) as quantity'),
              DB::raw('COUNT(DISTINCT shop_order.id) as orders_count'),
          ]);

        $allowed = ['revenue','quantity','orders_count','product_name'];
        if (!in_array($sortBy,$allowed)) $sortBy = 'revenue';
        $q->orderBy($sortBy,$sortDir);

        $rows = $q->get();

        return response()->json([
            'revenue_by_product' => $rows,
        ]);
    }

    /**
     * API: Tổng doanh thu theo thời gian
     * GET /dashboard/revenue/summary
     */
    public function getRevenueSummary(Request $request)
    {
        $timeType = $request->input('timeType', 'day');
        $from = $request->input('from');
        $to   = $request->input('to');

        $query = DB::table('shop_order');
        $this->revenueOrderFilter($query);

        if ($from && $to) {
            try {
                $query->whereBetween('shop_order.date_order', [
                    Carbon::parse($from)->startOfDay(),
                    Carbon::parse($to)->endOfDay(),
                ]);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Định dạng ngày không hợp lệ (YYYY-MM-DD)'], 400);
            }
        }

        if ($timeType === 'day') {
            $select = DB::raw('DATE(shop_order.date_order) as period, SUM('.$this->orderFinalAmountSql().') as revenue');
            $group  = DB::raw('DATE(shop_order.date_order)');
            $order  = $group;
        } elseif ($timeType === 'week') {
            $select = DB::raw('YEARWEEK(shop_order.date_order, 3) as k, CONCAT("Tuần ", WEEK(shop_order.date_order,3), " - ", DATE_FORMAT(shop_order.date_order, "%Y-%m")) as period, SUM('.$this->orderFinalAmountSql().') as revenue');
            $group  = DB::raw('YEARWEEK(shop_order.date_order, 3)');
            $order  = $group;
        } elseif ($timeType === 'month') {
            $select = DB::raw('DATE_FORMAT(shop_order.date_order, "%Y-%m") as period, SUM('.$this->orderFinalAmountSql().') as revenue');
            $group  = DB::raw('DATE_FORMAT(shop_order.date_order, "%Y-%m")');
            $order  = $group;
        } else {
            $select = DB::raw('YEAR(shop_order.date_order) as period, SUM('.$this->orderFinalAmountSql().') as revenue');
            $group  = DB::raw('YEAR(shop_order.date_order)');
            $order  = $group;
        }

        $summary = $query->select($select)->groupBy($group)->orderBy($order)->get()
            ->map(fn($r) => ['time' => $r->period, 'revenue' => (float)$r->revenue]);

        $total = DB::table('shop_order')
            ->tap(fn($q) => $this->revenueOrderFilter($q))
            ->when($from && $to, function ($q) use ($from, $to) {
                try {
                    $q->whereBetween('shop_order.date_order', [
                        Carbon::parse($from)->startOfDay(),
                        Carbon::parse($to)->endOfDay(),
                    ]);
                } catch (\Exception $e) {}
            })
            ->sum(DB::raw($this->orderFinalAmountSql()));

        return response()->json([
            'revenue_summary' => [
                'summary' => $summary,
                'total'   => (float) $total,
            ]
        ]);
    }

    // =========================================================
    // ======================== PHẦN ĐƠN HÀNG ==================
    // =========================================================

    /**
     * API: Thống kê đơn hàng theo trạng thái
     * GET /dashboard/orders/status-counters
     */
    public function getOrderStatusCounters(Request $request)
    {
        $timeType = $request->input('timeType', 'day');
        $f = $this->buildPeriodFilter($request, $timeType);
        if (!$f['ok']) return response()->json(['error' => $f['error']], 400);

        $q = DB::table('shop_order');
        if ($f['from'] && $f['to']) {
            $q->whereBetween('date_order', [$f['from'], $f['to']]);
        }

        $selects = [
            DB::raw('COUNT(*) as total_orders'),
            DB::raw("SUM(CASE WHEN order_status IN ('".implode("','",$this->statusBuckets['placed'])."') THEN 1 ELSE 0 END) as placed"),
            DB::raw("SUM(CASE WHEN order_status IN ('".implode("','",$this->statusBuckets['processing'])."') THEN 1 ELSE 0 END) as processing"),
            DB::raw("SUM(CASE WHEN order_status IN ('".implode("','",$this->statusBuckets['delivered'])."') THEN 1 ELSE 0 END) as delivered"),
            DB::raw("SUM(CASE WHEN order_status IN ('".implode("','",$this->statusBuckets['canceled'])."') THEN 1 ELSE 0 END) as canceled"),
        ];

        $row = $q->select($selects)->first();

        return response()->json([
            'order_status_counters' => [
                'total'      => (int) ($row->total_orders ?? 0),
                'placed'     => (int) ($row->placed ?? 0),
                'processing' => (int) ($row->processing ?? 0),
                'delivered'  => (int) ($row->delivered ?? 0),
                'canceled'   => (int) ($row->canceled ?? 0),
            ]
        ]);
    }

    /**
     * API: Thống kê đơn hàng theo ngày/tháng
     * GET /dashboard/orders/by-period
     */
    public function getOrdersByPeriod(Request $request)
    {
        $timeType = $request->input('timeType', 'day');
        $f = $this->buildPeriodFilter($request, $timeType);
        if (!$f['ok']) return response()->json(['error' => $f['error']], 400);

        $q = DB::table('shop_order');
        if ($f['from'] && $f['to']) {
            $q->whereBetween('date_order', [$f['from'], $f['to']]);
        }

        $rows = $q->select([
                DB::raw($f['periodExpr'].' as period'),
                DB::raw('COUNT(*) as orders'),
            ])
            ->groupBy(DB::raw($f['periodExpr']))
            ->orderBy(DB::raw($f['periodExpr']))
            ->get()
            ->map(fn($r) => ['time' => $r->period, 'orders' => (int)$r->orders]);

        return response()->json(['orders_by_period' => $rows]);
    }

    /**
     * API: Tỷ lệ hủy đơn hàng
     * GET /dashboard/orders/cancel-rate
     */
    public function getCancelRate(Request $request)
    {
        $timeType = $request->input('timeType', 'day');
        $f = $this->buildPeriodFilter($request, $timeType);
        if (!$f['ok']) return response()->json(['error' => $f['error']], 400);

        $base = DB::table('shop_order');
        if ($f['from'] && $f['to']) {
            $base->whereBetween('date_order', [$f['from'], $f['to']]);
        }

        $total    = (clone $base)->count();
        $canceled = (clone $base)->whereIn('order_status', $this->statusBuckets['canceled'])->count();
        $rate     = $total > 0 ? round($canceled * 100 / $total, 2) : 0.0;

        return response()->json([
            'cancel_rate' => [
                'total_orders' => (int)$total,
                'canceled'     => (int)$canceled,
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
        $f = $this->buildPeriodFilter($request, $timeType);
        if (!$f['ok']) return response()->json(['error' => $f['error']], 400);

        $q = DB::table('shop_order');
        if ($f['from'] && $f['to']) {
            $q->whereBetween('date_order', [$f['from'], $f['to']]);
        }

        $rows = $q->select([
                DB::raw($f['periodExpr'].' as period'),
                DB::raw("SUM(CASE WHEN order_status IN ('".implode("','",$this->statusBuckets['placed'])."') THEN 1 ELSE 0 END) as placed"),
                DB::raw("SUM(CASE WHEN order_status IN ('".implode("','",$this->statusBuckets['processing'])."') THEN 1 ELSE 0 END) as processing"),
                DB::raw("SUM(CASE WHEN order_status IN ('".implode("','",$this->statusBuckets['delivered'])."') THEN 1 ELSE 0 END) as delivered"),
                DB::raw("SUM(CASE WHEN order_status IN ('".implode("','",$this->statusBuckets['canceled'])."') THEN 1 ELSE 0 END) as canceled"),
                DB::raw('COUNT(*) as total'),
            ])
            ->groupBy(DB::raw($f['periodExpr']))
            ->orderBy(DB::raw($f['periodExpr']))
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
}
