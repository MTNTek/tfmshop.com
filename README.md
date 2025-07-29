# 🛒 TFM Shop - E-commerce Platform

## 🚀 Current Status: Ready for PostgreSQL!

Your e-commerce platform has been **successfully migrated to PostgreSQL**! The application is fully configured and ready to run with a PostgreSQL database.

### ✅ What's Complete:
- ✅ Complete e-commerce platform with authentication
- ✅ Shopping cart and order management
- ✅ PostgreSQL schema and configuration
- ✅ Database switching utilities
- ✅ Seed data and migration scripts

### 🎯 Next Step: Choose Your Database

**Option 1: Cloud PostgreSQL (Recommended - 2 minutes setup)**
```bash
# Quick cloud setup with Neon (free tier)
npm run postgres:test  # Shows setup instructions
```

**Option 2: Local PostgreSQL**
```bash
# Test if you have PostgreSQL installed
npm run postgres:test

# Or install locally (see POSTGRESQL_SETUP.md)
```

**Option 3: Switch Back to SQLite (if preferred)**
```bash
npm run db:switch-sqlite
npm run db:push
npm run db:seed
npm run dev
```

## 🌐 Recommended: 2-Minute Neon Setup

1. **Go to [neon.tech](https://neon.tech)** and create a free account
2. **Create a new project** (takes 30 seconds)
3. **Copy the connection string** from the dashboard
4. **Update your .env.local**:
   ```env
   DATABASE_URL=postgresql://username:password@host.neon.tech/database?sslmode=require
   ```
5. **Run the setup**:
   ```bash
   npm run db:push
   npm run db:seed-postgres
   npm run dev
   ```

## 🎉 Features

### 🛍️ E-commerce Core
- **Product Catalog**: Browse products by category
- **Shopping Cart**: Add/remove items, quantity management
- **Checkout**: Complete order processing
- **User Authentication**: Secure login/register

### 📊 Database Features
- **PostgreSQL Schema**: 15 tables for complete e-commerce
- **SQLite Alternative**: Instant local development
- **Easy Switching**: Switch between databases with one command
- **Sample Data**: Pre-loaded products and categories

### 🔧 Developer Tools
- **Database Studio**: Visual database management
- **Migration Scripts**: Easy database setup
- **Type Safety**: Full TypeScript integration
- **Hot Reload**: Next.js development server

## 📋 Available Commands

### Database Management
```bash
# Test PostgreSQL connection
npm run postgres:test

# Switch to PostgreSQL
npm run db:switch-postgres

# Switch to SQLite  
npm run db:switch-sqlite

# Setup database schema
npm run db:push

# Seed with sample data
npm run db:seed-postgres    # For PostgreSQL
npm run db:seed             # For SQLite

# Open database studio
npm run db:studio

# Reset database (push + seed)
npm run db:reset
```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### PostgreSQL Setup
```bash
# Show setup options
npm run postgres:setup

# Install via Docker (if available)
npm run postgres:docker-setup

# Install via Windows Package Manager (if available)
npm run postgres:winget-setup
```

## 🗂️ Project Structure

```
tfmshop.com/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (products, cart, orders)
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart page
│   └── products/          # Product pages
├── lib/
│   ├── db/               # Database configurations
│   │   ├── schema.ts         # SQLite schema
│   │   ├── schema-postgres.ts # PostgreSQL schema
│   │   ├── postgres.ts       # PostgreSQL utilities
│   │   └── seed-postgres.ts  # PostgreSQL seed data
│   └── auth.ts           # NextAuth configuration
├── scripts/              # Database utilities
│   ├── switch-db.ts        # Database switcher
│   ├── postgres-setup.ts   # PostgreSQL setup assistant
│   └── test-postgres.ts    # Connection tester
└── project/              # Frontend components (Vite)
    └── src/components/   # UI components
```

## 🔍 Database Schemas

### PostgreSQL Schema (Current)
- **Products**: Product catalog with categories, pricing, inventory
- **Users**: User authentication and profiles
- **Cart**: Shopping cart functionality
- **Orders**: Order processing and history
- **Reviews**: Product reviews and ratings
- **Wishlist**: User wishlist management
- **Coupons**: Discount codes and promotions
- **Inventory**: Stock management
- **Shipping**: Shipping rates and options

### SQLite Schema (Alternative)
- Simplified version for local development
- Same core functionality, different column naming

## 🐛 Troubleshooting

### Database Issues
```bash
# Test connection
npm run postgres:test

# Check schema
npm run db:studio

# Reset database
npm run db:reset
```

### Development Issues
```bash
# Clear cache and restart
rm -rf .next node_modules
npm install
npm run dev
```

## 📚 Documentation

- **[POSTGRESQL_SETUP.md](./POSTGRESQL_SETUP.md)**: Detailed PostgreSQL setup guide
- **[README.md](./README.md)**: This file - project overview
- **API Documentation**: Available at `/api` routes when running

## 🌟 Getting Started

1. **Choose your database** (PostgreSQL recommended):
   ```bash
   npm run postgres:test  # Shows setup options
   ```

2. **Set up the database**:
   ```bash
   npm run db:push
   npm run db:seed-postgres
   ```

3. **Start developing**:
   ```bash
   npm run dev
   ```

4. **Visit your store**: [http://localhost:3000](http://localhost:3000)

## 💡 Pro Tips

- **Free Tier**: Neon offers 1GB storage + 100 hours compute monthly (perfect for development)
- **Local Development**: SQLite works great for quick local testing
- **Database Studio**: Use `npm run db:studio` to visually manage your data
- **Type Safety**: All database operations are fully typed with TypeScript
- **Hot Reload**: Changes reflect immediately in development mode

---

**Ready to continue?** Run `npm run postgres:test` to see your database setup options! 🚀
