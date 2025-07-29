#!/usr/bin/env node
/**
 * Check and Update Database Schema
 * Adds missing columns and creates proper structure
 */

import Database from 'better-sqlite3';

async function updateSchema() {
  console.log('🔧 Checking and updating database schema...\n');

  try {
    const sqlite = new Database('./dev.db');

    // Check current products table structure
    const tableInfo = sqlite.prepare("PRAGMA table_info(products)").all();
    console.log('Current products table structure:');
    tableInfo.forEach(col => {
      console.log(`  - ${col.name}: ${col.type}`);
    });

    // Check if category column exists
    const hasCategoryColumn = tableInfo.some(col => col.name === 'category');
    
    if (!hasCategoryColumn) {
      console.log('\n🔄 Adding category column to products table...');
      sqlite.exec(`ALTER TABLE products ADD COLUMN category TEXT`);
      console.log('✅ Category column added');
    } else {
      console.log('\n✅ Category column already exists');
    }

    // Check if category_id column exists
    const hasCategoryIdColumn = tableInfo.some(col => col.name === 'category_id');
    
    if (!hasCategoryIdColumn) {
      console.log('🔄 Adding category_id column to products table...');
      sqlite.exec(`ALTER TABLE products ADD COLUMN category_id TEXT`);
      console.log('✅ Category_id column added');
    } else {
      console.log('✅ Category_id column already exists');
    }

    // Create categories table if it doesn't exist
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
    console.log('✅ Categories table ready');

    // Sample categories
    const sampleCategories = [
      {
        id: 'cat-electronics',
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest technology and electronic devices',
        image: '/api/placeholder/300/200',
        is_active: 1,
        created_at: Date.now(),
        updated_at: Date.now()
      },
      {
        id: 'cat-clothing',
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel for all occasions',
        image: '/api/placeholder/300/200',
        is_active: 1,
        created_at: Date.now(),
        updated_at: Date.now()
      },
      {
        id: 'cat-home-garden',
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Everything for your home and outdoor spaces',
        image: '/api/placeholder/300/200',
        is_active: 1,
        created_at: Date.now(),
        updated_at: Date.now()
      },
      {
        id: 'cat-sports',
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and fitness gear',
        image: '/api/placeholder/300/200',
        is_active: 1,
        created_at: Date.now(),
        updated_at: Date.now()
      },
      {
        id: 'cat-books',
        name: 'Books',
        slug: 'books',
        description: 'Educational and entertainment reading materials',
        image: '/api/placeholder/300/200',
        is_active: 1,
        created_at: Date.now(),
        updated_at: Date.now()
      }
    ];

    // Clear existing categories and insert fresh ones
    sqlite.exec('DELETE FROM categories');

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

    // Update products with category information
    const updateProduct = sqlite.prepare(`
      UPDATE products 
      SET category = ?, category_id = ? 
      WHERE name = ?
    `);

    updateProduct.run('Electronics', 'cat-electronics', 'Wireless Headphones');
    updateProduct.run('Electronics', 'cat-electronics', 'Smart Watch');
    updateProduct.run('Home & Garden', 'cat-home-garden', 'Coffee Maker');
    updateProduct.run('Electronics', 'cat-electronics', 'Laptop Backpack');

    console.log('✅ Updated product categories');

    // Show final structure
    console.log('\n📊 Final database structure:');
    const updatedTableInfo = sqlite.prepare("PRAGMA table_info(products)").all();
    console.log('Products table columns:');
    updatedTableInfo.forEach(col => {
      console.log(`  - ${col.name}: ${col.type}`);
    });

    const categoryCount = sqlite.prepare("SELECT COUNT(*) as count FROM categories").get();
    console.log(`\nCategories: ${categoryCount.count} records`);

    const productCount = sqlite.prepare("SELECT COUNT(*) as count FROM products").get();
    console.log(`Products: ${productCount.count} records`);

    sqlite.close();
    console.log('\n🎉 Database schema update complete!');

  } catch (error) {
    console.error('❌ Error updating schema:', error);
    process.exit(1);
  }
}

updateSchema();
