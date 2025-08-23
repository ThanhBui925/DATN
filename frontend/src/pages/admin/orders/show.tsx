import {DateField, Show, TextField, EditButton} from "@refinedev/antd";
import {useShow, useUpdate} from "@refinedev/core";
import {Typography, Row, Col, Breadcrumb, Tag, Table, Modal, Form, Select, Card, message, Input, Image, Button} from "antd";
import React, {useState} from "react";
import {convertToInt} from "../../../helpers/common";
import {paymentStatusMap} from "../../../types/PaymentStatusInterface";
import {statusMap, validTransitions} from "../../../types/OrderStatusInterface";
import {paymentMethodMap} from "../../../types/PaymentMethodMap";
import {axiosInstance} from "../../../utils/axios";

const {Title, Text} = Typography;

export const OrdersShow = () => {
    const {queryResult} = useShow({});
    const {data, isLoading} = queryResult;
    const record = data?.data;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRefundModalVisible, setIsRefundModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [refundForm] = Form.useForm();
    const {mutate} = useUpdate();

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

                let updateValues: any = {};
                if (values.order_status === 'canceled') {
                    const cancel_reason = `Đơn hàng được huỷ bởi admin, lý do: ${values.cancel_reason}`;
                    updateValues = { order_status: 'canceled', cancel_reason };
                } else if (values.order_status === 'return_rejected') {
                    const reject_reason = `Yêu cầu hoàn hàng bị từ chối bởi admin, lý do: ${values.reject_reason}`;
                    updateValues = { order_status: 'return_rejected', reject_reason };
                } else {
                    updateValues = { order_status: values.order_status == 'ready_to_pick' ? 'shipping' : values.order_status };
                }

                return mutate({
                    resource: "orders",
                    id: record?.id,
                    values: updateValues,
                }, {
                    onSuccess: () => {
                        setIsModalVisible(false);
                        form.resetFields();
                        queryResult.refetch();
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

    const handleRefundOk = async () => {
        try {
            const values = await refundForm.validateFields();

            await axiosInstance.post(`/api/orders/${record?.id}/refunded`, {
                payment_status: "refunded",
                transaction_code: values.transaction_code,
            });

            message.success("Đã cập nhật trạng thái hoàn tiền!");
            setIsRefundModalVisible(false);
            refundForm.resetFields();
            queryResult.refetch();
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi cập nhật!");
        }
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
                    <>
                        {
                            !(
                                (record?.status === "canceled" && record?.payment_status === "cash") ||
                                (record?.status === "refunded" && record?.payment_status === "refunded")
                            ) && (
                                <EditButton onClick={handleUpdateStatus}>Cập nhật trạng thái</EditButton>
                            )
                        }


                        <Button
                            onClick={() => {
                                window.open(`${import.meta.env.VITE_APP_API_URL}/api/orders/${record?.id}/pdf`, "_blank");
                            }}
                        >
                            In hoá đơn
                        </Button>


                    </>
                )}
            >
                <Row gutter={[24, 24]} style={{marginBottom: 24}}>
                    {['return_requested', 'return_accepted', 'return_rejected', 'canceled', 'refunded', 'completed'].includes(record?.status) &&
                        record?.return?.evidences?.length > 0 && (
                            <Col xs={24}>
                                <Card
                                    title={<Title level={4} style={{ margin: 0 }}>Hình ảnh trả hàng</Title>}
                                    style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(255, 0, 0, 0.5)" }}
                                >
                                    <Row gutter={[16, 16]}>
                                        {record?.return?.evidences.map((evd: any, index: any) => (
                                            <Col key={index}>
                                                <Image
                                                    src={evd.file_path}
                                                    alt={`Hình ảnh trả hàng ${index + 1}`}
                                                    style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 4 }}
                                                />
                                            </Col>
                                        ))}
                                        <Col>
                                            <div>
                                                <h3>Lý do trả hàng: {record?.return?.reason}</h3>
                                                {record?.return?.reason_for_refusal && (
                                                    <h3>Lý do từ chối trả hàng: {record?.return?.reason_for_refusal}</h3>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        )
                    }

                    {['return_requested', 'return_accepted', 'return_rejected', 'canceled', 'refunded', 'completed'].includes(record?.status) &&
                        record?.payment_status === "paid" && (
                            <Col xs={24}>
                                <Card
                                    title={<Title level={4} style={{ margin: 0 }}>Thông tin tài khoản hoàn tiền</Title>}
                                    style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(255, 0, 0, 0.5)" }}
                                >
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} sm={12}>
                                            <Text strong style={{ color: "#595959", fontSize: 14 }}>Số tài khoản</Text>
                                            <TextField
                                                value={record?.return?.refund_account_number || "-"}
                                                style={{ display: "block", fontSize: 16, color: "#262626", marginTop: 8 }}
                                            />
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Text strong style={{ color: "#595959", fontSize: 14 }}>Ngân hàng</Text>
                                            <TextField
                                                value={record?.return?.refund_bank || "-"}
                                                style={{ display: "block", fontSize: 16, color: "#262626", marginTop: 8 }}
                                            />
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Text strong style={{ color: "#595959", fontSize: 14 }}>Tên chủ tài khoản</Text>
                                            <TextField
                                                value={record?.return?.refund_account_name || "-"}
                                                style={{ display: "block", fontSize: 16, color: "#262626", marginTop: 8 }}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        )
                    }

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
                                <Col xs={24} sm={12}>
                                    <Text strong style={{color: "#595959", fontSize: 14}}>Trạng thái đơn hàng</Text>
                                    <div style={{marginTop: 8}}>
                                        {record?.status ? (
                                            record?.status == 'refunded' && record?.payment_status == 'refunded' ? (
                                                <Tag
                                                    color={statusMap[record.status]?.cssColor}
                                                    style={{padding: "4px 12px", fontSize: 14, borderRadius: 4}}
                                                >
                                                    Đơn hàng đã được hoàn thành công
                                                </Tag>
                                            ) : (
                                                <Tag
                                                    color={statusMap[record.status]?.cssColor}
                                                    style={{padding: "4px 12px", fontSize: 14, borderRadius: 4}}
                                                >
                                                    {statusMap[record.status]?.label || record.status}
                                                </Tag>
                                            )
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
                                {
                                    record?.status == 'return_rejected' && (
                                        <Col xs={24} sm={12}>
                                            <Text strong style={{color: "#595959", fontSize: 14}}>Lý do từ chối hoàn hàng</Text>
                                            <TextField
                                                value={record?.return?.reason_for_refusal || "Không có"}
                                                style={{display: "block", fontSize: 16, color: "#262626", marginTop: 8}}
                                            />
                                        </Col>
                                    )
                                }
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
                                <Col xs={24} sm={12}>
                                    <Text strong style={{color: "#595959", fontSize: 14}}>Trạng thái thanh toán</Text>
                                    <div style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 8}}>
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
                                        {record?.status === 'return_accepted' && record?.payment_status !== 'refunded' && (
                                            <Button
                                                type="dashed"
                                                onClick={() => setIsRefundModalVisible(true)}
                                            >
                                                Bấm xác nhận đã hoàn tiền
                                            </Button>
                                        )}
                                    </div>
                                </Col>
                                {record?.payment_status === 'refunded' && (
                                    <Col xs={24} sm={12}>
                                        <Text strong style={{color: "#595959", fontSize: 14}}>Mã giao dịch hoàn tiền</Text>
                                        <TextField
                                            value={record?.return?.transaction_code || "-"}
                                            style={{display: "block", fontSize: 16, color: "#262626", marginTop: 8}}
                                        />
                                    </Col>
                                )}
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
                                        value={record?.voucher_code || "Không sử dụng"}
                                        style={{display: "block", fontSize: 16, color: "#262626", marginTop: 8}}
                                    />
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Text strong style={{color: "#595959", fontSize: 14}}>Giá trị giảm</Text>
                                    <TextField
                                        value={ convertToInt(record?.discount_amount) + ' VNĐ'}
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
                                                    value={`${variant.size?.name || ""} - ${variant.color?.name || ""}`.trim() || "Không có biến thể"}
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
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                <span style={{ fontSize: 16, color: "#262626", whiteSpace: "nowrap" }}> Tiền hàng:</span>
                                <TextField
                                    value={
                                        record?.total_price
                                            ? `${convertToInt(record.total_price)} VNĐ`
                                            : "0.00 VNĐ"
                                    }
                                    style={{ fontSize: 16, color: "#262626" }}
                                />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                <span style={{ fontSize: 16, color: "#262626", whiteSpace: "nowrap" }}> Phí vận chuyển:</span>
                                <TextField
                                    value={
                                        record?.shipping_fee
                                            ? `${convertToInt(record.shipping_fee)} VNĐ`
                                            : "0.00 VNĐ"
                                    }
                                    style={{ fontSize: 16, color: "#262626" }}
                                />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                <span style={{ fontSize: 16, color: "#262626", whiteSpace: "nowrap" }}>Giảm giá:</span>
                                <TextField
                                    value={
                                        record?.discount_amount
                                            ? `${convertToInt(record.discount_amount)} VNĐ`
                                            : "0.00 VNĐ"
                                    }
                                    style={{ fontSize: 16, color: "#262626" }}
                                />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <h3 style={{ fontSize: 20, color: "#ff0000ff", whiteSpace: "nowrap", margin: 0 }}>
                                    Thành tiền:
                                </h3>
                                <TextField
                                    value={
                                        record?.final_amount
                                            ? `${convertToInt(record.final_amount)} VNĐ`
                                            : "0.00 VNĐ"
                                    }
                                    style={{ fontSize: 20, color: "#ff0000ff" }}
                                />
                            </div>
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
                      initialValues={{order_status: record?.status}}>
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
                                            ? !validTransitions[record?.status]?.includes(key)
                                            : true
                                    }
                                >
                                    {label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.order_status !== curValues.order_status}>
                        {({ getFieldValue }) => {
                            const selectedStatus = getFieldValue('order_status');
                            if (selectedStatus === 'canceled') {
                                return (
                                    <Form.Item
                                        name="cancel_reason"
                                        label="Lý do hủy"
                                        initialValue={record?.cancel_reason}
                                        rules={[{ required: true, message: "Vui lòng nhập lý do hủy" }]}
                                    >
                                        <Input.TextArea placeholder="Nhập lý do hủy đơn" />
                                    </Form.Item>
                                );
                            } else if (selectedStatus === 'return_rejected') {
                                return (
                                    <Form.Item
                                        name="reject_reason"
                                        label="Lý do từ chối hoàn hàng"
                                        initialValue={record?.reject_reason}
                                        rules={[{ required: true, message: "Vui lòng nhập lý do từ chối" }]}
                                    >
                                        <Input.TextArea placeholder="Nhập lý do từ chối hoàn hàng" />
                                    </Form.Item>
                                );
                            }
                            return null;
                        }}
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title={<Title level={4} style={{margin: 0}}>Xác nhận hoàn tiền</Title>}
                open={isRefundModalVisible}
                onOk={handleRefundOk}
                onCancel={() => {
                    setIsRefundModalVisible(false);
                    refundForm.resetFields();
                }}
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{style: {backgroundColor: "#1d39c4", color: "#fff", borderRadius: 6}}}
                cancelButtonProps={{style: {borderRadius: 6}}}
            >
                <Form form={refundForm} layout="vertical">
                    <Form.Item
                        name="transaction_code"
                        label="Mã giao dịch"
                        rules={[{ required: true, message: "Vui lòng nhập mã giao dịch" }]}
                    >
                        <Input placeholder="Nhập mã giao dịch" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};