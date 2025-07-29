import 'dotenv/config'
import { db } from '../lib/db-sqlite'
import { categories, products, productImages, productCategories } from '../lib/db/schema-sqlite'

async function seed() {
  try {
    console.log('🌱 Seeding SQLite database...')

    // Clear existing data
    await db.delete(productCategories)
    await db.delete(productImages)
    await db.delete(products)
    await db.delete(categories)

    // Insert categories
    console.log('📂 Seeding categories...')
    const categoryData = [
      { id: 'cat-1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
      { id: 'cat-2', name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel' },
      { id: 'cat-3', name: 'Home & Garden', slug: 'home-garden', description: 'Home improvement and gardening' },
      { id: 'cat-4', name: 'Sports', slug: 'sports', description: 'Sports and outdoor equipment' },
      { id: 'cat-5', name: 'Books', slug: 'books', description: 'Books and educational materials' },
    ]

    await db.insert(categories).values(categoryData)

    // Insert products
    console.log('📦 Seeding products...')
    const productData = [
      {
        id: 'prod-1',
        name: 'Wireless Bluetooth Headphones',
        slug: 'wireless-bluetooth-headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 79.99,
        comparePrice: 99.99,
        sku: 'WBH-001',
        stock: 50,
        isFeatured: true,
        tags: JSON.stringify(['electronics', 'audio', 'wireless']),
      },
      {
        id: 'prod-2',
        name: 'Smart Watch Series 5',
        slug: 'smart-watch-series-5',
        description: 'Advanced smartwatch with health monitoring',
        price: 299.99,
        comparePrice: 349.99,
        sku: 'SW-005',
        stock: 25,
        isFeatured: true,
        tags: JSON.stringify(['electronics', 'wearable', 'health']),
      },
      {
        id: 'prod-3',
        name: 'Cotton T-Shirt',
        slug: 'cotton-t-shirt',
        description: 'Comfortable 100% cotton t-shirt',
        price: 19.99,
        sku: 'CTS-001',
        stock: 100,
        tags: JSON.stringify(['clothing', 'cotton', 'casual']),
      },
      {
        id: 'prod-4',
        name: 'Yoga Mat Pro',
        slug: 'yoga-mat-pro',
        description: 'Professional grade yoga mat with excellent grip',
        price: 49.99,
        sku: 'YMP-001',
        stock: 30,
        tags: JSON.stringify(['sports', 'yoga', 'fitness']),
      },
      {
        id: 'prod-5',
        name: 'JavaScript Complete Guide',
        slug: 'javascript-complete-guide',
        description: 'Comprehensive guide to modern JavaScript development',
        price: 34.99,
        sku: 'JSG-001',
        stock: 15,
        tags: JSON.stringify(['books', 'programming', 'javascript']),
      },
      {
        id: 'prod-6',
        name: 'Portable Laptop Stand',
        slug: 'portable-laptop-stand',
        description: 'Adjustable aluminum laptop stand for better ergonomics',
        price: 45.99,
        sku: 'PLS-001',
        stock: 40,
        tags: JSON.stringify(['electronics', 'accessories', 'ergonomic']),
      },
      {
        id: 'prod-7',
        name: 'Wireless Mouse',
        slug: 'wireless-mouse',
        description: 'Ergonomic wireless mouse with long battery life',
        price: 24.99,
        sku: 'WM-001',
        stock: 75,
        tags: JSON.stringify(['electronics', 'computer', 'wireless']),
      },
      {
        id: 'prod-8',
        name: 'LED Desk Lamp',
        slug: 'led-desk-lamp',
        description: 'Adjustable LED desk lamp with USB charging port',
        price: 39.99,
        sku: 'LDL-001',
        stock: 35,
        tags: JSON.stringify(['home', 'lighting', 'office']),
      },
      {
        id: 'prod-9',
        name: 'Premium Coffee Mug',
        slug: 'premium-coffee-mug',
        description: 'Insulated stainless steel coffee mug',
        price: 16.99,
        sku: 'PCM-001',
        stock: 60,
        tags: JSON.stringify(['home', 'kitchen', 'coffee']),
      },
      {
        id: 'prod-10',
        name: 'Bluetooth Speaker',
        slug: 'bluetooth-speaker',
        description: 'Portable Bluetooth speaker with premium sound',
        price: 59.99,
        sku: 'BTS-001',
        stock: 45,
        isFeatured: true,
        tags: JSON.stringify(['electronics', 'audio', 'portable']),
      },
      {
        id: 'prod-11',
        name: 'Running Shoes',
        slug: 'running-shoes',
        description: 'Lightweight running shoes with advanced cushioning',
        price: 89.99,
        comparePrice: 119.99,
        sku: 'RS-001',
        stock: 20,
        tags: JSON.stringify(['sports', 'shoes', 'running']),
      },
      {
        id: 'prod-12',
        name: 'Backpack Pro',
        slug: 'backpack-pro',
        description: 'Durable laptop backpack with multiple compartments',
        price: 69.99,
        sku: 'BP-001',
        stock: 30,
        tags: JSON.stringify(['accessories', 'laptop', 'travel']),
      },
    ]

    await db.insert(products).values(productData)

    // Insert product images
    console.log('🖼️ Seeding product images...')
    const imageData = [
      { id: 'img-1', productId: 'prod-1', url: '/images/headphones.jpg', altText: 'Wireless Bluetooth Headphones', position: 0 },
      { id: 'img-2', productId: 'prod-2', url: '/images/smartwatch.jpg', altText: 'Smart Watch Series 5', position: 0 },
      { id: 'img-3', productId: 'prod-3', url: '/images/tshirt.jpg', altText: 'Cotton T-Shirt', position: 0 },
      { id: 'img-4', productId: 'prod-4', url: '/images/yoga-mat.jpg', altText: 'Yoga Mat Pro', position: 0 },
      { id: 'img-5', productId: 'prod-5', url: '/images/js-book.jpg', altText: 'JavaScript Complete Guide', position: 0 },
      { id: 'img-6', productId: 'prod-6', url: '/images/laptop-stand.jpg', altText: 'Portable Laptop Stand', position: 0 },
      { id: 'img-7', productId: 'prod-7', url: '/images/wireless-mouse.jpg', altText: 'Wireless Mouse', position: 0 },
      { id: 'img-8', productId: 'prod-8', url: '/images/desk-lamp.jpg', altText: 'LED Desk Lamp', position: 0 },
      { id: 'img-9', productId: 'prod-9', url: '/images/coffee-mug.jpg', altText: 'Premium Coffee Mug', position: 0 },
      { id: 'img-10', productId: 'prod-10', url: '/images/bluetooth-speaker.jpg', altText: 'Bluetooth Speaker', position: 0 },
      { id: 'img-11', productId: 'prod-11', url: '/images/running-shoes.jpg', altText: 'Running Shoes', position: 0 },
      { id: 'img-12', productId: 'prod-12', url: '/images/backpack.jpg', altText: 'Backpack Pro', position: 0 },
    ]

    await db.insert(productImages).values(imageData)

    // Insert product-category relationships
    console.log('🔗 Seeding product categories...')
    const productCategoryData = [
      { id: 'pc-1', productId: 'prod-1', categoryId: 'cat-1' }, // Headphones -> Electronics
      { id: 'pc-2', productId: 'prod-2', categoryId: 'cat-1' }, // Smart Watch -> Electronics
      { id: 'pc-3', productId: 'prod-3', categoryId: 'cat-2' }, // T-Shirt -> Clothing
      { id: 'pc-4', productId: 'prod-4', categoryId: 'cat-4' }, // Yoga Mat -> Sports
      { id: 'pc-5', productId: 'prod-5', categoryId: 'cat-5' }, // JS Book -> Books
      { id: 'pc-6', productId: 'prod-6', categoryId: 'cat-1' }, // Laptop Stand -> Electronics
      { id: 'pc-7', productId: 'prod-7', categoryId: 'cat-1' }, // Wireless Mouse -> Electronics
      { id: 'pc-8', productId: 'prod-8', categoryId: 'cat-3' }, // Desk Lamp -> Home & Garden
      { id: 'pc-9', productId: 'prod-9', categoryId: 'cat-3' }, // Coffee Mug -> Home & Garden
      { id: 'pc-10', productId: 'prod-10', categoryId: 'cat-1' }, // Bluetooth Speaker -> Electronics
      { id: 'pc-11', productId: 'prod-11', categoryId: 'cat-4' }, // Running Shoes -> Sports
      { id: 'pc-12', productId: 'prod-12', categoryId: 'cat-2' }, // Backpack -> Clothing
    ]

    await db.insert(productCategories).values(productCategoryData)

    console.log('✅ SQLite database seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

seed()
  .then(() => {
    console.log('🎉 Seeding completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  })
