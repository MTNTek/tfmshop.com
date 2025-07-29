import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db-postgres'
import { cartItems, products } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// GET /api/cart - Get user's cart items
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userCartItems = await db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
        addedAt: cartItems.addedAt,
        product: {
          id: products.id,
          name: products.name,
          slug: products.slug,
          price: products.price,
          image: products.image,
          stock: products.stock,
        }
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, session.user.id))

    return NextResponse.json(userCartItems)
  } catch (error) {
    console.error('Cart fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { productId, quantity = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists and has stock
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)

    if (!product[0]) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (product[0].stock < quantity) {
      return NextResponse.json(
        { error: 'Not enough stock' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const existingCartItem = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, session.user.id),
          eq(cartItems.productId, productId)
        )
      )
      .limit(1)

    if (existingCartItem.length > 0) {
      // Update existing item
      const newQuantity = existingCartItem[0].quantity + quantity
      
      if (product[0].stock < newQuantity) {
        return NextResponse.json(
          { error: 'Not enough stock' },
          { status: 400 }
        )
      }

      const updatedItem = await db
        .update(cartItems)
        .set({ 
          quantity: newQuantity,
          updatedAt: new Date()
        })
        .where(eq(cartItems.id, existingCartItem[0].id))
        .returning()

      return NextResponse.json(updatedItem[0])
    } else {
      // Create new cart item
      const newCartItem = await db
        .insert(cartItems)
        .values({
          userId: session.user.id,
          productId,
          quantity,
        })
        .returning()

      return NextResponse.json(newCartItem[0])
    }
  } catch (error) {
    console.error('Cart add error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { cartItemId, quantity } = await request.json()

    if (!cartItemId || quantity < 1) {
      return NextResponse.json(
        { error: 'Invalid cart item ID or quantity' },
        { status: 400 }
      )
    }

    // Verify cart item belongs to user
    const cartItem = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(cartItems.userId, session.user.id)
        )
      )
      .limit(1)

    if (!cartItem[0]) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Check product stock
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, cartItem[0].productId))
      .limit(1)

    if (!product[0] || product[0].stock < quantity) {
      return NextResponse.json(
        { error: 'Not enough stock' },
        { status: 400 }
      )
    }

    // Update quantity
    const updatedItem = await db
      .update(cartItems)
      .set({ 
        quantity,
        updatedAt: new Date()
      })
      .where(eq(cartItems.id, cartItemId))
      .returning()

    return NextResponse.json(updatedItem[0])
  } catch (error) {
    console.error('Cart update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get('cartItemId')

    if (!cartItemId) {
      return NextResponse.json(
        { error: 'Cart item ID is required' },
        { status: 400 }
      )
    }

    // Verify cart item belongs to user and delete
    const deletedItem = await db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(cartItems.userId, session.user.id)
        )
      )
      .returning()

    if (!deletedItem[0]) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error('Cart delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
