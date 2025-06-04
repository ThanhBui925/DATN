import { DeleteOutlined } from "@ant-design/icons";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,

} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table, Tag } from "antd";
import { Button, Modal, Space, Table } from "antd";
import { useForceDelete } from "../../hooks/useForceDelete";


export const CategoryList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const { forceDelete } = useForceDelete();

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          title="STT"
          key="index"
          render={(text, record, index) => index + 1}
        />
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="description" title="Description" />
        <Table.Column
          dataIndex="image"
          title="Image"
          render={(value: string) => (
            <img
              src={`http://localhost:8000/storage/${value}`}

              alt="Image"
              style={{ width: 100, height: "auto", objectFit: "cover" }}
            />
          )}
        />
        <Table.Column
          dataIndex="status"
          title="Status"
          render={(value: string) => (
            <Tag color={value === "active" ? "green" : "red"}>
              {value.toUpperCase()}
            </Tag>
          )}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => {
            const handleClick = () => {
              Modal.confirm({
                title: "Bạn có muốn xoá vĩnh viễn danh mục này?",
                okText: "Xoá",
                cancelText: "Huỷ",
                onOk: () => {
                 forceDelete(record.id as number);// Hoặc ép kiểu an toàn (chỉ khi bạn chắc chắn id luôn có):
                },
              });
            };

            return (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <ShowButton hideText size="small" recordItemId={record.id} />
                <DeleteButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  confirmTitle="Bạn có muốn xoá mềm danh mục này?"
                  confirmOkText="Xoá"
                  confirmCancelText="Huỷ"
                />
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  size="small"
                  onClick={handleClick}
                >
                  Xoá vĩnh viễn
                </Button>
              </Space>
            );
          }}
        />
      </Table>
    </List>
  );
};
