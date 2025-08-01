import {
    EditButton,
    List,
    ShowButton, TextField,
    useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import {
    Breadcrumb,
    Space,
    Table,
    Tag,
    Button,
    Modal,
    Form,
    Select,
    Row,
    Col,
    Input,
    DatePicker,
    message,
    notification
} from "antd";
import React, { useState } from "react";
import { useUpdate } from "@refinedev/core";
import { DateField } from "@refinedev/antd";
import { convertToInt } from "../../../helpers/common";
import {statusMap, validTransitions} from "../../../types/OrderStatusInterface";
import {paymentStatusMap} from "../../../types/PaymentStatusInterface";
import {paymentMethodMap} from "../../../types/PaymentMethodMap";
import {axiosInstance} from "../../../utils/axios";

export const OrdersList = () => {
    const { tableProps, setFilters, tableQueryResult } = useTable({
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
    const [selectedOrder, setSelectedOrder] = useState<BaseRecord | null>(null);
    const [form] = Form.useForm();
    const { mutate } = useUpdate();

    const handleUpdateStatus = (order: BaseRecord) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
        form.setFieldsValue({ order_status: order.status });
    };

    const handleModalOk = () => {
        form.validateFields()
            .then(async (values) => {
                if (!selectedOrder) {
                    message.error("Không tìm thấy đơn hàng!");
                    return;
                }

                const allowed = validTransitions[selectedOrder.status] || [];
                if (!allowed.includes(values.order_status)) {
                    message.error("Không thể chuyển sang trạng thái này!");
                    return;
                }

                try {
                    const response = await axiosInstance.put(`/api/orders/${selectedOrder.id}`, {
                        order_status: values.order_status == 'ready_to_pick' ? 'shipping' : values.order_status,
                    });
                    if (response?.data?.status == "false") {
                        return notification.error({ message: response?.data?.errors.order_status[0] || "Cập nhật đơn hàng thất bại"});
                    }
                    tableQueryResult.refetch();
                    setIsModalVisible(false);
                    form.resetFields();
                    setSelectedOrder(null);
                    notification.success({ message: response?.data?.message || "Cập nhật đơn hàng thành công !"});
                } catch (error) {
                    console.error("Cập nhật thất bại:", error);
                    notification.error({ message: "Cập nhật đơn hàng thất bại"});
                }
            })
            .catch(() => {
                message.error("Vui lòng kiểm tra lại thông tin!");
            });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setSelectedOrder(null);
    };

    const handleFilter = (values: any) => {
        setFilters([
            { field: "order_code", operator: "eq", value: values.order_code || undefined },
            { field: "order_date", operator: "eq", value: values.order_date ? values.order_date.format("YYYY-MM-DD") : undefined },
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
                <Table {...tableProps} rowKey="id" rowClassName={(record) => {
                    if (record.order_status === "completed" && record.payment_status === "paid") {
                        return "bg-green-100";
                    } else if (record.order_status === "canceled") {
                        return "bg-red-100";
                    }
                    return "";
                }}>
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
                        title="Trạng thái đơn hàng"
                        dataIndex="status"
                        render={(value: string) => {
                            const status = statusMap[value];
                            return status ? (
                                <Tag color={status.cssColor}>{status.label}</Tag>
                            ) : (
                                <Tag>{value}</Tag>
                            );
                        }}
                    />
                    {/*<Table.Column*/}
                    {/*    title="Trạng thái giao hàng"*/}
                    {/*    dataIndex="shipping_status"*/}
                    {/*    render={(value: string) => {*/}
                    {/*        const status = statusMap[value];*/}
                    {/*        return status ? (*/}
                    {/*            <Tag color={status.color}>{status.label}</Tag>*/}
                    {/*        ) : (*/}
                    {/*            <Tag>{value}</Tag>*/}
                    {/*        );*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <Table.Column
                        title="Phương thức thanh toán"
                        dataIndex="payment_method"
                        render={(value: string) =>
                            (
                                <Tag
                                    color={paymentMethodMap[value]?.color}
                                >
                                    {paymentMethodMap[value]?.label || value}
                                </Tag>
                            )
                        }
                    />
                    <Table.Column
                        title="Trạng thái thanh toán"
                        dataIndex="payment_status"
                        render={(value: string) => {
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
                                <EditButton hideText size="large" onClick={() => handleUpdateStatus(record)} />
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
                        <Select placeholder="Chọn trạng thái" style={{ width: "100%" }}>
                            {Object.entries(statusMap).map(([key, { label }]) => (
                                <Select.Option
                                    key={key}
                                    value={key}
                                    disabled={selectedOrder ? !validTransitions[selectedOrder.status]?.includes(key) : true}
                                >
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