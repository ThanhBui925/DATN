import {
    CreateButton,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Breadcrumb, Modal, Space, Table, Tag, Form, Input, Select, Button, Row, Col } from "antd";
import { useForceDelete } from "../../../hooks/useForceDelete";

export const CategoryList = () => {
    const { tableProps, setFilters } = useTable({
        syncWithLocation: true,
        filters: {
            initial: [
                { field: "name", operator: "contains", value: undefined },
                { field: "status", operator: "eq", value: undefined },
            ],
        },
    });

    const { forceDelete } = useForceDelete();
    const [form] = Form.useForm();

    const handleFilter = (values: any) => {
        setFilters([
            { field: "name", operator: "contains", value: values.name || undefined },
            { field: "status", operator: "eq", value: values.status || undefined },
        ]);
    };

    const handleReset = () => {
        form.resetFields();
        setFilters([
            { field: "name", operator: "contains", value: undefined },
            { field: "status", operator: "eq", value: undefined },
        ]);
    };

    return (
        <List
            title={"Danh mục"}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Danh mục</Breadcrumb.Item>
                </Breadcrumb>
            }
            headerButtons={() => (
                <CreateButton>Thêm danh mục</CreateButton>
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
                        <Form.Item label="Tên danh mục" name="name">
                            <Input placeholder="Nhập tên danh mục" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item label="Trạng thái" name="status">
                            <Select
                                placeholder="Chọn trạng thái"
                                allowClear
                                options={[
                                    { label: "Hoạt động", value: "1" },
                                    { label: "Không hoạt động", value: "0" },
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
                <Table.Column
                    title="STT"
                    key="index"
                    render={(text, record, index) => index + 1}
                />
                <Table.Column dataIndex="name" title="Tên danh mục"/>
                <Table.Column
                    dataIndex="image"
                    title="Ảnh"
                    render={(value: string) =>
                        value ? (
                            <img
                                src={ value }
                                alt="Image"
                                style={{ width: 90, height: 50, objectFit: "cover" }}
                            />
                        ) : (
                            <span>Chưa có ảnh</span>
                        )
                    }
                />
                <Table.Column
                    dataIndex="status"
                    title="Trạng thái"
                    render={(value) => (
                        <Tag color={value == 0 ? "red" : "green"}>
                            {value == 0 ? "Không hoạt động" : "Hoạt động"}
                        </Tag>
                    )}
                />
                <Table.Column
                    title="Hành động"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => {
                        const handleClick = () => {
                            Modal.confirm({
                                title: "Bạn có muốn xoá vĩnh viễn danh mục này?",
                                okText: "Xoá",
                                cancelText: "Huỷ",
                                onOk: () => {
                                    forceDelete(record.id as number);
                                },
                            });
                        };

                        return (
                            <Space>
                                <EditButton hideText size="large" recordItemId={record.id}/>
                                <ShowButton hideText size="large" recordItemId={record.id}/>
                                <DeleteButton
                                    hideText
                                    size="large"
                                    recordItemId={record.id}
                                    confirmTitle="Bạn có muốn xoá danh mục này?"
                                    confirmOkText="Xoá"
                                    confirmCancelText="Huỷ"
                                />
                            </Space>
                        );
                    }}
                />
            </Table>
        </List>
    );
};