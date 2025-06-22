import {
    CreateButton, DateField,
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import {Breadcrumb, Button, Col, DatePicker, Form, Input, Row, Select, Space, Table, Tag} from "antd";
import {convertToInt} from "../../../helpers/common";
import React from "react";

export const VoucherList = () => {
    const { tableProps, setFilters } = useTable({
        syncWithLocation: true,
        resource: "vouchers",
        filters: {
            initial: [
                { field: "code", operator: "eq", value: undefined },
                // { field: "issue_date", operator: "eq", value: undefined },
                // { field: "expiry_date", operator: "eq", value: undefined },
                { field: "discount_type", operator: "eq", value: undefined },
            ],
        },
    });

    const [form] = Form.useForm();

    const handleFilter = (values: any) => {
        setFilters([
            { field: "code", operator: "eq", value: values.code || undefined },
            // { field: "issue_date", operator: "eq", value: values.issue_date.format("YYYY-MM-DD hh:mm") || undefined },
            // { field: "expiry_date", operator: "eq", value: values.expiry_date.format("YYYY-MM-DD hh:mm") || undefined },
            { field: "discount_type", operator: "eq", value: values.discount_type || undefined },
        ]);
    };

    const handleReset = () => {
        form.resetFields();
        setFilters([
            { field: "code", operator: "eq", value: undefined },
            // { field: "issue_date", operator: "eq", value: undefined },
            // { field: "expiry_date", operator: "eq", value: undefined },
            { field: "discount_type", operator: "eq", value: undefined },
        ]);
    };

    return (
        <List
            title={"Danh sách Voucher"}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Voucher</Breadcrumb.Item>
                </Breadcrumb>
            }
            headerButtons={() => (
                <CreateButton>Thêm Voucher</CreateButton>
            )}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFilter}
                style={{ marginBottom: 16 }}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item label="Mã voucher" name="code">
                            <Input placeholder="Mã voucher" />
                        </Form.Item>
                    </Col>
                    {/*<Col xs={24} sm={12} md={6}>*/}
                    {/*    <Form.Item label="Ngày bắt đầu" name="issue_date">*/}
                    {/*        <DatePicker*/}
                    {/*            showTime*/}
                    {/*            format="YYYY-MM-DD"*/}
                    {/*            style={{ width: "100%" }}*/}
                    {/*        />*/}
                    {/*    </Form.Item>*/}
                    {/*</Col>*/}
                    {/*<Col xs={24} sm={12} md={6}>*/}
                    {/*    <Form.Item label="Ngày kết thúc" name="expiry_date">*/}
                    {/*        <DatePicker*/}
                    {/*            showTime*/}
                    {/*            format="YYYY-MM-DD"*/}
                    {/*            style={{ width: "100%" }}*/}
                    {/*        />*/}
                    {/*    </Form.Item>*/}
                    {/*</Col>*/}
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            label="Loại giảm giá"
                            name="discount_type"
                        >
                            <Select placeholder="Chọn loại" allowClear>
                                <Select.Option value="percentage">Phần trăm</Select.Option>
                                <Select.Option value="fixed">Số tiền cố định</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item label=" ">
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Lọc
                                </Button>
                                <Button onClick={handleReset}>Xóa bộ lọc</Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    title="STT"
                    key="index"
                    render={(text, record, index) => index + 1}
                />
                <Table.Column dataIndex="code" title="Mã Voucher" />
                <Table.Column
                    dataIndex="discount"
                    title="Giảm giá"
                    render={(value: number, record: BaseRecord) => (
                        <span>
                            {record.discount_type === "percentage"
                                ? `${convertToInt(value)}%`
                                : `${convertToInt(value)} VNĐ`}
                        </span>
                    )}
                />
                <Table.Column
                    dataIndex="discount_type"
                    title="Loại giảm giá"
                    render={(value: string) => (
                        <Tag color={value === "percentage" ? "blue" : "purple"}>
                            {value === "percentage" ? "Phần trăm" : "Số tiền cố định"}
                        </Tag>
                    )}
                />

                <Table.Column
                    dataIndex={["expiry_date"]}
                    title={"Ngày tạo"}
                    render={(value: any) => <DateField value={value} format={'hh:mm DD/MM/YYYY'} />}
                />
                <Table.Column
                    dataIndex="status"
                    title="Trạng thái"
                    render={(value: string) => (
                        <Tag color={Number(value) === 1 ? "green" : "red"}>
                            {Number(value) === 1 ? "Hoạt động" : "Không hoạt động"}
                        </Tag>
                    )}
                />
                <Table.Column
                    dataIndex="usage"
                    title="Sử dụng"
                    render={(_, record: BaseRecord) => (
                        <span>{ record.usage_count || 0}/{record.usage_limit || "∞"}</span>
                    )}
                />
                <Table.Column
                    title="Hành động"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => {

                        return (
                            <Space>
                                <EditButton hideText size="large" recordItemId={record.id} />
                                <ShowButton hideText size="large" recordItemId={record.id} />
                                <DeleteButton
                                    hideText
                                    size="large"
                                    recordItemId={record.id}
                                    confirmTitle="Bạn có muốn xoá voucher này?"
                                    confirmOkText="Xoá"
                                    confirmCancelText="Huỷ"
                                />
                            </Space>
                        );
                    }}
                />
            </Table>
        </List>
    );
};