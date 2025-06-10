import { Create, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker, Select, Upload, Button, Row, Col, Breadcrumb, Typography, Divider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { IResourceComponentsProps } from "@refinedev/core";
import dayjs from "dayjs";

const { Title } = Typography;

export const BannerCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps } = useForm({
        resource: "banners",
        action: "create",
    });

    const onFinish = async (values: any) => {
        const formData = new FormData();
        formData.append("title", values.title || "");
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
            title="Thêm mới Banner"
            saveButtonProps={{
                ...saveButtonProps,
                children: "Lưu",
                size: "large",
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
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Tiêu đề"
                            name="title"
                            rules={[{ required: true, message: "Không được bỏ trống trường này" }]}
                        >
                            <Input placeholder="Nhập tiêu đề banner" size="large" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Liên kết URL"
                            name="link_url"
                            rules={[{ type: "url", message: "Vui lòng nhập URL hợp lệ" }]}
                        >
                            <Input placeholder="Nhập URL (ví dụ: https://example.com)" size="large" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
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
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Hình ảnh banner"
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
                                name="image_url"
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

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Ngày bắt đầu"
                            name="start_date"
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                style={{ width: "100%" }}
                                size="large"
                                placeholder="Chọn ngày bắt đầu"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Ngày kết thúc"
                            name="end_date"
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                style={{ width: "100%" }}
                                size="large"
                                placeholder="Chọn ngày kết thúc"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item
                            label="Mô tả banner"
                            name="description"
                        >
                            <Input.TextArea
                                rows={6}
                                placeholder="Nhập mô tả cho banner"
                                showCount
                                maxLength={1000}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Create>
    );
};