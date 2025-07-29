import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db-postgres'
import { orders, orderItems, cartItems, products } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, session.user.id))
      .orderBy(desc(orders.createdAt))

    return NextResponse.json(userOrders)
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order from cart
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { 
      shippingAddress,
      billingAddress,
      paymentMethod = 'stripe' 
    } = await request.json()

    if (!shippingAddress || !billingAddress) {
      return NextResponse.json(
        { error: 'Shipping and billing addresses are required' },
        { status: 400 }
      )
    }

    // Get user's cart items
    const userCartItems = await db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          stock: products.stock,
        }
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, session.user.id))

    if (userCartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Validate stock availability
    for (const item of userCartItems) {
      if (!item.product || item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Not enough stock for ${item.product?.name || 'product'}` },
          { status: 400 }
        )
      }
    }

    // Calculate totals
    const subtotal = userCartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity
    }, 0)

    const shippingCost = subtotal > 100 ? 0 : 10 // Free shipping over $100
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + shippingCost + tax

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order
    const newOrder = await db
      .insert(orders)
      .values({
        userId: session.user.id,
        orderNumber,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod,
        subtotal,
        shippingCost,
        tax,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress),
      })
      .returning()

    const orderId = newOrder[0].id

    // Create order items
    const orderItemsData = userCartItems.map(item => ({
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product?.price || 0,
      productName: item.product?.name || '',
    }))

    await db.insert(orderItems).values(orderItemsData)

    // Update product stock
    for (const item of userCartItems) {
      if (item.product) {
        await db
          .update(products)
          .set({ 
            stock: item.product.stock - item.quantity,
            updatedAt: new Date()
          })
          .where(eq(products.id, item.productId))
      }
    }

    // Clear user's cart
    await db
      .delete(cartItems)
      .where(eq(cartItems.userId, session.user.id))

    return NextResponse.json(newOrder[0], { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
