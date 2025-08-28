import { Create, CreateButton, DeleteButton, Edit, EditButton, List, useForm, useTable } from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Breadcrumb, Col, Form, Input, Modal, Row, Space, Table } from "antd";
import { useState, useEffect } from "react";
import { useOne } from "@refinedev/core";

export const SizeList = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    const { saveButtonProps: createSaveButtonProps, formProps: createFormProps } = useForm({
        resource: "sizes",
        action: "create",
        onMutationSuccess: () => {
            createFormProps.form?.resetFields();
            setIsCreateModalOpen(false);
        },
    });

    const { saveButtonProps: editSaveButtonProps, formProps: editFormProps, queryResult } = useForm({
        resource: "sizes",
        action: "edit",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        id: selectedRecordId,
        onMutationSuccess: () => {
            setIsEditModalOpen(false);
        },
    });

    const { data: selectedRecordData, refetch: refetchRecord } = useOne({
        resource: "sizes",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        id: selectedRecordId,
        queryOptions: {
            enabled: !!selectedRecordId,
        },
    });

    useEffect(() => {
        if (selectedRecordData?.data && isEditModalOpen) {
            editFormProps.form?.setFieldsValue(selectedRecordData.data);
        }
    }, [selectedRecordData, isEditModalOpen, editFormProps.form]);

    const onCreateFinish = async (values: any) => {
        const formData = new FormData();
        formData.append("name", values.name || "");
        return createFormProps.onFinish?.(formData);
    };

    const onEditFinish = async (values: any) => {
        const formData = new FormData();
        formData.append("name", values.name || "");
        return editFormProps.onFinish?.(formData);
    };

    return (
        <List
            title={"Kích cỡ"}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Kích cỡ</Breadcrumb.Item>
                </Breadcrumb>
            }
            headerButtons={() => (
                <CreateButton onClick={() => setIsCreateModalOpen(true)}>Thêm kích cỡ</CreateButton>
            )}
        >
            <Table
                {...tableProps}
                rowKey="id"
            >
                <Table.Column
                    title="STT"
                    key="id"
                    render={(_, __, index) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const current = tableProps.pagination?.current || 1;
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const pageSize = tableProps.pagination?.pageSize || 10;
                        return (current - 1) * pageSize + index + 1;
                    }}
                />
                <Table.Column dataIndex="name" title="Tên kích cỡ"/>
                <Table.Column
                    title="Hành động"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton
                                hideText
                                size="large"
                                recordItemId={record.id}
                                onClick={() => {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    setSelectedRecordId(record.id);
                                    setIsEditModalOpen(true);
                                }}
                            />
                            <DeleteButton
                                hideText
                                size="large"
                                recordItemId={record.id}
                                confirmTitle="Bạn có muốn xoá kích cỡ này?"
                                confirmOkText="Xoá"
                                confirmCancelText="Huỷ"
                            />
                        </Space>
                    )}
                />
            </Table>

            <Modal
                open={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                closable={true}
                footer={null}
            >
                <Create
                    title="Tạo mới"
                    saveButtonProps={{ ...createSaveButtonProps, children: "Lưu" }}
                >
                    <Form {...createFormProps} layout="vertical" onFinish={onCreateFinish}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="Tên kích cỡ"
                                    name="name"
                                    rules={[
                                        { required: true, message: "Không được bỏ trống trường này" },
                                        { pattern: /^[0-9]+$/, message: "Chỉ được nhập số, không chứa ký tự đặc biệt" },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Create>
            </Modal>

            <Modal
                open={isEditModalOpen}
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setSelectedRecordId(null);
                    editFormProps.form?.resetFields();
                }}
                closable={true}
                footer={null}
            >
                <Edit
                    title={"Cập nhật"}
                    saveButtonProps={{ ...editSaveButtonProps, children: "Lưu" }}
                    headerButtons={() => null}
                    deleteButtonProps={{
                        children: "Xóa",
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        recordItemId: selectedRecordId,
                        confirmTitle: "Bạn có muốn xóa kích cỡ này?",
                        confirmOkText: "Xóa",
                        confirmCancelText: "Hủy",
                        onSuccess: () => {
                            setIsEditModalOpen(false);
                            setSelectedRecordId(null);
                        },
                    }}
                >
                    <Form {...editFormProps} layout="vertical" onFinish={onEditFinish}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="Tên kích cỡ"
                                    name="name"
                                    rules={[
                                        { required: true, message: "Không được bỏ trống trường này" },
                                        { pattern: /^[0-9]+$/, message: "Chỉ được nhập số, không chứa ký tự đặc biệt" },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Edit>
            </Modal>
        </List>
    );
};