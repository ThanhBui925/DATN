<h2>Chào {{ $user->name }},</h2>

<p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>

<p>Nhấn vào nút bên dưới để đặt lại mật khẩu của bạn:</p>

<p><a href="{{ $link }}" style="padding: 10px 20px; background-color: #3490dc; color: white; text-decoration: none;">Đặt lại mật khẩu</a></p>

<p>Hoặc dán đường dẫn sau vào trình duyệt nếu nút không hoạt động:</p>
<p>{{ $link }}</p>

<p>Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.</p>

<p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
