import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Row, Col, Skeleton, Tag, Breadcrumb, Card, Divider } from "antd";

const { Title, Text } = Typography;

export const CustomerShow = () => {
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

    const formattedCreatedAt = record?.created_at
        ? new Date(record.created_at).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "Không có ngày tạo";

    const formattedUpdatedAt = record?.updated_at
        ? new Date(record.updated_at).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "Không có ngày cập nhật";

    return (
        <Show
            title={<Title level={3}>Chi tiết Khách Hàng</Title>}
            breadcrumb={
                <Breadcrumb style={{ marginBottom: 16 }}>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Khách Hàng</Breadcrumb.Item>
                    <Breadcrumb.Item>Chi tiết</Breadcrumb.Item>
                    <Breadcrumb.Item>{record?.name || "Không có tên"}</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Card bordered={false} style={{ marginBottom: 24 }}>
                <Divider orientation="left">Thông tin cơ bản</Divider>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                            Tên Khách Hàng
                        </Title>
                        <TextField
                            value={record?.user?.name || "Không có tên"}
                            style={{ fontSize: 16, color: "#000" }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                            Email
                        </Title>
                        <TextField
                            value={record?.user?.email || "Không có email"}
                            style={{ fontSize: 16, color: "#000" }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                            Số Điện Thoại
                        </Title>
                        <TextField
                            value={record?.phone || "Không có số điện thoại"}
                            style={{ fontSize: 16, color: "#000" }}
                        />
                    </Col>
                    <Col xs={24} sm={24}>
                        <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                            Địa Chỉ
                        </Title>
                        <TextField
                            value={record?.address || "Không có địa chỉ"}
                            style={{ fontSize: 16, color: "#000" }}
                        />
                    </Col>
                </Row>

                <Divider orientation="left">Chi tiết hoạt động</Divider>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                            Ngày Tạo
                        </Title>
                        <Text strong style={{ fontSize: 16, color: "#fa8c16" }}>
                            {formattedCreatedAt}
                        </Text>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                            Trạng Thái
                        </Title>
                        {record?.deleted_at ? (
                            <Tag
                                color="red"
                                style={{ fontSize: 14, padding: "4px 8px" }}
                            >
                                Đã Xóa
                            </Tag>
                        ) : (
                            <Tag
                                color="green"
                                style={{ fontSize: 14, padding: "4px 8px" }}
                            >
                                Hoạt Động
                            </Tag>
                        )}
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                            Ngày Cập Nhật
                        </Title>
                        <Text strong style={{ fontSize: 16, color: "#fa8c16" }}>
                            {formattedUpdatedAt}
                        </Text>
                    </Col>
                </Row>

                <Divider orientation="left">Lịch sử mua hàng</Divider>
                ...
            </Card>
        </Show>
    );
};