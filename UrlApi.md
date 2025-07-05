// DANH MỤC
http://localhost:8000/api/categories -> GET : Lấy tất cả dữ liệu của danh mục
http://localhost:8000/api/categories -> POST : Thêm Danh Mục
http://localhost:8000/api/categories/{id} -> PUT : Sửa danh mục
http://localhost:8000/api/categories/{id} -> GET : Xem chi tiết danh mục theo id
http://localhost:8000/api/categories/{id} -> DELETE : Xóa mềm danh mục
http://localhost:8000/api/categories/{id}/force-delete -> Delete : Xóa vĩnh viễn danh mục đã xóa mềm
http://localhost:8000/api/categories/{id}/restore -> POST : Khôi phục danh mục đã xóa mềm
http://localhost:8000/api/categories/trashed -> GET : Xem Danh mục đã xóa

// SẢN PHẨM
http://localhost:8000/api/products -> GET : Lấy tất cả dữ liệu của sản phẩm
http://localhost:8000/api/products -> POST : Thêm mới sản phẩm
http://localhost:8000/api/products/{id} -> GET : Xem chi tiết sản phẩm theo id
http://localhost:8000/api/products/{id} -> PUT : Sửa sản phẩm 
http://localhost:8000/api/products/{id} -> DELETE : Xóa sản phẩm
http://localhost:8000/api/products/{id}/restore -> POST : khôi phục sản phẩm đã xóa
http://localhost:8000/api/products/trashed -> GET : Xem sản phẩm đã xóa

// ĐĂNG KÝ ĐĂNG NHẬP
http://localhost:8000/api/register -> POST : Đăng ký tài khoản
http://localhost:8000/api/login -> POST : Đăng nhập
http://localhost:8000/api/user -> GET : Lấy thông tin user hiện tại

// ĐƠN HÀNG (ADMIN)
http://localhost:8000/api/orders -> GET : Lấy tất cả đơn hàng (có thể lọc theo date, month/year, start_date/end_date, status, user_id)
http://localhost:8000/api/orders -> POST : Tạo đơn hàng mới (Admin)
http://localhost:8000/api/orders/search -> GET : Tìm kiếm đơn hàng theo tên sản phẩm (query: product_name)
http://localhost:8000/api/orders/{id}/pdf -> GET : Xuất ra file pdf của đơn hàng
http://localhost:8000/api/orders/{id} -> GET : Xem chi tiết đơn hàng theo id
http://localhost:8000/api/orders/{id} -> PUT : Cập nhật trạng thái đơn hàng (body: order_status)

// ĐƠN HÀNG (CLIENT)
http://localhost:8000/api/client/orders -> GET : Lấy danh sách đơn hàng của user hiện tại (có thể lọc theo status, date)
http://localhost:8000/api/client/orders -> POST : Tạo đơn hàng mới từ giỏ hàng
http://localhost:8000/api/client/orders/{id} -> GET : Xem chi tiết đơn hàng của user
http://localhost:8000/api/client/orders/{id}/cancel -> PUT : Hủy đơn hàng (body: cancel_reason, chỉ cho phép ở trạng thái pending/confirming)

// TÀI KHOẢN
http://localhost:8000/api/users -> GET : Lấy tất cả tài khoản (có thể tìm kiếm theo search)
http://localhost:8000/api/users/{id}/toggle-status -> PUT : Khóa/Mở tài khoản
http://localhost:8000/api/users/{id}/reset-password -> PUT : Đặt lại mật khẩu tài khoản (body: password, password_confirmation)
http://localhost:8000/api/users/{id}/role -> PUT : Cập nhật vai trò user (body: role)

// BANNER
http://localhost:8000/api/banners -> GET : Lấy tất cả banner
http://localhost:8000/api/banners -> POST : Thêm banner mới
http://localhost:8000/api/banners/{id} -> GET : Xem chi tiết banner
http://localhost:8000/api/banners/{id} -> PUT : Cập nhật banner
http://localhost:8000/api/banners/{id} -> DELETE : Xóa banner

// VOUCHER
http://localhost:8000/api/vouchers -> GET : Lấy tất cả voucher
http://localhost:8000/api/vouchers -> POST : Tạo voucher mới
http://localhost:8000/api/vouchers/{id} -> GET : Xem chi tiết voucher
http://localhost:8000/api/vouchers/{id} -> PUT : Cập nhật voucher
http://localhost:8000/api/vouchers/{id} -> DELETE : Xóa voucher
http://localhost:8000/api/vouchers/apply -> POST : Áp dụng voucher

