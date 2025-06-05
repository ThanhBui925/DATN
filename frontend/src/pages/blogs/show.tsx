import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import {Breadcrumb, Col, Image, Row, Skeleton, Tag, Typography} from "antd";
import MDEditor from "@uiw/react-md-editor";

const { Title } = Typography;

export const BlogPostShow = () => {
    const { queryResult } = useShow({});
    const { data, isLoading } = queryResult;

    const record = data?.data;

    if (isLoading) {
        return (
            <Show>
                <Skeleton active paragraph={{ rows: 4 }} />
            </Show>
        );
    }

  return (
      <Show
          title={'Chi tiết'}
          breadcrumb={
              <Breadcrumb>
                  <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                  <Breadcrumb.Item>Bài viết</Breadcrumb.Item>
                  <Breadcrumb.Item>Chi tiết</Breadcrumb.Item>
                  <Breadcrumb.Item>{ record?.name }</Breadcrumb.Item>
              </Breadcrumb>
          }
      >
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={24}>
                  <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                      Tên danh mục
                  </Title>
                  <TextField
                      value={record?.title || "Không có dữ liệu"}
                      style={{ fontSize: 16 }}
                  />
              </Col>

              <Col span={24}>
                  <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                      Mô tả
                  </Title>
                  <TextField
                      value={record?.description || "Không có mô tả"}
                      style={{ fontSize: 16 }}
                  />
              </Col>

              <Col span={24}>
                  <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                      Trạng thái
                  </Title>
                  {record?.status ? (
                      <>
                          <Tag color={record.status === "published" ? "green" : ""}>
                              {record.status === "published" ? "Công khai" : ""}
                          </Tag>
                          <Tag color={record.status === "draft" ? "red" : ""}>
                              {record.status === "draft" ? "Nháp" : ""}
                          </Tag>
                          <Tag color={record.status === "private" ? "blue" : ""}>
                              {record.status === "private" ? "Riêng tư" : ""}
                          </Tag>
                      </>
                  ) : (
                      <TextField value="Không có trạng thái" style={{ fontSize: 16 }} />
                  )}
              </Col>

              <Col span={24}>
                  <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                      Nội dung
                  </Title>

                  {record?.content ? (
                      <div data-color-mode="light">
                          <MDEditor.Markdown
                              source={record.content}
                              style={{ background: "white", padding: 16 }}
                          />
                      </div>
                  ) : (
                      <TextField value="Không có nội dung" style={{ fontSize: 16 }} />
                  )}
              </Col>

              <Col span={24}>
                  <Title level={5} style={{ marginBottom: 8, color: "#595959" }}>
                      Ảnh
                  </Title>
                  {record?.image ? (
                      <Image
                          src={record.image}
                          alt="Blog"
                          style={{
                              width: 150,
                              height: 150,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "1px solid #e8e8e8",
                          }}
                          preview
                      />
                  ) : (
                      <TextField value="Không có ảnh" style={{ fontSize: 16 }} />
                  )}
              </Col>
          </Row>
      </Show>
  );
};
