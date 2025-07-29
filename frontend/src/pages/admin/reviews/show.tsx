import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Breadcrumb, Col, Image, Row, Skeleton, Typography, Card, Divider, Space, Button, Modal, Input, Rate, Tag } from "antd";
import { useState } from "react";

const { Title, Text, Paragraph } = Typography;

export const ReviewShow = () => {
    const { queryResult } = useShow({});
    const { data, isLoading } = queryResult;
    const record = data?.data;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [responseText, setResponseText] = useState("");
    const maxResponseLength = 500;

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
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Skeleton active paragraph={{ rows: 4 }} title={{ width: "30%" }} />
                    </Col>
                    <Col xs={24} lg={8}>
                        <Skeleton active paragraph={{ rows: 3 }} title={{ width: "20%" }} />
                    </Col>
                </Row>
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
            title={`Đánh giá #${record?.id || "N/A"}`}
            breadcrumb={
                <Breadcrumb style={{ marginBottom: 16 }}>
                    <Breadcrumb.Item>
                        <Text>Trang chủ</Text>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Text>Đánh giá</Text>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Text strong>{`Đánh giá #${record?.id || "N/A"}`}</Text>
                    </Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Row gutter={[24, 24]} style={{ maxWidth: 1200, margin: "0 auto" }}>
                <Col xs={24} lg={16}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: 12,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            padding: "24px",
                            background: "#fff",
                        }}
                    >
                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                            <Space>
                                <Text strong style={{ color: "#595959" }}>
                                    Đăng ngày: {formattedCreatedDate}
                                </Text>
                                <Text> • </Text>
                                <Text strong style={{ color: "#595959" }}>
                                    Cập nhật: {formattedUpdatedDate}
                                </Text>
                                <Text> • </Text>
                                <Text strong style={{ color: "#595959" }}>
                                    Trạng thái:{" "}
                                    <Tag color={record?.is_visible ? "green" : "red"}>
                                        {record?.is_visible ? "Hiển thị" : "Ẩn"}
                                    </Tag>
                                </Text>
                            </Space>
                            <Space align="center">
                                <Text strong style={{ color: "#595959" }}>Xếp hạng: </Text>
                                <Rate disabled value={record?.rating || 0} style={{ fontSize: 16 }} />
                                <Text>({record?.rating ? `${record.rating}/5` : "Không có xếp hạng"})</Text>
                            </Space>
                            {record?.image && (
                                <Image
                                    src={record.image}
                                    alt="Review"
                                    style={{
                                        width: "100%",
                                        maxHeight: 400,
                                        objectFit: "cover",
                                        borderRadius: 8,
                                        marginTop: 16,
                                    }}
                                    preview
                                />
                            )}
                            <Paragraph style={{ marginTop: 16 }}>
                                <Text strong style={{ color: "#595959" }}>Nội dung: </Text>
                                <TextField
                                    value={record?.comment || "Không có nội dung"}
                                    style={{ fontSize: 16, color: "#333", lineHeight: 1.8 }}
                                />
                            </Paragraph>
                            {record?.reply && (
                                <Paragraph style={{ marginTop: 16, background: "#f5f5f5", padding: 16, borderRadius: 8 }}>
                                    <Text strong style={{ color: "#595959" }}>Phản hồi: </Text>
                                    <TextField
                                        value={record.reply}
                                        style={{ fontSize: 14, color: "#333", lineHeight: 1.6 }}
                                    />
                                </Paragraph>
                            )}
                            <Divider />
                            {/*<Button type="primary" onClick={handleOpenModal} style={{ borderRadius: 6 }}>*/}
                            {/*    Phản hồi đánh giá*/}
                            {/*</Button>*/}
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: 12,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            padding: "24px",
                            background: "#fff",
                        }}
                    >
                        <Title level={4} style={{ color: "#333", margin: "0 0 16px 0" }}>
                            Thông tin bổ sung
                        </Title>
                        <Divider style={{ margin: "16px 0" }} />
                        <Paragraph style={{ marginBottom: 16 }}>
                            <Text strong style={{ color: "#595959" }}>Người dùng: </Text>
                            <TextField
                                value={record?.user?.name ?? "Không có dữ liệu"}
                                style={{ fontSize: 14, color: "#333" }}
                            />
                        </Paragraph>
                        <Paragraph style={{ marginBottom: 16 }}>
                            <Text strong style={{ color: "#595959" }}>Email: </Text>
                            <TextField
                                value={record?.user?.email ?? "Không có dữ liệu"}
                                style={{ fontSize: 14, color: "#333" }}
                            />
                        </Paragraph>
                        <Paragraph style={{ marginBottom: 16 }}>
                            <Text strong style={{ color: "#595959" }}>Sản phẩm: </Text>
                            <TextField
                                value={record?.product?.name ?? "Không có dữ liệu"}
                                style={{ fontSize: 14, color: "#333" }}
                            />
                        </Paragraph>
                        {/*<Paragraph style={{ marginBottom: 16 }}>*/}
                        {/*    <Text strong style={{ color: "#595959" }}>Xếp hạng: </Text>*/}
                        {/*    <Rate disabled value={record?.rating || 0} style={{ fontSize: 14 }} />*/}
                        {/*</Paragraph>*/}
                        <Paragraph style={{ marginBottom: 16 }}>
                            <Text strong style={{ color: "#595959" }}>Ngày tạo: </Text>
                            <Text style={{ color: "#fa8c16" }}>{formattedCreatedDate}</Text>
                        </Paragraph>
                        <Paragraph>
                            <Text strong style={{ color: "#595959" }}>Ngày cập nhật: </Text>
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
                okButtonProps={{ disabled: !responseText.trim() || responseText.length > maxResponseLength }}
            >
                <Input.TextArea
                    rows={4}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Nhập phản hồi của bạn..."
                    maxLength={maxResponseLength}
                    showCount
                />
                {responseText.length > maxResponseLength && (
                    <Text type="danger" style={{ marginTop: 8 }}>
                        Phản hồi vượt quá {maxResponseLength} ký tự!
                    </Text>
                )}
            </Modal>
        </Show>
    );
};