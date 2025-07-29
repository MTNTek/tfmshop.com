import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'

const db = new Database('data/ecommerce.db')

// Initialize wishlist table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL DEFAULT 'guest',
    product_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
  )
`)

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId') || 'guest'

    const items = db.prepare(`
      SELECT w.*, 
             p.name, p.price, p.image, p.rating
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `).all(userId)

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Wishlist fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, userId = 'guest' } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Add to wishlist (ignore if already exists due to UNIQUE constraint)
    try {
      db.prepare(`
        INSERT INTO wishlist (user_id, product_id)
        VALUES (?, ?)
      `).run(userId, productId)

      return NextResponse.json({ 
        message: 'Added to wishlist',
        productId,
        userId 
      })
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return NextResponse.json({ 
          message: 'Product already in wishlist',
          productId,
          userId 
        })
      }
      throw error
    }
  } catch (error) {
    console.error('Wishlist add error:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const productId = url.searchParams.get('productId')
    const userId = url.searchParams.get('userId') || 'guest'

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const result = db.prepare(`
      DELETE FROM wishlist 
      WHERE user_id = ? AND product_id = ?
    `).run(userId, productId)

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Item not found in wishlist' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      message: 'Removed from wishlist',
      productId,
      userId 
    })
  } catch (error) {
    console.error('Wishlist remove error:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}