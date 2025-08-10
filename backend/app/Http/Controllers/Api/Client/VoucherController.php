<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use Carbon\Carbon;
use App\Traits\ApiResponseTrait;

class VoucherController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        $now = Carbon::now();

        $vouchers = Voucher::where('status', 1)
            ->where(function ($query) use ($now) {
                $query->whereNull('start_date')
                      ->orWhere('start_date', '<=', $now);
            })
            ->where(function ($query) use ($now) {
                $query->whereNull('expiry_date')
                      ->orWhere('expiry_date', '>=', $now);
            })
            ->get();

        return $this->success($vouchers, 'Lấy danh sách voucher thành công');
    }

    public function show($id)
    {
        $now = Carbon::now();

        $voucher = Voucher::where('status', 1)
            ->where(function ($query) use ($now) {
                $query->whereNull('start_date')
                      ->orWhere('start_date', '<=', $now);
            })
            ->where(function ($query) use ($now) {
                $query->whereNull('expiry_date')
                      ->orWhere('expiry_date', '>=', $now);
            })
            ->find($id);

        if (!$voucher) {
            return $this->error('Voucher không tồn tại hoặc không trong thời gian hoạt động', null, 404);
        }

        return $this->success($voucher, 'Lấy chi tiết voucher thành công');
    }
}
