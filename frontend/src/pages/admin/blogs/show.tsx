import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import {
    Breadcrumb,
    Col,
    Image,
    Row,
    Skeleton,
    Tag,
    Typography,
    Card,
    Divider,
    Space,
} from "antd";
import MDEditor from "@uiw/react-md-editor";

const { Title, Text, Paragraph } = Typography;

export const BlogPostShow = () => {
    const { queryResult } = useShow({});
    const { data, isLoading } = queryResult;
    const record = data?.data;

    if (isLoading) {
        return (
            <Show>
                <Skeleton active paragraph={{ rows: 6 }} title={{ width: "30%" }} />
            </Show>
        );
    }

    const formattedCreatedDate = record?.created_at
        ? new Date(record.created_at).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "Không có ngày tạo";

    const formattedUpdatedDate = record?.updated_at
        ? new Date(record.updated_at).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "Không có ngày cập nhật";

    // Map trạng thái
    const statusValue =
        typeof record?.status === "string"
            ? record.status
            : Number(record?.status);

    const statusMap: Record<string | number, { label: string; color: string }> = {
        draft: { label: "Nháp", color: "red" },
        0: { label: "Nháp", color: "red" },
        published: { label: "Công khai", color: "green" },
        1: { label: "Công khai", color: "green" },
        private: { label: "Riêng tư", color: "blue" },
        2: { label: "Riêng tư", color: "blue" },
    };

    const status = statusMap[statusValue];

    return (
        <Show
            title={null}
            breadcrumb={
                <Breadcrumb style={{ margin: "16px 0", fontSize: 14, color: "#666" }}>
                    <Breadcrumb.Item>
                        <Text style={{ color: "#666" }}>Trang chủ</Text>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Text style={{ color: "#666" }}>Bài viết</Text>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Text strong style={{ color: "#000" }}>
                            {record?.title || "Không có tiêu đề"}
                        </Text>
                    </Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Row gutter={[24, 24]} style={{ margin: "0 auto" }}>
                <Col xs={24} lg={16}>
                    <Card
                        style={{
                            borderRadius: 8,
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            padding: "24px 32px",
                            background: "#fff",
                        }}
                    >
                        <Title
                            level={1}
                            style={{
                                fontSize: 32,
                                fontWeight: 700,
                                color: "#333",
                                margin: "0 0 16px 0",
                                lineHeight: 1.2,
                            }}
                        >
                            {record?.title || "Không có tiêu đề"}
                        </Title>
                        <Space style={{ marginBottom: 24, color: "#666", fontSize: 14 }}>
                            <Text>Đăng ngày: {formattedCreatedDate}</Text>
                            <Text> • </Text>
                            <Text>Cập nhật: {formattedUpdatedDate}</Text>
                        </Space>

                        {record?.image && (
                            <Image
                                src={record.image}
                                alt="Blog"
                                style={{
                                    width: "800px",
                                    maxHeight: 500,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    marginBottom: 24,
                                }}
                                preview
                            />
                        )}

                        <div data-color-mode="light">
                            <MDEditor.Markdown
                                source={record?.content || "Không có nội dung"}
                                style={{
                                    background: "transparent",
                                    padding: 0,
                                    lineHeight: 1.8,
                                    fontSize: 16,
                                    color: "#333",
                                }}
                            />
                        </div>

                        <Divider />

                        <Space wrap style={{ marginTop: 16 }}>
                            <Text strong style={{ color: "#666" }}>Trạng thái:</Text>
                            {status ? (
                                <Tag
                                    color={status.color}
                                    style={{
                                        fontSize: 14,
                                        padding: "4px 12px",
                                        borderRadius: 20,
                                    }}
                                >
                                    {status.label}
                                </Tag>
                            ) : (
                                <Text style={{ color: "#666" }}>Không có trạng thái</Text>
                            )}
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: 8,
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            padding: "24px",
                            background: "#fff",
                        }}
                    >
                        <Title level={4} style={{ color: "#333", margin: "0 0 16px 0" }}>
                            Thông tin bổ sung
                        </Title>
                        <Divider style={{ margin: "16px 0" }} />

                        <Paragraph style={{ marginBottom: 16 }}>
                            <Text strong style={{ color: "#666" }}>Tiêu đề:</Text>{" "}
                            <TextField value={record?.title || "Không có dữ liệu"} />
                        </Paragraph>

                        <Paragraph style={{ marginBottom: 16 }}>
                            <Text strong style={{ color: "#666" }}>Tiêu đề ngắn:</Text>{" "}
                            <TextField value={record?.description || "Không có mô tả"} />
                        </Paragraph>

                        <Paragraph>
                            <Text strong style={{ color: "#666" }}>Ngày tạo:</Text>{" "}
                            <Text style={{ color: "#fa8c16" }}>{formattedCreatedDate}</Text>
                        </Paragraph>

                        <Paragraph>
                            <Text strong style={{ color: "#666" }}>Ngày cập nhật:</Text>{" "}
                            <Text style={{ color: "#fa8c16" }}>{formattedUpdatedDate}</Text>
                        </Paragraph>
                    </Card>
                </Col>
            </Row>
        </Show>
    );
};
