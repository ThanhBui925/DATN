import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Row, Col, Skeleton, Tag, Breadcrumb } from "antd";

const { Title } = Typography;

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

    return (
        <Show
            title={'Chi tiết Khách Hàng'}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Khách Hàng</Breadcrumb.Item>
                    <Breadcrumb.Item>Chi tiết</Breadcrumb.Item>
                    <Breadcrumb.Item>{record?.name || "Không có tên"}</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Tên Khách Hàng
                    </Title>
                    <TextField
                        value={record?.user?.name || "Không có tên"}
                        style={{ fontSize: 16 }}
                    />
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Email
                    </Title>
                    <TextField
                        value={record?.user?.email || "Không có email"}
                        style={{ fontSize: 16 }}
                    />
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Số Điện Thoại
                    </Title>
                    <TextField
                        value={record?.phone || "Không có số điện thoại"}
                        style={{ fontSize: 16 }}
                    />
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Địa Chỉ
                    </Title>
                    <TextField
                        value={record?.address || "Không có địa chỉ"}
                        style={{ fontSize: 16 }}
                    />
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Ngày Tạo
                    </Title>
                    <TextField
                        value={formattedCreatedAt}
                        style={{ fontSize: 16 }}
                    />
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Trạng Thái
                    </Title>
                    {record?.deleted_at ? (
                        <Tag color="red">Đã Xóa</Tag>
                    ) : (
                        <Tag color="green">Hoạt Động</Tag>
                    )}
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Ngày Cập Nhật
                    </Title>
                    <TextField
                        value={
                            record?.updated_at
                                ? new Date(record.updated_at).toLocaleString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : "Không có ngày cập nhật"
                        }
                        style={{ fontSize: 16 }}
                    />
                </Col>
            </Row>
        </Show>
    );
};