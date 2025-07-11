<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;

class BannerController extends Controller
{
    use ApiResponseTrait;

    /**
     * Lấy danh sách banner đang active cho client
     */
    public function index(Request $request)
    {
        $query = Banner::query()->where('status', 'active');
        // Có thể lọc theo ngày hiện tại nằm trong khoảng start_date, end_date nếu muốn
        $now = now();
        $query->where(function($q) use ($now) {
            $q->whereNull('start_date')->orWhere('start_date', '<=', $now);
        });
        $query->where(function($q) use ($now) {
            $q->whereNull('end_date')->orWhere('end_date', '>=', $now);
        });
        $banners = $query->orderBy('created_at', 'desc')->get();
        return $this->successResponse($banners, 'Lấy danh sách banner thành công');
    }

    /**
     * Xem chi tiết banner (nếu cần)
     */
    public function show($id)
    {
        $banner = Banner::where('status', 'active')->find($id);
        if (!$banner) {
            return $this->errorResponse('Banner không tồn tại hoặc đã bị ẩn', null, 404);
        }
        return $this->successResponse($banner, 'Lấy chi tiết banner thành công');
    }
}
