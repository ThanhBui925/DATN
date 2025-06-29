import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Row, Col, Skeleton, Tag, Breadcrumb, Card, Divider, Image } from "antd";

const { Title, Text } = Typography;

export const CustomerShow = () => {
    const { queryResult } = useShow({});
    const { data, isLoading } = queryResult;
    const record = data?.data;

    if (isLoading) {
        return (
            <Show>
                <Skeleton active paragraph={{ rows: 6 }} />
            </Show>
        );
    }

    const formattedCreatedAt = record?.created_at
        ? new Date(record?.created_at).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "Không có ngày tạo";

    const formattedUpdatedAt = record?.updated_at
        ? new Date(record?.updated_at).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "Không có ngày cập nhật";

    const formattedDob = record?.dob
        ? new Date(record?.dob).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
        : "Không có ngày sinh";

    const genderMap: any = {
        male: "Nam",
        female: "Nữ",
        other: "Khác",
        null: "Không xác định",
    };

    return (
        <Show
            title={<Title level={3}>Chi tiết Khách Hàng</Title>}
            breadcrumb={
                <Breadcrumb style={{ marginBottom: 16 }}>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Khách Hàng</Breadcrumb.Item>
                    <Breadcrumb.Item>Chi tiết</Breadcrumb.Item>
                    <Breadcrumb.Item>{record?.user?.name || "Không có tên"}</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: 8,
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            padding: "16px",
                        }}
                    >
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
                            <Col xs={24} sm={12} md={8}>
                                <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                                    Địa Chỉ
                                </Title>
                                <TextField
                                    value={record?.address || "Không có địa chỉ"}
                                    style={{ fontSize: 16, color: "#000" }}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                                    Ngày Sinh
                                </Title>
                                <TextField
                                    value={formattedDob}
                                    style={{ fontSize: 16, color: "#000" }}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                                    Giới Tính
                                </Title>
                                <TextField
                                    value={genderMap[record?.gender] || "Không xác định"}
                                    style={{ fontSize: 16, color: "#000" }}
                                />
                            </Col>
                        </Row>

                        <Divider orientation="left">Chi tiết hoạt động</Divider>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={8}>
                                <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                                    Vai Trò
                                </Title>
                                <Tag
                                    color={record?.user?.role === "client" ? "blue" : "default"}
                                    style={{ fontSize: 14, padding: "4px 8px" }}
                                >
                                    {record?.user?.role === "client" ? "Khách Hàng" : record?.user?.role || "Không xác định"}
                                </Tag>
                            </Col>
                            <Col xs={24} sm={12} md={8}>

                                <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                                 Trạng Thái
                            </Title>
                            <Tag
                                color={record?.deleted_at ? "red" : record?.user?.status === 1 ? "green" : "red"}
                                style={{ fontSize: 14, padding: "4px 8px" }}
                            >
                                {record?.deleted_at ? "Đã Xóa" : record?.user?.status === 1 ? "Hoạt Động" : "Ngừng Hoạt Động"}
                            </Tag>
                </Col>
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
                        Ngày Cập Nhật
                    </Title>
                    <Text strong style={{ fontSize: 16, color: "#fa8c16" }}>
                        {formattedUpdatedAt}
                    </Text>
                </Col>
            </Row>
        </Card>
</Col>
    <Col xs={24} lg={8}>
        <Card
            bordered={false}
            style={{
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                padding: "16px",
            }}
        >
            <Divider orientation="left">Ảnh đại diện</Divider>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
                {record?.avatar ? (
                    <Image
                        src={record?.avatar}
                        alt="Avatar"
                        style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: 8,
                            maxWidth: "100%",
                            display: "block",
                        }}
                        preview
                    />
                ) : (
                    <Text style={{ fontSize: 16, color: "#595959" }}>
                        Không có ảnh đại diện
                    </Text>
                )}
            </div>
        </Card>
    </Col>
</Row>
    <Divider orientation="left">Lịch sử mua hàng</Divider>
    <Card
        bordered={false}
        style={{
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            padding: "16px",
        }}
    >
        <Text style={{ fontSize: 16, color: "#595959" }}>
            Chưa có dữ liệu lịch sử mua hàng
        </Text>
    </Card>
</Show>
);
};