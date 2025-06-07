import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, Row, Col, Breadcrumb, InputNumber } from "antd";

export const VoucherCreate = () => {
  const { saveButtonProps, formProps } = useForm({
    resource: "vouchers",
    action: "create",
  });


  return (
      <Create
          title={"Tạo mới Voucher"}
          saveButtonProps={{
            ...saveButtonProps,
            children: "Lưu",
          }}
          breadcrumb={
            <Breadcrumb>
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
              <Breadcrumb.Item>Voucher</Breadcrumb.Item>
              <Breadcrumb.Item>Thêm mới</Breadcrumb.Item>
            </Breadcrumb>
          }
      >
        <Form {...formProps} layout="vertical">
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
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  label="Loại giảm giá"
                  name="discount_type"
                  initialValue="percentage"
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
                    format="DD/MM/YYYY HH:mm:ss"
                    style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  label="Trạng thái"
                  name="status"
                  initialValue="1"
                  rules={[{ required: true, message: "Không được bỏ trống trường này" }]}
              >
                <Select>
                  <Select.Option value="1">Hoạt động</Select.Option>
                  <Select.Option value="2">Không hoạt động</Select.Option>
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
      </Create>
  );
};