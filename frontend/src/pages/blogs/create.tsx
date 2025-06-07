import {Create, useForm } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import {Breadcrumb, Button, Col, Form, Input, Row, Select, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

export const BlogPostCreate = () => {
    const {formProps, saveButtonProps} = useForm({
        resource: "blogs",
        action: "create"
    });

    const onFinish = async (values: any) => {
        const formData = new FormData();
        formData.append("title", values.title || "");
        formData.append("description", values.description || "");
        formData.append("content", values.content || "");
        formData.append("status", values.status || "published");

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
                    <Col sm={12} xs={24}>
                        <Form.Item
                            label={"Tiêu đề"}
                            name={["title"]}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={"Tiêu đề ngắn"}
                            name={["description"]}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <TextArea />
                        </Form.Item>
                        <Form.Item
                            label={"Trạng thái"}
                            name={["status"]}
                            initialValue={"draft"}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                options={[
                                    { value: "draft", label: "Nháp" },
                                    { value: "published", label: "Công khai" },
                                    { value: "private", label: "Riêng tư" },
                                ]}
                            />
                        </Form.Item>
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
                    <Col sm={12} xs={24}>
                        <Form.Item
                            label={"Nội dung"}
                            name="content"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <MDEditor data-color-mode="light" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Create>
    );
};
