<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    // Trạng thái đơn hàng được tính doanh thu (đã ghi nhận)
    private array $orderStatusesForRevenue = ['confirmed','preparing','shipping','delivered','completed'];

    // Bộ lọc đơn hàng tính doanh thu: chỉ đơn paid + trạng thái hợp lệ
    private function revenueOrderFilter($q) {
        return $q->whereIn('shop_order.order_status', $this->orderStatusesForRevenue)
                 ->where('shop_order.payment_status', 'paid');
    }

    // SQL tính tổng tiền cấp đơn (KHÔNG tính phí ship)
    private function orderFinalAmountSql(): string {
        return 'COALESCE(shop_order.final_amount, (shop_order.total_price - COALESCE(shop_order.discount_amount,0)))';
    }

    // SQL giá cuối cùng cấp item (ưu tiên final_price; fallback price)
    private function itemFinalPriceSql(): string {
        return 'COALESCE(shop_order_items.final_price, shop_order_items.price)';
    }

    // Tổng doanh thu (snapshot)
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

    // Tổng số đơn hàng
    public function getTotalOrders()
    {
        $total = DB::table('shop_order')->count();
        return response()->json(['total_orders' => $total]);
    }

    // Tổng số khách hàng
    public function getTotalCustomers()
    {
        $total = DB::table('customers')->count();
        return response()->json(['total_customers' => $total]);
    }

    // Giá trị trung bình mỗi đơn hàng (AOV)
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

    // Đánh giá trung bình
    public function getAverageRating()
    {
        $averageRating = DB::table('reviews')->avg('rating');
        return response()->json(['average_rating' => round($averageRating, 2)]);
    }

    // Doanh thu theo tháng
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

    // Tăng trưởng người dùng
    public function getUserGrowth()
    {
        $growth = DB::table('users')
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as total_users')
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return response()->json(['user_growth' => $growth]);
    }

    // Doanh thu theo danh mục
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
            $q->whereBetween('shop_order.date_order', [
                Carbon::parse($from)->startOfDay(),
                Carbon::parse($to)->endOfDay(),
            ]);
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

    // Doanh thu theo sản phẩm
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
            $q->whereBetween('shop_order.date_order', [
                Carbon::parse($from)->startOfDay(),
                Carbon::parse($to)->endOfDay(),
            ]);
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

    // Tổng doanh thu theo: Ngày / Tuần / Tháng / Năm
    public function getRevenueSummary(Request $request)
    {
        $timeType = $request->input('timeType', 'day');
        $from = $request->input('from');
        $to   = $request->input('to');

        $query = DB::table('shop_order');
        $this->revenueOrderFilter($query);

        if ($from && $to) {
            $query->whereBetween('shop_order.date_order', [
                Carbon::parse($from)->startOfDay(),
                Carbon::parse($to)->endOfDay(),
            ]);
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
            ->when($from && $to, fn($q)=>$q->whereBetween('shop_order.date_order',[
                Carbon::parse($from)->startOfDay(), Carbon::parse($to)->endOfDay()
            ]))
            ->sum(DB::raw($this->orderFinalAmountSql()));

        return response()->json([
            'revenue_summary' => [
                'summary' => $summary,
                'total'   => (float) $total,
            ]
        ]);
    }
}
