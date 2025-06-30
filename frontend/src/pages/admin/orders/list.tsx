import {
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import {Breadcrumb, Space, Table, Tag, Button, Modal, Form, Select, Row, Col, Input, DatePicker} from "antd";
import React, { useState } from "react";
import { useUpdate } from "@refinedev/core";
import { DateField } from "@refinedev/antd";
import {convertToInt} from "../../../helpers/common";

export const OrdersList = () => {
    const { tableProps, setFilters } = useTable({
        syncWithLocation: true,
        filters: {
            initial: [
                { field: "order_code", operator: "eq", value: undefined },
                { field: "order_date", operator: "eq", value: undefined },
                { field: "phone", operator: "eq", value: undefined },
                { field: "status", operator: "eq", value: undefined },
            ],
        },
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [form] = Form.useForm();
    const { mutate } = useUpdate();

    const statusMap: Record<string, { color: string; label: string }> = {
        confirming: { color: "blue", label: "Đang xác nhận" },
        confirmed: { color: "cyan", label: "Đã xác nhận" },
        preparing: { color: "purple", label: "Đang chuẩn bị" },
        shipping: { color: "orange", label: "Đang giao" },
        delivered: { color: "green", label: "Đã giao" },
        completed: { color: "success", label: "Hoàn thành" },
        canceled: { color: "red", label: "Đã hủy" },
        pending: { color: "default", label: "Chờ xử lý" },
    };

    const handleUpdateStatus = (orderId: any) => {
        setSelectedOrderId(orderId);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            mutate({
                resource: "orders",
                id: selectedOrderId!,
                values: { order_status: values.order_status },
            });
            setIsModalVisible(false);
            form.resetFields();
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleFilter = (values: any) => {
        setFilters([
            { field: "order_code", operator: "eq", value: values.order_code || undefined },
            { field: "order_date", operator: "eq", value: values.order_date.format("YYYY-MM-DD") || undefined },
            { field: "phone", operator: "eq", value: values.phone || undefined },
            { field: "status", operator: "eq", value: values.status || undefined },
        ]);
    };

    const handleReset = () => {
        form.resetFields();
        setFilters([
            { field: "order_code", operator: "eq", value: undefined },
            { field: "order_date", operator: "eq", value: undefined },
            { field: "phone", operator: "eq", value: undefined },
            { field: "status", operator: "eq", value: undefined },
        ]);
    };

    return (
        <>
            <List
                title={`Đơn hàng`}
                breadcrumb={
                    <Breadcrumb>
                        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item>Đơn hàng</Breadcrumb.Item>
                    </Breadcrumb>
                }
                headerButtons={false}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFilter}
                    style={{ marginBottom: 16 }}
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item label="Mã đơn hàng" name="order_code">
                                <Input placeholder="Không nhập dấu #" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item label="Số điện thoại" name="phone">
                                <Input placeholder="Nhập số điện thoại người nhận" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item label="Ngày đặt" name="order_date">
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item label="Trạng thái" name="status">
                                <Select
                                    placeholder="Chọn trạng thái"
                                    allowClear={true}
                                    mode={'multiple'}
                                >
                                    {Object.entries(statusMap).map(([key, { label }]) => (
                                        <Select.Option key={key} value={key}>
                                            {label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label=" ">
                                <Space>
                                    <Button type="primary" htmlType="submit">
                                        Lọc
                                    </Button>
                                    <Button onClick={handleReset}>Xóa bộ lọc</Button>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Table {...tableProps} rowKey="id">
                    <Table.Column
                        title="STT"
                        key="index"
                        render={(text, record, index) => index + 1}
                    />
                    <Table.Column
                        title="Mã đơn hàng"
                        dataIndex="id"
                        render={(value: string) => (value ? `#${value}` : "-")}
                    />
                    <Table.Column
                        title="Ngày đặt"
                        dataIndex="date_order"
                        render={(value: any) => <DateField value={value} format="DD/MM/YYYY HH:mm" />}
                    />
                    <Table.Column
                        title="Tổng tiền"
                        dataIndex="total_price"
                        render={(value: number) =>
                            value ? `${convertToInt(value)} VNĐ` : "0 VNĐ"
                        }
                    />
                    <Table.Column
                        title="Trạng thái đơn"
                        dataIndex="order_status"
                        render={(value: string) => {
                            const status = statusMap[value];
                            return status ? (
                                <Tag color={status.color}>{status.label}</Tag>
                            ) : (
                                <Tag>{value}</Tag>
                            );
                        }}
                    />
                    <Table.Column
                        title="Phương thức thanh toán"
                        dataIndex="payment_method"
                        render={(value: string) => {
                            const paymentMap: Record<string, string> = {
                                cash: "Tiền mặt",
                                card: "Thẻ",
                                paypal: "PayPal",
                                vnpay: "VNPay",
                            };
                            return paymentMap[value] || value || "-";
                        }}
                    />
                    <Table.Column
                        title="Trạng thái thanh toán"
                        dataIndex="payment_status"
                        render={(value: string) => {
                            const paymentStatusMap: Record<string, { color: string; label: string }> = {
                                unpaid: { color: "red", label: "Chưa thanh toán" },
                                paid: { color: "green", label: "Đã thanh toán" },
                            };
                            const status = paymentStatusMap[value];
                            return status ? (
                                <Tag color={status.color}>{status.label}</Tag>
                            ) : (
                                <Tag>{value}</Tag>
                            );
                        }}
                    />
                    <Table.Column
                        title="Người nhận"
                        render={(record: any) => (
                            <>
                                <div style={{ fontWeight: 600 }}>{record.recipient_name}</div>
                                <div>{record.recipient_phone}</div>
                                <div>{record?.recipient_email}</div>
                            </>
                        )}
                    />
                    <Table.Column
                        title="Hành động"
                        dataIndex="actions"
                        render={(_, record: BaseRecord) => (
                            <Space>
                                <EditButton hideText size="large" onClick={() => handleUpdateStatus(record.id)}/>
                                <ShowButton hideText size="large" recordItemId={record.id} />
                            </Space>
                        )}
                    />
                </Table>
            </List>
            <Modal
                title="Cập nhật trạng thái đơn hàng"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="order_status"
                        label="Trạng thái đơn hàng"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái đơn hàng" }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            {Object.entries(statusMap).map(([key, { label }]) => (
                                <Select.Option key={key} value={key}>
                                    {label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};