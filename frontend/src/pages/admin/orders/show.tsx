import {DateField, Show, TextField, EditButton} from "@refinedev/antd";
import {useShow, useUpdate} from "@refinedev/core";
import {Typography, Row, Col, Breadcrumb, Tag, Table, Modal, Form, Select, Card, message} from "antd";
import {useState} from "react";
import {convertToInt} from "../../../helpers/common";

const {Title, Text} = Typography;

const validTransitions: Record<string, string[]> = {
    pending: ["confirming", "canceled"],
    confirming: ["confirmed", "canceled"],
    confirmed: ["preparing", "canceled"],
    preparing: ["shipping", "canceled"],
    shipping: ["delivered", "canceled"],
    delivered: ["completed"],
    completed: [],
    canceled: [],
};

export const OrdersShow = () => {
    const {queryResult} = useShow({});
    const {data, isLoading} = queryResult;
    const record = data?.data;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const {mutate} = useUpdate();

    const statusMap: Record<string, { color: string; label: string }> = {
        confirming: {color: "gold", label: "Đang xác nhận"},
        confirmed: {color: "blue", label: "Đã xác nhận"},
        preparing: {color: "orange", label: "Đang chuẩn bị"},
        shipping: {color: "cyan", label: "Đang giao hàng"},
        delivered: {color: "green", label: "Đã giao hàng"},
        completed: {color: "purple", label: "Hoàn tất"},
        canceled: {color: "red", label: "Đã hủy"},
        pending: {color: "default", label: "Chờ xử lý"},
    };

    const paymentStatusMap: Record<string, { color: string; label: string }> = {
        unpaid: {color: "red", label: "Chưa thanh toán"},
        paid: {color: "green", label: "Đã thanh toán"},
    };

    const paymentMethodMap: Record<string, { label: string; color: string }> = {
        cash: {label: "Tiền mặt", color: "gold"},
        card: {label: "Thẻ tín dụng", color: "purple"},
        paypal: {label: "PayPal", color: "blue"},
        vnpay: {label: "VNPay", color: "red"}
    };

    const handleUpdateStatus = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields()
            .then((values) => {
                const allowed = validTransitions[record?.order_status] || [];
                if (!allowed.includes(values.order_status)) {
                    message.error("Không thể chuyển sang trạng thái này!");
                    return;
                }

                return mutate({
                    resource: "orders",
                    id: record?.id,
                    values: {order_status: values.order_status},
                }, {
                    onSuccess: () => {
                        setIsModalVisible(false);
                        form.resetFields();
                    },
                });
            })
            .catch(() => {
                message.error("Vui lòng kiểm tra lại thông tin!");
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
                <Row gutter={[24, 24]} style={{marginBottom: 24}}>
                    <Col xs={24}>
                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={12}>
                                <Card
                                    title={<Title level={4} style={{margin: 0}}>Thông tin người đặt hàng</Title>}
                                    style={{borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)"}}
                                    bodyStyle={{padding: 16}}
                                >
                                    <Col>
                                        <div style={{marginBottom: 12}}>
                                            <Text strong>Tên người đặt:</Text>
                                            <TextField value={record?.user?.name || "-"} style={{marginLeft: 8}}/>
                                        </div>
                                        <div style={{marginBottom: 12}}>
                                            <Text strong>Số điện thoại:</Text>
                                            <TextField value={record?.user?.customer?.phone || "-"}
                                                       style={{marginLeft: 8}}/>
                                        </div>
                                        <div style={{marginBottom: 12}}>
                                            <Text strong>Email:</Text>
                                            <TextField value={record?.user?.email || "-"} style={{marginLeft: 8}}/>
                                        </div>
                                    </Col>
                                </Card>
                            </Col>
                            <Col xs={24} md={12}>
                                <Card
                                    title={<Title level={4} style={{margin: 0}}>Thông tin người nhận hàng</Title>}
                                    style={{borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)"}}
                                    bodyStyle={{padding: 16}}
                                >
                                    <Col>
                                        <div style={{marginBottom: 12}}>
                                            <Text strong>Tên người nhận:</Text>
                                            <TextField value={record?.recipient_name || "-"} style={{marginLeft: 8}}/>
                                        </div>
                                        <div style={{marginBottom: 12}}>
                                            <Text strong>Số điện thoại:</Text>
                                            <TextField value={record?.recipient_phone || "-"} style={{marginLeft: 8}}/>
                                        </div>
                                        <div style={{marginBottom: 12}}>
                                            <Text strong>Email:</Text>
                                            <TextField value={record?.recipient_email || "-"} style={{marginLeft: 8}}/>
                                        </div>
                                    </Col>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24}>
                        <Card
                            title={<Title level={4} style={{margin: 0}}>Địa chỉ giao hàng</Title>}
                            style={{borderRadius: 8, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"}}
                        >
                            <TextField value={record?.shipping_address || "-"}/>
                        </Card>
                    </Col>
                    <Col xs={24}>
                        <Card
                            title={<Title level={4} style={{margin: 0}}>Thông tin đơn hàng</Title>}
                            style={{borderRadius: 8, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"}}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <Text strong style={{color: "#595959", fontSize: 14}}>Mã đơn hàng</Text>
                                    <TextField
                                        value={`#${record?.id || "-"}`}
                                        style={{display: "block", fontSize: 16, color: "#262626", marginTop: 8}}
                                    />
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Text strong style={{color: "#595959", fontSize: 14}}>Ngày đặt hàng</Text>
                                    <DateField
                                        value={record?.date_order}
                                        format="DD/MM/YYYY HH:mm"
                                        style={{display: "block", fontSize: 16, color: "#262626", marginTop: 8}}
                                    />
                                </Col>
                                {/*<Col xs={24} sm={12}>*/}
                                {/*    <Text strong style={{color: "#595959", fontSize: 14}}>Tổng tiền</Text>*/}
                                {/*    <TextField*/}
                                {/*        value={*/}
                                {/*            record?.total_price*/}
                                {/*                ? `${convertToInt(record.total_price)} VNĐ`*/}
                                {/*                : "0.00 VNĐ"*/}
                                {/*        }*/}
                                {/*        style={{display: "block", fontSize: 16, color: "#262626", marginTop: 8}}*/}
                                {/*    />*/}
                                {/*</Col>*/}
                                <Col xs={24} sm={12}>
                                    <Text strong style={{color: "#595959", fontSize: 14}}>Trạng thái đơn hàng</Text>
                                    <div style={{marginTop: 8}}>
                                        {record?.order_status ? (
                                            <Tag
                                                color={statusMap[record.order_status]?.color}
                                                style={{padding: "4px 12px", fontSize: 14, borderRadius: 4}}
                                            >
                                                {statusMap[record.order_status]?.label || record.order_status}
                                            </Tag>
                                        ) : (
                                            <TextField
                                                value="Không có trạng thái"
                                                style={{display: "block", fontSize: 16, color: "#262626"}}
                                            />
                                        )}
                                    </div>
                                </Col>
                                {
                                    record?.status == 'canceled' && (
                                        <Col xs={24} sm={12}>
                                            <Text strong style={{color: "#595959", fontSize: 14}}>Lý do hủy</Text>
                                            <TextField
                                                value={record?.cancel_reason || "Không có"}
                                                style={{display: "block", fontSize: 16, color: "#262626", marginTop: 8}}
                                            />
                                        </Col>
                                    )
                                }
                                <Col xs={24} sm={12}>
                                    <Text strong style={{color: "#595959", fontSize: 14}}>Trạng thái thanh toán</Text>
                                    <div style={{marginTop: 8}}>
                                        {record?.payment_status ? (
                                            <Tag
                                                color={paymentStatusMap[record.payment_status]?.color}
                                                style={{padding: "4px 12px", fontSize: 14, borderRadius: 4}}
                                            >
                                                {paymentStatusMap[record.payment_status]?.label || record.payment_status}
                                            </Tag>
                                        ) : (
                                            <TextField
                                                value="-"
                                                style={{display: "block", fontSize: 16, color: "#262626"}}
                                            />
                                        )}
                                    </div>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Text strong style={{color: "#595959", fontSize: 14}}>Phương thức thanh toán</Text>
                                    <div style={{marginTop: 8}}>
                                        {record?.payment_method ? (
                                            <Tag
                                                color={paymentMethodMap[record.payment_method]?.color}
                                                style={{padding: "4px 12px", fontSize: 14, borderRadius: 4}}
                                            >
                                                {paymentMethodMap[record.payment_method]?.label || record.payment_method}
                                            </Tag>
                                        ) : (
                                            <TextField
                                                value="-"
                                                style={{display: "block", fontSize: 16, color: "#262626"}}
                                            />
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={24}>
                        <Card
                            title={<Title level={4} style={{margin: 0}}>Mã giảm giá</Title>}
                            style={{borderRadius: 8, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"}}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <Text strong style={{color: "#595959", fontSize: 14}}>Mã voucher</Text>
                                    <TextField
                                        value={record?.voucher?.code || "Không sử dụng"}
                                        style={{display: "block", fontSize: 16, color: "#262626", marginTop: 8}}
                                    />
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Text strong style={{color: "#595959", fontSize: 14}}>Giá trị giảm</Text>
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
                                        style={{display: "block", fontSize: 16, color: "#262626", marginTop: 8}}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={24}>
                        <Card
                            title={<Title level={4} style={{margin: 0}}>Sản phẩm trong đơn hàng</Title>}
                            style={{borderRadius: 8, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"}}
                        >
                            {record?.items && record.items.length > 0 ? (
                                <Table
                                    dataSource={record.items}
                                    rowKey="id"
                                    pagination={false}
                                    style={{marginTop: 16}}
                                    rowClassName={() => "ant-table-row-hover"}
                                    summary={(pageData) => {
                                        const totalSum = pageData.reduce(
                                            (sum, item: any) => sum + (item.price * item.quantity || 0),
                                            0
                                        );
                                        return (
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell index={0} colSpan={4}>
                                                    <TextField
                                                        value="Tổng cộng"
                                                        style={{ fontSize: 14, fontWeight: "bold", color: "#262626" }}
                                                    />
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={4}>
                                                    <TextField
                                                        value={`${convertToInt(totalSum)} VNĐ`}
                                                        style={{ fontSize: 14, fontWeight: "bold", color: "#262626" }}
                                                    />
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        );
                                    }}
                                >
                                    <Table.Column
                                        title="Tên sản phẩm"
                                        dataIndex={["product", "name"]}
                                        render={(value) => (
                                            <TextField
                                                value={value || "-"}
                                                style={{fontSize: 14, color: "#262626"}}
                                            />
                                        )}
                                    />
                                    <Table.Column
                                        title="Biến thể"
                                        dataIndex="variant"
                                        render={(variant) =>
                                            variant ? (
                                                <TextField
                                                    value={`${variant.size?.name || ""} ${variant.color?.name || ""}`.trim() || "Không có biến thể"}
                                                    style={{fontSize: 14, color: "#262626"}}
                                                />
                                            ) : (
                                                <TextField
                                                    value="Không có biến thể"
                                                    style={{fontSize: 14, color: "#262626"}}
                                                />
                                            )
                                        }
                                    />
                                    <Table.Column
                                        title="Số lượng"
                                        dataIndex="quantity"
                                        render={(value) => (
                                            <TextField
                                                value={value || 0}
                                                style={{fontSize: 14, color: "#262626"}}
                                            />
                                        )}
                                    />
                                    <Table.Column
                                        title="Đơn giá"
                                        dataIndex="price"
                                        render={(value) => (
                                            <TextField
                                                value={value ? `${convertToInt(value)} VNĐ` : "0 VNĐ"}
                                                style={{fontSize: 14, color: "#262626"}}
                                            />
                                        )}
                                    />
                                    <Table.Column
                                        title="Tổng"
                                        render={(_, item) => (
                                            <TextField
                                                value={
                                                    item.price && item.quantity
                                                        ? `${convertToInt(item.price * item.quantity)} VNĐ`
                                                        : "0 VNĐ"
                                                }
                                                style={{fontSize: 14, color: "#262626"}}
                                            />
                                        )}
                                    />
                                </Table>
                            ) : (
                                <TextField
                                    value="Không có sản phẩm"
                                    style={{fontSize: 16, color: "#595959"}}
                                />
                            )}
                        </Card>
                    </Col>
                </Row>
                <Row style={{ display: 'flex', justifyContent: "end"}}>
                    <Col xs={24} md={8}>
                        <Card title={<Title level={4} style={{margin: 0}}>Tổng tiền đơn hàng</Title>} style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
                            <TextField
                                value={
                                    record?.total_price
                                        ? `${convertToInt(record.total_price)} VNĐ`
                                        : "0.00 VNĐ"
                                }
                                style={{display: "block", fontSize: 16, color: "#262626"}}
                            />
                        </Card>
                    </Col>
                </Row>
            </Show>
            <Modal
                title={<Title level={4} style={{margin: 0}}>Cập nhật trạng thái đơn hàng</Title>}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Lưu"
                cancelText="Hủy"
                okButtonProps={{style: {backgroundColor: "#1d39c4", color: "#fff", borderRadius: 6}}}
                cancelButtonProps={{style: {borderRadius: 6}}}
            >
                <Form form={form}
                      layout="vertical"
                      initialValues={{order_status: record?.order_status}}>
                    <Form.Item
                        name="order_status"
                        label="Trạng thái đơn hàng"
                        rules={[{required: true, message: "Vui lòng chọn trạng thái đơn hàng"}]}
                    >
                        <Select placeholder="Chọn trạng thái" style={{width: "100%"}}>
                            {Object.entries(statusMap).map(([key, {label}]) => (
                                <Select.Option
                                    key={key}
                                    value={key}
                                    disabled={
                                        record?.order_status
                                            ? !validTransitions[record.order_status]?.includes(key)
                                            : true
                                    }
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