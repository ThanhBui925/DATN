import { List } from "@refinedev/antd";
import { Breadcrumb, Row, Col, Card, Statistic, Typography } from "antd";
import { Column, Line, Pie, Bar, Area } from "@ant-design/charts";
import React from "react";
import {ArrowUpOutlined} from "@ant-design/icons";

interface MonthlySales {
    month: string;
    sales: number;
}

interface UserGrowth {
    month: string;
    users: number;
}

interface OrderStatus {
    status: string;
    count: number;
}

interface CategorySales {
    category: string;
    sales: number;
}

interface PaymentMethod {
    method: string;
    count: number;
}

interface ProductByCategory {
    category: string;
    count: number;
}

interface VoucherUsage {
    code: string;
    used: number;
}

interface ProductRating {
    rating: number;
    count: number;
}

interface WeeklySales {
    week: string;
    sales: number;
}

interface OrderCompletionTime {
    days: string;
    count: number;
}

interface ShippingStatus {
    status: string;
    count: number;
}

interface TopProduct {
    product: string;
    quantity: number;
}

interface FakeData {
    monthlySales: MonthlySales[];
    userGrowth: UserGrowth[];
    orderStatus: OrderStatus[];
    categorySales: CategorySales[];
    paymentMethods: PaymentMethod[];
    productsByCategory: ProductByCategory[];
    voucherUsage: VoucherUsage[];
    productRatings: ProductRating[];
    weeklySales: WeeklySales[];
    orderCompletionTime: OrderCompletionTime[];
    shippingStatus: ShippingStatus[];
    topProducts: TopProduct[];
}

interface Stats {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
    voucherUsageCount: number;
    averageRating: string;
}

