import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const sqlite = new Database('./dev.db')
    
    // Query raw SQL to match actual database structure
    const query = includeInactive
      ? 'SELECT * FROM categories ORDER BY name'
      : 'SELECT * FROM categories WHERE is_active = 1 ORDER BY name'
    
    const result = sqlite.prepare(query).all()
    sqlite.close()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      slug,
      description,
      image,
      parentId,
      isActive = true,
    } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const sqlite = new Database('./dev.db')

    // Insert the category
    const newCategory = sqlite.prepare(`
      INSERT INTO categories (id, name, slug, description, image, parent_id, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).get(
      crypto.randomUUID(),
      name,
      slug,
      description || null,
      image || null,
      parentId || null,
      isActive ? 1 : 0,
      Date.now(),
      Date.now()
    )

    sqlite.close()

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
