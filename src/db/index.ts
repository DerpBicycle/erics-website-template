import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

/**
 * Database Connection
 * ===================
 * Singleton pattern with connection pooling for production use.
 *
 * Usage:
 *   import { db } from '@/db'
 *   const users = await db.query.users.findMany()
 */

// Global singleton to prevent multiple connections in development
declare global {
  // eslint-disable-next-line no-var
  var database: ReturnType<typeof drizzle<typeof schema>> | undefined
}

function createDatabase() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  // Create PostgreSQL connection with connection pooling
  const client = postgres(connectionString, {
    max: 10, // Maximum connections in pool
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 10, // Connection timeout in seconds
  })

  return drizzle(client, { schema })
}

// Use singleton pattern to reuse connection across hot reloads
export const db = globalThis.database ?? createDatabase()

if (process.env.NODE_ENV !== 'production') {
  globalThis.database = db
}

// Re-export schema for convenience
export * from './schema'
