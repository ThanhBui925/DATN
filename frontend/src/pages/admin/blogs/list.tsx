import {
    CreateButton,
    DateField,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import {type BaseRecord } from "@refinedev/core";
import {Breadcrumb, Button, Col, Form, Input, Row, Select, Space, Table, Tag} from "antd";

export const BlogPostList = () => {
    const { tableProps, setFilters } = useTable({
        syncWithLocation: true,
        filters: {
            initial: [
                { field: "title", operator: "contains", value: undefined },
                { field: "status", operator: "eq", value: undefined },
            ],
        },
    });

    const handleFilter = (values: any) => {
        setFilters([
            { field: "title", operator: "contains", value: values.title || undefined },
            { field: "status", operator: "eq", value: values.status || undefined },
        ]);
    };

    const [form] = Form.useForm();

    const handleReset = () => {
        form.resetFields();
        setFilters([
            { field: "title", operator: "contains", value: undefined },
            { field: "status", operator: "eq", value: undefined },
        ]);
    };

    return (
        <List
            title={'Bài viết'}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Bài viết</Breadcrumb.Item>
                </Breadcrumb>
            }
            headerButtons={() => (
                <CreateButton>Thêm bài viết</CreateButton>
            )}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFilter}
                style={{ marginBottom: 16 }}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item label="Tên danh mục" name="title">
                            <Input placeholder="Nhập tiêu đề" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item label="Trạng thái" name="status">
                            <Select
                                placeholder="Chọn trạng thái"
                                allowClear
                                defaultValue={'published'}
                                options={[
                                    { label: "Công khai", value: "published" },
                                    { label: "Riêng tư", value: "private" },
                                    { label: "Nháp", value: "draft" },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item label=" ">
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Lọc
                                </Button>
                                <Button onClick={handleReset}>Xóa bộ lọc</Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title={"STT"}/>
                <Table.Column
                    dataIndex="image"
                    title="Ảnh"
                    render={(value: string) =>
                        value ? (
                            <img
                                src={value}
                                alt="Image"
                                style={{width: 90, height: 50, objectFit: "cover"}}
                            />
                        ) : (
                            <span>Chưa có ảnh</span>
                        )
                    }
                />
                <Table.Column dataIndex="title" title={"Tiêu đề"}/>
                <Table.Column
                    dataIndex="status"
                    title="Trạng thái"
                    render={(value: string | number) => {
                        if (value === null || value === undefined) return null;

                        const statusMap: Record<string, { color: string; label: string }> = {
                            "1": { color: "green", label: "Công khai" },
                            "0": { color: "red", label: "Nháp" },
                            "2": { color: "blue", label: "Riêng tư" },
                        };

                        const status = statusMap[String(value)];

                        return status && <Tag color={status.color}>{status.label}</Tag>;
                    }}

                />

                <Table.Column
                    dataIndex={["created_at"]}
                    title={"Ngày tạo"}
                    render={(value: any) => <DateField value={value}/>}
                />
                <Table.Column
                    title={"Hành động"}
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton hideText size="large" recordItemId={record.id}/>
                            <ShowButton hideText size="large" recordItemId={record.id}/>
                            <DeleteButton hideText size="large" recordItemId={record.id}/>
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
