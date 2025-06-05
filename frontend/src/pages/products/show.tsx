import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Row, Col, Image, List } from "antd";

const { Title } = Typography;

export const ProductsShow = () => {
    const { queryResult } = useShow({});
    const { data, isLoading } = queryResult;
    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Title level={5}>ID</Title>
                    <TextField value={record?.id} />

                    <Title level={5}>Tên sản phẩm</Title>
                    <TextField value={record?.name} />

                    <Title level={5}>Danh mục</Title>
                    <TextField value={record?.category?.name || "Chưa có danh mục"} />

                    <Title level={5}>Giá</Title>
                    <TextField value={record?.price ? `${record.price} VNĐ` : "0.00 VNĐ"} />

                    <Title level={5}>Giá khuyến mãi</Title>
                    <TextField value={record?.sale_price ? `${record.sale_price} VNĐ` : "Không có"} />

                    <Title level={5}>Ngày kết thúc khuyến mãi</Title>
                    <TextField value={record?.sale_end || "Không có"} />

                    <Title level={5}>Trạng thái</Title>
                    <TextField value={record?.status === "1" ? "Hoạt động" : "Ngừng hoạt động"} />
                </Col>
                <Col span={12}>
                    <Title level={5}>Mô tả</Title>
                    <div
                        dangerouslySetInnerHTML={{ __html: record?.description }}
                        style={{ border: "1px solid #d9d9d9", padding: "10px", borderRadius: "4px" }}
                    />

                    <Title level={5}>Ảnh đại diện sản phẩm</Title>
                    {record?.image ? (
                        <Image src={record.image} width={200} style={{ borderRadius: "4px" }} />
                    ) : (
                        <TextField value="Chưa có ảnh" />
                    )}

                    <Title level={5}>Ảnh mô tả sản phẩm</Title>
                    {record?.imageDesc && record.imageDesc.length > 0 ? (
                        <Image.PreviewGroup>
                            <Row gutter={[8, 8]}>
                                {record.imageDesc.map((url: any, index: number) => (
                                    <Col key={index}>
                                        <Image src={url} width={100} style={{ borderRadius: "4px" }} />
                                    </Col>
                                ))}
                            </Row>
                        </Image.PreviewGroup>
                    ) : (
                        <TextField value="Chưa có ảnh" />
                    )}
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
                <Col span={24}>
                    <Title level={5}>Biến thể sản phẩm</Title>
                    {record?.variants && record.variants.length > 0 ? (
                        <List
                            bordered
                            dataSource={record.variants}
                            renderItem={(variant: any) => (
                                <List.Item>
                                    <Row gutter={[16, 16]} style={{ width: "100%" }}>
                                        <Col sm={12} xs={24}>
                                            <Title level={5}>Tên biến thể</Title>
                                            <TextField value={variant.name} />
                                            <Title level={5}>Kích thước</Title>
                                            <TextField value={variant.size?.name || "Chưa có kích thước"} />
                                            <Title level={5}>Màu sắc</Title>
                                            <TextField value={variant.color?.name || "Chưa có màu sắc"} />
                                        </Col>
                                        <Col sm={12} xs={24}>
                                            <Title level={5}>Số lượng</Title>
                                            <TextField value={variant.quantity} />
                                            <Title level={5}>Trạng thái</Title>
                                            <TextField value={variant.status === "active" ? "Hoạt động" : "Ngừng hoạt động"} />
                                            <Title level={5}>Ảnh biến thể</Title>
                                            {variant.images && variant.images.length > 0 ? (
                                                <Image.PreviewGroup>
                                                    <Row gutter={[8, 8]}>
                                                        {variant.images.map((url: any, index: string) => (
                                                            <Col key={index}>
                                                                <Image src={url} width={100} style={{ borderRadius: "4px" }} />
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </Image.PreviewGroup>
                                            ) : (
                                                <TextField value="Chưa có ảnh" />
                                            )}
                                        </Col>
                                    </Row>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <TextField value="Chưa có biến thể" />
                    )}
                </Col>
            </Row>
        </Show>
    );
};