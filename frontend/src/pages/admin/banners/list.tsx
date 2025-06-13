import {
    List,
    useTable,
    EditButton,
    ShowButton,
    DeleteButton,
    DateField,
    ImageField,
    TagField, CreateButton,
} from "@refinedev/antd";
import {Table, Space, Breadcrumb} from "antd";
import { IResourceComponentsProps } from "@refinedev/core";

export const BannerList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    return (
        <List
            title="Danh sách Banner"
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
                <Table.Column dataIndex="id" title="Mã số" />
                <Table.Column dataIndex="title" title="Tiêu đề" />
                <Table.Column dataIndex="link_url" title="Đường dẫn" />
                <Table.Column
                    dataIndex="image_url"
                    title="Hình ảnh"
                    render={(value) => (
                        <ImageField
                            value={value}
                            width={100}
                            height={100}
                            style={{ maxWidth: '100px' }}
                        />
                    )}
                />
                <Table.Column
                    dataIndex="status"
                    title="Trạng thái"
                    render={(value) => (
                        <TagField
                            value={value === "1" ? "Hoạt động" : "Không hoạt động"}
                            color={value === "1" ? "green" : "red"}
                        />
                    )}
                />
                <Table.Column
                    dataIndex="start_date"
                    title="Ngày bắt đầu"
                    render={(value) => <DateField value={value} />}
                />
                <Table.Column
                    dataIndex="end_date"
                    title="Ngày kết thúc"
                    render={(value) => <DateField value={value} />}
                />
                <Table.Column
                    title="Hành động"
                    dataIndex="actions"
                    render={(_, record: any) => (
                        <Space>
                            <EditButton
                                hideText
                                size="large"
                                recordItemId={record.id}
                            />
                            <ShowButton
                                hideText
                                size="large"
                                recordItemId={record.id}
                            />
                            <DeleteButton
                                hideText
                                size="large"
                                recordItemId={record.id}
                            />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};