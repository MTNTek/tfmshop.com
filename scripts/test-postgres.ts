#!/usr/bin/env node
/**
 * PostgreSQL Connection Test
 * Tests if PostgreSQL is available and accessible
 */

import postgres from 'postgres';

async function testConnection() {
  console.log('🔍 Testing PostgreSQL connection...\n');

  // Test local PostgreSQL
  const localUrl = 'postgresql://postgres:password@localhost:5432/tfmshop';
  console.log('Testing local PostgreSQL connection...');
  
  try {
    const sql = postgres(localUrl, { max: 1 });
    await sql`SELECT 1 as test`;
    await sql.end();
    
    console.log('✅ Local PostgreSQL is available!');
    console.log(`   Connection: ${localUrl}`);
    console.log('\nNext steps:');
    console.log('1. Run: npm run db:push');
    console.log('2. Run: npm run db:seed-postgres');
    console.log('3. Run: npm run dev');
    return true;
  } catch (error) {
    console.log('❌ Local PostgreSQL not available');
    console.log(`   Error: ${error.message}\n`);
  }

  // If local fails, provide cloud setup instructions
  console.log('💡 Recommended: Set up a cloud PostgreSQL database\n');
  
  console.log('🌟 **Neon (Recommended - Free Tier)**');
  console.log('   1. Go to: https://neon.tech');
  console.log('   2. Sign up and create a project');
  console.log('   3. Copy the connection string');
  console.log('   4. Update .env.local with: DATABASE_URL=<your-connection-string>');
  console.log('   5. Run: npm run db:push && npm run db:seed-postgres\n');

  console.log('🔄 **Supabase (Alternative - Free Tier)**');
  console.log('   1. Go to: https://supabase.com');
  console.log('   2. Sign up and create a project'); 
  console.log('   3. Go to Settings > Database');
  console.log('   4. Copy the connection pooling URL');
  console.log('   5. Update .env.local with: DATABASE_URL=<your-connection-string>');
  console.log('   6. Run: npm run db:push && npm run db:seed-postgres\n');

  console.log('📖 For more options, see: POSTGRESQL_SETUP.md');
  
  return false;
}

testConnection().catch(console.error);
