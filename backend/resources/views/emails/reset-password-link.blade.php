<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #1a202c; text-align: center; font-size: 24px; margin-bottom: 20px;">Chào {{ $user->name }},</h2>

        <p style="font-size: 16px; margin-bottom: 20px;">Bạn vừa yêu cầu đặt lại mật khẩu.</p>

        <p style="font-size: 16px; margin-bottom: 20px;">Nhấn vào nút bên dưới để đặt lại mật khẩu của bạn:</p>

        <p style="text-align: center; margin-bottom: 20px;">
            <a href="{{ $link }}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Đặt lại mật khẩu</a>
        </p>

        <p style="font-size: 16px; margin-bottom: 20px;">Hoặc dán đường dẫn sau vào trình duyệt nếu nút không hoạt động:</p>
        <p style="font-size: 14px; word-break: break-all; color: #4f46e5; margin-bottom: 20px;">{{ $link }}</p>

        <p style="font-size: 16px; margin-bottom: 20px;">Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.</p>

        <p style="font-size: 16px; color: #666666;">Trân trọng,<br>Đội ngũ hỗ trợ</p>
    </div>
</body>
</html>
