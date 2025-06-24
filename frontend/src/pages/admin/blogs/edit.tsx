import { Edit, Show, useForm } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import {
    Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Row,
    Select,
    Skeleton,
    Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";

export const BlogPostEdit = () => {
    const { saveButtonProps, formProps, queryResult } = useForm({
        resource: "blogs",
        action: "edit",
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { data, isLoading } = queryResult;
    const initialImage = data?.data?.image || null;

    const onFinish = async (values: any) => {
        const formData = new FormData();

        formData.append("title", values.title || "");
        formData.append("description", values.description || "");
        formData.append("content", values.content || "");
        formData.append("status", values.status); // status là number

        const image = values.image?.[0];

        if (image?.originFileObj) {
            formData.append("image", image.originFileObj);
        }

        return formProps.onFinish?.(formData);
    };

    if (isLoading) {
        return (
            <Show>
                <Skeleton active paragraph={{ rows: 16 }} />
            </Show>
        );
    }

    return (
        <Edit
            title={"Cập nhật"}
            saveButtonProps={{
                ...saveButtonProps,
                children: "Lưu",
            }}
            deleteButtonProps={{
                children: "Xóa",
            }}
            headerButtons={() => null}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Bài viết</Breadcrumb.Item>
                    <Breadcrumb.Item>Cập nhật</Breadcrumb.Item>
                    <Breadcrumb.Item>{data?.data?.title}</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Form
                {...formProps}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    ...formProps.initialValues,
                    status: Number(formProps.initialValues?.status), // ✅ ép status về dạng number
                    image: initialImage
                        ? [
                              {
                                  url: initialImage,
                                  uid: "-1",
                                  name: "image",
                                  status: "done",
                              },
                          ]
                        : [],
                }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Tiêu đề"
                            name="title"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Tiêu đề ngắn"
                            name="description"
                            rules={[{ required: true }]}
                        >
                            <TextArea />
                        </Form.Item>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            rules={[{ required: true }]}
                        >
                            <Select
                                options={[
                                    { value: 0, label: "Nháp" },
                                    { value: 1, label: "Công khai" },
                                    { value: 2, label: "Riêng tư" },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Ảnh"
                            name="image"
                            valuePropName="fileList"
                            getValueFromEvent={(e) =>
                                Array.isArray(e) ? e : e?.fileList
                            }
                        >
                            <Upload
                                name="image"
                                listType="picture"
                                maxCount={1}
                                beforeUpload={() => false}
                                defaultFileList={
                                    initialImage
                                        ? [
                                              {
                                                  url: initialImage,
                                                  uid: "-1",
                                                  name: "image",
                                                  status: "done",
                                              },
                                          ]
                                        : []
                                }
                            >
                                <Button icon={<UploadOutlined />}>Chọn 1 tệp</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Nội dung"
                            name="content"
                            rules={[{ required: true }]}
                        >
                            <MDEditor data-color-mode="light" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Edit>
    );
};
