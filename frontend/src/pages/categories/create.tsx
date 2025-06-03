import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Row, Col, Upload, Button, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export const CategoryCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      contentType: "multipart/form-data",
    },
  });
  const onFinish = async (values: any) => {
  const formData = new FormData();
  formData.append("name", values.name);
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

  try {
    await fetch("/api/categories", {
      method: "POST",
      body: formData,
    });
    // Xử lý thành công ở đây (ví dụ: thông báo, redirect, ...)
  } catch (error) {
    console.error("Error submitting form:", error);
    alert(JSON.stringify(error));
  }
};
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" encType="multipart/form-data">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input name!" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Image"
              name="image"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
              extra="Upload an image"
            >
              <Upload
                name="image"
                listType="picture"
                maxCount={1}
                beforeUpload={() => false} // prevent auto upload, let form handle
              >
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              initialValue="active"
              rules={[{ required: true, message: "Please select status!" }]}
            >
              <Select
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};
