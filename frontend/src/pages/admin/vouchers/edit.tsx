import { Edit, useForm } from "@refinedev/antd";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Breadcrumb,
  InputNumber,
  Switch,
} from "antd";
import dayjs from "dayjs";

export const VoucherEdit = () => {
  const { saveButtonProps, formProps, queryResult } = useForm({
    resource: "vouchers",
    action: "edit",
    redirect: "list",
  });

  const initialValues = {
    code: queryResult?.data?.data?.code || "",
    discount: queryResult?.data?.data?.discount || 0,
    discount_type: queryResult?.data?.data?.discount_type || "fixed",
    max_discount_amount: queryResult?.data?.data?.max_discount_amount || null,
    min_order_amount: queryResult?.data?.data?.min_order_amount || 0,
    usage_limit: queryResult?.data?.data?.usage_limit || null,
    usage_limit_per_user: queryResult?.data?.data?.usage_limit_per_user || null,
    is_public: queryResult?.data?.data?.is_public,
    start_date: queryResult?.data?.data?.start_date
        ? dayjs(queryResult.data.data.start_date)
        : null,
    expiry_date: queryResult?.data?.data?.expiry_date
        ? dayjs(queryResult.data.data.expiry_date)
        : null,
    status: queryResult?.data?.data?.status,
    description: queryResult?.data?.data?.description || "",
  };

  const handleFinish = async (values: any) => {
    const formattedValues = {
      ...values,
      start_date: values.start_date
          ? dayjs(values.start_date).format("YYYY-MM-DD HH:mm:ss")
          : null,
      expiry_date: values.expiry_date
          ? dayjs(values.expiry_date).format("YYYY-MM-DD HH:mm:ss")
          : null,
      status: values.status == true ? 1 : 0,
      usage_limit:
          values.usage_limit === undefined ||
          values.usage_limit === null ||
          values.usage_limit === ""
              ? ""
              : parseInt(values.usage_limit),
      usage_limit_per_user:
          values.usage_limit_per_user === undefined ||
          values.usage_limit_per_user === null ||
          values.usage_limit_per_user === ""
              ? ""
              : parseInt(values.usage_limit_per_user),
      discount: parseFloat(values.discount),
      max_discount_amount:
          values.max_discount_amount === undefined ||
          values.max_discount_amount === null ||
          values.max_discount_amount === ""
              ? ""
              : parseFloat(values.max_discount_amount),
      min_order_amount:
          values.min_order_amount === undefined ||
          values.min_order_amount === null ||
          values.min_order_amount === ""
              ? ""
              : parseFloat(values.min_order_amount),
      is_public: values.is_public == true ? 1 : 0,
    };

    return formProps?.onFinish?.(formattedValues);
  };

  return (
      <Edit
          title={"Chỉnh sửa Voucher"}
          saveButtonProps={{ ...saveButtonProps, children: "Lưu" }}
          breadcrumb={
            <Breadcrumb>
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
              <Breadcrumb.Item>Voucher</Breadcrumb.Item>
              <Breadcrumb.Item>Chỉnh sửa</Breadcrumb.Item>
            </Breadcrumb>
          }
      >
        <Form
            {...formProps}
            layout="vertical"
            initialValues={initialValues}
            onFinish={handleFinish}
        >
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
                    precision={2}
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
                  label="Số tiền giảm giá tối đa"
                  name="max_discount_amount"
                  rules={[
                    { required: true, message: "Không được bỏ trống trường này" },
                  ]}
              >
                <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    precision={2}
                    placeholder="Để trống nếu không giới hạn"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  label="Số tiền đơn hàng tối thiểu"
                  name="min_order_amount"
                  rules={[
                    { required: true, message: "Không được bỏ trống trường này" },
                  ]}
              >
                <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    precision={2}
                    placeholder="Số tiền tối thiểu để áp dụng voucher"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  label="Ngày bắt đầu"
                  name="start_date"
                  rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
              >
                <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  label="Ngày hết hạn"
                  name="expiry_date"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày hết hạn",
                    },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        return value.isAfter(dayjs())
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error("Ngày hết hạn phải lớn hơn hiện tại")
                            );
                      },
                    },
                  ]}
              >
                <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                  label="Trạng thái"
                  name="status"
                  valuePropName="checked"
                  rules={[{ required: true, message: "Không được bỏ trống trường này" }]}
              >
                <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                  label="Công khai"
                  name="is_public"
                  valuePropName="checked"
              >
                <Switch checkedChildren="Công khai" unCheckedChildren="Riêng tư" />
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
            <Col span={12}>
              <Form.Item
                  label="Giới hạn sử dụng mỗi người"
                  name="usage_limit_per_user"
              >
                <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="Để trống nếu không giới hạn"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Edit>
  );
};