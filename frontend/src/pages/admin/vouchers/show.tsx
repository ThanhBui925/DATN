import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Row, Col, Skeleton, Tag, Breadcrumb, Card, Divider } from "antd";
import {convertDate, convertToInt} from "../../../helpers/common";

const { Title, Text } = Typography;

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
        ? convertDate(record?.expiry_date)
        : "Không có ngày hết hạn";

    // Định dạng giá trị giảm giá
    const formattedDiscount = record?.discount
        ? `${convertToInt(record.discount)}${record.discount_type === "percentage" ? "%" : " VNĐ"}`
        : "Không có giá trị giảm giá";

    return (
        <Show
            title={<Title level={3}>Chi tiết Voucher</Title>}
            breadcrumb={
                <Breadcrumb style={{ marginBottom: 16 }}>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Vouchers</Breadcrumb.Item>
                    <Breadcrumb.Item>Chi tiết</Breadcrumb.Item>
                    <Breadcrumb.Item>{record?.code || "Không có mã"}</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Card bordered={false} style={{ marginBottom: 24 }}>
                <Divider orientation="left">Thông tin cơ bản</Divider>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                            Mã Voucher
                        </Title>
                        <TextField
                            value={record?.code || "Không có mã"}
                            style={{ fontSize: 16, color: "#000" }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                            Giá trị giảm giá
                        </Title>
                        <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                            {formattedDiscount}
                        </Text>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                            Loại giảm giá
                        </Title>
                        <TextField
                            value={record?.discount_type === "percentage" ? "Phần trăm" : "Cố định"}
                            style={{ fontSize: 16, color: "#000" }}
                        />
                    </Col>
                    <Col xs={24} sm={24}>
                        <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                            Mô tả
                        </Title>
                        <TextField
                            value={record?.description || "Không có mô tả"}
                            style={{ fontSize: 16, color: "#000" }}
                        />
                    </Col>
                </Row>

                <Divider orientation="left">Chi tiết sử dụng</Divider>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                            Ngày hết hạn
                        </Title>
                        <Text strong style={{ fontSize: 16, color: "#fa8c16" }}>
                            {formattedExpiryDate}
                        </Text>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                            Trạng thái
                        </Title>
                        {record?.status ? (
                            <Tag
                                color={record.status === "1" ? "green" : "red"}
                                style={{ fontSize: 14, padding: "4px 8px" }}
                            >
                                {record.status === "1" ? "Hoạt động" : "Không hoạt động"}
                            </Tag>
                        ) : (
                            <TextField
                                value="Không có trạng thái"
                                style={{ fontSize: 16, color: "#000" }}
                            />
                        )}
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                            Giới hạn sử dụng
                        </Title>
                        <TextField
                            value={record?.usage_limit || "Không giới hạn"}
                            style={{ fontSize: 16, color: "#000" }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                            Số lần đã sử dụng
                        </Title>
                        <TextField
                            value={record?.usage_count || 0}
                            style={{ fontSize: 16, color: "#000" }}
                        />
                    </Col>
                </Row>
            </Card>
        </Show>
    );
};