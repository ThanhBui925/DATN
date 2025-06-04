import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const CategoryShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"Name"}</Title>
      <TextField value={record?.name} />
      <Title level={5}>{"Description"}</Title>
      <TextField value={record?.description} />
      <Title level={5}>{"Image"}</Title>
      {record?.image && (
        <img
          src={`http://localhost:8000/storage/${record.image}`}
          alt="Category"
          style={{ width: 100, height: "auto", objectFit: "cover" }}
        />
      )}
    </Show>
  );
};
