<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu</title>
    <!-- Tailwind CSS qua CDN để cải thiện giao diện -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Đặt lại mật khẩu</h2>

        <form id="resetForm">
            @csrf
            <input type="hidden" id="token" name="token">
            <input type="hidden" id="email" name="email">

            <label class="block text-sm font-medium text-gray-700">Mật khẩu mới:</label><br>
            <input type="password" id="password" name="password" required
                   class="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"><br><br>
            @error('password')
                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
            @enderror

            <label class="block text-sm font-medium text-gray-700">Nhập lại mật khẩu:</label><br>
            <input type="password" id="password_confirmation" name="password_confirmation" required
                   class="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"><br><br>
            @error('password_confirmation')
                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
            @enderror

            <button type="submit"
                    class="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200">
                Xác nhận
            </button>
            <p id="message" class="text-sm mt-4 text-center"></p>
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
                    password_confirmation: document.getElementById('password_confirmation').value,
                    _token: document.querySelector('input[name="_token"]').value // Thêm CSRF token
                };

                try {
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
                } catch (error) {
                    document.getElementById('message').innerText = 'Đã có lỗi xảy ra. Vui lòng thử lại!';
                    document.getElementById('message').style.color = 'red';
                }
            });
        </script>
    </div>
</body>
</html>
