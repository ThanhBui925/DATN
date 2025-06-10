import {Show, TextField, DateField} from "@refinedev/antd";
import {useShow} from "@refinedev/core";
import {Typography, Row, Col, Skeleton, Image, Tag, Breadcrumb, Card, Space} from "antd";
import {IResourceComponentsProps} from "@refinedev/core";

const {Title, Text} = Typography;

export const BannerShow: React.FC<IResourceComponentsProps> = () => {
    const {queryResult} = useShow();
    const {data, isLoading} = queryResult;
    const record = data?.data;

    if (isLoading) {
        return (
            <Show>
                <Skeleton active paragraph={{rows: 4}}/>
            </Show>
        );
    }

    return (
        <Show
            title={<Title level={3}>Chi tiết Banner</Title>}
            breadcrumb={
                <Breadcrumb style={{marginBottom: 16, fontSize: 14}}>
                    <Breadcrumb.Item>
                        <Text strong>Trang chủ</Text>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Text strong>Banner</Text>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Text strong>Chi tiết</Text>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Text strong>{record?.title || "Không có tiêu đề"}</Text>
                    </Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Row gutter={[24, 24]} style={{marginBottom: 24}}>
                <Col xs={24} lg={12}>
                    <Card
                        title={<Title level={4} style={{margin: 0}}>Thông tin cơ bản</Title>}
                    >
                        <Space direction="vertical" size="middle" style={{width: "100%"}}>
                            <div>
                                <Text strong>Tiêu đề</Text>
                                <TextField
                                    value={record?.title || "Không có dữ liệu"}
                                    style={{display: "block", fontSize: 16, color: "#262626", marginTop: 8}}
                                />
                            </div>
                            <div>
                                <Text strong>Đường dẫn</Text>
                                <TextField
                                    value={record?.slug || "Không có dữ liệu"}
                                    style={{display: "block", fontSize: 16, color: "#262626", marginTop: 8}}
                                />
                            </div>
                            <div>
                                <Text strong>Liên kết URL</Text>
                                {record?.link_url ? (
                                    <a href={record.link_url} target="_blank" rel="noopener noreferrer">
                                        <TextField
                                            value={record.link_url}
                                            style={{display: "block", fontSize: 16, color: "#1d39c4", marginTop: 8}}
                                        />
                                    </a>
                                ) : (
                                    <TextField
                                        value="Không có liên kết"
                                        style={{display: "block", fontSize: 16, color: "#595959", marginTop: 8}}
                                    />
                                )}
                            </div>
                            <div>
                                <Text strong>Trạng thái</Text>
                                <div style={{marginTop: 8}}>
                                    {record?.status ? (
                                        <Tag
                                            color={record.status === "1" ? "green" : "red"}
                                            style={{padding: "4px 12px", fontSize: 14, borderRadius: 4}}
                                        >
                                            {record.status === "1" ? "Hoạt động" : "Không hoạt động"}
                                        </Tag>
                                    ) : (
                                        <TextField
                                            value="Không có trạng thái"
                                            style={{display: "block", fontSize: 16, color: "#595959"}}
                                        />
                                    )}
                                </div>
                            </div>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={<Title level={4} style={{margin: 0}}>Hình ảnh & Thời gian</Title>}
                    >
                        <Space direction="vertical" size="middle" style={{width: "100%"}}>
                            <div>
                                <Text strong>Hình ảnh</Text>
                                <div style={{marginTop: 8}}>
                                    {record?.image_url ? (
                                        <Image
                                            src={record.image_url}
                                            alt="Banner"
                                            style={{
                                                width: 200,
                                                height: 200,
                                                objectFit: "cover",
                                                borderRadius: 8,
                                                border: "1px solid #e8e8e8",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                                            }}
                                            preview
                                        />
                                    ) : (
                                        <TextField
                                            value="Không có ảnh"
                                            style={{display: "block", fontSize: 16, color: "#595959"}}
                                        />
                                    )}
                                </div>
                            </div>
                            <div>
                                <Text strong>Ngày bắt đầu</Text>
                                <DateField
                                    value={record?.start_date}
                                    format="DD/MM/YYYY HH:mm:ss"
                                    style={{display: "block", fontSize: 16, color: "#262626", marginTop: 8}}
                                />
                            </div>
                            <div>
                                <Text strong>Ngày kết thúc</Text>
                                <DateField
                                    value={record?.end_date}
                                    format="DD/MM/YYYY HH:mm:ss"
                                    style={{display: "block", fontSize: 16, color: "#262626", marginTop: 8}}
                                />
                            </div>
                        </Space>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card
                        title={<Title level={4} style={{margin: 0}}>Mô tả</Title>}
                    >
                        <Text strong>Mô tả</Text>
                        <TextField
                            value={record?.description || "Không có mô tả"}
                            style={{display: "block", fontSize: 16, color: "#262626", marginTop: 8, lineHeight: 1.6}}
                        />
                    </Card>
                </Col>
            </Row>
        </Show>
    );
};