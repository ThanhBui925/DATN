import {
    CreateButton,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useSelect,
    useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Breadcrumb, Space, Table, Tag, Form, Input, Select, Button } from "antd";
import { SearchOutlined } from '@ant-design/icons';

export const ProductsList = () => {
    const { tableProps, setFilters } = useTable({
        syncWithLocation: true,
    });

    const [form] = Form.useForm();

    const { selectProps: categorySelectProps } = useSelect({
        resource: "categories",
        optionLabel: "name",
        optionValue: "id",
        queryOptions: {
            cacheTime: 5 * 60 * 1000,
        },
    });

    const handleSearch = (values: any) => {
        setFilters([
            {
                field: "name",
                operator: "contains",
                value: values.name || undefined,
            },
            {
                field: "status",
                operator: "eq",
                value: values.status !== undefined ? values.status : undefined,
            },
            {
                field: "category.id",
                operator: "in",
                value: values.category_id && values.category_id.length > 0 ? values.category_id : undefined,
            },
        ]);
    };

    const handleReset = () => {
        form.resetFields();
        setFilters([]);
    };

    return (
        <List
            title={`Sản phẩm`}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
                </Breadcrumb>
            }
            headerButtons={() => (
                <CreateButton>Thêm sản phẩm</CreateButton>
            )}
        >
            <Form form={form} layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
                <Form.Item name="name" label="Tên sản phẩm">
                    <Input placeholder="Tìm theo tên" allowClear />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái">
                    <Select placeholder="Chọn trạng thái" allowClear style={{ width: 150 }}>
                        <Select.Option value="1">Hoạt động</Select.Option>
                        <Select.Option value="0">Ngừng hoạt động</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Danh mục"
                    name="category_id"
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn danh mục"
                        {...categorySelectProps}
                        loading={categorySelectProps.loading}
                        allowClear
                        style={{ minWidth: 200 }}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                        Tìm kiếm
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button onClick={handleReset}>
                        Đặt lại
                    </Button>
                </Form.Item>
            </Form>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    title="STT"
                    key="index"
                    render={(text, record, index) => index + 1}
                />
                <Table.Column
                    dataIndex="image"
                    title="Ảnh"
                    render={(value: string) =>
                        value ? (
                            <img
                                src={value}
                                alt="Image"
                                style={{ width: 90, height: 50, objectFit: "cover" }}
                            />
                        ) : (
                            <span>Chưa có ảnh</span>
                        )
                    }
                />
                <Table.Column dataIndex="name" title={"Tên sản phẩm"} />
                <Table.Column dataIndex="price" title={"Giá sản phẩm"} />
                <Table.Column dataIndex="variants_sum_quantity" title={"Tồn kho"} />
                <Table.Column
                    dataIndex="status"
                    title="Trạng thái"
                    render={(value: string) => {
                        const statusMap: Record<string, { color: string; label: string }> = {
                            1: { color: "green", label: "Hoạt động" },
                            0: { color: "red", label: "Ngừng hoạt động" }
                        };

                        const status = statusMap[value];

                        return status && (
                            <Tag color={status.color}>{status.label}</Tag>
                        );
                    }}
                />
                <Table.Column dataIndex={['category', 'name']} title="Danh mục" />
                <Table.Column
                    title={"Hành động"}
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton hideText size="large" recordItemId={record.id} />
                            <ShowButton hideText size="large" recordItemId={record.id} />
                            <DeleteButton hideText size="large" recordItemId={record.id} />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};