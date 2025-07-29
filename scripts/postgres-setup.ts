#!/usr/bin/env node
/**
 * PostgreSQL Setup Assistant
 * Helps set up PostgreSQL for the TFM Shop application
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, writeFileSync } from 'fs';

const execAsync = promisify(exec);

async function checkCommand(command: string): Promise<boolean> {
  try {
    await execAsync(`${command} --version`);
    return true;
  } catch {
    return false;
  }
}

async function setupPostgreSQL() {
  console.log('🐘 PostgreSQL Setup Assistant for TFM Shop\n');

  // Check what's available
  const hasDocker = await checkCommand('docker');
  const hasChoco = await checkCommand('choco');
  const hasScoop = await checkCommand('scoop');
  const hasWinget = await checkCommand('winget');

  console.log('📋 Available Installation Options:\n');

  if (hasDocker) {
    console.log('✅ Docker (Recommended)');
    console.log('   Command: docker run --name tfmshop-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=tfmshop -p 5432:5432 -d postgres:15\n');
  } else {
    console.log('❌ Docker (Not installed)');
    console.log('   Install from: https://docs.docker.com/desktop/install/windows/\n');
  }

  if (hasChoco) {
    console.log('✅ Chocolatey');
    console.log('   Command: choco install postgresql\n');
  } else {
    console.log('❌ Chocolatey (Not installed)');
    console.log('   Install from: https://chocolatey.org/install\n');
  }

  if (hasScoop) {
    console.log('✅ Scoop');
    console.log('   Command: scoop install postgresql\n');
  } else {
    console.log('❌ Scoop (Not installed)');
    console.log('   Install from: https://scoop.sh/\n');
  }

  if (hasWinget) {
    console.log('✅ Windows Package Manager');
    console.log('   Command: winget install PostgreSQL.PostgreSQL\n');
  } else {
    console.log('❌ Windows Package Manager (Not available)');
  }

  console.log('🌐 Cloud Options (No local installation required):\n');
  console.log('1. Neon (Free tier): https://neon.tech');
  console.log('   - 1 database, 1GB storage, 100 hours compute time per month');
  console.log('   - Connection string format: postgresql://user:pass@host/db?sslmode=require\n');

  console.log('2. Supabase (Free tier): https://supabase.com');
  console.log('   - 500MB database, 2GB bandwidth per month');
  console.log('   - Connection string format: postgresql://postgres.xxx:pass@xxx.pooler.supabase.com:5432/postgres\n');

  console.log('3. Render (Free tier): https://render.com');
  console.log('   - 1GB storage, expires after 90 days of inactivity');
  console.log('   - Connection string format: postgresql://user:pass@host:port/db\n');

  console.log('📝 Manual Setup Instructions:\n');
  console.log('1. Choose one of the options above');
  console.log('2. Update your .env.local file with the DATABASE_URL');
  console.log('3. Run: npm run db:switch-postgres');
  console.log('4. Run: npm run db:push');
  console.log('5. Run: npm run db:seed-postgres');
  console.log('6. Run: npm run dev\n');

  // Attempt automatic setup if possible
  if (hasDocker) {
    console.log('🚀 Would you like me to try setting up PostgreSQL with Docker?');
    console.log('   This will run: docker run --name tfmshop-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=tfmshop -p 5432:5432 -d postgres:15');
    console.log('\n   To proceed, run: npm run postgres:docker-setup');
  } else if (hasWinget) {
    console.log('🚀 Would you like me to try installing PostgreSQL with Windows Package Manager?');
    console.log('   This will run: winget install PostgreSQL.PostgreSQL');
    console.log('\n   To proceed, run: npm run postgres:winget-setup');
  }

  console.log('\n💡 For fastest setup, I recommend using a cloud provider like Neon or Supabase.');
}

setupPostgreSQL().catch(console.error);
