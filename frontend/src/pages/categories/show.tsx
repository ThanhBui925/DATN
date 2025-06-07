import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import {Typography, Row, Col, Skeleton, Image, Tag, Breadcrumb} from "antd";

const { Title } = Typography;

export const CategoryShow = () => {
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

    return (
        <Show
            title={'Chi tiết'}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Danh mục</Breadcrumb.Item>
                    <Breadcrumb.Item>Chi tiết</Breadcrumb.Item>
                    <Breadcrumb.Item>{ record!.name }</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Tên danh mục
                    </Title>
                    <TextField
                        value={record?.name || "Không có dữ liệu"}
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

                <Col span={24}>
                    <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                        Ảnh
                    </Title>
                    {record?.image ? (
                        <Image
                            src={record.image}
                            alt="Category"
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
            </Row>
        </Show>
    );
};