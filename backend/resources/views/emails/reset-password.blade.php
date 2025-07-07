<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Đặt lại mật khẩu</title>
</head>
<body>
  <h2>Đặt lại mật khẩu</h2>

  <form id="resetForm">
    <input type="hidden" id="token" name="token">
    <input type="hidden" id="email" name="email">

    <label>Mật khẩu mới:</label><br>
    <input type="password" id="password" name="password" required><br><br>

    <label>Nhập lại mật khẩu:</label><br>
    <input type="password" id="password_confirmation" name="password_confirmation" required><br><br>

    <button type="submit">Xác nhận</button>
    <p id="message"></p>
  </form>

  <script>
    // Lấy token và email từ URL
    const params = new URLSearchParams(window.location.search);
    document.getElementById('token').value = params.get('token');
    document.getElementById('email').value = params.get('email');

    document.getElementById('resetForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        token: document.getElementById('token').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        password_confirmation: document.getElementById('password_confirmation').value
      };

      const res = await fetch('http://localhost:8000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      document.getElementById('message').innerText = result.message;

      if (result.status) {
        document.getElementById('message').style.color = 'green';
      } else {
        document.getElementById('message').style.color = 'red';
      }
    });
  </script>
</body>
</html>
