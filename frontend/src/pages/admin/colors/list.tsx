import {
    Create,
    CreateButton,
    DeleteButton,
    Edit,
    EditButton,
    List,
    useForm,
    useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Breadcrumb, Col, Form, Input, Modal, Row, Space, Table } from "antd";
import { useState, useEffect } from "react";
import { useOne } from "@refinedev/core";

export const ColorList = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    const {
        saveButtonProps: createSaveButtonProps,
        formProps: createFormProps,
    } = useForm({
        resource: "colors",
        action: "create",
        onMutationSuccess: () => {
            createFormProps.form?.resetFields();
            setIsCreateModalOpen(false);
        },
    });

    const {
        saveButtonProps: editSaveButtonProps,
        formProps: editFormProps,
        queryResult,
    } = useForm({
        resource: "colors",
        action: "edit",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        id: selectedRecordId,
        onMutationSuccess: () => {
            setIsEditModalOpen(false);
        },
    });

    const { data: selectedRecordData, refetch: refetchRecord } = useOne({
        resource: "colors",
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

    return (
        <List
            title={"Màu sắc"}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Màu sắc</Breadcrumb.Item>
                </Breadcrumb>
            }
            headerButtons={() => (
                <CreateButton onClick={() => setIsCreateModalOpen(true)}>Thêm màu sắc</CreateButton>
            )}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    title="STT"
                    key="id"
                    render={(value, record, index) => index + 1}
                />
                <Table.Column dataIndex="name" title="Tên màu sắc" />
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
                                confirmTitle="Bạn có muốn xoá màu sắc này?"
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
                    saveButtonProps={{
                        ...createSaveButtonProps,
                        children: "Lưu",
                    }}
                >
                    <Form {...createFormProps} layout="vertical">
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="Tên màu sắc"
                                    name="name"
                                    rules={[{ required: true, message: "Không được bỏ trống trường này" }]}
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
                    saveButtonProps={{
                        ...editSaveButtonProps,
                        children: "Lưu",
                    }}
                    headerButtons={() => null}
                    deleteButtonProps={{
                        children: "Xóa",
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        recordItemId: selectedRecordId,
                        confirmTitle: "Bạn có muốn xóa màu sắc này?",
                        confirmOkText: "Xóa",
                        confirmCancelText: "Hủy",
                        onSuccess: () => {
                            setIsEditModalOpen(false);
                            setSelectedRecordId(null);
                        },
                    }}
                >
                    <Form {...editFormProps} layout="vertical">
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="Tên màu sắc"
                                    name="name"
                                    rules={[{ required: true, message: "Không được bỏ trống trường này" }]}
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