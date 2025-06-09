import {
    CreateButton,
    DateField,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Breadcrumb, Space, Table } from "antd";

export const ReviewList = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    return (
        <List
            title={'Đánh giá'}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Đánh giá</Breadcrumb.Item>
                </Breadcrumb>
            }
            headerButtons={ false }
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="id"
                    title={"STT"}
                    render={(value, record, index) => (
                        index + 1
                    )}
                />
                <Table.Column
                    dataIndex={["user", "name"]}
                    title={"Người dùng"}
                />
                <Table.Column
                    dataIndex={['product', 'name']}
                    title={"Sản phẩm"}
                    render={(value: number) => `Product ${value}`}
                />
                <Table.Column
                    dataIndex="rating"
                    title={"Xếp hạng"}
                    render={(value: number) => `${value} / 5`}
                />
                <Table.Column
                    dataIndex="image"
                    title={"Ảnh"}
                    render={(value: string) =>
                        value ? (
                            <img
                                src={value}
                                alt="Review Image"
                                style={{ width: 90, height: 50, objectFit: "cover" }}
                            />
                        ) : (
                            <span>Chưa có ảnh</span>
                        )
                    }
                />
                <Table.Column
                    dataIndex={["created_at"]}
                    title={"Ngày tạo"}
                    render={(value: any) => <DateField value={value} />}
                />
                <Table.Column
                    title={"Hành động"}
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <ShowButton hideText size="large" recordItemId={record.id} />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};