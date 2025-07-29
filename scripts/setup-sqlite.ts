#!/usr/bin/env node
/**
 * SQLite Database Setup
 * Creates and initializes the SQLite database with schema
 */

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../lib/db/schema-sqlite';

async function setupDatabase() {
  console.log('🔧 Setting up SQLite database...\n');

  try {
    // Create SQLite database
    const sqlite = new Database('./dev.db');
    const db = drizzle(sqlite, { schema });

    console.log('✅ SQLite database created successfully');
    
    // Create tables manually for now
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        price REAL NOT NULL,
        compare_price REAL,
        sku TEXT UNIQUE,
        stock INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        is_featured INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    console.log('✅ Products table created');

    // Insert sample products
    const sampleProducts = [
      {
        id: crypto.randomUUID(),
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        stock: 50,
        is_featured: 1,
        created_at: Date.now(),
        updated_at: Date.now()
      },
      {
        id: crypto.randomUUID(),
        name: 'Smart Watch',
        slug: 'smart-watch',
        description: 'Feature-rich smartwatch with health monitoring',
        price: 299.99,
        stock: 30,
        is_featured: 1,
        created_at: Date.now(),
        updated_at: Date.now()
      },
      {
        id: crypto.randomUUID(),
        name: 'Coffee Maker',
        slug: 'coffee-maker',
        description: 'Programmable coffee maker with thermal carafe',
        price: 89.99,
        stock: 25,
        is_featured: 1,
        created_at: Date.now(),
        updated_at: Date.now()
      },
      {
        id: crypto.randomUUID(),
        name: 'Laptop Backpack',
        slug: 'laptop-backpack',
        description: 'Durable backpack with laptop compartment',
        price: 59.99,
        stock: 100,
        is_featured: 0,
        created_at: Date.now(),
        updated_at: Date.now()
      }
    ];

    const insertProduct = sqlite.prepare(`
      INSERT INTO products (id, name, slug, description, price, stock, is_featured, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const product of sampleProducts) {
      insertProduct.run(
        product.id,
        product.name,
        product.slug,
        product.description,
        product.price,
        product.stock,
        product.is_featured,
        product.created_at,
        product.updated_at
      );
    }

    console.log(`✅ Inserted ${sampleProducts.length} sample products`);

    sqlite.close();
    console.log('\n🎉 SQLite database setup complete!');
    console.log('   • Database: ./dev.db');
    console.log('   • Sample products loaded');
    console.log('   • Ready for development');
    console.log('\nNext steps:');
    console.log('   1. npm run dev');
    console.log('   2. Visit http://localhost:3000');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
