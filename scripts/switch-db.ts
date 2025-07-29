#!/usr/bin/env node
/**
 * Database Connection Switcher
 * Switches between SQLite and PostgreSQL configurations
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_CONFIGS = {
  sqlite: {
    envVar: 'DATABASE_URL=file:./dev.db',
    schemaPath: './lib/db/schema-sqlite.ts',
    description: 'SQLite (Local file database)'
  },
  postgres: {
    envVar: 'DATABASE_URL=postgresql://postgres:password@localhost:5432/tfmshop',
    schemaPath: './lib/db/schema-postgres.ts', 
    description: 'PostgreSQL (Server database)'
  }
};

function updateEnvFile(dbType: 'sqlite' | 'postgres') {
  const envPath = join(process.cwd(), '.env.local');
  const config = DB_CONFIGS[dbType];
  
  let envContent = '';
  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, 'utf-8');
  }
  
  // Remove existing DATABASE_URL
  envContent = envContent.replace(/^DATABASE_URL=.*$/m, '');
  
  // Add new DATABASE_URL
  if (!envContent.includes(config.envVar)) {
    envContent = envContent.trim() + '\n' + config.envVar + '\n';
  }
  
  writeFileSync(envPath, envContent);
  console.log(`✅ Updated .env.local for ${config.description}`);
}

function updateDrizzleConfig(dbType: 'sqlite' | 'postgres') {
  const configPath = join(process.cwd(), 'drizzle.config.ts');
  const config = DB_CONFIGS[dbType];
  
  let configContent = readFileSync(configPath, 'utf-8');
  
  // Update schema path
  configContent = configContent.replace(
    /schema: '\.\/lib\/db\/schema[^']*'/,
    `schema: '${config.schemaPath}'`
  );
  
  // Update dialect
  if (dbType === 'sqlite') {
    configContent = configContent.replace(/dialect: 'postgresql'/, "dialect: 'sqlite'");
  } else {
    configContent = configContent.replace(/dialect: 'sqlite'/, "dialect: 'postgresql'");
  }
  
  writeFileSync(configPath, configContent);
  console.log(`✅ Updated drizzle.config.ts for ${config.description}`);
}

function switchDatabase(dbType: 'sqlite' | 'postgres') {
  if (!DB_CONFIGS[dbType]) {
    console.error('❌ Invalid database type. Use "sqlite" or "postgres"');
    process.exit(1);
  }
  
  console.log(`🔄 Switching to ${DB_CONFIGS[dbType].description}...`);
  
  updateEnvFile(dbType);
  updateDrizzleConfig(dbType);
  
  console.log(`\n🎉 Successfully switched to ${DB_CONFIGS[dbType].description}!`);
  console.log('\nNext steps:');
  if (dbType === 'postgres') {
    console.log('1. Ensure PostgreSQL is running (see POSTGRESQL_SETUP.md)');
    console.log('2. Run: npm run db:push');
    console.log('3. Run: npm run db:seed-postgres');
  } else {
    console.log('1. Run: npm run db:push');
    console.log('2. Run: npm run db:seed');
  }
  console.log('4. Run: npm run dev');
}

// CLI usage
const dbType = process.argv[2] as 'sqlite' | 'postgres';

if (!dbType) {
  console.log('Usage: tsx scripts/switch-db.ts <sqlite|postgres>');
  console.log('\nAvailable options:');
  Object.entries(DB_CONFIGS).forEach(([key, config]) => {
    console.log(`  ${key}: ${config.description}`);
  });
  process.exit(1);
}

switchDatabase(dbType);
