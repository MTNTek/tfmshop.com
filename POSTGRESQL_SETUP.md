# PostgreSQL Setup Guide for TFM Shop

## 🎯 Quick Start (Recommended: Cloud Database)

### Option 1: Neon (Free Tier) - RECOMMENDED ⭐
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string from the dashboard
4. Update `.env.local`:
   ```env
   DATABASE_URL=postgresql://username:password@host.neon.tech/database?sslmode=require
   ```
5. Run setup commands:
   ```bash
   npm run db:push
   npm run db:seed-postgres
   npm run dev
   ```

### Option 2: Supabase (Free Tier)
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (use the "Connection pooling" URL for better performance)
5. Update `.env.local`:
   ```env
   DATABASE_URL=postgresql://postgres.xxx:password@xxx.pooler.supabase.com:5432/postgres
   ```
6. Run setup commands:
   ```bash
   npm run db:push
   npm run db:seed-postgres
   npm run dev
   ```

## 🖥️ Local Installation Options

### Option 3: Docker (if Docker is installed)
```bash
# Install Docker Desktop first: https://docs.docker.com/desktop/install/windows/
# Then run:
docker run --name tfmshop-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=tfmshop -p 5432:5432 -d postgres:15

# Update .env.local:
DATABASE_URL=postgresql://postgres:password@localhost:5432/tfmshop

# Setup database:
npm run db:push
npm run db:seed-postgres
npm run dev
```

### Option 4: Direct Windows Installation
1. **Download PostgreSQL**: Go to [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. **Run the installer**:
   - Set password to `password` (for development)
   - Keep default port `5432`
   - Remember the installation directory
3. **Create database**:
   ```cmd
   # Open Command Prompt as Administrator
   cd "C:\Program Files\PostgreSQL\15\bin"
   createdb -U postgres tfmshop
   ```
4. **Update .env.local**:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/tfmshop
   ```
5. **Setup database**:
   ```bash
   npm run db:push
   npm run db:seed-postgres
   npm run dev
   ```

### Option 5: Using Chocolatey (if installed)
```bash
# Install Chocolatey first: https://chocolatey.org/install
choco install postgresql

# Create database
createdb -U postgres tfmshop

# Update .env.local
DATABASE_URL=postgresql://postgres:password@localhost:5432/tfmshop

# Setup database
npm run db:push
npm run db:seed-postgres
npm run dev
```

## 🔧 Database Management Commands

```bash
# Switch to PostgreSQL configuration
npm run db:switch-postgres

# Switch back to SQLite if needed
npm run db:switch-sqlite

# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed-postgres

# Open database studio
npm run db:studio

# Reset database (push + seed)
npm run db:reset
```

## 🐛 Troubleshooting

### Connection Issues
- **"database does not exist"**: Make sure to create the database first
- **"connection refused"**: Check if PostgreSQL is running
- **"authentication failed"**: Verify username/password in connection string

### Common Solutions
```bash
# Check if PostgreSQL is running (Windows)
net start postgresql-x64-15

# Restart PostgreSQL service
net stop postgresql-x64-15
net start postgresql-x64-15

# Connect to PostgreSQL directly
psql -U postgres -h localhost -p 5432
```

### Environment Variables
Make sure your `.env.local` file contains:
```env
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

## 📊 Database Schema

The PostgreSQL schema includes:
- **Products**: Product catalog with categories, pricing, inventory
- **Users**: User authentication and profiles  
- **Cart**: Shopping cart functionality
- **Orders**: Order processing and history
- **Reviews**: Product reviews and ratings
- **Wishlist**: User wishlist management
- **Coupons**: Discount codes and promotions
- **Inventory**: Stock management
- **Shipping**: Shipping rates and options

## 🔄 Migration from SQLite

If you're switching from SQLite to PostgreSQL:

1. **Backup your SQLite data** (if needed):
   ```bash
   npm run db:studio  # Export data manually
   ```

2. **Switch to PostgreSQL**:
   ```bash
   npm run db:switch-postgres
   ```

3. **Setup PostgreSQL database**:
   ```bash
   npm run db:push
   npm run db:seed-postgres
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## 💡 Pro Tips

- **Free Tier Limits**: Cloud providers offer generous free tiers perfect for development
- **Connection Pooling**: Use pooled connections for better performance (Supabase includes this)
- **SSL Mode**: Cloud databases require `sslmode=require` in the connection string
- **Local Development**: Use Docker for consistent local PostgreSQL setup
- **Backup**: Cloud providers handle backups automatically

## 🎉 Next Steps

After PostgreSQL is set up:
1. Visit [http://localhost:3000](http://localhost:3000) to see your e-commerce site
2. Browse products, add to cart, and test checkout
3. Use the admin features for inventory management
4. Explore the database with `npm run db:studio`

Need help? Check the main README.md for additional documentation.
