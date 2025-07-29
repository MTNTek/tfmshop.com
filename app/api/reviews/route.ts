import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import Database from 'better-sqlite3';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const sqlite = new Database('./dev.db');
    
    // Create reviews table if it doesn't exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        user_email TEXT NOT NULL,
        user_name TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title TEXT NOT NULL,
        comment TEXT NOT NULL,
        verified_purchase BOOLEAN DEFAULT FALSE,
        helpful_count INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL
      )
    `);
    
    // Get reviews for the product
    const reviews = sqlite.prepare(`
      SELECT * FROM reviews 
      WHERE product_id = ? 
      ORDER BY created_at DESC
    `).all(productId);

    // Get review statistics
    const stats = sqlite.prepare(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM reviews 
      WHERE product_id = ?
    `).get(productId);

    sqlite.close();

    return NextResponse.json({
      reviews: reviews.map((review: any) => ({
        ...review,
        created_at: new Date(review.created_at).toISOString()
      })),
      stats: {
        ...(stats as any),
        average_rating: (stats as any)?.average_rating ? parseFloat((stats as any).average_rating.toFixed(1)) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { productId, rating, title, comment } = await request.json();
    
    if (!productId || !rating || !title || !comment) {
      return NextResponse.json(
        { error: 'Product ID, rating, title, and comment are required' }, 
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' }, 
        { status: 400 }
      );
    }

    const sqlite = new Database('./dev.db');
    
    // Check if user has already reviewed this product
    const existingReview = sqlite.prepare(`
      SELECT id FROM reviews 
      WHERE product_id = ? AND user_email = ?
    `).get(productId, session.user.email);

    if (existingReview) {
      sqlite.close();
      return NextResponse.json(
        { error: 'You have already reviewed this product' }, 
        { status: 400 }
      );
    }

    // Check if user has purchased this product (verified purchase)
    const purchase = sqlite.prepare(`
      SELECT o.id FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_email = ? AND oi.product_id = ? AND o.status = 'delivered'
    `).get(session.user.email, productId);

    const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    sqlite.prepare(`
      INSERT INTO reviews (
        id, product_id, user_email, user_name, rating, title, comment, 
        verified_purchase, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      reviewId,
      productId,
      session.user.email,
      session.user.name || 'Anonymous',
      rating,
      title,
      comment,
      !!purchase,
      Date.now()
    );

    sqlite.close();

    return NextResponse.json({
      id: reviewId,
      message: 'Review submitted successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { reviewId, action } = await request.json();
    
    if (!reviewId || !action) {
      return NextResponse.json(
        { error: 'Review ID and action are required' }, 
        { status: 400 }
      );
    }

    const sqlite = new Database('./dev.db');
    
    if (action === 'helpful') {
      // Increment helpful count
      sqlite.prepare(`
        UPDATE reviews 
        SET helpful_count = helpful_count + 1 
        WHERE id = ?
      `).run(reviewId);

      sqlite.close();
      return NextResponse.json({ message: 'Marked as helpful' });
    }

    sqlite.close();
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
