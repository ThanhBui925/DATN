import { Create, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker, Select, Upload, Button, Row, Col, Breadcrumb } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { IResourceComponentsProps } from "@refinedev/core";
import dayjs from "dayjs";

export const BannerCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps } = useForm({
        resource: "banners",
        action: "create",
    });

    const onFinish = async (values: any) => {
        const formData = new FormData();
        formData.append("title", values.title || "");
        formData.append("slug", values.slug || "");
        formData.append("description", values.description || "");
        formData.append("link_url", values.link_url || "");
        formData.append("start_date", values.start_date ? dayjs(values.start_date).format("YYYY-MM-DD HH:mm:ss") : "");
        formData.append("end_date", values.end_date ? dayjs(values.end_date).format("YYYY-MM-DD HH:mm:ss") : "");
        formData.append("status", values.status || "1");

        if (
            values.image_url &&
            Array.isArray(values.image_url) &&
            values.image_url.length > 0 &&
            values.image_url[0].originFileObj
        ) {
            formData.append("image_url", values.image_url[0].originFileObj);
        }

        return formProps.onFinish?.(formData);
    };

    return (
        <Create
            title="Thêm Banner"
            saveButtonProps={{
                ...saveButtonProps,
                children: "Lưu",
            }}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Banner</Breadcrumb.Item>
                    <Breadcrumb.Item>Thêm mới</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Form {...formProps} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Tiêu đề"
                            name="title"
                            rules={[{ required: true, message: "Không được bỏ trống trường này" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Đường dẫn"
                            name="slug"
                            rules={[{ required: true, message: "Không được bỏ trống trường này" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Liên kết URL"
                            name="link_url"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            initialValue="1"
                        >
                            <Select>
                                <Select.Option value="1">Hoạt động</Select.Option>
                                <Select.Option value="2">Không hoạt động</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item
                            label="Hình ảnh"
                            name="image_url"
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
                                name="image_url"
                                listType="picture"
                                maxCount={1}
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>Chọn 1 tệp</Button>
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Ngày bắt đầu"
                            name="start_date"
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Ngày kết thúc"
                            name="end_date"
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Mô tả"
                            name="description"
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Create>
    );
};