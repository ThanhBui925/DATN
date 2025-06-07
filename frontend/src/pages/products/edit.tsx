import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Breadcrumb, Button, Col, Form, Input, Row, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";

export const ProductsEdit = () => {
    const { formProps, saveButtonProps, queryResult } = useForm({
        resource: "products",
        action: "edit",
    });

    const { selectProps: categorySelectProps } = useSelect({
        resource: "categories",
        optionLabel: "name",
        optionValue: "id",
        queryOptions: {
            cacheTime: 5 * 60 * 1000,
        },
    });

    const { selectProps: sizeSelectProps } = useSelect({
        resource: "sizes",
        optionLabel: "name",
        optionValue: "id",
        queryOptions: {
            cacheTime: 5 * 60 * 1000,
        },
    });

    const { selectProps: colorSelectProps } = useSelect({
        resource: "colors",
        optionLabel: "name",
        optionValue: "id",
        queryOptions: {
            cacheTime: 5 * 60 * 1000,
        },
    });

    const [variantForms, setVariantForms] = useState(
        queryResult?.data?.data?.variants?.map((variant: any) => ({
            key: variant.id || Date.now(),
        })) || []
    );

    const addVariantForm = () => {
        setVariantForms([...variantForms, { key: Date.now() }]);
    };

    const removeVariantForm = (key: any) => {
        setVariantForms(variantForms.filter((form: any) => form.key !== key));
    };

    const onFinish = async (values: any) => {
        const formData = new FormData();
        formData.append("name", values.name || "");
        formData.append("category_id", values.category_id || "");
        formData.append("description", values.description || "");
        formData.append("price", values.price || "0.00");
        formData.append("sale_price", values.sale_price || "");
        formData.append("sale_end", values.sale_end || "");
        formData.append("status", values.status || "1");

        if (
            values.image &&
            Array.isArray(values.image) &&
            values.image.length > 0
        ) {
            const file = values.image[0];
            if (file.originFileObj) {
                formData.append("image", file.originFileObj);
            }
        }

        if (
            values.imageDesc &&
            Array.isArray(values.imageDesc) &&
            values.imageDesc.length > 0
        ) {
            values.imageDesc.forEach((file: any, index: number) => {
                if (file.originFileObj) {
                    formData.append(`imageDesc[${index}]`, file.originFileObj);
                }
            });
        }

        if (values.variants && Array.isArray(values.variants)) {
            values.variants.forEach((variant: any, index: number) => {
                formData.append(`variants[${index}][name]`, variant.name || "");
                formData.append(`variants[${index}][size_id]`, variant.size_id || "");
                formData.append(`variants[${index}][color_id]`, variant.color_id || "");
                formData.append(`variants[${index}][quantity]`, variant.quantity || "0");
                formData.append(`variants[${index}][status]`, variant.status || "1");

                if (
                    variant.images &&
                    Array.isArray(variant.images) &&
                    variant.images.length > 0
                ) {
                    variant.images.forEach((file: any, fileIndex: number) => {
                        if (file.originFileObj) {
                            formData.append(`variants[${index}][images][${fileIndex}]`, file.originFileObj);
                        }
                    });
                }
            });
        }

        return formProps.onFinish?.(formData);
    };

    return (
        <Edit
            title="Chỉnh sửa sản phẩm"
            saveButtonProps={{
                ...saveButtonProps,
                children: "Lưu",
            }}
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
                    <Breadcrumb.Item>Chỉnh sửa</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Form 
                {...formProps} 
                layout="vertical" 
                onFinish={onFinish}
                initialValues={{
                    ...queryResult?.data?.data,
                    image: queryResult?.data?.data?.image ? [{
                        uid: '-1',
                        name: 'image',
                        status: 'done',
                        url: queryResult?.data?.data?.image,
                    }] : [],
                    imageDesc: queryResult?.data?.data?.imageDesc?.map((url:string, index: number) => ({
                        uid: index,
                        name: `imageDesc-${index}`,
                        status: 'done',
                        url,
                    })) || [],
                    variants: queryResult?.data?.data?.variants || [],
                }}
            >
                <Row gutter={16}>
                    <Col sm={12} xs={24}>
                        <Form.Item
                            label="Tên sản phẩm"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên sản phẩm!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Danh mục"
                            name="category_id"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn danh mục!",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Chọn danh mục"
                                {...categorySelectProps}
                                loading={categorySelectProps.loading}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Giá"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập giá sản phẩm!",
                                },
                                {
                                    pattern: /^\d+(\.\d{1,2})?$/,
                                    message: "Giá phải là số hợp lệ (ví dụ: 10.99)!",
                                },
                            ]}
                        >
                            <Input type="number" step="0.01" min="0" />
                        </Form.Item>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn trạng thái!",
                                },
                            ]}
                        >
                            <Select
                                options={[
                                    { value: "1", label: "Hoạt động" },
                                    { value: "0", label: "Ngừng hoạt động" },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Ảnh đại diện sản phẩm"
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
                                    required: true,
                                    message: "Vui lòng chọn ít nhất 1 ảnh!",
                                    validator: (_, value) => {
                                        if (value && value.length > 0) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Vui lòng chọn ít nhất 1 ảnh!"));
                                    },
                                },
                            ]}
                        >
                            <Upload
                                name="image"
                                listType="picture"
                                maxCount={1}
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>Chọn 1 tệp</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label="Ảnh mô tả sản phẩm"
                            name="imageDesc"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                return e && e.fileList;
                            }}
                        >
                            <Upload
                                name="image"
                                listType="picture"
                                maxCount={50}
                                multiple={true}
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>Chọn nhiều tệp</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col sm={12} xs={24}>
                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mô tả sản phẩm!",
                                },
                            ]}
                        >
                            <MDEditor />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <h3>Biến thể sản phẩm</h3>
                        <Form.List
                            name="variants"
                            rules={[
                                {
                                    validator: async (_, values) => {
                                        if (!values || values.length < 1) {
                                            return Promise.reject(new Error("Vui lòng thêm ít nhất 1 biến thể!"));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            {(fields, { add, remove }) => (
                                <>
                                    {variantForms.map((variant: any, index: number) => (
                                        <div
                                            key={variant.key}
                                            style={{
                                                border: "1px solid #d9d9d9",
                                                padding: "16px",
                                                marginBottom: "16px",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            <Row gutter={16}>
                                                <Col sm={12} xs={24}>
                                                    <Form.Item
                                                        label="Tên biến thể"
                                                        name={[index, "name"]}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Vui lòng nhập tên biến thể!",
                                                            },
                                                            {
                                                                max: 255,
                                                                message: "Tên biến thể tối đa 255 ký tự!",
                                                            },
                                                        ]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label="Kích thước"
                                                        name={[index, "size_id"]}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Vui lòng chọn kích thước!",
                                                            },
                                                        ]}
                                                    >
                                                        <Select
                                                            placeholder="Chọn kích thước"
                                                            {...sizeSelectProps}
                                                            options={[
                                                                { label: "39", value: "39" },
                                                                { label: "40", value: "40" },
                                                                { label: "41", value: "41" },
                                                                { label: "42", value: "42" },
                                                                { label: "43", value: "43" }
                                                            ]}
                                                            loading={sizeSelectProps.loading}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label="Màu sắc"
                                                        name={[index, "color_id"]}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Vui lòng chọn màu sắc!",
                                                            },
                                                        ]}
                                                    >
                                                        <Select
                                                            placeholder="Chọn màu sắc"
                                                            {...colorSelectProps}
                                                            options={[
                                                                { label: "Đỏ", value: "1" },
                                                                { label: "Xanh", value: "2" },
                                                                { label: "Vàng", value: "3" },
                                                                { label: "Trắng", value: "4" },
                                                                { label: "Đen", value: "5" }
                                                            ]}
                                                            loading={colorSelectProps.loading}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col sm={12} xs={24}>
                                                    <Form.Item
                                                        label="Số lượng"
                                                        name={[index, "quantity"]}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Vui lòng nhập số lượng!",
                                                            },
                                                            {
                                                                type: "number",
                                                                min: 0,
                                                                message: "Số lượng phải lớn hơn hoặc bằng 0!",
                                                            },
                                                        ]}
                                                    >
                                                        <Input type="number" min="0" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label="Trạng thái"
                                                        name={[index, "status"]}
                                                        initialValue="active"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Vui lòng chọn trạng thái!",
                                                            },
                                                        ]}
                                                    >
                                                        <Select
                                                            defaultValue="active"
                                                            options={[
                                                                { value: "active", label: "Hoạt động" },
                                                                { value: "inactive", label: "Ngừng hoạt động" },
                                                            ]}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label="Ảnh biến thể"
                                                        name={[index, "images"]}
                                                        valuePropName="fileList"
                                                        getValueFromEvent={(e) => {
                                                            if (Array.isArray(e)) {
                                                                return e;
                                                            }
                                                            return e && e.fileList;
                                                        }}
                                                    >
                                                        <Upload
                                                            name="images"
                                                            listType="picture"
                                                            multiple={true}
                                                            beforeUpload={() => false}
                                                        >
                                                            <Button icon={<UploadOutlined />}>
                                                                Chọn nhiều tệp
                                                            </Button>
                                                        </Upload>
                                                    </Form.Item>
                                                    <Button
                                                        type="dashed"
                                                        danger
                                                        onClick={() => {
                                                            remove(index);
                                                            removeVariantForm(variant.key);
                                                        }}
                                                        style={{ marginTop: "16px" }}
                                                    >
                                                        Xóa biến thể
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}
                                    <Button
                                        type="dashed"
                                        onClick={() => {
                                            add();
                                            addVariantForm();
                                        }}
                                        block
                                    >
                                        Thêm biến thể
                                    </Button>
                                </>
                            )}
                        </Form.List>
                    </Col>
                </Row>
            </Form>
        </Edit>
    );
};