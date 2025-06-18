<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Customer;
use App\Models\Shipping;
use App\Models\Voucher;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;

class OrderTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $adminUser;
    protected $customerUser;
    protected $customer;
    protected $shipping;
    protected $product;
    protected $voucher;

    protected function setUp(): void
    {
        parent::setUp();

        // Tạo user admin
        $this->adminUser = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'),
        ]);

        // Tạo user customer
        $this->customerUser = User::factory()->create([
            'role' => 'client',
            'email' => 'customer@example.com',
            'password' => bcrypt('password123'),
        ]);

        // Tạo customer
        $this->customer = Customer::factory()->create([
            'user_id' => $this->customerUser->id,
            'name' => $this->faker->name,
        ]);

        // Tạo shipping
        $this->shipping = Shipping::factory()->create([
            'name' => $this->faker->company,
            'price' => 20000,
        ]);

        // Tạo product
        $this->product = Product::factory()->create([
            'name' => 'Áo thun',
            'price' => 100000,
            'status' => 'active',
        ]);

        // Tạo voucher
        $this->voucher = Voucher::factory()->create([
            'code' => 'DISC10',
            'discount' => 10,
            'discount_type' => 'percentage',
            'status' => 'active',
        ]);
    }

    public function test_create_order_successfully()
    {
        $response = $this->actingAs($this->customerUser)->postJson('/api/orders', [
            'customer_id' => $this->customer->id,
            'shipping_id' => $this->shipping->id,
            'user_id' => $this->customerUser->id,
            'shipping_address' => '123 Đường ABC',
            'payment_method' => 'cash',
            'recipient_name' => 'Nguyen Van A',
            'recipient_phone' => '0909123456',
            'order_items' => [
                [
                    'product_id' => $this->product->id,
                    'quantity' => 2,
                    'price' => 100000,
                ],
            ],
            'voucher_code' => 'DISC10',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['message' => 'Order created successfully'])
                 ->assertJsonStructure(['data' => ['id', 'slug', 'date_order', 'total_price', 'order_status', 'payment_status', 'shipping_address', 'payment_method', 'user_id', 'customer_id', 'shipping_id', 'recipient_name', 'recipient_phone', 'voucher_id']]);

        $this->assertDatabaseHas('shop_order', [
            'user_id' => $this->customerUser->id,
            'total_price' => 180000, // 200000 - 10% discount
        ]);
    }

    public function test_get_order_list_by_date()
    {
        $order = Order::factory()->create([
            'user_id' => $this->customerUser->id,
            'customer_id' => $this->customer->id,
            'date_order' => now(),
        ]);

        $response = $this->actingAs($this->adminUser)->getJson('/api/orders?date=' . now()->format('Y-m-d'));

        $response->assertStatus(200)
                 ->assertJsonCount(1)
                 ->assertJsonFragment(['id' => $order->id]);
    }

    public function test_update_order_status_successfully()
    {
        $order = Order::factory()->create([
            'user_id' => $this->customerUser->id,
            'customer_id' => $this->customer->id,
        ]);

        $response = $this->actingAs($this->adminUser)->putJson("/api/orders/{$order->id}", [
            'order_status' => 'completed',
            'payment_status' => 'paid',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Order status updated successfully'])
                 ->assertJsonFragment(['order_status' => 'completed', 'payment_status' => 'paid']);

        $this->assertDatabaseHas('shop_order', [
            'id' => $order->id,
            'order_status' => 'completed',
            'payment_status' => 'paid',
        ]);
    }

    public function test_search_order_by_product()
    {
        $order = Order::factory()->create([
            'user_id' => $this->customerUser->id,
            'customer_id' => $this->customer->id,
        ]);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $this->product->id,
        ]);

        $response = $this->actingAs($this->adminUser)->getJson('/api/orders/search?product_name=Áo');

        $response->assertStatus(200)
                 ->assertJsonCount(1)
                 ->assertJsonFragment(['id' => $order->id]);
    }

    public function test_generate_pdf_successfully()
    {
        $order = Order::factory()->create([
            'user_id' => $this->customerUser->id,
            'customer_id' => $this->customer->id,
        ]);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $this->product->id,
        ]);

        $response = $this->actingAs($this->adminUser)->get("/api/orders/{$order->id}/pdf");

        $response->assertStatus(200)
                 ->assertDownload('invoice_' . $order->id . '.pdf');
    }
}