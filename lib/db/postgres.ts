import { db } from './schema-postgres';
import * as schema from './schema-postgres';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';

// Re-export everything for easy imports
export { db };
export * from './schema-postgres';

// Database utility functions
export class DatabaseError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export async function withTransaction<T>(
  callback: (tx: PgTransaction<PostgresJsQueryResultHKT, Record<string, never>, any>) => Promise<T>
): Promise<T> {
  try {
    return await db.transaction(callback);
  } catch (error) {
    throw new DatabaseError('Transaction failed', error);
  }
}

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.select().from(schema.products).limit(1);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
