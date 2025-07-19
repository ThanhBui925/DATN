<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use App\Models\Address;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderAddressUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $order;
    protected $address;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Tạo user test
        $this->user = User::factory()->create([
            'role' => 'client'
        ]);
        
        // Tạo địa chỉ test
        $this->address = Address::factory()->create([
            'user_id' => $this->user->id,
            'address' => '123 Test Street',
            'recipient_name' => 'Test User',
            'recipient_phone' => '0123456789',
            'recipient_email' => 'test@example.com'
        ]);
        
        // Tạo đơn hàng test
        $this->order = Order::factory()->create([
            'user_id' => $this->user->id,
            'order_status' => 'pending',
            'shipping_address' => 'Old Address',
            'recipient_name' => 'Old Name',
            'recipient_phone' => '0987654321',
            'recipient_email' => 'old@example.com'
        ]);
    }

    public function test_user_can_update_order_address_with_existing_address()
    {
        Sanctum::actingAs($this->user);

        $response = $this->putJson("/api/client/orders/{$this->order->id}/address", [
            'address_id' => $this->address->id
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => true,
                     'message' => 'Cập nhật địa chỉ đơn hàng thành công'
                 ]);

        $this->order->refresh();
        $this->assertEquals($this->address->address, $this->order->shipping_address);
        $this->assertEquals($this->address->recipient_name, $this->order->recipient_name);
        $this->assertEquals($this->address->recipient_phone, $this->order->recipient_phone);
        $this->assertEquals($this->address->recipient_email, $this->order->recipient_email);
    }

    public function test_user_can_update_order_address_with_new_address()
    {
        Sanctum::actingAs($this->user);

        $newAddressData = [
            'shipping_address' => '456 New Street',
            'recipient_name' => 'New User',
            'recipient_phone' => '0111222333',
            'recipient_email' => 'new@example.com'
        ];

        $response = $this->putJson("/api/client/orders/{$this->order->id}/address", $newAddressData);

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => true,
                     'message' => 'Cập nhật địa chỉ đơn hàng thành công'
                 ]);

        $this->order->refresh();
        $this->assertEquals($newAddressData['shipping_address'], $this->order->shipping_address);
        $this->assertEquals($newAddressData['recipient_name'], $this->order->recipient_name);
        $this->assertEquals($newAddressData['recipient_phone'], $this->order->recipient_phone);
        $this->assertEquals($newAddressData['recipient_email'], $this->order->recipient_email);
    }

    public function test_cannot_update_order_address_when_not_authenticated()
    {
        $response = $this->putJson("/api/client/orders/{$this->order->id}/address", [
            'address_id' => $this->address->id
        ]);

        $response->assertStatus(401);
    }

    public function test_cannot_update_other_user_order_address()
    {
        $otherUser = User::factory()->create(['role' => 'client']);
        Sanctum::actingAs($otherUser);

        $response = $this->putJson("/api/client/orders/{$this->order->id}/address", [
            'address_id' => $this->address->id
        ]);

        $response->assertStatus(404);
    }

    public function test_cannot_update_order_address_when_order_status_not_allowed()
    {
        $this->order->update(['order_status' => 'shipping']);
        Sanctum::actingAs($this->user);

        $response = $this->putJson("/api/client/orders/{$this->order->id}/address", [
            'address_id' => $this->address->id
        ]);

        $response->assertStatus(400)
                 ->assertJson([
                     'status' => false,
                     'message' => 'Chỉ có thể thay đổi địa chỉ đơn hàng ở trạng thái chờ xác nhận hoặc đang xác nhận'
                 ]);
    }

    public function test_cannot_update_order_address_with_invalid_address_id()
    {
        Sanctum::actingAs($this->user);

        $response = $this->putJson("/api/client/orders/{$this->order->id}/address", [
            'address_id' => 99999
        ]);

        $response->assertStatus(404);
    }

    public function test_cannot_update_order_address_with_other_user_address()
    {
        $otherUser = User::factory()->create(['role' => 'client']);
        $otherAddress = Address::factory()->create(['user_id' => $otherUser->id]);
        
        Sanctum::actingAs($this->user);

        $response = $this->putJson("/api/client/orders/{$this->order->id}/address", [
            'address_id' => $otherAddress->id
        ]);

        $response->assertStatus(404);
    }
} 