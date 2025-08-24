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

export const CustomerList = () => {
    const { tableProps, setFilters } = useTable({
        syncWithLocation: true,
        resource: "customers",
    });

    const [form] = useForm();

    const handleSearch = (values: any) => {
        setFilters([
            {
                field: "user_name",
                operator: "contains",
                value: values.name || undefined,
            },
            {
                field: "user_email",
                operator: "contains",
                value: values.email || undefined,
            },
            {
                field: "phone",
                operator: "contains",
                value: values.phone || undefined,
            },
            {
                field: "user_status",
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
            title={"Danh sách Khách Hàng"}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Khách Hàng</Breadcrumb.Item>
                </Breadcrumb>
            }
            headerButtons={() => (
                <CreateButton>Thêm khách hàng</CreateButton>
            )}
        >
            <Form form={form} layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
                <Form.Item name="name" label="Tên khách hàng">
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
                    dataIndex="user_name"
                    title="Tên Khách Hàng"
                    render={(value: string) => <span>{value}</span>}
                />
                <Table.Column
                    dataIndex="user_email"
                    title="Email"
                    render={(value: string) => <span>{value}</span>}
                />
                <Table.Column
                    dataIndex={["phone"]}
                    title="Số Điện Thoại"
                    render={(value: string) => <span>{value}</span>}
                />
                <Table.Column
                    dataIndex={["address"]}
                    title="Địa Chỉ"
                    render={(value: string) => <span>{value || "Chưa cung cấp"}</span>}
                />
                <Table.Column
                    dataIndex={["created_at"]}
                    title="Ngày Tạo"
                    render={(value: any) => <DateField value={value}/>}
                />
                <Table.Column
                    dataIndex="user_status"
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
                            <ShowButton hideText size="large" recordItemId={record.id}/>
                            <DeleteButton
                                hideText
                                size="large"
                                recordItemId={record.id}
                                resource="customers"
                                icon={record.user_status === 1 ? <PauseOutlined/> : <PlayCircleOutlined/>}
                                confirmTitle={
                                    record.user_status === 1
                                        ? "Bạn có muốn ngừng hoạt động khách hàng này?"
                                        : "Bạn có muốn kích hoạt khách hàng này?"
                                }
                                confirmOkText={record.user_status === 1 ? "Ngừng hoạt động" : "Kích hoạt"}
                                confirmCancelText="Hủy"
                                meta={{
                                    action: "toggle-status",
                                    payload: {status: record.user_status === 1 ? 0 : 1},
                                }}
                                successNotification={() => ({
                                    type: "success",
                                    message: record.user_status === 1
                                        ? "Đã ngừng hoạt động khách hàng thành công"
                                        : "Đã kích hoạt khách hàng thành công",
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