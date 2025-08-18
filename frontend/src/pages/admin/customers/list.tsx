import {DeleteOutlined, PauseOutlined, PlayCircleOutlined} from "@ant-design/icons";
import {
    CreateButton, DateField,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Breadcrumb, Space, Table, Tag } from "antd";

export const CustomerList = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
        resource: "customers",
    });

    return (
        <List
            title={"Danh sách Khách Hàng"}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Khách Hàng</Breadcrumb.Item>
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
                                    description: "Thao tác đã được thực hiện.", // Tùy chọn thêm mô tả
                                })}
                            />
                        </Space>
                    )
                    }
                />
            </Table>
        </List>
    );
};