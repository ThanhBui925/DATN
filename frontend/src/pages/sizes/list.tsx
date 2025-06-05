import {
    Create,
    CreateButton,
    DeleteButton, Edit,
    EditButton,
    List,
    useForm,
    useTable,
} from "@refinedev/antd";
import type {BaseRecord} from "@refinedev/core";
import {Breadcrumb, Col, Form, Input, Modal, Row, Space, Table} from "antd";
import {useState} from "react";

export const SizeList = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<BaseRecord | null>(null);
    const {tableProps} = useTable({
        syncWithLocation: true,
    });

    const {
        saveButtonProps: createSaveButtonProps,
        formProps: createFormProps,
    } = useForm({
        resource: "sizes",
        action: "create",
    });

    const {
        saveButtonProps: editSaveButtonProps,
        formProps: editFormProps,
    } = useForm({
        resource: "sizes",
        action: "edit",
        id: selectedRecord?.id,
        redirect: false,
    });

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
                    render={(index) => index + 1}
                />
                <Table.Column dataIndex="name" title="Tên kích cỡ"/>
                <Table.Column
                    title="Hành động"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => {
                        return (
                            <Space>
                                <EditButton
                                    hideText
                                    size="large"
                                    recordItemId={record.id}
                                    onClick={() => {
                                        setSelectedRecord(record);
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
                        );
                    }}
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
                    <Form {...createFormProps} layout="vertical" onFinish={onCreateFinish}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="Tên kích cỡ"
                                    name="name"
                                    rules={[{required: true, message: "Không được bỏ trống trường này"}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Create>
            </Modal>

            <Modal
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
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
                        recordItemId: selectedRecord?.id,
                        confirmTitle: "Bạn có muốn xóa kích cỡ này?",
                        confirmOkText: "Xóa",
                        confirmCancelText: "Hủy",
                        onSuccess: () => {
                            setIsEditModalOpen(false);
                        },
                    }}
                >
                    <Form {...editFormProps} layout="vertical" onFinish={onEditFinish} initialValues={selectedRecord!}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="Tên kích cỡ"
                                    name="name"
                                    rules={[{required: true, message: "Không được bỏ trống trường này"}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Edit>
            </Modal>
        </List>
    );
};