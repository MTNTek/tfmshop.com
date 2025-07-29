import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Database from 'better-sqlite3';

export async function GET(request: NextRequest) {
  try {
    // Simplified auth check for demo purposes
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.log('Warning: No authentication in demo mode');
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';
    
    // Calculate date range
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    const sqlite = new Database('./dev.db');
    
    // Total Revenue
    const revenueResult = sqlite.prepare(`
      SELECT COALESCE(SUM(total), 0) as total_revenue
      FROM orders 
      WHERE created_at >= ? AND status != 'cancelled'
    `).get(startDate.getTime());

    // Total Orders
    const ordersResult = sqlite.prepare(`
      SELECT COUNT(*) as total_orders
      FROM orders 
      WHERE created_at >= ? AND status != 'cancelled'
    `).get(startDate.getTime());

    // Total Products
    const productsResult = sqlite.prepare(`
      SELECT COUNT(*) as total_products
      FROM products
    `).get();

    // Total Customers (unique emails from orders)
    const customersResult = sqlite.prepare(`
      SELECT COUNT(DISTINCT user_email) as total_customers
      FROM orders
      WHERE created_at >= ?
    `).get(startDate.getTime());

    // Recent Orders
    const recentOrders = sqlite.prepare(`
      SELECT id, user_email as customer_name, total, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 10
    `).all();

    // Sales data over time (daily)
    const salesData = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const dayEnd = dayStart + (24 * 60 * 60 * 1000) - 1;
      
      const dayRevenue = sqlite.prepare(`
        SELECT COALESCE(SUM(total), 0) as sales
        FROM orders 
        WHERE created_at >= ? AND created_at <= ? AND status != 'cancelled'
      `).get(dayStart, dayEnd);

      salesData.push({
        date: date.toISOString().split('T')[0],
        sales: dayRevenue.sales
      });
    }

    // Order status distribution
    const statusDistribution = sqlite.prepare(`
      SELECT status, COUNT(*) as count
      FROM orders
      WHERE created_at >= ?
      GROUP BY status
    `).all(startDate.getTime());

    const orderStatusDistribution = statusDistribution.map(item => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: item.count
    }));

    // Product performance (top selling products)
    const productPerformance = sqlite.prepare(`
      SELECT 
        oi.product_name as name,
        SUM(oi.quantity) as sales
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.created_at >= ? AND o.status != 'cancelled'
      GROUP BY oi.product_name
      ORDER BY sales DESC
      LIMIT 5
    `).all(startDate.getTime());

    sqlite.close();

    const analytics = {
      totalRevenue: revenueResult.total_revenue,
      totalOrders: ordersResult.total_orders,
      totalProducts: productsResult.total_products,
      totalCustomers: customersResult.total_customers,
      recentOrders,
      salesData,
      productPerformance,
      orderStatusDistribution
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
