import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Row, Col, Image, Breadcrumb, Card, Table, Divider } from "antd";
import { convertDate, convertToInt } from "../../../helpers/common";
import MDEditor from "@uiw/react-md-editor";

// Define interfaces for type safety
interface ImageType {
    url: string;
}

interface Variant {
    id: number;
    name: string;
    quantity: number;
    size_id: number;
    color_id: number;
    status: string;
    size?: { id: number; name: string };
    color?: { id: number; name: string };
    images?: { image_url: string }[];
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    status: number;
    created_at: string;
    updated_at: string;
}

interface Review {
    id: number;
    product_id: number;
    user_id: number;
    comment: string;
    rating: number;
    is_visible: number;
    reply: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
}

interface Category {
    id: number;
    name: string;
    description: string;
    image: string;
    status: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Product {
    id: number;
    category_id: number;
    name: string;
    description: string;
    price: string;
    sale_price: string | null;
    sale_end: string | null;
    image: string;
    status: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    total_ordered_quantity: string;
    average_rating: number;
    review_count: number;
    category: Category;
    variants: Variant[];
    images: ImageType[];
    reviews: Review[];
}

const { Title, Text } = Typography;

export const ProductsShow: React.FC = () => {
    const { queryResult } = useShow<Product>({});
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
        { key: "4", label: "Giá", value: record?.price ? `${convertToInt(record.price)} VNĐ` : "0.00 VNĐ" },
        {
            key: "5",
            label: "Giá khuyến mãi",
            value: record?.sale_price ? `${convertToInt(record.sale_price)} VNĐ` : "Không có",
        },
        {
            key: "6",
            label: "Ngày kết thúc khuyến mãi",
            value: record?.sale_end ? convertDate(record.sale_end) : "Không có",
        },
        { key: "7", label: "Trạng thái", value: record?.status === "1" ? "Hoạt động" : "Ngừng hoạt động" },
        { key: "8", label: "Số lượng đơn hàng bán ra", value: record?.total_ordered_quantity || "0" },
        { key: "9", label: "Số lượng đánh giá", value: record?.review_count || "0" },
        { key: "10", label: "Đánh giá trung bình", value: record?.average_rating + ' sao'},
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
            render: (value: any) =>
                value && value.length > 0 ? (
                    <Image.PreviewGroup>
                        <Row gutter={[4, 8]}>
                            {value.map((image: any, index: string) => (
                                <Col key={index} span={3}>
                                    <Image
                                        src={image.image_url}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            objectFit: "cover",
                                            borderRadius: 4,
                                        }}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Image.PreviewGroup>
                ) : (
                    <TextField value="Chưa có ảnh" />
                ),
        },
    ];

    const reviewColumns = [
        {
            title: <Text strong style={{ color: "#444" }}>Người đánh giá</Text>,
            dataIndex: "user",
            key: "user",
            render: (value: any) => <TextField value={value?.name || "Ẩn danh"} />,
        },
        {
            title: <Text strong style={{ color: "#444" }}>Nội dung</Text>,
            dataIndex: "comment",
            key: "comment",
            render: (value: any) => <TextField value={value || "Không có nội dung"} />,
        },
        {
            title: <Text strong style={{ color: "#444" }}>Điểm đánh giá</Text>,
            dataIndex: "rating",
            key: "rating",
            render: (value: any) => <TextField value={value} />,
        },
        {
            title: <Text strong style={{ color: "#444" }}>Ngày đánh giá</Text>,
            dataIndex: "created_at",
            key: "created_at",
            render: (value: any) => <TextField value={convertDate(value)} />,
        },
        {
            title: <Text strong style={{ color: "#444" }}>Trạng thái</Text>,
            dataIndex: "is_visible",
            key: "is_visible",
            render: (value: any) => <TextField value={value === 1 ? "Hiển thị" : "Ẩn"} />,
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
                    <Card title={<Title level={4} style={{ margin: 0 }}>Thông tin cơ bản</Title>}>
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
                    <Card title={<Title level={4} style={{ margin: 0 }}>Ảnh đại diện sản phẩm</Title>}>
                        {record?.image ? (
                            <Image src={record.image} width={300} />
                        ) : (
                            <TextField value="Chưa có ảnh" />
                        )}
                        <Divider orientation="left">Ảnh mô tả sản phẩm</Divider>
                        {record?.images && record.images.length > 0 ? (
                            <Image.PreviewGroup>
                                <Row gutter={[8, 8]}>
                                    {record.images.map((image: ImageType, index: number) => (
                                        <Col key={index}>
                                            <Image
                                                src={image.url}
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    objectFit: "cover",
                                                    borderRadius: 4,
                                                }}
                                            />
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
                    <Card title={<Title level={4} style={{ margin: 0 }}>Mô tả sản phẩm</Title>}>
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/*@ts-ignore*/}
                        {/*<div dangerouslySetInnerHTML={{ __html:  }} />*/}
                        <MDEditor.Markdown source={record?.description} />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[24, 24]} style={{ marginBottom: 20 }}>
                <Col span={24}>
                    <Card title={<Title level={4} style={{ margin: 0 }}>Biến thể sản phẩm</Title>}>
                        {record?.variants && record.variants.length > 0 ? (
                            <Table
                                dataSource={record.variants}
                                columns={variantColumns}
                                pagination={false}
                                bordered
                                rowKey={(variant: Variant) => variant.id || variant.name}
                            />
                        ) : (
                            <TextField value="Chưa có biến thể" />
                        )}
                    </Card>
                </Col>
            </Row>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card title={<Title level={4} style={{ margin: 0 }}>Đánh giá sản phẩm</Title>}>
                        {record?.reviews && record.reviews.length > 0 ? (
                            <Table
                                dataSource={record.reviews}
                                columns={reviewColumns}
                                pagination={false}
                                bordered
                                rowKey={(review: Review) => review.id}
                            />
                        ) : (
                            <TextField value="Chưa có đánh giá" />
                        )}
                    </Card>
                </Col>
            </Row>
        </Show>
    );
};