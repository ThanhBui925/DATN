import { Create, useForm } from "@refinedev/antd";
import {Form, Input, Upload, Button, Select, Row, Col, Breadcrumb} from "antd";
import { UploadOutlined } from "@ant-design/icons";

export const CategoryCreate = () => {
  const { saveButtonProps, formProps } = useForm({
    resource: "categories",
    action: "create",
  });

  const onFinish = async (values: any) => {
    const formData = new FormData();
    formData.append("name", values.name || "");
    formData.append("description", values.description || "");
    formData.append("status", values.status || "active");

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
          title={'Tạo mới'}
          saveButtonProps={{
            ...saveButtonProps,
            children: "Lưu",
          }}
          breadcrumb={
            <Breadcrumb>
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
              <Breadcrumb.Item>Danh mục</Breadcrumb.Item>
              <Breadcrumb.Item>Thêm mới</Breadcrumb.Item>
            </Breadcrumb>
          }
      >
        <Form {...formProps} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                  label="Tên danh mục"
                  name="name"
                  rules={[{ required: true, message: "Không được bỏ trống trường này" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                  label="Trạng thái"
                  name="status"
                  initialValue="active"
              >
                <Select>
                  <Select.Option value="active">Hoạt động</Select.Option>
                  <Select.Option value="inactive">Không hoạt động</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                  label="Ảnh"
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
                      message: "Vui lòng chọn ít nhất 1 ảnh!",
                      validator: (_, value) => {
                        if (value && value.length > 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Vui lòng chọn ít nhất 1 ảnh!"));
                      },
                    },
                  ]}
              >
                <Upload
                    name="image"
                    listType="picture"
                    maxCount={1}
                    beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Chọn 1 tệp</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Create>
  );
};