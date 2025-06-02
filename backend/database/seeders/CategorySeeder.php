<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::insert([
            [
                'slug' => 'dien-thoai',
                'name' => 'Điện thoại',
                'description' => 'Các loại điện thoại',
                'image' => 'dien-thoai.jpg',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slug' => 'laptop',
                'name' => 'Laptop',
                'description' => 'Máy tính xách tay',
                'image' => 'laptop.jpg',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
