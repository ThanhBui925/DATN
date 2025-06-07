import { Show, TextField, DateField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Row, Col, Skeleton, Image, Tag, Breadcrumb } from "antd";
import { IResourceComponentsProps } from "@refinedev/core";

const { Title } = Typography;

export const BannerShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;
    const record = data?.data;

    if (isLoading) {
        return (
            <Show>
                <Skeleton active paragraph={{ rows: 4 }} />
            </Show>
        );
    }

    return (
        <Show
            title="Chi tiết Banner"
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Banner</Breadcrumb.Item>
                    <Breadcrumb.Item>Chi tiết</Breadcrumb.Item>
                    <Breadcrumb.Item>{record?.title}</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Tiêu đề
                    </Title>
                    <TextField
                        value={record?.title || "Không có dữ liệu"}
                        style={{ fontSize: 16 }}
                    />
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Đường dẫn
                    </Title>
                    <TextField
                        value={record?.slug || ""}
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
                        Liên kết URL
                    </Title>
                    {record?.link_url ? (
                        <a href={record.link_url} target="_blank" rel="noopener noreferrer">
                            <TextField
                                value={record.link_url}
                                style={{ fontSize: 16 }}
                            />
                        </a>
                    ) : (
                        <TextField value="Không có liên kết" style={{ fontSize: 16 }} />
                    )}
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Hình ảnh
                    </Title>
                    {record?.image_url ? (
                        <Image
                            src={record.image_url}
                            alt="Banner"
                            style={{
                                width: 150,
                                height: 150,
                                objectFit: "cover",
                                borderRadius: 8,
                                border: "1px solid #e8e8e8",
                            }}
                            preview
                        />
                    ) : (
                        <TextField value="Không có ảnh" style={{ fontSize: 16 }} />
                    )}
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Ngày bắt đầu
                    </Title>
                    <DateField
                        value={record?.start_date}
                        format="DD/MM/YYYY HH:mm:ss"
                        style={{ fontSize: 16 }}
                    />
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Ngày kết thúc
                    </Title>
                    <DateField
                        value={record?.end_date}
                        format="DD/MM/YYYY HH:mm:ss"
                        style={{ fontSize: 16 }}
                    />
                </Col>

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Trạng thái
                    </Title>
                    {record?.status ? (
                        <Tag color={record.status === "1" ? "green" : "red"}>
                            {record.status === "1" ? "Hoạt động" : "Không hoạt động"}
                        </Tag>
                    ) : (
                        <TextField value="Không có trạng thái" style={{ fontSize: 16 }} />
                    )}
                </Col>
            </Row>
        </Show>
    );
};