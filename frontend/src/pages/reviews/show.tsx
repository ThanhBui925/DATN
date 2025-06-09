import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Breadcrumb, Col, Image, Row, Skeleton, Typography, Card, Divider, Space, Button, Modal, Input } from "antd";
import { useState } from "react";

const { Title, Text, Paragraph } = Typography;

export const ReviewShow = () => {
    const { queryResult } = useShow({});
    const { data, isLoading } = queryResult;
    const record = data?.data;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [responseText, setResponseText] = useState("");

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        // Implement response submission logic here (e.g., API call)
        console.log("Response submitted:", responseText);
        setResponseText("");
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setResponseText("");
        setIsModalVisible(false);
    };

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

    return (
        <Show
            title={`Chi tiết đánh giá`}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Text>Trang chủ</Text>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Text>Đánh giá</Text>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Text >{`Đánh giá #${record?.id || "N/A"}`}</Text>
                    </Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Row gutter={[24, 24]} style={{ margin: "0 auto" }}>
                <Col xs={24} lg={16}>
                    <Card
                    >
                        <Space>
                            <Text strong style={{ color: "#666" }}>Đăng ngày: {formattedCreatedDate}</Text>
                            <Text> • </Text>
                            <Text strong style={{ color: "#666" }}>Cập nhật: {formattedUpdatedDate}</Text>
                            <Text> • </Text>
                            <Text>Xếp hạng: {record?.rating ? `${record.rating} / 5` : "Không có xếp hạng"}</Text>
                        </Space>
                        <Col xs={24} style={{ marginTop: 20}}>
                            {record?.image && (
                                <Image
                                    src={record.image}
                                    alt="Review"
                                    style={{
                                        width: "100%",
                                        maxHeight: 400,
                                        objectFit: "cover",
                                        borderRadius: 8,
                                        marginBottom: 24,
                                    }}
                                    preview
                                />
                            )}
                        </Col>
                        <Paragraph style={{ marginBottom: 24 }}>
                            <Text strong style={{ color: "#666" }}>Nội dung: </Text>
                            <TextField
                                value={record?.content || "Không có nội dung"}
                                style={{ fontSize: 16, color: "#333", lineHeight: 1.8 }}
                            />
                        </Paragraph>
                        <Divider />
                        <Button type="primary" onClick={handleOpenModal}>
                            Phản hồi
                        </Button>
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
                            <Text strong style={{ color: "#666" }}>Người dùng: </Text>
                            <TextField
                                value={ record?.user.name ?? "Không có dữ liệu"}
                                style={{ fontSize: 14, color: "#333" }}
                            />
                        </Paragraph>
                        <Paragraph style={{ marginBottom: 16 }}>
                            <Text strong style={{ color: "#666" }}>Sản phẩm: </Text>
                            <TextField
                                value={ record?.product.name ?? "Không có dữ liệu"}
                                style={{ fontSize: 14, color: "#333" }}
                            />
                        </Paragraph>
                        <Paragraph style={{ marginBottom: 16 }}>
                            <Text strong style={{ color: "#666" }}>Biến thể sản phẩm: </Text>
                            <TextField
                                value={ record?.variant.name ?? "Không có dữ liệu"}
                                style={{ fontSize: 14, color: "#333" }}
                            />
                        </Paragraph>
                        <Paragraph style={{ marginBottom: 16 }}>
                            <Text strong style={{ color: "#666" }}>Xếp hạng: </Text>
                            <TextField
                                value={record?.rating ? `${record.rating} / 5` : "Không có xếp hạng"}
                                style={{ fontSize: 14, color: "#333" }}
                            />
                        </Paragraph>
                        <Paragraph>
                            <Text strong style={{ color: "#666" }}>Ngày tạo: </Text>
                            <Text style={{ color: "#fa8c16" }}>{formattedCreatedDate}</Text>
                        </Paragraph>
                        <Paragraph>
                            <Text strong style={{ color: "#666" }}>Ngày cập nhật: </Text>
                            <Text style={{ color: "#fa8c16" }}>{formattedUpdatedDate}</Text>
                        </Paragraph>
                    </Card>
                </Col>
            </Row>
            <Modal
                title="Phản hồi đánh giá"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Gửi"
                cancelText="Hủy"
            >
                <Input.TextArea
                    rows={4}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Nhập phản hồi của bạn..."
                />
            </Modal>
        </Show>
    );
};