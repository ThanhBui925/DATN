import { List } from "@refinedev/antd";
import { Breadcrumb, Row, Col, Card, Statistic, Typography, DatePicker, Select as AntSelect, Button } from "antd";
import { Column, Line, Pie, Bar, Area } from "@ant-design/charts";
import React, { useEffect, useState } from "react";
import { ArrowUpOutlined } from "@ant-design/icons";
import { axiosInstance } from "../../../utils/axios";
import dayjs from "dayjs";

const { Option } = AntSelect;
const { RangePicker } = DatePicker;

interface MonthlySales {
    month: string;
    total: number;
}

interface UserGrowth {
    month: string;
    total_users: number;
}

interface OrderStatus {
    status: string;
    count: number;
    date?: string;
}

interface CategorySales {
    category_name: string;
    total_revenue: number;
    date?: string;
}

interface PaymentMethod {
    method: string;
    count: number;
    date?: string;
}

interface ProductByCategory {
    category: string;
    count: number;
    date?: string;
}

interface VoucherUsage {
    code: string;
    used: number;
    date?: string;
}

interface ProductRating {
    rating: number;
    count: number;
    date?: string;
}

interface WeeklySales {
    week: string;
    sales: number;
}

interface OrderCompletionTime {
    days: string;
    count: number;
    date?: string;
}

interface ShippingStatus {
    status: string;
    count: number;
    date?: string;
}

interface TopProduct {
    product: string;
    quantity: number;
    date?: string;
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
    averageRating: number;
}

