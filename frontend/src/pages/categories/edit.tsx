import { Edit, useForm } from "@refinedev/antd";
import {Breadcrumb, Button, Col, Form, Input, Row, Select, Upload} from "antd";
import { UploadOutlined } from "@ant-design/icons";

export const CategoryEdit = () => {
    const { saveButtonProps, formProps, queryResult } = useForm({
        resource: "categories",
        action: "edit",
    });

    const { data } = queryResult;
    const initialImage = data?.data?.image || null;

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
        } else if (initialImage && !values.image) {
            formData.append("image", initialImage);
        }

        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        return formProps.onFinish?.(formData);
    };

    return (
        <Edit
            title={'Cập nhật'}
            saveButtonProps={{
                ...saveButtonProps,
                children: "Lưu",
            }}
            deleteButtonProps={{
                children: "Xóa",
                // onClick: handleDelete,
            }}
            headerButtons={() => null}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Danh mục</Breadcrumb.Item>
                    <Breadcrumb.Item>Cập nhật</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Form
                {...formProps}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    ...formProps.initialValues,
                    image: initialImage ? [{ url: initialImage, status: "done" }] : [],
                }}
            >
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
                            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
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
                                    validator: (_, value) => {
                                        if (!value || value.length === 0) {
                                            return Promise.reject(new Error("Vui lòng chọn ít nhất 1 ảnh!"));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Upload
                                name="image"
                                listType="picture"
                                maxCount={1}
                                beforeUpload={() => false}
                                defaultFileList={
                                    initialImage ? [{ url: initialImage, uid: "-1", status: "done" }] : []
                                }
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
        </Edit>
    );
};