import {Edit, Show, useForm } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import {Breadcrumb, Button, Col, Form, Input, Row, Select, Skeleton, Upload} from "antd";
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";

export const BlogPostEdit = () => {

    const {saveButtonProps, formProps, queryResult} = useForm({
        resource: "blogs",
        action: "edit",
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const {data, isLoading} = queryResult;
    const initialImage = data?.data?.image || null;

    const onFinish = async (values: any) => {
        const formData = new FormData();
        formData.append("name", values.name || "");
        formData.append("description", values.description || "");
        formData.append("status", values.status || "published");

        if (
            values.image &&
            Array.isArray(values.image) &&
            values.image.length > 0 &&
            values.image[0].originFileObj
        ) {
            formData.append("image", values.image[0].originFileObj);
        }

        return formProps.onFinish?.(formData);
    };
    if (isLoading) {
        return (
            <Show>
                <Skeleton active paragraph={{rows: 16}}/>
            </Show>
        );
    }

    return (
        <Edit
            title={'Cập nhật'}
            saveButtonProps={{
                ...saveButtonProps,
                children: "Lưu",
            }}
            deleteButtonProps={{
                children: "Xóa",
                // onClick: handleDelete,
            }}
            headerButtons={() => null}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Bài viết</Breadcrumb.Item>
                    <Breadcrumb.Item>Cập nhật</Breadcrumb.Item>
                    <Breadcrumb.Item>{data?.data?.name}</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Form
                {...formProps}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    ...formProps.initialValues,
                    image: initialImage ? [{url: initialImage, status: "done"}] : [],
                }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={"Tiêu đề"}
                            name={["title"]}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={"Tiêu đề ngắn"}
                            name={["description"]}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <TextArea />
                        </Form.Item>
                        <Form.Item
                            label={"Trạng thái"}
                            name={["status"]}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                options={[
                                    { value: "draft", label: "Nháp" },
                                    { value: "published", label: "Công khai" },
                                    { value: "private", label: "Riêng tư" },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Ảnh"
                            name="image"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                return e && e.fileList;
                            }}
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (!value || value.length === 0) {
                                            return Promise.reject(new Error("Vui lòng chọn ít nhất 1 ảnh!"));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Upload
                                name="image"
                                listType="picture"
                                maxCount={1}
                                beforeUpload={() => false}
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                defaultFileList={
                                    initialImage ? [{ url: initialImage, uid: "-1", status: "done" }] : []
                                }
                            >
                                <Button icon={<UploadOutlined />}>Chọn 1 tệp</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={"Nội dung"}
                            name="content"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <MDEditor data-color-mode="light" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Edit>
    );
};