const Dashboard = () => {
    const fakeData: FakeData = {
        monthlySales: [
            { month: "Jan", sales: 12000000 },
            { month: "Feb", sales: 19000000 },
            { month: "Mar", sales: 15000000 },
            { month: "Apr", sales: 22000000 },
            { month: "May", sales: 30000000 },
            { month: "Jun", sales: 28000000 },
        ],
        userGrowth: [
            { month: "Jan", users: 50 },
            { month: "Feb", users: 80 },
            { month: "Mar", users: 120 },
            { month: "Apr", users: 150 },
            { month: "May", users: 200 },
            { month: "Jun", users: 250 },
        ],
        orderStatus: [
            { status: "Pending", count: 10 },
            { status: "Confirmed", count: 20 },
            { status: "Preparing", count: 30 },
            { status: "Shipping", count: 25 },
            { status: "Delivered", count: 50 },
            { status: "Completed", count: 40 },
            { status: "Canceled", count: 5 },
        ],
        categorySales: [
            { category: "Điện thoại", sales: 45000000 },
            { category: "Phụ kiện", sales: 15000000 },
            { category: "Laptop", sales: 30000000 },
            { category: "Laptop1", sales: 20000000 },
        ],
        paymentMethods: [
            { method: "Cash", count: 30 },
            { method: "Card", count: 50 },
            { method: "Paypal", count: 20 },
            { method: "VNPay", count: 40 },
        ],
        productsByCategory: [
            { category: "Điện thoại", count: 20 },
            { category: "Phụ kiện", count: 50 },
            { category: "Laptop", count: 15 },
            { category: "Laptop1", count: 10 },
        ],
        voucherUsage: [
            { code: "DISCOUNT10", used: 15 },
            { code: "FREESHIP", used: 25 },
            { code: "SALE20", used: 10 },
            { code: "NEWUSER", used: 5 },
        ],
        productRatings: [
            { rating: 5, count: 50 },
            { rating: 4, count: 30 },
            { rating: 3, count: 15 },
            { rating: 2, count: 5 },
            { rating: 1, count: 2 },
        ],
        weeklySales: [
            { week: "Week 1", sales: 5000000 },
            { week: "Week 2", sales: 7000000 },
            { week: "Week 3", sales: 6000000 },
            { week: "Week 4", sales: 8000000 },
        ],
        orderCompletionTime: [
            { days: "1-2 days", count: 40 },
            { days: "3-4 days", count: 30 },
            { days: "5-7 days", count: 20 },
            { days: ">7 days", count: 10 },
        ],
        shippingStatus: [
            { status: "Đang giao", count: 15 },
            { status: "Rảnh rỗi", count: 35 },
        ],
        topProducts: [
            { product: "Giày Nam", quantity: 100 },
            { product: "Iphone 14", quantity: 80 },
            { product: "Tai nghe", quantity: 60 },
            { product: "Laptop Dell", quantity: 40 },
            { product: "Ốp lưng", quantity: 30 },
        ],
    };

    const salesConfig = {
        data: fakeData.monthlySales,
        xField: "month",
        yField: "sales",
        title: { visible: true, text: "Doanh Thu Hàng Tháng (VNĐ)" },
        label: {
            position: "middle",
            formatter: (datum: MonthlySales) => datum.sales.toLocaleString(),
        },
        yAxis: {
            label: { formatter: (v: number) => `${(v / 1000000).toFixed(1)}M` },
        },
    };

    const userGrowthConfig = {
        data: fakeData.userGrowth,
        xField: "month",
        yField: "users",
        title: { visible: true, text: "Tăng Trưởng Người Dùng" },
        areaStyle: { fill: "#1890ff" },
        line: { color: "#1890ff" },
    };

    const orderStatusConfig = {
        data: fakeData.orderStatus,
        angleField: "count",
        colorField: "status",
        radius: 0.8,
        title: { visible: true, text: "Trạng Thái Đơn Hàng" },
        label: { type: "inner", offset: "-30%", formatter: ({ count }: OrderStatus) => count },
        color: ({ status }: OrderStatus) => {
            switch (status) {
                case "Pending": return "#ff4d4f";
                case "Confirmed": return "#faad14";
                case "Preparing": return "#1890ff";
                case "Shipping": return "#13c2c2";
                case "Delivered": return "#52c41a";
                case "Completed": return "#2f54eb";
                case "Canceled": return "#595959";
                default: return "#000";
            }
        },
    };

    const categorySalesConfig = {
        data: fakeData.categorySales,
        xField: "category",
        yField: "sales",
        title: { visible: true, text: "Doanh Thu Theo Danh Mục (VNĐ)" },
        label: {
            position: "middle",
            formatter: (datum: CategorySales) => datum.sales.toLocaleString(),
        },
        yAxis: {
            label: { formatter: (v: number) => `${(v / 1000000).toFixed(1)}M` },
        },
    };

    const paymentMethodsConfig = {
        data: fakeData.paymentMethods,
        angleField: "count",
        colorField: "method",
        radius: 0.8,
        title: { visible: true, text: "Phương Thức Thanh Toán" },
        label: { type: "inner", offset: "-30%", formatter: ({ count }: PaymentMethod) => count },
    };

    const productsByCategoryConfig = {
        data: fakeData.productsByCategory,
        xField: "count",
        yField: "category",
        title: { visible: true, text: "Số Lượng Sản Phẩm Theo Danh Mục" },
        label: { position: "right", formatter: (datum: ProductByCategory) => datum.count },
    };

    const voucherUsageConfig = {
        data: fakeData.voucherUsage,
        xField: "code",
        yField: "used",
        title: { visible: true, text: "Sử Dụng Voucher" },
        label: { position: "middle", formatter: (datum: VoucherUsage) => datum.used },
    };

    const productRatingsConfig = {
        data: fakeData.productRatings,
        angleField: "count",
        colorField: "rating",
        radius: 0.8,
        title: { visible: true, text: "Đánh Giá Sản Phẩm" },
        label: { type: "inner", offset: "-30%", formatter: ({ count }: ProductRating) => count },
        color: ({ rating }: ProductRating) => {
            return ["#52c41a", "#1890ff", "#faad14", "#ff4d4f", "#595959"][5 - rating];
        },
    };

    const weeklySalesConfig = {
        data: fakeData.weeklySales,
        xField: "week",
        yField: "sales",
        title: { visible: true, text: "Doanh Thu Theo Tuần (VNĐ)" },
        label: {
            position: "middle",
            formatter: (datum: WeeklySales) => datum.sales.toLocaleString(),
        },
        yAxis: {
            label: { formatter: (v: number) => `${(v / 1000000).toFixed(1)}M` },
        },
    };

    const orderCompletionTimeConfig = {
        data: fakeData.orderCompletionTime,
        angleField: "count",
        colorField: "days",
        radius: 0.8,
        innerRadius: 0.6,
        title: { visible: true, text: "Thời Gian Hoàn Thành Đơn Hàng" },
        label: { type: "inner", offset: "-30%", formatter: ({ count }: OrderCompletionTime) => count },
    };

    const shippingStatusConfig = {
        data: fakeData.shippingStatus,
        angleField: "count",
        colorField: "status",
        radius: 0.8,
        title: { visible: true, text: "Tình Trạng Vận Chuyển" },
        label: { type: "inner", offset: "-30%", formatter: ({ count }: ShippingStatus) => count },
        color: ({ status }: ShippingStatus) => (status === "Đang giao" ? "#1890ff" : "#52c41a"),
    };

    const topProductsConfig = {
        data: fakeData.topProducts,
        xField: "quantity",
        yField: "product",
        title: { visible: true, text: "Top Sản Phẩm Bán Chạy" },
        label: { position: "right", formatter: (datum: TopProduct) => datum.quantity },
    };

    const stats: Stats = {
        totalRevenue: fakeData.monthlySales.reduce((sum: number, item: MonthlySales) => sum + item.sales, 0),
        totalOrders: fakeData.orderStatus.reduce((sum: number, item: OrderStatus) => sum + item.count, 0),
        totalCustomers: fakeData.userGrowth[fakeData.userGrowth.length - 1].users,
        averageOrderValue: fakeData.monthlySales.reduce((sum: number, item: MonthlySales) => sum + item.sales, 0) / fakeData.orderStatus.reduce((sum: number, item: OrderStatus) => sum + item.count, 0),
        voucherUsageCount: fakeData.voucherUsage.reduce((sum: number, item: VoucherUsage) => sum + item.used, 0),
        averageRating: (fakeData.productRatings.reduce((sum: number, item: ProductRating) => sum + item.rating * item.count, 0) / fakeData.productRatings.reduce((sum: number, item: ProductRating) => sum + item.count, 0)).toFixed(1),
    };

    return (
        <List
            title="Thống Kê Tổng Quan"
            breadcrumb={
                <Breadcrumb>
                    <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Tổng Doanh Thu"
                            value={stats.totalRevenue}
                            precision={0}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            formatter={(value: number) => `${(value / 1000000).toFixed(1)}M VNĐ`}
                            valueStyle={{ color: "#3f8600" }}
                            prefix={<ArrowUpOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Tổng Số Đơn Hàng"
                            value={stats.totalOrders}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Tổng Số Khách Hàng"
                            value={stats.totalCustomers}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Giá Trị Đơn Hàng Trung Bình"
                            value={stats.averageOrderValue}
                            precision={0}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            formatter={(value: number) => `${(value / 1000000).toFixed(1)}M VNĐ`}
                            valueStyle={{ color: "#faad14" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Số Lượng Voucher Đã Sử Dụng"
                            value={stats.voucherUsageCount}
                            valueStyle={{ color: "#ff4d4f" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Đánh Giá Trung Bình"
                            value={stats.averageRating}
                            suffix="sao"
                            valueStyle={{ color: "#2f54eb" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Doanh Thu Hàng Tháng">
                        <Line {...salesConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Tăng Trưởng Người Dùng">
                        <Area {...userGrowthConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Trạng Thái Đơn Hàng">
                        <Pie {...orderStatusConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Doanh Thu Theo Danh Mục">
                        <Column {...categorySalesConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Phương Thức Thanh Toán">
                        <Pie {...paymentMethodsConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Số Lượng Sản Phẩm Theo Danh Mục">
                        <Bar {...productsByCategoryConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Sử Dụng Voucher">
                        <Column {...voucherUsageConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Đánh Giá Sản Phẩm">
                        <Pie {...productRatingsConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Doanh Thu Theo Tuần">
                        <Line {...weeklySalesConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Tình Trạng Vận Chuyển">
                        <Pie {...shippingStatusConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Top Sản Phẩm Bán Chạy">
                        <Bar {...topProductsConfig} />
                    </Card>
                </Col>
            </Row>
        </List>
    );
};

export default Dashboard;