import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db-postgres'
import { orders, orderItems, products } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth()
    const { orderId } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get order details
    const order = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.id, orderId),
          eq(orders.userId, session.user.id)
        )
      )
      .limit(1)

    if (!order[0]) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Get order items with product details
    const items = await db
      .select({
        id: orderItems.id,
        quantity: orderItems.quantity,
        price: orderItems.price,
        productName: orderItems.productName,
        product: {
          id: products.id,
          name: products.name,
          slug: products.slug,
          image: products.image,
        }
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, orderId))

    return NextResponse.json({
      ...order[0],
      items,
      shippingAddress: JSON.parse(order[0].shippingAddress || '{}'),
      billingAddress: JSON.parse(order[0].billingAddress || '{}'),
    })
  } catch (error) {
    console.error('Order details fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
