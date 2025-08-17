import { DeleteOutlined, PauseOutlined, PlayCircleOutlined } from "@ant-design/icons";
import {
    DateField,
    DeleteButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Breadcrumb, Space, Table, Tag } from "antd";

export const AdminList = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
        resource: "manager-admin",
    });

    return (
        <List
            title="Danh sách Quản trị viên"
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Quản trị viên</Breadcrumb.Item>
                </Breadcrumb>
            }
            headerButtons={false}
        >
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
                                    description: "Thao tác đã được thực hiện.", // Tùy chọn thêm mô tả
                                })}
                            />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};