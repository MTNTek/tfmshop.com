import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db-sqlite'
import { products } from '@/lib/db/schema-sqlite'
import { eq, like } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    // Get all products first - select only fields that exist in our simple schema
    let allProducts = await db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      comparePrice: products.comparePrice,
      sku: products.sku,
      stock: products.stock,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    }).from(products).where(eq(products.isActive, true))
    
    // Apply filters
    if (search) {
      allProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (featured === 'true') {
      allProducts = allProducts.filter(product => product.isFeatured)
    }
    
    // Apply pagination
    const offset = (page - 1) * limit
    const paginatedProducts = allProducts.slice(offset, offset + limit)

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: allProducts.length,
        totalPages: Math.ceil(allProducts.length / limit),
        hasNext: offset + limit < allProducts.length,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, stock = 0, featured = false } = body

    if (!name || !price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const newProduct = await db.insert(products).values({
      name,
      slug,
      description,
      price: parseFloat(price),
      stock,
      isFeatured: featured,
    }).returning()

    return NextResponse.json({ product: newProduct[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
