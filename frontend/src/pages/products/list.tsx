import {
    CreateButton,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import type {BaseRecord} from "@refinedev/core";
import {Breadcrumb, Space, Table, Tag} from "antd";

export const ProductsList = () => {
    const {tableProps} = useTable({
        syncWithLocation: true,
    });

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
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    title="STT"
                    key="index"
                    render={(text, record, index) => index + 1}
                />
                <Table.Column dataIndex="name" title={"Tên sản phẩm"}/>
                <Table.Column dataIndex="price" title={"Giá sản phẩm"}/>
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