const Dashboard = () => {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [averageOrderValue, setAverageOrderValue] = useState(0);
    const [averageRating, setRatingAvg] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlySales[]>([]);
    const [voucherUsageCount, setVoucherUsageCount] = useState(0);
    const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([]);
    const [revenusByCate, setRevenusByCate] = useState<CategorySales[]>([]);
    const [orderStatusData, setOrderStatusData] = useState<OrderStatus[]>([]);
    const [paymentMethodsData, setPaymentMethodsData] = useState<PaymentMethod[]>([]);
    const [productsByCategoryData, setProductsByCategoryData] = useState<ProductByCategory[]>([]);
    const [voucherUsageData, setVoucherUsageData] = useState<VoucherUsage[]>([]);
    const [productRatingsData, setProductRatingsData] = useState<ProductRating[]>([]);
    const [weeklySalesData, setWeeklySalesData] = useState<WeeklySales[]>([]);
    const [orderCompletionTimeData, setOrderCompletionTimeData] = useState<OrderCompletionTime[]>([]);
    const [shippingStatusData, setShippingStatusData] = useState<ShippingStatus[]>([]);
    const [topProductsData, setTopProductsData] = useState<TopProduct[]>([]);

    // State cho bộ lọc ngày của từng biểu đồ
    const [chartFilters, setChartFilters] = useState<{
        monthlySales: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        userGrowth: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        orderStatus: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        categorySales: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        paymentMethods: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        productsByCategory: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        voucherUsage: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        productRatings: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        weeklySales: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        orderCompletionTime: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        shippingStatus: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        topProducts: [dayjs.Dayjs | null, dayjs.Dayjs | null];
    }>({
        monthlySales: [null, null],
        userGrowth: [null, null],
        orderStatus: [null, null],
        categorySales: [null, null],
        paymentMethods: [null, null],
        productsByCategory: [null, null],
        voucherUsage: [null, null],
        productRatings: [null, null],
        weeklySales: [null, null],
        orderCompletionTime: [null, null],
        shippingStatus: [null, null],
        topProducts: [null, null],
    });

    const [chartFilterTypes, setChartFilterTypes] = useState<{
        monthlySales: string;
        userGrowth: string;
        orderStatus: string;
        categorySales: string;
        paymentMethods: string;
        productsByCategory: string;
        voucherUsage: string;
        productRatings: string;
        weeklySales: string;
        orderCompletionTime: string;
        shippingStatus: string;
        topProducts: string;
    }>({
        monthlySales: 'all',
        userGrowth: 'all',
        orderStatus: 'all',
        categorySales: 'all',
        paymentMethods: 'all',
        productsByCategory: 'all',
        voucherUsage: 'all',
        productRatings: 'all',
        weeklySales: 'all',
        orderCompletionTime: 'all',
        shippingStatus: 'all',
        topProducts: 'all',
    });

    // State cho bộ lọc của stats (các card số)
    const [statsFilterType, setStatsFilterType] = useState<string>('all');
    const [statsFilterDates, setStatsFilterDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

    const calculateFromTo = (value: string, customDates: [dayjs.Dayjs | null, dayjs.Dayjs | null] = [null, null]) => {
        const today = dayjs();
        let from: string | undefined;
        let to: string | undefined;

        switch (value) {
            case 'today':
                from = today.startOf('day').format('YYYY-MM-DD HH:mm:ss');
                to = today.endOf('day').format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'yesterday':
                const yesterday = today.subtract(1, 'day');
                from = yesterday.startOf('day').format('YYYY-MM-DD HH:mm:ss');
                to = yesterday.endOf('day').format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'last_week':
                const lastWeekStart = today.subtract(1, 'week').startOf('week');
                const lastWeekEnd = today.subtract(1, 'week').endOf('week');
                from = lastWeekStart.format('YYYY-MM-DD HH:mm:ss');
                to = lastWeekEnd.format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'last_month':
                const lastMonthStart = today.subtract(1, 'month').startOf('month');
                const lastMonthEnd = today.subtract(1, 'month').endOf('month');
                from = lastMonthStart.format('YYYY-MM-DD HH:mm:ss');
                to = lastMonthEnd.format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'this_month':
                const thisMonthStart = today.startOf('month');
                const thisMonthEnd = today.endOf('month');
                from = thisMonthStart.format('YYYY-MM-DD HH:mm:ss');
                to = thisMonthEnd.format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'custom':
                if (customDates[0] && customDates[1]) {
                    from = customDates[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
                    to = customDates[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
                }
                break;
            default:
                break;
        }

        return { from, to };
    };

    const fetchTotalRevenue = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/total-revenue', { params });
            setTotalRevenue(res.data.total_revenue ?? 0);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTotalOrders = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/total-orders', { params });
            setTotalOrders(res.data.total_orders ?? 0);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTotalCustomers = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/total-customers', { params });
            setTotalCustomers(res.data.total_customers ?? 0);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAverageOrderValue = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/average-order-value', { params });
            setAverageOrderValue(res.data.average_order_value ?? 0);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAverageRating = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/average-rating', { params });
            setRatingAvg(res.data.average_rating ?? 0);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchVoucherUsageCount = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/voucher-usage-count', { params });
            setVoucherUsageCount(res.data.voucher_usage_count ?? 0);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMonthlyRevenue = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/monthly-revenue', { params });
            setMonthlyRevenue(res.data.monthly_revenue ?? []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUserGrowth = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/user-growth', { params });
            setUserGrowth(res.data.user_growth ?? []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRevenueByCategory = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/revenue-by-category', { params });
            setRevenusByCate(res.data.revenue_by_category ?? []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchOrderStatus = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/order-status', { params });
            setOrderStatusData(res.data.order_status ?? []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPaymentMethods = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/payment-methods', { params });
            setPaymentMethodsData(res.data.payment_methods ?? []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProductsByCategory = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/products-by-category', { params });
            setProductsByCategoryData(res.data.products_by_category ?? []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchVoucherUsage = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/voucher-usage', { params });
            setVoucherUsageData(res.data.voucher_usage ?? []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProductRatings = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/product-ratings', { params });
            setProductRatingsData(res.data.product_ratings ?? []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchWeeklySales = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/weekly-sales', { params });
            setWeeklySalesData(res.data.weekly_sales ?? []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchOrderCompletionTime = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/order-completion-time', { params });
            setOrderCompletionTimeData(res.data.order_completion_time ?? []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchShippingStatus = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/shipping-status', { params });
            setShippingStatusData(res.data.shipping_status ?? []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTopProducts = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/top-products', { params });
            setTopProductsData(res.data.top_products ?? []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAllStats = async (params?: any) => {
        await Promise.all([
            fetchTotalRevenue(params),
            fetchTotalOrders(params),
            fetchTotalCustomers(params),
            fetchAverageOrderValue(params),
            fetchAverageRating(params),
            fetchVoucherUsageCount(params),
        ]);
    };

    const fetchAllData = async () => {
        await Promise.all([
            fetchAllStats(),
            fetchMonthlyRevenue(),
            fetchUserGrowth(),
            fetchRevenueByCategory(),
            fetchOrderStatus(),
            fetchPaymentMethods(),
            fetchProductsByCategory(),
            fetchVoucherUsage(),
            fetchProductRatings(),
            fetchWeeklySales(),
            fetchOrderCompletionTime(),
            fetchShippingStatus(),
            fetchTopProducts(),
        ]);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleStatsFilterChange = (value: string) => {
        setStatsFilterType(value);
        if (value === 'all') {
            fetchAllStats();
            setStatsFilterDates([null, null]);
            return;
        }

        if (value !== 'custom') {
            const { from, to } = calculateFromTo(value);
            if (from && to) {
                const params = { from, to, filter: 'range' };
                fetchAllStats(params);
            }
            setStatsFilterDates([dayjs(from), dayjs(to)]);
        } else {
            setStatsFilterDates([null, null]);
        }
    };

    const handleStatsDateChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => {
        setStatsFilterDates(dates);
        if (dates[0] && dates[1]) {
            const { from, to } = calculateFromTo('custom', dates);
            if (from && to) {
                const params = { from, to, filter: 'range' };
                fetchAllStats(params);
            }
        }
    };

    const handleStatsReset = () => {
        setStatsFilterType('all');
        setStatsFilterDates([null, null]);
        fetchAllStats();
    };

    const handleFilterChange = (chart: string, value: string) => {
        setChartFilterTypes(prev => ({ ...prev, [chart]: value }));
        if (value === 'all') {
            fetchDataForChart(chart);
            setChartFilters(prev => ({ ...prev, [chart]: [null, null] }));
            return;
        }

        if (value !== 'custom') {
            const { from, to } = calculateFromTo(value);
            if (from && to) {
                const params = { from, to, filter: 'range' };
                fetchDataForChart(chart, params);
            }
            setChartFilters(prev => ({ ...prev, [chart]: [dayjs(from), dayjs(to)] }));
        } else {
            setChartFilters(prev => ({ ...prev, [chart]: [null, null] }));
        }
    };

    const handleDateChange = (chart: string, dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => {
        setChartFilters(prev => ({ ...prev, [chart]: dates }));
        if (dates[0] && dates[1]) {
            const { from, to } = calculateFromTo('custom', dates);
            if (from && to) {
                const params = { from, to, filter: 'range' };
                fetchDataForChart(chart, params);
            }
        }
    };

    const handleChartReset = (chart: string) => {
        setChartFilterTypes(prev => ({ ...prev, [chart]: 'all' }));
        setChartFilters(prev => ({ ...prev, [chart]: [null, null] }));
        fetchDataForChart(chart);
    };

    const fetchDataForChart = (chart: string, params?: any) => {
        switch (chart) {
            case 'monthlySales':
                fetchMonthlyRevenue(params);
                break;
            case 'userGrowth':
                fetchUserGrowth(params);
                break;
            case 'orderStatus':
                fetchOrderStatus(params);
                break;
            case 'categorySales':
                fetchRevenueByCategory(params);
                break;
            case 'paymentMethods':
                fetchPaymentMethods(params);
                break;
            case 'productsByCategory':
                fetchProductsByCategory(params);
                break;
            case 'voucherUsage':
                fetchVoucherUsage(params);
                break;
            case 'productRatings':
                fetchProductRatings(params);
                break;
            case 'weeklySales':
                fetchWeeklySales(params);
                break;
            case 'orderCompletionTime':
                fetchOrderCompletionTime(params);
                break;
            case 'shippingStatus':
                fetchShippingStatus(params);
                break;
            case 'topProducts':
                fetchTopProducts(params);
                break;
            default:
                break;
        }
    };

    const stats: Stats = {
        totalRevenue,
        totalOrders,
        totalCustomers,
        averageOrderValue,
        voucherUsageCount,
        averageRating,
    };

    const fakeData: FakeData = {
        monthlySales: monthlyRevenue,
        userGrowth: userGrowth,
        orderStatus: orderStatusData,
        categorySales: revenusByCate,
        paymentMethods: paymentMethodsData,
        productsByCategory: productsByCategoryData,
        voucherUsage: voucherUsageData,
        productRatings: productRatingsData,
        weeklySales: weeklySalesData,
        orderCompletionTime: orderCompletionTimeData,
        shippingStatus: shippingStatusData,
        topProducts: topProductsData,
    };

    const salesConfig = {
        data: fakeData.monthlySales,
        xField: "month",
        yField: "total",
        point: {
            shapeField: 'square',
            sizeField: 4,
        },
        style: {
            lineWidth: 2,
        },
        title: { visible: true, text: "Doanh Thu Hàng Tháng (VNĐ)" },
        label: {
            position: "middle",
            formatter: (datum: MonthlySales) => datum.total.toLocaleString('vi-VI'),
        },
        yAxis: {
            label: { formatter: (v: number) => `${(v / 1000000).toFixed(1)}M` },
        },
    };

    const userGrowthConfig = {
        data: fakeData.userGrowth,
        xField: "month",
        yField: "total_users",
        point: {
            shapeField: 'square',
            sizeField: 4,
        },
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
        xField: "category_name",
        yField: "total_revenue",
        title: { visible: true, text: "Doanh Thu Theo Danh Mục (VNĐ)" },
        label: {
            position: "middle",
            formatter: (datum: CategorySales) => datum.total_revenue.toLocaleString(),
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
                <Col xs={24}>
                    <Card title="Bộ Lọc Cho Thống Kê Số Lượng">
                        <Row gutter={16}>
                            <Col span={12}>
                                <AntSelect
                                    value={statsFilterType}
                                    onChange={handleStatsFilterChange}
                                    style={{ width: '100%' }}
                                >
                                    <Option value="all">Tất cả</Option>
                                    <Option value="today">Hôm nay</Option>
                                    <Option value="yesterday">Hôm qua</Option>
                                    <Option value="last_week">Tuần trước</Option>
                                    <Option value="last_month">Tháng trước</Option>
                                    <Option value="this_month">Tháng này</Option>
                                    <Option value="custom">Tùy chọn</Option>
                                </AntSelect>
                            </Col>
                            <Col span={12}>
                                <Button onClick={handleStatsReset} style={{ width: '100%' }}>Bỏ lọc</Button>
                            </Col>
                        </Row>
                        {statsFilterType === 'custom' && (
                            <RangePicker
                                value={statsFilterDates}
                                onChange={handleStatsDateChange}
                                style={{ width: '100%', marginTop: 8 }}
                                showTime
                            />
                        )}
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Tổng Doanh Thu"
                            value={stats.totalRevenue}
                            precision={0}
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
                    <Card style={{ padding: 10 }}
                        title={
                            <div className="p-5">
                                Doanh Thu Hàng Tháng
                                <div className="mt-2">
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <AntSelect
                                                value={chartFilterTypes.monthlySales}
                                                onChange={(value) => handleFilterChange('monthlySales', value)}
                                                style={{ width: '100%' }}
                                            >
                                                <Option value="all">Tất cả</Option>
                                                <Option value="today">Hôm nay</Option>
                                                <Option value="yesterday">Hôm qua</Option>
                                                <Option value="last_week">Tuần trước</Option>
                                                <Option value="last_month">Tháng trước</Option>
                                                <Option value="this_month">Tháng này</Option>
                                                <Option value="custom">Tùy chọn</Option>
                                            </AntSelect>
                                        </Col>
                                        <Col span={12}>
                                            <Button onClick={() => handleChartReset('monthlySales')} style={{ width: '100%' }}>Bỏ lọc</Button>
                                        </Col>
                                    </Row>
                                    {chartFilterTypes.monthlySales === 'custom' && (
                                        <RangePicker
                                            value={chartFilters.monthlySales}
                                            onChange={(dates) => handleDateChange('monthlySales', dates)}
                                            style={{ width: '100%', marginTop: 8 }}
                                            showTime
                                        />
                                    )}
                                </div>
                            </div>
                        }
                    >
                        <Line {...salesConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card style={{ padding: 10 }}
                        title={
                            <div>
                                Tăng Trưởng Người Dùng
                                <div className="mt-2">
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <AntSelect
                                                value={chartFilterTypes.userGrowth}
                                                onChange={(value) => handleFilterChange('userGrowth', value)}
                                                style={{ width: '100%' }}
                                            >
                                                <Option value="all">Tất cả</Option>
                                                <Option value="today">Hôm nay</Option>
                                                <Option value="yesterday">Hôm qua</Option>
                                                <Option value="last_week">Tuần trước</Option>
                                                <Option value="last_month">Tháng trước</Option>
                                                <Option value="this_month">Tháng này</Option>
                                                <Option value="custom">Tùy chọn</Option>
                                            </AntSelect>
                                        </Col>
                                        <Col span={12}>
                                            <Button onClick={() => handleChartReset('userGrowth')} style={{ width: '100%' }}>Bỏ lọc</Button>
                                        </Col>
                                    </Row>
                                    {chartFilterTypes.userGrowth === 'custom' && (
                                        <RangePicker
                                            value={chartFilters.userGrowth}
                                            onChange={(dates) => handleDateChange('userGrowth', dates)}
                                            style={{ width: '100%', marginTop: 8 }}
                                            showTime
                                        />
                                    )}
                                </div>
                            </div>
                        }
                    >
                        <Area {...userGrowthConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card style={{ padding: 10 }}
                        title={
                            <div>
                                Trạng Thái Đơn Hàng
                                <div className="mt-2">
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <AntSelect
                                                value={chartFilterTypes.orderStatus}
                                                onChange={(value) => handleFilterChange('orderStatus', value)}
                                                style={{ width: '100%' }}
                                            >
                                                <Option value="all">Tất cả</Option>
                                                <Option value="today">Hôm nay</Option>
                                                <Option value="yesterday">Hôm qua</Option>
                                                <Option value="last_week">Tuần trước</Option>
                                                <Option value="last_month">Tháng trước</Option>
                                                <Option value="this_month">Tháng này</Option>
                                                <Option value="custom">Tùy chọn</Option>
                                            </AntSelect>
                                        </Col>
                                        <Col span={12}>
                                            <Button onClick={() => handleChartReset('orderStatus')} style={{ width: '100%' }}>Bỏ lọc</Button>
                                        </Col>
                                    </Row>
                                    {chartFilterTypes.orderStatus === 'custom' && (
                                        <RangePicker
                                            value={chartFilters.orderStatus}
                                            onChange={(dates) => handleDateChange('orderStatus', dates)}
                                            style={{ width: '100%', marginTop: 8 }}
                                            showTime
                                        />
                                    )}
                                </div>
                            </div>
                        }
                    >
                        <Pie {...orderStatusConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card style={{ padding: 10 }}
                        title={
                            <div>
                                Doanh Thu Theo Danh Mục
                                <div className="mt-2">
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <AntSelect
                                                value={chartFilterTypes.categorySales}
                                                onChange={(value) => handleFilterChange('categorySales', value)}
                                                style={{ width: '100%' }}
                                            >
                                                <Option value="all">Tất cả</Option>
                                                <Option value="today">Hôm nay</Option>
                                                <Option value="yesterday">Hôm qua</Option>
                                                <Option value="last_week">Tuần trước</Option>
                                                <Option value="last_month">Tháng trước</Option>
                                                <Option value="this_month">Tháng này</Option>
                                                <Option value="custom">Tùy chọn</Option>
                                            </AntSelect>
                                        </Col>
                                        <Col span={12}>
                                            <Button onClick={() => handleChartReset('categorySales')} style={{ width: '100%' }}>Bỏ lọc</Button>
                                        </Col>
                                    </Row>
                                    {chartFilterTypes.categorySales === 'custom' && (
                                        <RangePicker
                                            value={chartFilters.categorySales}
                                            onChange={(dates) => handleDateChange('categorySales', dates)}
                                            style={{ width: '100%', marginTop: 8 }}
                                            showTime
                                        />
                                    )}
                                </div>
                            </div>
                        }
                    >
                        <Column {...categorySalesConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card style={{ padding: 10 }}
                        title={
                            <div>
                                Phương Thức Thanh Toán
                                <div className="mt-2">
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <AntSelect
                                                value={chartFilterTypes.paymentMethods}
                                                onChange={(value) => handleFilterChange('paymentMethods', value)}
                                                style={{ width: '100%' }}
                                            >
                                                <Option value="all">Tất cả</Option>
                                                <Option value="today">Hôm nay</Option>
                                                <Option value="yesterday">Hôm qua</Option>
                                                <Option value="last_week">Tuần trước</Option>
                                                <Option value="last_month">Tháng trước</Option>
                                                <Option value="this_month">Tháng này</Option>
                                                <Option value="custom">Tùy chọn</Option>
                                            </AntSelect>
                                        </Col>
                                        <Col span={12}>
                                            <Button onClick={() => handleChartReset('paymentMethods')} style={{ width: '100%' }}>Bỏ lọc</Button>
                                        </Col>
                                    </Row>
                                    {chartFilterTypes.paymentMethods === 'custom' && (
                                        <RangePicker
                                            value={chartFilters.paymentMethods}
                                            onChange={(dates) => handleDateChange('paymentMethods', dates)}
                                            style={{ width: '100%', marginTop: 8 }}
                                            showTime
                                        />
                                    )}
                                </div>
                            </div>
                        }
                    >
                        <Pie {...paymentMethodsConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card style={{ padding: 10 }}
                        title={
                            <div>
                                Số Lượng Sản Phẩm Theo Danh Mục
                                <div className="mt-2">
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <AntSelect
                                                value={chartFilterTypes.productsByCategory}
                                                onChange={(value) => handleFilterChange('productsByCategory', value)}
                                                style={{ width: '100%' }}
                                            >
                                                <Option value="all">Tất cả</Option>
                                                <Option value="today">Hôm nay</Option>
                                                <Option value="yesterday">Hôm qua</Option>
                                                <Option value="last_week">Tuần trước</Option>
                                                <Option value="last_month">Tháng trước</Option>
                                                <Option value="this_month">Tháng này</Option>
                                                <Option value="custom">Tùy chọn</Option>
                                            </AntSelect>
                                        </Col>
                                        <Col span={12}>
                                            <Button onClick={() => handleChartReset('productsByCategory')} style={{ width: '100%' }}>Bỏ lọc</Button>
                                        </Col>
                                    </Row>
                                    {chartFilterTypes.productsByCategory === 'custom' && (
                                        <RangePicker
                                            value={chartFilters.productsByCategory}
                                            onChange={(dates) => handleDateChange('productsByCategory', dates)}
                                            style={{ width: '100%', marginTop: 8 }}
                                            showTime
                                        />
                                    )}
                                </div>
                            </div>
                        }
                    >
                        <Bar {...productsByCategoryConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card style={{ padding: 10 }}
                        title={
                            <div>
                                Sử Dụng Voucher
                                <div className="mt-2">
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <AntSelect
                                                value={chartFilterTypes.voucherUsage}
                                                onChange={(value) => handleFilterChange('voucherUsage', value)}
                                                style={{ width: '100%' }}
                                            >
                                                <Option value="all">Tất cả</Option>
                                                <Option value="today">Hôm nay</Option>
                                                <Option value="yesterday">Hôm qua</Option>
                                                <Option value="last_week">Tuần trước</Option>
                                                <Option value="last_month">Tháng trước</Option>
                                                <Option value="this_month">Tháng này</Option>
                                                <Option value="custom">Tùy chọn</Option>
                                            </AntSelect>
                                        </Col>
                                        <Col span={12}>
                                            <Button onClick={() => handleChartReset('voucherUsage')} style={{ width: '100%' }}>Bỏ lọc</Button>
                                        </Col>
                                    </Row>
                                    {chartFilterTypes.voucherUsage === 'custom' && (
                                        <RangePicker
                                            value={chartFilters.voucherUsage}
                                            onChange={(dates) => handleDateChange('voucherUsage', dates)}
                                            style={{ width: '100%', marginTop: 8 }}
                                            showTime
                                        />
                                    )}
                                </div>
                            </div>
                        }
                    >
                        <Column {...voucherUsageConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card style={{ padding: 10 }}
                        title={
                            <div>
                                Đánh Giá Sản Phẩm
                                <div className="mt-2">
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <AntSelect
                                                value={chartFilterTypes.productRatings}
                                                onChange={(value) => handleFilterChange('productRatings', value)}
                                                style={{ width: '100%' }}
                                            >
                                                <Option value="all">Tất cả</Option>
                                                <Option value="today">Hôm nay</Option>
                                                <Option value="yesterday">Hôm qua</Option>
                                                <Option value="last_week">Tuần trước</Option>
                                                <Option value="last_month">Tháng trước</Option>
                                                <Option value="this_month">Tháng này</Option>
                                                <Option value="custom">Tùy chọn</Option>
                                            </AntSelect>
                                        </Col>
                                        <Col span={12}>
                                            <Button onClick={() => handleChartReset('productRatings')} style={{ width: '100%' }}>Bỏ lọc</Button>
                                        </Col>
                                    </Row>
                                    {chartFilterTypes.productRatings === 'custom' && (
                                        <RangePicker
                                            value={chartFilters.productRatings}
                                            onChange={(dates) => handleDateChange('productRatings', dates)}
                                            style={{ width: '100%', marginTop: 8 }}
                                            showTime
                                        />
                                    )}
                                </div>
                            </div>
                        }
                    >
                        <Pie {...productRatingsConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card style={{ padding: 10 }}
                        title={
                            <div>
                                Doanh Thu Theo Tuần
                                <div className="mt-2">
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <AntSelect
                                                value={chartFilterTypes.weeklySales}
                                                onChange={(value) => handleFilterChange('weeklySales', value)}
                                                style={{ width: '100%' }}
                                            >
                                                <Option value="all">Tất cả</Option>
                                                <Option value="today">Hôm nay</Option>
                                                <Option value="yesterday">Hôm qua</Option>
                                                <Option value="last_week">Tuần trước</Option>
                                                <Option value="last_month">Tháng trước</Option>
                                                <Option value="this_month">Tháng này</Option>
                                                <Option value="custom">Tùy chọn</Option>
                                            </AntSelect>
                                        </Col>
                                        <Col span={12}>
                                            <Button onClick={() => handleChartReset('weeklySales')} style={{ width: '100%' }}>Bỏ lọc</Button>
                                        </Col>
                                    </Row>
                                    {chartFilterTypes.weeklySales === 'custom' && (
                                        <RangePicker
                                            value={chartFilters.weeklySales}
                                            onChange={(dates) => handleDateChange('weeklySales', dates)}
                                            style={{ width: '100%', marginTop: 8 }}
                                            showTime
                                        />
                                    )}
                                </div>
                            </div>
                        }
                    >
                        <Line {...weeklySalesConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card style={{ padding: 10 }}
                        title={
                            <div>
                                Tình Trạng Vận Chuyển
                                <div className="mt-2">
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <AntSelect
                                                value={chartFilterTypes.shippingStatus}
                                                onChange={(value) => handleFilterChange('shippingStatus', value)}
                                                style={{ width: '100%' }}
                                            >
                                                <Option value="all">Tất cả</Option>
                                                <Option value="today">Hôm nay</Option>
                                                <Option value="yesterday">Hôm qua</Option>
                                                <Option value="last_week">Tuần trước</Option>
                                                <Option value="last_month">Tháng trước</Option>
                                                <Option value="this_month">Tháng này</Option>
                                                <Option value="custom">Tùy chọn</Option>
                                            </AntSelect>
                                        </Col>
                                        <Col span={12}>
                                            <Button onClick={() => handleChartReset('shippingStatus')} style={{ width: '100%' }}>Bỏ lọc</Button>
                                        </Col>
                                    </Row>
                                    {chartFilterTypes.shippingStatus === 'custom' && (
                                        <RangePicker
                                            value={chartFilters.shippingStatus}
                                            onChange={(dates) => handleDateChange('shippingStatus', dates)}
                                            style={{ width: '100%', marginTop: 8 }}
                                            showTime
                                        />
                                    )}
                                </div>
                            </div>
                        }
                    >
                        <Pie {...shippingStatusConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card style={{ padding: 10 }}
                        title={
                            <div>
                                Top Sản Phẩm Bán Chạy
                                <div className="mt-2">
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <AntSelect
                                                value={chartFilterTypes.topProducts}
                                                onChange={(value) => handleFilterChange('topProducts', value)}
                                                style={{ width: '100%' }}
                                            >
                                                <Option value="all">Tất cả</Option>
                                                <Option value="today">Hôm nay</Option>
                                                <Option value="yesterday">Hôm qua</Option>
                                                <Option value="last_week">Tuần trước</Option>
                                                <Option value="last_month">Tháng trước</Option>
                                                <Option value="this_month">Tháng này</Option>
                                                <Option value="custom">Tùy chọn</Option>
                                            </AntSelect>
                                        </Col>
                                        <Col span={12}>
                                            <Button onClick={() => handleChartReset('topProducts')} style={{ width: '100%' }}>Bỏ lọc</Button>
                                        </Col>
                                    </Row>
                                    {chartFilterTypes.topProducts === 'custom' && (
                                        <RangePicker
                                            value={chartFilters.topProducts}
                                            onChange={(dates) => handleDateChange('topProducts', dates)}
                                            style={{ width: '100%', marginTop: 8 }}
                                            showTime
                                        />
                                    )}
                                </div>
                            </div>
                        }
                    >
                        <Bar {...topProductsConfig} />
                    </Card>
                </Col>
            </Row>
        </List>
    );
};

export default Dashboard;