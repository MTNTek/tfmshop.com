import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { error: 'Product slug is required' },
        { status: 400 }
      )
    }

    const sqlite = new Database('./dev.db')
    
    // Get product by slug
    const product = sqlite.prepare(`
      SELECT * FROM products 
      WHERE slug = ? AND is_active = 1
    `).get(slug)

    sqlite.close()

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Convert database format to API format
    const formattedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      comparePrice: product.compare_price,
      sku: product.sku,
      stock: product.stock,
      isActive: Boolean(product.is_active),
      isFeatured: Boolean(product.is_featured),
      category: product.category,
      category_id: product.category_id,
      tags: product.tags || '',
      createdAt: new Date(product.created_at).toISOString(),
      updatedAt: new Date(product.updated_at).toISOString(),
      image: '/api/placeholder/600/600', // Default placeholder
      images: ['/api/placeholder/600/600'], // Array of images
    }

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
