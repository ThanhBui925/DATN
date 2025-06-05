import { DeleteOutlined } from "@ant-design/icons";
import {
    CreateButton, DateField,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Breadcrumb, Button, Modal, Space, Table, Tag } from "antd";
import { useForceDelete } from "../../hooks/useForceDelete";

export const VoucherList = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
        resource: "vouchers", // Specify the resource
    });

    const { forceDelete } = useForceDelete();

    return (
        <List
            title={"Danh sách Voucher"}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Voucher</Breadcrumb.Item>
                </Breadcrumb>
            }
            headerButtons={() => (
                <CreateButton>Thêm Voucher</CreateButton>
            )}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    title="STT"
                    key="index"
                    render={(text, record, index) => index + 1}
                />
                <Table.Column dataIndex="code" title="Mã Voucher" />
                <Table.Column
                    dataIndex="discount"
                    title="Giảm giá"
                    render={(value: number, record: BaseRecord) => (
                        <span>
                            {record.discount_type === "percentage"
                                ? `${value}%`
                                : `${value.toLocaleString()} VNĐ`}
                        </span>
                    )}
                />
                <Table.Column
                    dataIndex="discount_type"
                    title="Loại giảm giá"
                    render={(value: string) => (
                        <Tag color={value === "percentage" ? "blue" : "purple"}>
                            {value === "percentage" ? "Phần trăm" : "Số tiền cố định"}
                        </Tag>
                    )}
                />

                <Table.Column
                    dataIndex={["expiry_date"]}
                    title={"Ngày tạo"}
                    render={(value: any) => <DateField value={value}/>}
                />
                <Table.Column
                    dataIndex="status"
                    title="Trạng thái"
                    render={(value: string) => (
                        <Tag color={value === "active" ? "green" : "red"}>
                            {value === "active" ? "Hoạt động" : "Không hoạt động"}
                        </Tag>
                    )}
                />
                <Table.Column
                    dataIndex="usage"
                    title="Sử dụng"
                    render={(_, record: BaseRecord) => (
                        <span>{record.usage_count}/{record.usage_limit || "∞"}</span>
                    )}
                />
                <Table.Column
                    title="Hành động"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => {
                        const handleClick = () => {
                            Modal.confirm({
                                title: "Bạn có muốn xoá vĩnh viễn voucher này?",
                                okText: "Xoá",
                                cancelText: "Huỷ",
                                onOk: () => {
                                    forceDelete(record.id as number);
                                },
                            });
                        };

                        return (
                            <Space>
                                <EditButton hideText size="large" recordItemId={record.id} />
                                <ShowButton hideText size="large" recordItemId={record.id} />
                                <DeleteButton
                                    hideText
                                    size="large"
                                    recordItemId={record.id}
                                    confirmTitle="Bạn có muốn xoá voucher này?"
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