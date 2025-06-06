import { DateField, Show, TextField, EditButton } from "@refinedev/antd";
import { useShow, useUpdate } from "@refinedev/core";
import { Typography, Row, Col, Breadcrumb, Tag, Table, Modal, Form, Select } from "antd";
import { useState } from "react";

const { Title } = Typography;

export const OrdersShow = () => {
    const { queryResult } = useShow({});
    const { data, isLoading } = queryResult;
    const record = data?.data;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { mutate } = useUpdate();

    const statusMap: Record<string, { color: string; label: string }> = {
        confirming: { color: "gold", label: "Đang xác nhận" },
        confirmed: { color: "blue", label: "Đã xác nhận" },
        preparing: { color: "orange", label: "Đang chuẩn bị" },
        shipping: { color: "cyan", label: "Đang giao hàng" },
        delivered: { color: "green", label: "Đã giao hàng" },
        completed: { color: "purple", label: "Hoàn tất" },
        canceled: { color: "red", label: "Đã hủy" },
        pending: { color: "default", label: "Chờ xử lý" },
    };

    const paymentStatusMap: Record<string, { color: string; label: string }> = {
        unpaid: { color: "red", label: "Chưa thanh toán" },
        paid: { color: "green", label: "Đã thanh toán" },
    };

    const paymentMethodMap: Record<string, string> = {
        cash: "Tiền mặt",
        card: "Thẻ",
        paypal: "PayPal",
        vnpay: "VNPay",
    };

    const handleUpdateStatus = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            mutate({
                resource: "shop_order",
                id: record?.id,
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

    return (
        <>
            <Show
                isLoading={isLoading}
                title={"Chi tiết đơn hàng"}
                breadcrumb={
                    <Breadcrumb>
                        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item>Đơn hàng</Breadcrumb.Item>
                        <Breadcrumb.Item>Chi tiết</Breadcrumb.Item>
                        <Breadcrumb.Item>{`Đơn hàng #${record?.id || "-"}`}</Breadcrumb.Item>
                    </Breadcrumb>
                }
                headerButtons={() => (
                    <EditButton onClick={handleUpdateStatus}>Cập nhật trạng thái</EditButton>
                )}
            >
                <Row gutter={[24, 24]} style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}>
                    <Col span={12}>
                        <Title level={4}>Thông tin đơn hàng</Title>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Title level={5}>Mã đơn hàng</Title>
                                <TextField value={`#${record?.id || "-"}`} />
                            </Col>
                            <Col span={24}>
                                <Title level={5}>Ngày đặt hàng</Title>
                                <DateField value={record?.date_order} format="DD/MM/YYYY HH:mm" />
                            </Col>
                            <Col span={24}>
                                <Title level={5}>Tổng tiền</Title>
                                <TextField
                                    value={
                                        record?.total_price
                                            ? `${record.total_price.toLocaleString("vi-VN")} VNĐ`
                                            : "0.00 VNĐ"
                                    }
                                />
                            </Col>
                            <Col span={24}>
                                <Title level={5}>Trạng thái đơn hàng</Title>
                                {record?.order_status ? (
                                    <Tag color={statusMap[record.order_status]?.color}>
                                        {statusMap[record.order_status]?.label || record.order_status}
                                    </Tag>
                                ) : (
                                    <TextField value="Không có trạng thái" />
                                )}
                            </Col>
                            <Col span={24}>
                                <Title level={5}>Lý do hủy</Title>
                                <TextField value={record?.cancel_reason || "Không có"} />
                            </Col>
                            <Col span={24}>
                                <Title level={5}>Trạng thái thanh toán</Title>
                                {record?.payment_status ? (
                                    <Tag color={paymentStatusMap[record.payment_status]?.color}>
                                        {paymentStatusMap[record.payment_status]?.label || record.payment_status}
                                    </Tag>
                                ) : (
                                    <TextField value="-" />
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Title level={4}>Thông tin giao hàng</Title>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Title level={5}>Phương thức thanh toán</Title>
                                <TextField
                                    value={
                                        record?.payment_method
                                            ? paymentMethodMap[record.payment_method] || record.payment_method
                                            : "-"
                                    }
                                />
                            </Col>
                            <Col span={24}>
                                <Title level={5}>Địa chỉ giao hàng</Title>
                                <TextField value={record?.shipping_address || "-"} />
                            </Col>
                            <Col span={24}>
                                <Title level={5}>Tên người nhận</Title>
                                <TextField value={record?.recipient_name || "-"} />
                            </Col>
                            <Col span={24}>
                                <Title level={5}>Số điện thoại người nhận</Title>
                                <TextField value={record?.recipient_phone || "-"} />
                            </Col>
                            <Col span={24}>
                                <Title level={5}>Ngày giao hàng</Title>
                                <DateField value={record?.shipped_at} format="DD/MM/YYYY HH:mm" />
                            </Col>
                            <Col span={24}>
                                <Title level={5}>Ngày nhận hàng</Title>
                                <DateField value={record?.delivered_at} format="DD/MM/YYYY HH:mm" />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Title level={4}>Mã giảm giá</Title>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Title level={5}>Mã voucher</Title>
                                <TextField value={record?.voucher?.code || "Không sử dụng"} />
                            </Col>
                            <Col span={24}>
                                <Title level={5}>Giá trị giảm</Title>
                                <TextField
                                    value={
                                        record?.voucher?.discount
                                            ? record.voucher.discount_type === "percentage"
                                                ? `${record.voucher.discount}%`
                                                : record.voucher.discount_type === "fixed"
                                                    ? `${record.voucher.discount.toLocaleString("vi-VN")} VNĐ`
                                                    : "Miễn phí vận chuyển"
                                            : "0 VNĐ"
                                    }
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Title level={4}>Sản phẩm trong đơn hàng</Title>
                        {record?.items && record.items.length > 0 ? (
                            <Table
                                dataSource={record.items}
                                rowKey="id"
                                pagination={false}
                                style={{ marginTop: "16px" }}
                            >
                                <Table.Column
                                    title="Tên sản phẩm"
                                    dataIndex={["product", "name"]}
                                    render={(value) => <TextField value={value || "-"} />}
                                />
                                <Table.Column
                                    title="Biến thể"
                                    dataIndex="variant"
                                    render={(variant) =>
                                        variant ? (
                                            <TextField
                                                value={`${variant.size?.name || ""} ${variant.color?.name || ""}`.trim() || "Không có biến thể"}
                                            />
                                        ) : (
                                            <TextField value="Không có biến thể" />
                                        )
                                    }
                                />
                                <Table.Column
                                    title="Số lượng"
                                    dataIndex="quantity"
                                    render={(value) => <TextField value={value || 0} />}
                                />
                                <Table.Column
                                    title="Đơn giá"
                                    dataIndex="price"
                                    render={(value) => (
                                        <TextField
                                            value={value ? `${value.toLocaleString("vi-VN")} VNĐ` : "0 VNĐ"}
                                        />
                                    )}
                                />
                                <Table.Column
                                    title="Tổng"
                                    render={(_, item) => (
                                        <TextField
                                            value={
                                                item.price && item.quantity
                                                    ? `${(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ`
                                                    : "0 VNĐ"
                                            }
                                        />
                                    )}
                                />
                            </Table>
                        ) : (
                            <TextField value="Không có sản phẩm" />
                        )}
                    </Col>
                </Row>
            </Show>
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