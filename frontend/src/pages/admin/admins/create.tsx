import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, Row, Col, Breadcrumb, Switch, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export const ManagerAdminCreate = () => {
    const { saveButtonProps, formProps } = useForm({
        resource: "manager-admin",
        action: "create",
    });

    const onFinish = async (values: any) => {
        const formData = new FormData();
        formData.append("name", values.name || "");
        formData.append("email", values.email || "");
        formData.append("password", values.password || "");
        formData.append("password_confirmation", values.password_confirmation || "");
        formData.append("status", values.status || "1");
        if (values.phone) formData.append("phone", values.phone);
        if (values.address) formData.append("address", values.address);
        if (values.dob) formData.append("dob", dayjs(values.dob).format("YYYY-MM-DD"));
        if (values.gender) formData.append("gender", values.gender);
        if (values.avatar && Array.isArray(values.avatar) && values.avatar.length > 0) {
            const file = values.avatar[0];
            if (file.originFileObj) {
                formData.append("avatar", file.originFileObj);
            }
        }

        // Debugging: Log FormData content
        console.log("FormData entries:", [...formData.entries()]);

        return formProps.onFinish?.(formData);
    };

    return (
        <Create
            title="Tạo mới Quản trị viên"
            saveButtonProps={{
                ...saveButtonProps,
                children: "Lưu",
            }}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Quản trị viên</Breadcrumb.Item>
                    <Breadcrumb.Item>Thêm mới</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Form {...formProps} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Họ và tên"
                            name="name"
                            rules={[
                                { required: true, message: "Vui lòng nhập họ và tên!" },
                                { max: 255, message: "Họ và tên không được vượt quá 255 ký tự!" },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Vui lòng nhập email!" },
                                { type: "email", message: "Email không hợp lệ!" },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                { required: true, message: "Vui lòng nhập mật khẩu!" },
                                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="password_confirmation"
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                { max: 20, message: "Số điện thoại không được vượt quá 20 ký tự!" },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[
                                { max: 255, message: "Địa chỉ không được vượt quá 255 ký tự!" },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ngày sinh"
                            name="dob"
                            rules={[
                                {
                                    validator: (_, value) =>
                                        !value || value.isBefore(dayjs())
                                            ? Promise.resolve()
                                            : Promise.reject(new Error("Ngày sinh phải nhỏ hơn ngày hiện tại!")),
                                },
                            ]}
                        >
                            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            rules={[
                                {
                                    validator: (_, value) =>
                                        !value || ["male", "female", "other"].includes(value)
                                            ? Promise.resolve()
                                            : Promise.reject(new Error("Giới tính không hợp lệ!")),
                                },
                            ]}
                        >
                            <Select placeholder="Chọn giới tính" allowClear>
                                <Select.Option value="male">Nam</Select.Option>
                                <Select.Option value="female">Nữ</Select.Option>
                                <Select.Option value="other">Khác</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ảnh đại diện"
                            name="avatar"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                return e && e.fileList;
                            }}
                        >
                            <Upload
                                name="avatar"
                                listType="picture"
                                maxCount={1}
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            initialValue="1"
                            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                        >
                            <Select>
                                <Select.Option value="1">Hoạt động</Select.Option>
                                <Select.Option value="0">Không hoạt động</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Create>
    );
};