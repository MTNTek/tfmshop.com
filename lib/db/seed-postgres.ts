import { db, products, categories, users } from './postgres';

const categories_data = [
  { name: 'Electronics', slug: 'electronics', image: '/api/placeholder/300/200' },
  { name: 'Clothing', slug: 'clothing', image: '/api/placeholder/300/200' },
  { name: 'Home & Garden', slug: 'home-garden', image: '/api/placeholder/300/200' },
  { name: 'Sports', slug: 'sports', image: '/api/placeholder/300/200' },
  { name: 'Books', slug: 'books', image: '/api/placeholder/300/200' },
];

const products_data = [
  {
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: '199.99',
    image: '/api/placeholder/400/400',
    category: 'Electronics',
    stock: 50,
    featured: true,
  },
  {
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health monitoring',
    price: '299.99',
    image: '/api/placeholder/400/400',
    category: 'Electronics',
    stock: 30,
    featured: true,
  },
  {
    name: 'Running Shoes',
    description: 'Comfortable running shoes for all terrains',
    price: '129.99',
    image: '/api/placeholder/400/400',
    category: 'Sports',
    stock: 75,
    featured: false,
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe',
    price: '89.99',
    image: '/api/placeholder/400/400',
    category: 'Home & Garden',
    stock: 25,
    featured: true,
  },
  {
    name: 'Laptop Backpack',
    description: 'Durable backpack with laptop compartment',
    price: '59.99',
    image: '/api/placeholder/400/400',
    category: 'Electronics',
    stock: 100,
    featured: false,
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with excellent sound quality',
    price: '79.99',
    image: '/api/placeholder/400/400',
    category: 'Electronics',
    stock: 60,
    featured: true,
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat for exercise and meditation',
    price: '39.99',
    image: '/api/placeholder/400/400',
    category: 'Sports',
    stock: 80,
    featured: false,
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable organic cotton t-shirt in multiple colors',
    price: '24.99',
    image: '/api/placeholder/400/400',
    category: 'Clothing',
    stock: 120,
    featured: false,
  },
  {
    name: 'Kitchen Knife Set',
    description: 'Professional kitchen knife set with wooden block',
    price: '149.99',
    image: '/api/placeholder/400/400',
    category: 'Home & Garden',
    stock: 35,
    featured: true,
  },
  {
    name: 'Programming Book',
    description: 'Complete guide to modern web development',
    price: '49.99',
    image: '/api/placeholder/400/400',
    category: 'Books',
    stock: 40,
    featured: false,
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Insert categories
    console.log('📂 Seeding categories...');
    await db.insert(categories).values(categories_data);

    // Insert products
    console.log('📦 Seeding products...');
    await db.insert(products).values(products_data);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Seed completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed failed:', error);
      process.exit(1);
    });
}

export { seed };
