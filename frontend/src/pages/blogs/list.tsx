import {
    CreateButton,
    DateField,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import {type BaseRecord } from "@refinedev/core";
import {Breadcrumb, Space, Table, Tag} from "antd";

export const BlogPostList = () => {
    const {tableProps} = useTable({
        syncWithLocation: true,
    });

    return (
        <List
            title={'Bài viết'}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Bài viết</Breadcrumb.Item>
                </Breadcrumb>
            }
            headerButtons={() => (
                <CreateButton>Thêm bài viết</CreateButton>
            )}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title={"STT"}/>
                <Table.Column
                    dataIndex="image"
                    title="Ảnh"
                    render={(value: string) =>
                        value ? (
                            <img
                                src={value}
                                alt="Image"
                                style={{width: 90, height: 50, objectFit: "cover"}}
                            />
                        ) : (
                            <span>Chưa có ảnh</span>
                        )
                    }
                />
                <Table.Column dataIndex="title" title={"Tiêu đề"}/>
                <Table.Column
                    dataIndex="status"
                    title="Trạng thái"
                    render={(value: string) => {
                        if (!value) return null;

                        const statusMap: Record<string, { color: string; label: string }> = {
                            published: { color: "green", label: "Công khai" },
                            draft: { color: "red", label: "Nháp" },
                            private: { color: "blue", label: "Riêng tư" },
                        };

                        const status = statusMap[value];

                        return status && (
                            <Tag color={status.color}>{status.label}</Tag>
                        );
                    }}
                />

                <Table.Column
                    dataIndex={["created_at"]}
                    title={"Ngày tạo"}
                    render={(value: any) => <DateField value={value}/>}
                />
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
