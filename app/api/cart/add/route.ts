import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity = 1 } = await request.json();
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const sqlite = new Database('./dev.db');
    
    // Create cart table if it doesn't exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS cart (
        id TEXT PRIMARY KEY,
        user_email TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        UNIQUE(user_email, product_id)
      )
    `);

    // For demo purposes, we'll use a dummy user email
    const userEmail = 'demo@tfmshop.com';

    // Check if item already exists in cart
    const existingItem = sqlite.prepare(`
      SELECT id, quantity FROM cart 
      WHERE user_email = ? AND product_id = ?
    `).get(userEmail, productId);

    if (existingItem) {
      // Update quantity
      const newQuantity = (existingItem as any).quantity + quantity;
      sqlite.prepare(`
        UPDATE cart 
        SET quantity = ?, updated_at = ?
        WHERE user_email = ? AND product_id = ?
      `).run(newQuantity, Date.now(), userEmail, productId);
    } else {
      // Add new item
      const cartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sqlite.prepare(`
        INSERT INTO cart (id, user_email, product_id, quantity, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(cartId, userEmail, productId, quantity, Date.now(), Date.now());
    }

    sqlite.close();

    return NextResponse.json({
      message: 'Item added to cart successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
