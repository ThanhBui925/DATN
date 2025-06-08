import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Upload, Button, Select, Row, Col, Breadcrumb, Typography, Divider } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const CategoryCreate = () => {
  const { saveButtonProps, formProps } = useForm({
    resource: "categories",
    action: "create",
  });

  const onFinish = async (values: any) => {
    const formData = new FormData();
    formData.append("name", values.name || "");
    formData.append("description", values.description || "");
    formData.append("status", values.status || "1");

    if (
        values.image &&
        Array.isArray(values.image) &&
        values.image.length > 0 &&
        values.image[0].originFileObj
    ) {
      formData.append("image", values.image[0].originFileObj);
    }
    return formProps.onFinish?.(formData);
  };

  return (
      <Create
          title={<Title level={3}>Tạo mới danh mục</Title>}
          saveButtonProps={{
            ...saveButtonProps,
            children: "Lưu",
            size: "large",
          }}
          breadcrumb={
            <Breadcrumb style={{ marginBottom: 16 }}>
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
              <Breadcrumb.Item>Danh mục</Breadcrumb.Item>
              <Breadcrumb.Item>Thêm mới</Breadcrumb.Item>
            </Breadcrumb>
          }
      >
        <Form {...formProps} layout="vertical" onFinish={onFinish}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={16}>
              <Form.Item
                  label="Tên danh mục"
                  name="name"
                  rules={[{ required: true, message: "Không được bỏ trống trường này" }]}
              >
                <Input placeholder="Nhập tên danh mục" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                  label="Trạng thái"
                  name="status"
                  initialValue="1"
                  rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
              >
                <Select size="large">
                  <Select.Option value="1">Hoạt động</Select.Option>
                  <Select.Option value="0">Không hoạt động</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={16}>
              <Form.Item
                  label="Mô tả danh mục"
                  name="description"
              >
                <Input.TextArea
                    rows={5}
                    placeholder="Nhập mô tả cho danh mục"
                    showCount
                    maxLength={1000}
                />
              </Form.Item>
            </Col>
            <Col xs={8} sm={8}>
              <Form.Item
                  label="Ảnh danh mục"
                  name="image"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e && e.fileList;
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn một ảnh!",
                      validator: (_, value) => {
                        if (value && value.length > 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Vui lòng chọn một ảnh!"));
                      },
                    },
                  ]}
                  extra="Định dạng hỗ trợ: JPG, PNG. Kích thước tối đa: 2MB."
              >
                <Upload
                    name="image"
                    listType="picture-card"
                    maxCount={1}
                    beforeUpload={() => false}
                    accept="image/jpeg,image/png"
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Create>
  );
};