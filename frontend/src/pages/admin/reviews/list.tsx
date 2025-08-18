import { DeleteOutlined, PauseOutlined, PlayCircleOutlined, SearchOutlined } from "@ant-design/icons";
import {
    CreateButton,
    DateField,
    List,
    ShowButton,
    useSelect,
    useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Breadcrumb, Button, Col, Form, Input, Row, Select, Space, Table } from "antd";
import { useForm } from "antd/es/form/Form";

export const ReviewList = () => {
    const { tableProps, setFilters } = useTable({
        syncWithLocation: true,
        resource: "reviews",
    });

    const [form] = useForm();

    const handleSearch = (values: any) => {
        setFilters([
            {
                field: "product_id",
                operator: "eq",
                value: values.product_id || undefined,
            },
            {
                field: "rating",
                operator: "eq",
                value: values.rating !== undefined ? values.rating : undefined,
            },
        ], "replace");
    };

    const handleReset = () => {
        form.resetFields();
        setFilters([], "replace");
    };

    const { selectProps: productSelectProps } = useSelect({
        resource: "products",
        optionLabel: "name",
        optionValue: "id",
        queryOptions: {
            cacheTime: 5 * 60 * 1000,
        },
    });

    return (
        <List
            title={'Đánh giá'}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Đánh giá</Breadcrumb.Item>
                </Breadcrumb>
            }
            headerButtons={() => (
                <CreateButton>Thêm đánh giá</CreateButton>
            )}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSearch}
                style={{ marginBottom: 16 }}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item label="Sản phẩm" name="product_id">
                            <Select
                                placeholder="Chọn sản phẩm"
                                allowClear
                                {...productSelectProps}
                                loading={productSelectProps.loading}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item label="Xếp hạng" name="rating">
                            <Select
                                placeholder="Chọn xếp hạng"
                                allowClear
                                options={[
                                    { label: "1 sao", value: 1 },
                                    { label: "2 sao", value: 2 },
                                    { label: "3 sao", value: 3 },
                                    { label: "4 sao", value: 4 },
                                    { label: "5 sao", value: 5 },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item label=" ">
                            <Space>
                                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                    Lọc
                                </Button>
                                <Button onClick={handleReset}>Xóa bộ lọc</Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="id"
                    title={"STT"}
                    render={(value, record, index) => (
                        index + 1
                    )}
                />
                <Table.Column
                    dataIndex={["user", "name"]}
                    title={"Người dùng"}
                />
                <Table.Column
                    dataIndex={['product', 'name']}
                    title={"Sản phẩm"}
                    render={(value: string) => value || "Chưa cung cấp"}
                />
                <Table.Column
                    dataIndex="rating"
                    title={"Xếp hạng"}
                    render={(value: number) => `${value} / 5`}
                />
                <Table.Column
                    dataIndex="image"
                    title={"Ảnh"}
                    render={(value: string) =>
                        value ? (
                            <img
                                src={value}
                                alt="Review Image"
                                style={{ width: 90, height: 50, objectFit: "cover" }}
                            />
                        ) : (
                            <span>Chưa có ảnh</span>
                        )
                    }
                />
                <Table.Column
                    dataIndex={["created_at"]}
                    title={"Ngày tạo"}
                    render={(value: any) => <DateField value={value} />}
                />
                <Table.Column
                    title={"Hành động"}
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <ShowButton hideText size="large" recordItemId={record.id} />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};