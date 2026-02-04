import { Package, ShoppingCart, Users, Calendar, TrendingUp, TrendingDown, MoreHorizontal, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { StatCard } from './StatCard';
import { formatCurrency } from '../utils/currency';
import { useState, useEffect } from 'react';
import { analyticsAPI } from '../utils/api';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function AdminDashboardHome() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await analyticsAPI.getDashboard();
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Use mock data if API fails or is loading
  const salesData = analyticsData?.salesData || [
    { month: 'Jan', sales: 12000, orders: 145 },
    { month: 'Feb', sales: 19000, orders: 220 },
    { month: 'Mar', sales: 15000, orders: 180 },
    { month: 'Apr', sales: 25000, orders: 290 },
    { month: 'May', sales: 22000, orders: 260 },
    { month: 'Jun', sales: 30000, orders: 350 },
  ];

  const appointmentData = analyticsData?.appointmentData || [
    { day: 'Mon', appointments: 12 },
    { day: 'Tue', appointments: 19 },
    { day: 'Wed', appointments: 15 },
    { day: 'Thu', appointments: 22 },
    { day: 'Fri', appointments: 18 },
    { day: 'Sat', appointments: 10 },
    { day: 'Sun', appointments: 8 },
  ];

  const recentOrders = analyticsData?.recentOrders || [
    { id: '#ORD-1234', customer: 'John Doe', amount: 89.99, status: 'Completed', date: 'Feb 2, 2026' },
    { id: '#ORD-1235', customer: 'Jane Smith', amount: 156.50, status: 'Processing', date: 'Feb 2, 2026' },
    { id: '#ORD-1236', customer: 'Bob Johnson', amount: 45.00, status: 'Shipped', date: 'Feb 1, 2026' },
    { id: '#ORD-1237', customer: 'Alice Brown', amount: 210.75, status: 'Completed', date: 'Feb 1, 2026' },
  ];

  const stats = analyticsData?.stats || {
    totalSales: '$123,456',
    totalOrders: '1,234',
    totalUsers: '8,456',
    appointments: '456',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={stats.totalSales}
          change="+12.5% from last month"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change="+8.2% from last month"
          icon={ShoppingCart}
          trend="up"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change="+3.1% from last month"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Appointments"
          value={stats.appointments}
          change="-2.4% from last month"
          icon={Calendar}
          trend="down"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#0891b2"
                  strokeWidth={2}
                  dot={{ fill: '#0891b2', r: 4 }}
                  name="Sales ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointments Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="appointments" fill="#0891b2" radius={[8, 8, 0, 0]} name="Appointments" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{formatCurrency(order.amount)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'Completed'
                            ? 'bg-success/10 text-success'
                            : order.status === 'Processing'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-info/10 text-info'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}