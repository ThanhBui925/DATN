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
                            rules={[
                                { required: true, message: "Không được bỏ trống trường này" },
                                { max: 255, message: "Tiêu đề tối đa 255 ký tự" }
                            ]}
                        >
                            <Input placeholder="Nhập tiêu đề banner" size="large" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Liên kết URL"
                            name="link_url"
                            rules={[
                                { type: "url", message: "Vui lòng nhập URL hợp lệ" },
                                { max: 255, message: "URL tối đa 255 ký tự" }
                            ]}
                        >
                            <Input placeholder="Nhập URL (ví dụ: https://example.com)" size="large" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            initialValue="1"
                            rules={[
                                { required: true, message: "Vui lòng chọn trạng thái" },
                                { validator: (_, value) => (value === "1" || value === "0") ? Promise.resolve() : Promise.reject("Chỉ nhận giá trị 1 hoặc 0") }
                            ]}
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
                            getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn một ảnh!",
                                    validator: (_, value) => {
                                        if (value && value.length > 0) {
                                            const file = value[0].originFileObj;
                                            if (!["image/jpeg", "image/png"].includes(file?.type)) {
                                                return Promise.reject("Chỉ nhận file JPG hoặc PNG!");
                                            }
                                            if (file?.size > 2 * 1024 * 1024) {
                                                return Promise.reject("Kích thước tối đa 2MB!");
                                            }
                                            return Promise.resolve();
                                        }
                                        return Promise.reject("Vui lòng chọn một ảnh!");
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
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (value && isNaN(Date.parse(value))) {
                                            return Promise.reject("Ngày không hợp lệ!");
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
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
                            dependencies={['start_date']}
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const startDate = getFieldValue('start_date');
                                        if (value && startDate && value < startDate) {
                                            return Promise.reject("Ngày kết thúc phải sau ngày bắt đầu!");
                                        }
                                        return Promise.resolve();
                                    }
                                })
                            ]}
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
                            rules={[
                                { max: 1000, message: "Mô tả tối đa 1000 ký tự" }
                            ]}
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