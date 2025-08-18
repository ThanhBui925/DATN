import { DeleteOutlined, PauseOutlined, PlayCircleOutlined, SearchOutlined } from "@ant-design/icons";
import {
    CreateButton,
    DateField,
    DeleteButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Breadcrumb, Button, Form, Input, Select, Space, Table, Tag } from "antd";
import { useForm } from "antd/es/form/Form";

export const AdminList = () => {
    const { tableProps, setFilters } = useTable({
        syncWithLocation: true,
        resource: "manager-admin",
    });

    const [form] = useForm();

    const handleSearch = (values: any) => {
        setFilters([
            {
                field: "name",
                operator: "contains",
                value: values.name || undefined,
            },
            {
                field: "email",
                operator: "contains",
                value: values.email || undefined,
            },
            {
                field: "phone",
                operator: "contains",
                value: values.phone || undefined,
            },
            {
                field: "status",
                operator: "eq",
                value: values.status !== undefined ? values.status : undefined,
            },
        ]);
    };

    const handleReset = () => {
        form.resetFields();
        setFilters([]);
    };

    return (
        <List
            title="Danh sách Quản trị viên"
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Quản trị viên</Breadcrumb.Item>
                </Breadcrumb>
            }
            headerButtons={() => (
                <CreateButton>Thêm quản trị viên</CreateButton>
            )}
        >
            <Form form={form} layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
                <Form.Item name="name" label="Tên quản trị viên">
                    <Input placeholder="Tìm theo tên" allowClear />
                </Form.Item>
                <Form.Item name="email" label="Email">
                    <Input placeholder="Tìm theo email" allowClear />
                </Form.Item>
                <Form.Item name="phone" label="Số điện thoại">
                    <Input placeholder="Tìm theo số điện thoại" allowClear />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái">
                    <Select placeholder="Chọn trạng thái" allowClear style={{ width: 150 }}>
                        <Select.Option value="1">Hoạt động</Select.Option>
                        <Select.Option value="0">Ngừng hoạt động</Select.Option>
                    </Select>
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
                    dataIndex="name"
                    title="Tên Quản trị viên"
                    render={(value: string) => <span>{value || "Chưa cung cấp"}</span>}
                />
                <Table.Column
                    dataIndex="email"
                    title="Email"
                    render={(value: string) => <span>{value || "Chưa cung cấp"}</span>}
                />
                <Table.Column
                    dataIndex="phone"
                    title="Số Điện Thoại"
                    render={(value: string) => <span>{value || "Chưa cung cấp"}</span>}
                />
                <Table.Column
                    dataIndex="created_at"
                    title="Ngày Tạo"
                    render={(value: any) => <DateField value={value} format="DD/MM/YYYY HH:mm:ss" />}
                />
                <Table.Column
                    dataIndex="status"
                    title="Trạng Thái"
                    render={(value: number) => (
                        <Tag color={value === 1 ? "green" : "red"}>
                            {value === 1 ? "Hoạt Động" : "Không Hoạt Động"}
                        </Tag>
                    )}
                />
                <Table.Column
                    title="Hành Động"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <ShowButton hideText size="large" recordItemId={record.id} />
                            <DeleteButton
                                hideText
                                size="large"
                                recordItemId={record.id}
                                resource="manager-admin"
                                icon={record.status === 1 ? <PauseOutlined /> : <PlayCircleOutlined />}
                                confirmTitle={
                                    record.status === 1
                                        ? "Bạn có muốn ngừng hoạt động quản trị viên này?"
                                        : "Bạn có muốn kích hoạt quản trị viên này?"
                                }
                                confirmOkText={record.status === 1 ? "Ngừng hoạt động" : "Kích hoạt"}
                                confirmCancelText="Hủy"
                                meta={{
                                    action: "toggle-status",
                                    payload: { status: record.status === 1 ? 0 : 1 },
                                }}
                                successNotification={() => ({
                                    type: "success",
                                    message: record.status === 1
                                        ? "Đã ngừng hoạt động quản trị viên thành công"
                                        : "Đã kích hoạt quản trị viên thành công",
                                    description: "Thao tác đã được thực hiện.",
                                })}
                            />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};