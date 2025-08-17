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

interface ProductSales {
    product_name: string;
    total_revenue: number;
    date?: string;
}

interface Stats {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
    voucherUsageCount: number;
    averageRating: number;
    totalProduct: number;
    totalVariant: number;
    refundRate: number;
}

const Dashboard = () => {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [averageOrderValue, setAverageOrderValue] = useState(0);
    const [averageRating, setRatingAvg] = useState(0);
    const [totalProduct, setTotalProduct] = useState(0);
    const [totalVariant, setTotalVariant] = useState(0);
    const [refundRate, setRefundRate] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlySales[]>([]);
    const [voucherUsageCount, setVoucherUsageCount] = useState(0);
    const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([]);
    const [revenusByCate, setRevenusByCate] = useState<CategorySales[]>([]);
    const [orderStatusData, setOrderStatusData] = useState<OrderStatus[]>([]);
    const [paymentMethodsData, setPaymentMethodsData] = useState<PaymentMethod[]>([]);
    const [revenueByProduct, setRevenueByProduct] = useState<ProductSales[]>([]);

    // State cho bộ lọc ngày của từng biểu đồ
    const [chartFilters, setChartFilters] = useState<{
        monthlySales: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        userGrowth: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        orderStatus: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        categorySales: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        paymentMethods: [dayjs.Dayjs | null, dayjs.Dayjs | null];
        productSales: [dayjs.Dayjs | null, dayjs.Dayjs | null];
    }>({
        monthlySales: [null, null],
        userGrowth: [null, null],
        orderStatus: [null, null],
        categorySales: [null, null],
        paymentMethods: [null, null],
        productSales: [null, null],
    });

    const [chartFilterTypes, setChartFilterTypes] = useState<{
        monthlySales: string;
        userGrowth: string;
        orderStatus: string;
        categorySales: string;
        paymentMethods: string;
        productSales: string;
    }>({
        monthlySales: 'all',
        userGrowth: 'all',
        orderStatus: 'all',
        categorySales: 'all',
        paymentMethods: 'all',
        productSales: 'all',
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

    const fetchRevenueByProduct = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/revenue-by-product', { params });
            setRevenueByProduct(res.data.revenue_by_product ?? []);
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

    const fetchTotalProduct = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/total-product', { params });
            setTotalProduct(res.data.total_product ?? 0);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTotalVariant = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/total-variant', { params });
            setTotalVariant(res.data.total_variant ?? 0);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRefundRate = async (params?: any) => {
        try {
            const res = await axiosInstance.get('/api/dashboard/return-order-rate', { params });
            setRefundRate(res.data.return_order_rate ?? 0);
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
            fetchTotalProduct(params),
            fetchTotalVariant(params),
            fetchRefundRate(params),
        ]);
    };

    const fetchAllData = async () => {
        await Promise.all([
            fetchAllStats(),
            fetchMonthlyRevenue(),
            fetchUserGrowth(),
            fetchRevenueByCategory(),
            fetchRevenueByProduct(),
            fetchOrderStatus(),
            fetchPaymentMethods(),
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
            case 'productSales':
                fetchRevenueByProduct(params);
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
        totalProduct,
        totalVariant,
        refundRate,
    };

    const fakeData = {
        monthlySales: monthlyRevenue,
        userGrowth: userGrowth,
        orderStatus: orderStatusData,
        categorySales: revenusByCate,
        paymentMethods: paymentMethodsData,
        productSales: revenueByProduct,
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

    const productSalesConfig = {
        data: fakeData.productSales,
        xField: "product_name",
        yField: "total_revenue",
        title: { visible: true, text: "Doanh Thu Theo Sản Phẩm (VNĐ)" },
        label: {
            position: "middle",
            formatter: (datum: ProductSales) => datum.total_revenue.toLocaleString(),
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
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Tổng sản phẩm"
                            value={stats.totalProduct}
                            suffix="sảm phẩm"
                            valueStyle={{ color: "#2f54eb" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Tổng biến thể"
                            value={stats.totalVariant}
                            suffix="biến thể"
                            valueStyle={{ color: "#2f54eb" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Tỉ lệ hoàn đơn"
                            value={stats.refundRate}
                            suffix="%"
                            valueStyle={{ color: "#2f54eb" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card style={{ padding: 10 }}
                          title={
                              <div>
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
                        <Line {...salesConfig} height={300} />
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
                        <Area {...userGrowthConfig} height={300} />
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
                        <Pie {...orderStatusConfig} height={300} />
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
                        <Pie {...paymentMethodsConfig} height={300} />
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
                        <Column {...categorySalesConfig} height={300} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card style={{ padding: 10 }}
                          title={
                              <div>
                                  Doanh Thu Theo Sản Phẩm
                                  <div className="mt-2">
                                      <Row gutter={16}>
                                          <Col span={12}>
                                              <AntSelect
                                                  value={chartFilterTypes.productSales}
                                                  onChange={(value) => handleFilterChange('productSales', value)}
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
                                              <Button onClick={() => handleChartReset('productSales')} style={{ width: '100%' }}>Bỏ lọc</Button>
                                          </Col>
                                      </Row>
                                      {chartFilterTypes.productSales === 'custom' && (
                                          <RangePicker
                                              value={chartFilters.productSales}
                                              onChange={(dates) => handleDateChange('productSales', dates)}
                                              style={{ width: '100%', marginTop: 8 }}
                                              showTime
                                          />
                                      )}
                                  </div>
                              </div>
                          }
                    >
                        <Column {...productSalesConfig} height={300} />
                    </Card>
                </Col>
            </Row>
        </List>
    );
};

export default Dashboard;