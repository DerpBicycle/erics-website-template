import { pgTable, text, timestamp, uuid, boolean, jsonb } from 'drizzle-orm/pg-core'

/**
 * Database Schema
 * ===============
 * Define your database tables here using Drizzle ORM.
 *
 * Commands:
 *   bun run db:push     - Push schema changes to database
 *   bun run db:studio   - Open Drizzle Studio
 *   bun run db:generate - Generate migrations
 *
 * See: https://orm.drizzle.team/docs/sql-schema-declaration
 */

// Example: Users table (if not using Supabase Auth)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Example: Posts table
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: uuid('author_id').references(() => users.id),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content'),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Type exports for use in your application
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
