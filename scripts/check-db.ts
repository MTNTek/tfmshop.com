#!/usr/bin/env node
/**
 * Quick Database Check
 * Verify categories and products data
 */

import Database from 'better-sqlite3';

try {
  console.log('🔍 Checking database contents...\n');
  
  const sqlite = new Database('./dev.db');

  // Check categories
  const categories = sqlite.prepare("SELECT * FROM categories").all();
  console.log(`📁 Categories (${categories.length} records):`);
  categories.forEach(cat => {
    console.log(`  - ${cat.name} (${cat.slug}) - Active: ${cat.is_active}`);
  });

  // Check products  
  const products = sqlite.prepare("SELECT id, name, category, category_id FROM products").all();
  console.log(`\n📦 Products (${products.length} records):`);
  products.forEach(prod => {
    console.log(`  - ${prod.name} → Category: ${prod.category || 'None'}`);
  });

  sqlite.close();
  console.log('\n✅ Database check complete');

} catch (error) {
  console.error('❌ Database error:', error);
}
