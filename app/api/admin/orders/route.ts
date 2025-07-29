import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';

export async function GET(request: NextRequest) {
  try {
    // Simplified auth check for demo purposes
    // In production, implement proper authentication
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      // For demo purposes, allow access but add a warning in response
      console.log('Warning: No authentication in demo mode');
    }

    const sqlite = new Database('./dev.db');
    
    // Get all orders with order items
    const orders = sqlite.prepare(`
      SELECT 
        o.*,
        GROUP_CONCAT(
          json_object(
            'id', oi.id,
            'product_name', oi.product_name,
            'product_price', oi.product_price,
            'quantity', oi.quantity,
            'total', oi.total
          )
        ) as items_json
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `).all();

    sqlite.close();

    // Parse the order data
    const formattedOrders = orders.map((order: any) => ({
      ...order,
      shipping_address: JSON.parse(order.shipping_address),
      payment_method: JSON.parse(order.payment_method),
      items: order.items_json ? 
        order.items_json.split('},{').map((item: string, index: number, array: string[]) => {
          let jsonStr = item;
          if (index === 0 && !jsonStr.startsWith('[')) jsonStr = '[' + jsonStr;
          if (index === array.length - 1 && !jsonStr.endsWith(']')) jsonStr = jsonStr + ']';
          if (index > 0 && index < array.length - 1) {
            if (!jsonStr.startsWith('{')) jsonStr = '{' + jsonStr;
            if (!jsonStr.endsWith('}')) jsonStr = jsonStr + '}';
          }
          try {
            return JSON.parse(jsonStr.replace(/^\[|\]$/g, ''));
          } catch {
            return JSON.parse(item);
          }
        }) : []
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Simplified auth check for demo purposes
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.log('Warning: No authentication in demo mode');
    }

    const { orderId, status } = await request.json();
    
    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const sqlite = new Database('./dev.db');
    
    // Update order status
    sqlite.prepare(
      'UPDATE orders SET status = ? WHERE id = ?'
    ).run(status, orderId);

    // Get order details for notification
    const order = sqlite.prepare(
      'SELECT * FROM orders WHERE id = ?'
    ).get(orderId);

    if (order) {
      // Send notification for specific status changes
      if (status === 'shipped' || status === 'delivered') {
        try {
          const orderData = {
            ...order,
            shipping_address: JSON.parse(order.shipping_address),
            payment_method: JSON.parse(order.payment_method)
          };

          // Get order items
          const items = sqlite.prepare(
            'SELECT * FROM order_items WHERE order_id = ?'
          ).all(orderId);
          orderData.items = items;

          await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: status === 'shipped' ? 'order_shipped' : 'order_delivered',
              orderData,
              customerEmail: orderData.shipping_address.email
            })
          });
        } catch (notificationError) {
          console.error('Failed to send notification:', notificationError);
          // Don't fail the status update if notification fails
        }
      }
    }

    sqlite.close();

    return NextResponse.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
