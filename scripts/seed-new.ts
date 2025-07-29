import 'dotenv/config'
import { db } from '../lib/db-sqlite'
import { categories, products } from '../lib/db/schema-sqlite'

async function seed() {
  try {
    console.log('🌱 Seeding database...')

    // Clear existing data
    await db.delete(products)
    await db.delete(categories)

    // Insert categories
    console.log('📂 Seeding categories...')
    const insertedCategories = await db.insert(categories).values([
      { 
        id: 'cat-1', 
        name: 'Electronics', 
        slug: 'electronics', 
        description: 'Electronic devices and gadgets',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id: 'cat-2', 
        name: 'Clothing', 
        slug: 'clothing', 
        description: 'Fashion and apparel',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id: 'cat-3', 
        name: 'Home & Garden', 
        slug: 'home-garden', 
        description: 'Home improvement and gardening',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id: 'cat-4', 
        name: 'Sports', 
        slug: 'sports', 
        description: 'Sports and outdoor equipment',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id: 'cat-5', 
        name: 'Books', 
        slug: 'books', 
        description: 'Books and educational materials',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]).returning()

    console.log(`✅ Inserted ${insertedCategories.length} categories`)

    // Insert products
    console.log('📦 Seeding products...')
    const insertedProducts = await db.insert(products).values([
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
        tags: 'electronics,audio,wireless',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
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
        tags: 'electronics,wearable,smart',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-3',
        name: 'Organic Cotton T-Shirt',
        slug: 'organic-cotton-t-shirt',
        description: 'Comfortable and sustainable organic cotton t-shirt',
        price: 24.99,
        comparePrice: 34.99,
        sku: 'OCT-001',
        stock: 100,
        isFeatured: false,
        tags: 'clothing,organic,cotton',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-4',
        name: 'Gaming Mechanical Keyboard',
        slug: 'gaming-mechanical-keyboard',
        description: 'RGB backlit mechanical keyboard for gaming',
        price: 129.99,
        comparePrice: 159.99,
        sku: 'GMK-001',
        stock: 30,
        isFeatured: true,
        tags: 'electronics,gaming,keyboard',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-5',
        name: 'Wireless Mouse',
        slug: 'wireless-mouse',
        description: 'Ergonomic wireless mouse with precision tracking',
        price: 39.99,
        comparePrice: 49.99,
        sku: 'WM-001',
        stock: 75,
        isFeatured: false,
        tags: 'electronics,mouse,wireless',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-6',
        name: 'Yoga Mat',
        slug: 'yoga-mat',
        description: 'Non-slip yoga mat for exercise and meditation',
        price: 29.99,
        comparePrice: 39.99,
        sku: 'YM-001',
        stock: 60,
        isFeatured: false,
        tags: 'sports,yoga,fitness',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-7',
        name: 'Coffee Maker',
        slug: 'coffee-maker',
        description: 'Programmable coffee maker with thermal carafe',
        price: 89.99,
        comparePrice: 119.99,
        sku: 'CM-001',
        stock: 20,
        isFeatured: true,
        tags: 'home,kitchen,coffee',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-8',
        name: 'Running Shoes',
        slug: 'running-shoes',
        description: 'Lightweight running shoes with advanced cushioning',
        price: 119.99,
        comparePrice: 149.99,
        sku: 'RS-001',
        stock: 40,
        isFeatured: true,
        tags: 'sports,shoes,running',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-9',
        name: 'Desk Lamp',
        slug: 'desk-lamp',
        description: 'LED desk lamp with adjustable brightness',
        price: 49.99,
        comparePrice: 69.99,
        sku: 'DL-001',
        stock: 35,
        isFeatured: false,
        tags: 'home,lighting,desk',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-10',
        name: 'Backpack',
        slug: 'backpack',
        description: 'Durable laptop backpack with multiple compartments',
        price: 59.99,
        comparePrice: 79.99,
        sku: 'BP-001',
        stock: 45,
        isFeatured: false,
        tags: 'bags,laptop,travel',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-11',
        name: 'Bluetooth Speaker',
        slug: 'bluetooth-speaker',
        description: 'Portable Bluetooth speaker with excellent sound quality',
        price: 69.99,
        comparePrice: 89.99,
        sku: 'BS-001',
        stock: 55,
        isFeatured: true,
        tags: 'electronics,audio,portable',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod-12',
        name: 'Water Bottle',
        slug: 'water-bottle',
        description: 'Insulated stainless steel water bottle',
        price: 19.99,
        comparePrice: 29.99,
        sku: 'WB-001',
        stock: 80,
        isFeatured: false,
        tags: 'sports,hydration,steel',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]).returning()

    console.log(`✅ Inserted ${insertedProducts.length} products`)
    console.log('🎉 Database seeded successfully!')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

if (require.main === module) {
  seed().catch((error) => {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  })
}

export { seed }
