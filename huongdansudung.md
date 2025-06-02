
# Hướng dẫn chạy dự án DATN
Lưu ý quan trọng

Mỗi lần pull về cần đọc lại hdsd
Mỗi lần pull về cần đọc lại hdsd
Mỗi lần pull về cần đọc lại hdsd

Lưu ý tắt hết laragon và xampp để tránh xung đột cổng
## 1. Cài đặt thư viện backend (Laravel)

Mở terminal và chạy:

```bash
cd backend
composer install
```

---

## 2. Cài đặt thư viện frontend (React)

Mở tab terminal mới và chạy:

```bash
cd frontend
npm install
```

---
Sau khi đã cài đặt đầy đủ thư viện của BE và FE
## 3. Khởi động hệ thống bằng Docker

Quay về thư mục gốc dự án (`DATN`), chạy:

```bash
docker compose up -d --build

```

---

## 4. Kiểm tra container đang chạy

Mở Docker Desktop, đảm bảo các container sau đang chạy:

| Container          | Mục đích               | Đường dẫn kiểm tra                 |
|--------------------|------------------------|----------------------------------|
| `laravel_backend`  | Backend Laravel        | [http://localhost:8000](http://localhost:8000) |
| `react_frontend`   | Frontend React         | [http://localhost:3000](http://localhost:3000) |
| `phpmyadmin`       | Giao diện quản lý MySQL| [http://localhost:8080](http://localhost:8080) |

---
Sau khi đã chạy thành công chỉ cần run các container trên docker
Nếu có thay đổi Dockerfile cần chạy
docker-compose down

docker-compose up -d --build
## 5. Migration cơ sở dữ liệu

- Nếu tạo migration mới :
docker exec -it laravel_backend php artisan make:model tên_bảng --all
Sau đó chạy :
```bash
docker-compose run --rm migrate # = php artisan migrate
```

Muốn chạy seeder
```bash
docker-compose run --rm migrate php artisan db:seed # = php artisan db:seed
```
để migrate lên csdl
- Nếu muốn dùng migrate như bình thường thì tại thư mục backend chạy câu lệnh dưới để vào bên trong container
docker exec -it laravel_backend bash
Sau khi vào xong sẽ hiện dòng này trong cmd
root@947a34b7feec:/var/www/html# 
Trong đây có thể chạy php artisan migrate, ...

---

## 6. Một số lưu ý

- Không chạy lệnh `php artisan migrate` trực tiếp trên máy host, phải chạy qua Docker(Hướng dẫn số 5).
- Nếu thay đổi `.env` hoặc cấu hình, nên chạy lại:

```bash
docker-compose down
docker-compose up -d --build
```

---

## Liên hệ hỗ trợ

Nếu gặp lỗi hoặc cần hỗ trợ, liên hệ qua zalo để hỗ trợ.
