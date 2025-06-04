<?php

namespace App\Traits;

trait ApiResponseTrait
{
    protected function success($data = null, string $message = 'Thành công', int $code = 200)
    {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data
        ], $code);
    }

    protected function error(string $message = 'Lỗi', $errors = null, int $code = 400)
    {
        return response()->json([
            'status' => false,
            'message' => $message,
            'errors' => $errors
        ], $code);
    }
}
