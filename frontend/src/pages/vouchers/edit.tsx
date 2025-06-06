import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, Row, Col, Breadcrumb, InputNumber } from "antd";
export const VoucherEdit = () => {
    const { saveButtonProps, formProps, queryResult } = useForm({
        resource: "vouchers",
        action: "edit",
    });

    const initialValues = {
        ...queryResult?.data?.data,
        expiry_date: queryResult?.data?.data?.expiry_date ?? null,
    };

    return (
        <Edit
            title={"Chỉnh sửa Voucher"}
            saveButtonProps={{
                ...saveButtonProps,
                children: "Lưu",
            }}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Voucher</Breadcrumb.Item>
                    <Breadcrumb.Item>Chỉnh sửa</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Form {...formProps} layout="vertical" initialValues={initialValues}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Mã Voucher"
                            name="code"
                            rules={[{ required: true, message: "Không được bỏ trống trường này" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Giá trị giảm giá"
                            name="discount"
                            rules={[{ required: true, message: "Không được bỏ trống trường này" }]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                min={0}
                                step={formProps.form?.getFieldValue("discount_type") === "percentage" ? 1 : 1000}
                                formatter={(value) =>
                                    formProps.form?.getFieldValue("discount_type") === "percentage"
                                        ? `${value}%`
                                        : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ'
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Loại giảm giá"
                            name="discount_type"
                            rules={[{ required: true, message: "Không được bỏ trống trường này" }]}
                        >
                            <Select>
                                <Select.Option value="percentage">Phần trăm</Select.Option>
                                <Select.Option value="fixed">Số tiền cố định</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Ngày hết hạn"
                            name="expiry_date"
                        >
                            <DatePicker
                                showTime
                                format="DD/MM/YYYY HH:mm"
                                style={{ width: "100 " }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            rules={[{ required: true, message: "Không được bỏ trống trường này" }]}
                        >
                            <Select>
                                <Select.Option value="active">Hoạt động</Select.Option>
                                <Select.Option value="inactive">Không hoạt động</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Giới hạn sử dụng"
                            name="usage_limit"
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                min={0}
                                placeholder="Để trống nếu không giới hạn"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[{ required: true, message: "Không được bỏ trống trường này" }]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Edit>
    );
};