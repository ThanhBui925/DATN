import {DeleteOutlined} from "@ant-design/icons";
import {
    CreateButton,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import type {BaseRecord} from "@refinedev/core";
import {Breadcrumb, Button, Modal, Space, Table, Tag} from "antd";
import {useForceDelete} from "../../hooks/useForceDelete";

export const CategoryList = () => {
    const {tableProps} = useTable({
        syncWithLocation: true,
    });

    const {forceDelete} = useForceDelete();

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
                                style={{ width: 100, height: "auto", objectFit: "cover" }}
                            />
                        ) : (
                            <span>Chưa có ảnh</span>
                        )
                    }
                />
                <Table.Column
                    dataIndex="status"
                    title="Trạng thái"
                    render={(value: string) => {
                        if (value === "inactive") {
                            return <Tag color="red">Không hoạt động</Tag>;
                        } else {
                            return <Tag color="green">Hoạt động</Tag>;
                        }
                    }}
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
                                    confirmTitle="Bạn có muốn xoá mềm danh mục này?"
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