// REVIEW
http://localhost:8000/api/reviews -> GET : Lấy tất cả review
http://localhost:8000/api/reviews -> POST : Tạo review mới
http://localhost:8000/api/reviews/{id} -> GET : Xem chi tiết review
http://localhost:8000/api/reviews/{id} -> PUT : Cập nhật review
http://localhost:8000/api/reviews/{id} -> DELETE : Xóa review
http://localhost:8000/api/reviews/{id}/reply -> POST : Trả lời review

// BLOG
http://localhost:8000/api/blogs -> GET : Lấy tất cả blog
http://localhost:8000/api/blogs -> POST : Tạo blog mới
http://localhost:8000/api/blogs/{id} -> GET : Xem chi tiết blog
http://localhost:8000/api/blogs/{id} -> PUT : Cập nhật blog
http://localhost:8000/api/blogs/{id} -> DELETE : Xóa blog
http://localhost:8000/api/blogs/{id}/hide -> PUT : Ẩn blog
http://localhost:8000/api/blogs/{blogId}/comments -> GET : Lấy comment của blog
http://localhost:8000/api/blogs/{blogId}/comments -> POST : Tạo comment cho blog
http://localhost:8000/api/blogs/comments/{commentId} -> DELETE : Xóa comment
http://localhost:8000/api/blogs/comments/{commentId}/restore -> PUT : Khôi phục comment

// CART (ADMIN)
http://localhost:8000/api/cart -> GET : Lấy tất cả giỏ hàng
http://localhost:8000/api/cart -> POST : Tạo giỏ hàng mới
http://localhost:8000/api/cart -> PUT : Cập nhật giỏ hàng
http://localhost:8000/api/cart -> DELETE : Xóa giỏ hàng

// CART (CLIENT)
http://localhost:8000/api/client/cart -> GET : Lấy giỏ hàng của user hiện tại
http://localhost:8000/api/client/cart/items -> POST : Thêm sản phẩm vào giỏ hàng
http://localhost:8000/api/client/cart/items/{itemId} -> PUT : Cập nhật số lượng sản phẩm trong giỏ hàng
http://localhost:8000/api/client/cart/items/{itemId} -> DELETE : Xóa sản phẩm khỏi giỏ hàng

// PRODUCTS (CLIENT)
http://localhost:8000/api/client/products -> GET : Lấy tất cả sản phẩm (có thể lọc theo category_id, name_like, status)
http://localhost:8000/api/client/products/{id} -> GET : Xem chi tiết sản phẩm

// CATEGORIES (CLIENT)
http://localhost:8000/api/client/categories -> GET : Lấy tất cả danh mục
http://localhost:8000/api/client/categories/{id} -> GET : Xem chi tiết danh mục

// CUSTOMERS
http://localhost:8000/api/customers -> GET : Lấy tất cả khách hàng
http://localhost:8000/api/customers -> POST : Tạo khách hàng mới
http://localhost:8000/api/customers/{id} -> GET : Xem chi tiết khách hàng
http://localhost:8000/api/customers/{id} -> PUT : Cập nhật khách hàng
http://localhost:8000/api/customers/{id} -> DELETE : Xóa khách hàng

// COLORS
http://localhost:8000/api/colors -> GET : Lấy tất cả màu sắc
http://localhost:8000/api/colors -> POST : Tạo màu sắc mới
http://localhost:8000/api/colors/{id} -> PUT : Cập nhật màu sắc
http://localhost:8000/api/colors/{id} -> DELETE : Xóa màu sắc

// SIZES
http://localhost:8000/api/sizes -> GET : Lấy tất cả kích thước
http://localhost:8000/api/sizes -> POST : Tạo kích thước mới
http://localhost:8000/api/sizes/{id} -> PUT : Cập nhật kích thước
http://localhost:8000/api/sizes/{id} -> DELETE : Xóa kích thước

// DASHBOARD
http://localhost:8000/api/dashboard/total-revenue -> GET : Tổng doanh thu
http://localhost:8000/api/dashboard/total-orders -> GET : Tổng đơn hàng
http://localhost:8000/api/dashboard/total-customers -> GET : Tổng số khách hàng
http://localhost:8000/api/dashboard/average-order-value -> GET : Giá trị đơn hàng trung bình
http://localhost:8000/api/dashboard/average-rating -> GET : Đánh giá trung bình
http://localhost:8000/api/dashboard/monthly-revenue -> GET : Doanh thu hàng tháng
http://localhost:8000/api/dashboard/user-growth -> GET : Tăng trưởng người dùng
http://localhost:8000/api/dashboard/revenue-by-category -> GET : Doanh thu theo danh mục

// FORGOT PASSWORD
http://localhost:8000/api/forgot-password -> POST : Gửi link reset password
http://localhost:8000/api/reset-password -> POST : Reset password


