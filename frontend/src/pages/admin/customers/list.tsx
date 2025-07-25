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
                    render={(value: any) => <DateField value={value} />}
                />
                <Table.Column
                    dataIndex={["deleted_at"]}
                    title="Trạng Thái"
                    render={(value: string) => (
                        <Tag color={value ? "red" : "green"}>
                            {value ? "Đã Xóa" : "Hoạt Động"}
                        </Tag>
                    )}
                />
                <Table.Column
                    title="Hành Động"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => {

                        return (
                            <Space>
                                <ShowButton hideText size="large" recordItemId={record.id} />
                                <DeleteButton
                                    hideText
                                    size="large"
                                    recordItemId={record.id}
                                    icon={record.user_status ? <PauseOutlined /> : <PlayCircleOutlined />}
                                    confirmTitle={
                                        record.user_status
                                            ? 'Bạn có muốn ngừng hoạt động khách hàng này?'
                                            : 'Bạn có muốn kích hoạt lại khách hàng này?'
                                    }
                                    confirmOkText={record.user_status ? 'Ngừng hoạt động' : 'Kích hoạt'}
                                    confirmCancelText="Hủy"
                                />
                            </Space>
                        );
                    }}
                />
            </Table>
        </List>
    );
};