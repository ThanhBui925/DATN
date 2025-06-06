import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Row, Col, Skeleton, Tag, Breadcrumb } from "antd";

const { Title } = Typography;

export const VoucherShow = () => {
    const { queryResult } = useShow({});
    const { data, isLoading } = queryResult;

    const record = data?.data;

    if (isLoading) {
        return (
            <Show>
                <Skeleton active paragraph={{ rows: 4 }} />
            </Show>
        );
    }

    // Định dạng ngày hết hạn
    const formattedExpiryDate = record?.expiry_date
        ? new Date(record.expiry_date).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "Không có ngày hết hạn";

    const formattedDiscount = record?.discount
        ? `${record.discount}${record.discount_type === "percentage" ? "%" : " VNĐ"}`
        : "Không có giá trị giảm giá";

    return (
        <Show
            title={'Chi tiết Voucher'}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Vouchers</Breadcrumb.Item>
                    <Breadcrumb.Item>Chi tiết</Breadcrumb.Item>
                    <Breadcrumb.Item>{record?.code || "Không có mã"}</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Mã Voucher
                    </Title>
                    <TextField
                        value={record?.code || "Không có mã"}
                        style={{ fontSize: 16 }}
                    />
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Giá trị giảm giá
                    </Title>
                    <TextField
                        value={formattedDiscount}
                        style={{ fontSize: 16 }}
                    />
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Loại giảm giá
                    </Title>
                    <TextField
                        value={record?.discount_type === "percentage" ? "Phần trăm" : "Cố định"}
                        style={{ fontSize: 16 }}
                    />
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Mô tả
                    </Title>
                    <TextField
                        value={record?.description || "Không có mô tả"}
                        style={{ fontSize: 16 }}
                    />
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Ngày hết hạn
                    </Title>
                    <TextField
                        value={formattedExpiryDate}
                        style={{ fontSize: 16 }}
                    />
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Trạng thái
                    </Title>
                    {record?.status ? (
                        <Tag color={record.status === "active" ? "green" : "red"}>
                            {record.status === "active" ? "Hoạt động" : "Không hoạt động"}
                        </Tag>
                    ) : (
                        <TextField value="Không có trạng thái" style={{ fontSize: 16 }} />
                    )}
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Giới hạn sử dụng
                    </Title>
                    <TextField
                        value={record?.usage_limit || "Không giới hạn"}
                        style={{ fontSize: 16 }}
                    />
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Số lần đã sử dụng
                    </Title>
                    <TextField
                        value={record?.usage_count || 0}
                        style={{ fontSize: 16 }}
                    />
                </Col>
            </Row>
        </Show>
    );
};