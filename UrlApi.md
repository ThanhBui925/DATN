// DANH MỤCMỤC
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
http://localhost:8000/api/products/{id} -> GET : Xem chi tiết danh mục theo id
http://localhost:8000/api/products/{id} -> PUT : Sửa sản phẩm 
http://localhost:8000/api/products/{id} -> DELETE : Xóa sản phẩm
http://localhost:8000/api/products/{id}/restore -> POST : khôi phục sản phẩm đã xóa
http://localhost:8000/api/products/trashed -> GET : Xem sản phẩm đã xóa


// ĐĂNG KÝ ĐĂNG NHẬP
http://localhost:8000/api/register -> POST : Đăng ký tài khoản
http://localhost:8000/api/login -> POST : Đăng nhập


/// ĐƠN HÀNG
http://localhost:8000/api/orders  -> GET : Lấy tất cả đơn hàng
http://localhost:8000/api/orders/{id}/status -> PUT : Cập nhật trạng thái đơn hàng
http://localhost:8000/api/orders/search -> GET : Tìm kiếm đơn hàng theo tên sản phẩm
http://localhost:8000/api/orders/{id}/detail -> GET : Xem chi tiết đơn hàng theo id
http://localhost:8000/api/orders/{id}/pdf -> GET : Xuất ra file pdf của đơn hàng


// TÀI KHOẢN
http://localhost:8000/api/users  -> GET : Lấy tất cả tài khoản
http://localhost:8000/api/users?search=(admin,user)  -> GET : Tìm kiếm, lọc theo vai trò (admin, khách hàng, v.v.)
http://localhost:8000/api/users/{id}/toggle-status -> PUT : Khóa/Mở tài khoản
http://localhost:8000/api/users/{id}/reset-password -> PUT : Đặt lại mật khẩu tài khoản


