import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items, shippingAddress, paymentMethod, totals } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      )
    }

    const sqlite = new Database('./dev.db')

    // Create orders table if it doesn't exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_email TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        subtotal REAL NOT NULL,
        tax REAL NOT NULL,
        shipping REAL NOT NULL,
        total REAL NOT NULL,
        shipping_address TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `)

    // Create order_items table if it doesn't exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        product_price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        total REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id)
      );
    `)

    const orderId = crypto.randomUUID()
    const now = Date.now()

    // Insert order
    const insertOrder = sqlite.prepare(`
      INSERT INTO orders (
        id, user_email, status, subtotal, tax, shipping, total, 
        shipping_address, payment_method, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    insertOrder.run(
      orderId,
      session.user.email,
      'pending',
      totals.subtotal,
      totals.tax,
      totals.shipping,
      totals.total,
      JSON.stringify(shippingAddress),
      JSON.stringify(paymentMethod),
      now,
      now
    )

    // Insert order items
    const insertOrderItem = sqlite.prepare(`
      INSERT INTO order_items (
        id, order_id, product_id, product_name, product_price, quantity, total
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    for (const item of items) {
      insertOrderItem.run(
        crypto.randomUUID(),
        orderId,
        item.productId,
        item.productName,
        item.productPrice,
        item.quantity,
        item.productPrice * item.quantity
      )
    }

    // Update product stock (reduce by ordered quantity)
    const updateStock = sqlite.prepare(`
      UPDATE products SET stock = stock - ? WHERE id = ?
    `)

    for (const item of items) {
      updateStock.run(item.quantity, item.productId)
    }

    sqlite.close()

    // Send order confirmation email
    try {
      const orderForEmail = {
        id: orderId,
        created_at: Date.now(),
        total: totals.total,
        shipping_address: shippingAddress,
        items: items.map(item => ({
          product_name: item.name,
          quantity: item.quantity,
          total: item.price * item.quantity
        }))
      };

      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order_confirmation',
          orderData: orderForEmail,
          customerEmail: shippingAddress.email
        })
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      id: orderId,
      status: 'pending',
      total: totals.total,
      message: 'Order placed successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    const sqlite = new Database('./dev.db')

    if (orderId) {
      // Get specific order
      const order = sqlite.prepare(`
        SELECT * FROM orders WHERE id = ? AND user_email = ?
      `).get(orderId, session.user.email)

      if (!order) {
        sqlite.close()
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }

      // Get order items
      const items = sqlite.prepare(`
        SELECT * FROM order_items WHERE order_id = ?
      `).all(orderId)

      sqlite.close()

      return NextResponse.json({
        ...order,
        shipping_address: JSON.parse(order.shipping_address),
        payment_method: JSON.parse(order.payment_method),
        items
      })
    } else {
      // Get all orders for user
      const orders = sqlite.prepare(`
        SELECT id, status, total, created_at FROM orders 
        WHERE user_email = ? 
        ORDER BY created_at DESC
      `).all(session.user.email)

      sqlite.close()

      return NextResponse.json({ orders })
    }

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
