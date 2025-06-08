import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Row, Col, Image, Breadcrumb, Card, Table } from "antd";

const { Title, Text } = Typography;

export const ProductsShow = () => {
    const { queryResult } = useShow({});
    const { data, isLoading } = queryResult;
    const record = data?.data;

    const basicInfoColumns = [
        {
            title: <Text strong style={{ color: "#444" }}>Tiêu đề</Text>,
            dataIndex: "label",
            key: "label",
            width: "30%",
        },
        {
            title: <Text strong style={{ color: "#444" }}>Nội dung</Text>,
            dataIndex: "value",
            key: "value",
            render: (value: any) => <TextField value={value} />,
        },
    ];

    const basicInfoData = [
        { key: "1", label: "ID", value: record?.id },
        { key: "2", label: "Tên sản phẩm", value: record?.name },
        { key: "3", label: "Danh mục", value: record?.category?.name || "Chưa có danh mục" },
        { key: "4", label: "Giá", value: record?.price ? `${record.price} VNĐ` : "0.00 VNĐ" },
        { key: "5", label: "Giá khuyến mãi", value: record?.sale_price ? `${record.sale_price} VNĐ` : "Không có" },
        { key: "6", label: "Ngày kết thúc khuyến mãi", value: record?.sale_end || "Không có" },
        { key: "7", label: "Trạng thái", value: record?.status === "1" ? "Hoạt động" : "Ngừng hoạt động" },
    ];

    const variantColumns = [
        {
            title: <Text strong style={{ color: "#444" }}>Tên biến thể</Text>,
            dataIndex: "name",
            key: "name",
            render: (value: any) => <TextField value={value} />,
        },
        {
            title: <Text strong style={{ color: "#444" }}>Kích thước</Text>,
            dataIndex: "size",
            key: "size",
            render: (value: any) => <TextField value={value?.name || "Chưa có kích thước"} />,
        },
        {
            title: <Text strong style={{ color: "#444" }}>Màu sắc</Text>,
            dataIndex: "color",
            key: "color",
            render: (value: any) => <TextField value={value?.name || "Chưa có màu sắc"} />,
        },
        {
            title: <Text strong style={{ color: "#444" }}>Số lượng</Text>,
            dataIndex: "quantity",
            key: "quantity",
            render: (value: any) => <TextField value={value} />,
        },
        {
            title: <Text strong style={{ color: "#444" }}>Trạng thái</Text>,
            dataIndex: "status",
            key: "status",
            render: (value: any) => <TextField value={value === "1" ? "Hoạt động" : "Ngừng hoạt động"} />,
        },
        {
            title: <Text strong style={{ color: "#444" }}>Ảnh biến thể</Text>,
            dataIndex: "images",
            key: "images",
            render: (value: any) => (
                value && value.length > 0 ? (
                    <Image.PreviewGroup>
                        <Row gutter={[8, 8]}>
                            {value.map((image: any, index: string) => (
                                <Col key={index} span={8}>
                                    <Image src={image.image_url} width="100%" />
                                </Col>
                            ))}
                        </Row>
                    </Image.PreviewGroup>
                ) : (
                    <TextField value="Chưa có ảnh" />
                )
            ),
        },
    ];

    return (
        <Show
            isLoading={isLoading}
            title={<Title level={3} style={{ margin: 0 }}>Chi tiết sản phẩm</Title>}
            breadcrumb={
                <Breadcrumb style={{ margin: "0 0 20px 0", fontSize: 14, color: "#444" }}>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
                    <Breadcrumb.Item>Chi tiết</Breadcrumb.Item>
                    <Breadcrumb.Item>{record?.name}</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Row gutter={[24, 24]} style={{ marginBottom: 20 }}>
                <Col span={16}>
                    <Card
                        title={<Title level={4} style={{ margin: 0 }}>Thông tin cơ bản</Title>}
                    >
                        <Table
                            dataSource={basicInfoData}
                            columns={basicInfoColumns}
                            pagination={false}
                            bordered
                            rowKey="key"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        title={<Title level={4} style={{ margin: 0 }}>Ảnh đại diện sản phẩm</Title>}
                    >
                        {record?.image ? (
                            <Image src={record.image} width={200} />
                        ) : (
                            <TextField value="Chưa có ảnh" />
                        )}
                    </Card>
                </Col>
            </Row>
            <Row gutter={[24, 24]} style={{ marginBottom: 20 }}>
                <Col span={24}>
                    <Card
                        title={<Title level={4} style={{ margin: 0 }}>Ảnh mô tả sản phẩm</Title>}
                    >
                        {record?.imageDesc && record.imageDesc.length > 0 ? (
                            <Image.PreviewGroup>
                                <Row gutter={[8, 8]}>
                                    {record.imageDesc.map((url: any, index: number) => (
                                        <Col key={index} xs={12} sm={8} md={6} lg={4}>
                                            <Image src={url.url} width="100%" />
                                        </Col>
                                    ))}
                                </Row>
                            </Image.PreviewGroup>
                        ) : (
                            <TextField value="Chưa có ảnh" />
                        )}
                    </Card>
                </Col>
            </Row>
            <Row gutter={[24, 24]} style={{ marginBottom: 20 }}>
                <Col span={24}>
                    <Card
                        title={<Title level={4} style={{ margin: 0 }}>Mô tả sản phẩm</Title>}
                    >
                        <div
                            dangerouslySetInnerHTML={{ __html: record?.description }}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card
                        title={<Title level={4} style={{ margin: 0 }}>Biến thể sản phẩm</Title>}
                    >
                        {record?.variants && record.variants.length > 0 ? (
                            <Table
                                dataSource={record.variants}
                                columns={variantColumns}
                                pagination={false}
                                bordered
                                rowKey={(variant: any) => variant.id || variant.name}
                            />
                        ) : (
                            <TextField value="Chưa có biến thể" />
                        )}
                    </Card>
                </Col>
            </Row>
        </Show>
    );
};