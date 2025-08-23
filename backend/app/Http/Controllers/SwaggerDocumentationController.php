<?php

namespace App\Http\Controllers;

/**
 * @OA\Tag(
 *     name="Authentication",
 *     description="API Endpoints cho xác thực người dùng"
 * )
 * 
 * @OA\Tag(
 *     name="Password Reset",
 *     description="API Endpoints cho quên mật khẩu"
 * )
 * 
 * @OA\Tag(
 *     name="Client Products",
 *     description="API Endpoints cho sản phẩm (Client)"
 * )
 * 
 * @OA\Tag(
 *     name="Client Categories",
 *     description="API Endpoints cho danh mục sản phẩm (Client)"
 * )
 * 
 * @OA\Tag(
 *     name="Client Banners",
 *     description="API Endpoints cho banner (Client)"
 * )
 * 
 * @OA\Tag(
 *     name="Client Cart",
 *     description="API Endpoints cho giỏ hàng (Client)"
 * )
 * 
 * @OA\Tag(
 *     name="Client Orders",
 *     description="API Endpoints cho đơn hàng (Client)"
 * )
 * 
 * @OA\Tag(
 *     name="Client Reviews",
 *     description="API Endpoints cho đánh giá sản phẩm (Client)"
 * )
 * 
 * @OA\Tag(
 *     name="Client Addresses",
 *     description="API Endpoints cho địa chỉ (Client)"
 * )
 * 
 * @OA\Tag(
 *     name="Client Shipping",
 *     description="API Endpoints cho vận chuyển (Client)"
 * )
 * 
 * @OA\Tag(
 *     name="Admin Dashboard",
 *     description="API Endpoints cho dashboard (Admin)"
 * )
 * 
 * @OA\Tag(
 *     name="Admin Banners",
 *     description="API Endpoints quản lý banner (Admin)"
 * )
 * 
 * @OA\Tag(
 *     name="Admin Categories",
 *     description="API Endpoints quản lý danh mục (Admin)"
 * )
 * 
 * @OA\Tag(
 *     name="Admin Products",
 *     description="API Endpoints quản lý sản phẩm (Admin)"
 * )
 * 
 * @OA\Tag(
 *     name="Admin Orders",
 *     description="API Endpoints quản lý đơn hàng (Admin)"
 * )
 * 
 * @OA\Tag(
 *     name="Admin Users",
 *     description="API Endpoints quản lý người dùng (Admin)"
 * )
 * 
 * @OA\Tag(
 *     name="Admin Customers",
 *     description="API Endpoints quản lý khách hàng (Admin)"
 * )
 * 
 * @OA\Tag(
 *     name="Admin Colors",
 *     description="API Endpoints quản lý màu sắc (Admin)"
 * )
 * 
 * @OA\Tag(
 *     name="Admin Sizes",
 *     description="API Endpoints quản lý kích thước (Admin)"
 * )
 * 
 * @OA\Tag(
 *     name="Admin Vouchers",
 *     description="API Endpoints quản lý voucher (Admin)"
 * )
 * 
 * @OA\Tag(
 *     name="Admin Reviews",
 *     description="API Endpoints quản lý đánh giá (Admin)"
 * )
 * 
 * @OA\Tag(
 *     name="Admin Blogs",
 *     description="API Endpoints quản lý blog (Admin)"
 * )
 */

/**
 * @OA\Post(
 *     path="/api/login",
 *     summary="Đăng nhập người dùng",
 *     description="Đăng nhập với email và password",
 *     tags={"Authentication"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"email","password"},
 *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
 *             @OA\Property(property="password", type="string", format="password", example="password123")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Đăng nhập thành công",
 *         @OA\JsonContent(
 *             @OA\Property(property="token", type="string", example="1|abc123..."),
 *             @OA\Property(property="user", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Thông tin đăng nhập không đúng",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Unauthorized")
 *         )
 *     )
 * )
 * 
 * @OA\Post(
 *     path="/api/register",
 *     summary="Đăng ký người dùng mới",
 *     description="Tạo tài khoản người dùng mới",
 *     tags={"Authentication"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name","email","password","password_confirmation"},
 *             @OA\Property(property="name", type="string", example="Nguyễn Văn A"),
 *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
 *             @OA\Property(property="password", type="string", format="password", example="password123"),
 *             @OA\Property(property="password_confirmation", type="string", format="password", example="password123"),
 *             @OA\Property(property="phone", type="string", example="0123456789"),
 *             @OA\Property(property="address", type="string", example="123 Đường ABC, Quận 1, TP.HCM")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Đăng ký thành công",
 *         @OA\JsonContent(
 *             @OA\Property(property="token", type="string", example="1|abc123..."),
 *             @OA\Property(property="user", type="object"),
 *             @OA\Property(property="customer", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Dữ liệu không hợp lệ"
 *     )
 * )
 * 
 * @OA\Get(
 *     path="/api/user",
 *     summary="Lấy thông tin người dùng hiện tại",
 *     description="Lấy thông tin người dùng đang đăng nhập",
 *     tags={"Authentication"},
 *     security={{"bearerAuth": {}}},
 *     @OA\Response(response=200, description="Thành công")
 * )
 * 
 * @OA\Get(
 *     path="/api/profile",
 *     summary="Lấy profile người dùng",
 *     description="Lấy thông tin profile chi tiết",
 *     tags={"Authentication"},
 *     security={{"bearerAuth": {}}},
 *     @OA\Response(response=200, description="Thành công")
 * )
 * 
 * @OA\Post(
 *     path="/api/forgot-password",
 *     summary="Gửi link reset password",
 *     description="Gửi email chứa link reset password",
 *     tags={"Password Reset"},
 *     @OA\Response(response=200, description="Thành công")
 * )
 * 
 * @OA\Post(
 *     path="/api/reset-password",
 *     summary="Reset password",
 *     description="Đặt lại mật khẩu mới",
 *     tags={"Password Reset"},
 *     @OA\Response(response=200, description="Thành công")
 * )
 */

class SwaggerDocumentationController extends Controller
{
    // Controller này chỉ dùng để document API, không có logic thực tế
    public function index()
    {
        return response()->json(['message' => 'Swagger Documentation Controller']);
    }
} 