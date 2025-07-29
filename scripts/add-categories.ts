#!/usr/bin/env node
/**
 * Add Categories to SQLite Database
 * Creates categories table and adds sample categories
 */

import Database from 'better-sqlite3';

async function addCategories() {
  console.log('🏷️ Adding categories to SQLite database...\n');

  try {
    const sqlite = new Database('./dev.db');

    // Create categories table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        image TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    console.log('✅ Categories table created');

    // Sample categories
    const sampleCategories = [
      {
        id: crypto.randomUUID(),
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest technology and electronic devices',
        image: '/api/placeholder/300/200',
        is_active: 1,
        created_at: Date.now(),
        updated_at: Date.now()
      },
      {
        id: crypto.randomUUID(),
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel for all occasions',
        image: '/api/placeholder/300/200',
        is_active: 1,
        created_at: Date.now(),
        updated_at: Date.now()
      },
      {
        id: crypto.randomUUID(),
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Everything for your home and outdoor spaces',
        image: '/api/placeholder/300/200',
        is_active: 1,
        created_at: Date.now(),
        updated_at: Date.now()
      },
      {
        id: crypto.randomUUID(),
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and fitness gear',
        image: '/api/placeholder/300/200',
        is_active: 1,
        created_at: Date.now(),
        updated_at: Date.now()
      },
      {
        id: crypto.randomUUID(),
        name: 'Books',
        slug: 'books',
        description: 'Educational and entertainment reading materials',
        image: '/api/placeholder/300/200',
        is_active: 1,
        created_at: Date.now(),
        updated_at: Date.now()
      }
    ];

    const insertCategory = sqlite.prepare(`
      INSERT INTO categories (id, name, slug, description, image, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const category of sampleCategories) {
      insertCategory.run(
        category.id,
        category.name,
        category.slug,
        category.description,
        category.image,
        category.is_active,
        category.created_at,
        category.updated_at
      );
    }

    console.log(`✅ Inserted ${sampleCategories.length} sample categories`);

    // Also update products to include category associations
    sqlite.exec(`
      UPDATE products 
      SET category = 'Electronics' 
      WHERE name IN ('Wireless Headphones', 'Smart Watch', 'Laptop Backpack');
      
      UPDATE products 
      SET category = 'Home & Garden' 
      WHERE name = 'Coffee Maker';
    `);

    console.log('✅ Updated product categories');

    sqlite.close();
    console.log('\n🎉 Categories setup complete!');
    console.log('   • 5 categories added');
    console.log('   • Products categorized');
    console.log('   • Categories API ready');

  } catch (error) {
    console.error('❌ Error adding categories:', error);
    process.exit(1);
  }
}

addCategories();
