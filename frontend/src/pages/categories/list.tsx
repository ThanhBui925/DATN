import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";

export const CategoryList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
      <Table.Column title="STT" key="index" render={(text, record, index) => index + 1} />
        <Table.Column dataIndex="name" title={"name"} />
        <Table.Column dataIndex="description" title={"Description"} />
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
        <Table.Column dataIndex="status" title={"Status"} />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
