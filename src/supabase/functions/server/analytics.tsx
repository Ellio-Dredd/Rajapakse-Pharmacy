import { Hono } from 'npm:hono';
import { supabase, successResponse, errorResponse } from './db.tsx';

const analytics = new Hono();

// Get dashboard statistics
analytics.get('/dashboard', async (c) => {
  try {
    // Fetch counts from all tables
    const [
      { count: totalProducts },
      { count: totalOrders },
      { count: totalUsers },
      { count: totalAppointments },
      { count: pendingOrders },
      { count: confirmedAppointments },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    ]);
    
    // Calculate total sales
    const { data: orders } = await supabase.from('orders').select('total');
    const totalSales = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    
    return successResponse({
      totalProducts: totalProducts || 0,
      totalOrders: totalOrders || 0,
      totalUsers: totalUsers || 0,
      totalAppointments: totalAppointments || 0,
      totalSales: Number(totalSales.toFixed(2)),
      pendingOrders: pendingOrders || 0,
      confirmedAppointments: confirmedAppointments || 0,
    });
  } catch (error) {
    console.error('Exception in GET /analytics/dashboard:', error);
    return errorResponse('Failed to fetch analytics');
  }
});

// Get sales analytics over time
analytics.get('/sales', async (c) => {
  try {
    const days = parseInt(c.req.query('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('orders')
      .select('created_at, total, status')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching sales analytics:', error);
      return errorResponse(error.message);
    }
    
    // Group by date
    const salesByDate: Record<string, { date: string; total: number; count: number }> = {};
    
    data.forEach(order => {
      const date = order.created_at.split('T')[0];
      if (!salesByDate[date]) {
        salesByDate[date] = { date, total: 0, count: 0 };
      }
      salesByDate[date].total += order.total;
      salesByDate[date].count += 1;
    });
    
    const chartData = Object.values(salesByDate);
    
    return successResponse(chartData);
  } catch (error) {
    console.error('Exception in GET /analytics/sales:', error);
    return errorResponse('Failed to fetch sales analytics');
  }
});

// Get product category distribution
analytics.get('/products-by-category', async (c) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category');
    
    if (error) {
      console.error('Error fetching product categories:', error);
      return errorResponse(error.message);
    }
    
    // Count by category
    const categoryCount: Record<string, number> = {};
    data.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });
    
    const chartData = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
    }));
    
    return successResponse(chartData);
  } catch (error) {
    console.error('Exception in GET /analytics/products-by-category:', error);
    return errorResponse('Failed to fetch category analytics');
  }
});

// Get appointment statistics
analytics.get('/appointments-stats', async (c) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('status, appointment_date');
    
    if (error) {
      console.error('Error fetching appointment stats:', error);
      return errorResponse(error.message);
    }
    
    // Count by status
    const statusCount: Record<string, number> = {};
    data.forEach(appointment => {
      statusCount[appointment.status] = (statusCount[appointment.status] || 0) + 1;
    });
    
    return successResponse({
      byStatus: statusCount,
      total: data.length,
    });
  } catch (error) {
    console.error('Exception in GET /analytics/appointments-stats:', error);
    return errorResponse('Failed to fetch appointment statistics');
  }
});

// Get top selling products
analytics.get('/top-products', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '10');
    
    const { data: orders } = await supabase
      .from('orders')
      .select('items');
    
    if (!orders) {
      return successResponse([]);
    }
    
    // Count product occurrences
    const productCount: Record<string, { name: string; count: number; revenue: number }> = {};
    
    orders.forEach(order => {
      const items = order.items as any[];
      items.forEach(item => {
        if (!productCount[item.id]) {
          productCount[item.id] = { name: item.name, count: 0, revenue: 0 };
        }
        productCount[item.id].count += item.quantity;
        productCount[item.id].revenue += item.price * item.quantity;
      });
    });
    
    const topProducts = Object.values(productCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return successResponse(topProducts);
  } catch (error) {
    console.error('Exception in GET /analytics/top-products:', error);
    return errorResponse('Failed to fetch top products');
  }
});

// Get recent activity
analytics.get('/recent-activity', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '20');
    
    const [orders, appointments] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(limit),
      supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(limit),
    ]);
    
    const activities = [
      ...(orders.data || []).map(order => ({
        type: 'order',
        id: order.id,
        title: `Order ${order.order_number}`,
        description: `${order.customer_name} - $${order.total}`,
        status: order.status,
        timestamp: order.created_at,
      })),
      ...(appointments.data || []).map(apt => ({
        type: 'appointment',
        id: apt.id,
        title: `Appointment ${apt.appointment_number}`,
        description: `${apt.patient_name} with ${apt.doctor_name}`,
        status: apt.status,
        timestamp: apt.created_at,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    return successResponse(activities);
  } catch (error) {
    console.error('Exception in GET /analytics/recent-activity:', error);
    return errorResponse('Failed to fetch recent activity');
  }
});

export default analytics;
