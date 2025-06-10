import { Edit, useForm } from "@refinedev/antd";
import { Breadcrumb, Button, Col, Form, Input, Row, DatePicker, Select, Upload, Skeleton, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { IResourceComponentsProps } from "@refinedev/core";
import dayjs from "dayjs";

const { Title } = Typography;

export const BannerEdit: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm({
        resource: "banners",
        action: "edit",
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { data, isLoading } = queryResult;
    const bannerData = data?.data;
    const initialImage = bannerData?.image_url || null;

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

    if (isLoading) {
        return (
            <Edit>
                <Skeleton active paragraph={{ rows: 4 }} />
            </Edit>
        );
    }

    return (
        <Edit
            title={`Chỉnh sửa Banner`}
            saveButtonProps={{
                ...saveButtonProps,
                children: "Lưu",
                size: "large",
            }}
            deleteButtonProps={{
                children: "Xóa",
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
            <Form
                {...formProps}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    ...formProps.initialValues,
                    image_url: initialImage ? [{ uid: "-1", url: initialImage, status: "done" }] : [],
                    start_date: bannerData?.start_date ? dayjs(bannerData.start_date) : undefined,
                    end_date: bannerData?.end_date ? dayjs(bannerData.end_date) : undefined,
                    status: bannerData?.status || "1",
                }}
            >
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
                            label="Slug"
                            name="slug"
                            rules={[{ required: true, message: "Không được bỏ trống trường này" }]}
                        >
                            <Input placeholder="Nhập slug" size="large" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
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
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                defaultFileList={
                                    initialImage ? [{ uid: "-1", url: initialImage, status: "done" }] : []
                                }
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
        </Edit>
    );
};