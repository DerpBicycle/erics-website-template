# Database Guide

A comprehensive guide to setting up and using databases with this template, including Supabase and Drizzle ORM.

## Table of Contents

- [Overview](#overview)
- [Shared Database Concept](#shared-database-concept)
- [Supabase Setup](#supabase-setup)
- [Drizzle ORM Setup](#drizzle-orm-setup)
- [Connection Pooling](#connection-pooling)
- [Schema Management](#schema-management)
- [Migrations](#migrations)
- [Seeding Data](#seeding-data)
- [Querying Data](#querying-data)
- [Best Practices](#best-practices)

## Overview

This template supports multiple database approaches:

1. **Supabase** - Recommended for shared database across multiple sites
2. **PostgreSQL** - Direct PostgreSQL connection
3. **No Database** - For static sites or API-backed sites

### Technology Stack

- **Drizzle ORM** - Type-safe TypeScript ORM
- **PostgreSQL** - Relational database
- **Supabase** - PostgreSQL hosting with additional features
- **Zod** - Runtime validation for data

## Shared Database Concept

### Why Shared Database?

One of the key features of this template is support for **multiple sites sharing a single database**:

```
┌─────────────────┐
│   gamejobs.be   │─┐
└─────────────────┘ │
                    │
┌─────────────────┐ │    ┌──────────────────┐
│ gameindustry.be │─┼───▶│  Shared Supabase │
└─────────────────┘ │    │    PostgreSQL    │
                    │    └──────────────────┘
┌─────────────────┐ │
│  yoursite.com   │─┘
└─────────────────┘
```

**Benefits:**

- **Cost-effective** - One database instance for multiple sites
- **Data sharing** - Sites can reference shared data (e.g., companies)
- **Centralized management** - Single backup/monitoring setup
- **Row-level security** - Supabase RLS isolates site data

### Implementation Strategy

Use a **site identifier** in your tables:

```typescript
// src/db/schema.ts
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  siteId: text('site_id').notNull(), // 'gamejobs', 'gameindustry', etc.
  title: text('title').notNull(),
  content: text('content').notNull(),
})
```

**Query with site isolation:**

```typescript
const posts = await db
  .select()
  .from(posts)
  .where(eq(posts.siteId, 'mysite'))
```

### Row-Level Security (RLS)

Supabase allows database-level security:

```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read posts for their site
CREATE POLICY "Site isolation" ON posts
  FOR SELECT
  USING (site_id = current_setting('app.site_id')::text);
```

Set site ID at connection time:

```typescript
await db.execute(sql`SET app.site_id = 'mysite'`)
```

## Supabase Setup

### 1. Create Supabase Project

**New Project:**

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **New Project**
4. Choose organization
5. Enter project details:
   - **Name**: My Project
   - **Database Password**: Generate strong password
   - **Region**: Choose closest to your users
6. Click **Create Project**

**Existing Project:**

Use an existing project to share database across sites.

### 2. Get Connection Details

Navigate to **Project Settings → Database**:

```bash
# Connection string (for Drizzle ORM)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Connection pooling (recommended for serverless)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:6543/postgres?pgbouncer=true

# Supabase client (optional, for additional features)
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Important**: Use **Session mode** (port 5432) for migrations, **Transaction mode** (port 6543) for application queries.

### 3. Configure Environment Variables

Add to `.env.local`:

```bash
# Database
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Optional: Supabase client
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key  # For admin operations
```

### 4. Initialize Supabase Client (Optional)

If using Supabase features beyond PostgreSQL:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Note**: For most use cases, Drizzle ORM is sufficient. Use Supabase client for:

- Authentication
- Storage (file uploads)
- Realtime subscriptions
- Edge functions

## Drizzle ORM Setup

### 1. Install Dependencies

Already included in template:

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### 2. Create Drizzle Configuration

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

### 3. Define Database Schema

```typescript
// src/db/schema.ts
import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  siteId: text('site_id').notNull().default('default'),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Export type for TypeScript
export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
```

### 4. Create Database Connection

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!

// Disable prefetch for compatibility with Supabase
const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
```

### 5. Add Scripts to package.json

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Connection Pooling

### Why Connection Pooling?

Serverless environments (Vercel, Netlify, Coolify) create new connections per request. Connection pooling prevents exhausting database connections.

### Supabase Connection Pooling

Supabase provides **PgBouncer** for connection pooling:

```bash
# Transaction mode (port 6543) - For application queries
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:6543/postgres?pgbouncer=true

# Session mode (port 5432) - For migrations
DATABASE_URL_UNPOOLED=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

**Usage:**

```typescript
// Use pooled connection for queries
const client = postgres(process.env.DATABASE_URL!, { prepare: false })

// Use unpooled for migrations
const migrationClient = postgres(process.env.DATABASE_URL_UNPOOLED!)
```

### Configure Connection Limits

```typescript
const client = postgres(connectionString, {
  prepare: false,
  max: 10, // Maximum connections
  idle_timeout: 20, // Close idle connections after 20s
  connect_timeout: 10, // Timeout connection after 10s
})
```

## Schema Management

### Defining Tables

Use Drizzle schema builders:

```typescript
import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
} from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    // Indexes for performance
    emailIdx: index('email_idx').on(table.email),
  })
)

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id').references(() => users.id),
  title: text('title').notNull(),
  content: text('content'),
  metadata: jsonb('metadata'), // Store JSON data
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})
```

### Relationships

```typescript
import { relations } from 'drizzle-orm'

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))
```

### Enums

```typescript
import { pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['admin', 'user', 'guest'])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  role: roleEnum('role').default('user'),
})
```

## Migrations

### Strategy: SQL Migrations (Recommended)

Based on gamejobs.be experience, **manual SQL migrations are more reliable** than ORM-generated migrations.

#### 1. Create Migration Directory

```bash
mkdir -p supabase/migrations
```

#### 2. Create Migration Files

Name files with incremental numbers:

```bash
supabase/migrations/
├── 001_initial_schema.sql
├── 002_add_users_table.sql
└── 003_add_posts_table.sql
```

#### 3. Write Migration SQL

```sql
-- supabase/migrations/001_initial_schema.sql

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  site_id TEXT NOT NULL DEFAULT 'default',
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on site_id for performance
CREATE INDEX IF NOT EXISTS idx_posts_site_id ON posts(site_id);

-- Create index on slug for lookups
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Enable Row Level Security (optional)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy for site isolation
CREATE POLICY "Site isolation" ON posts
  FOR SELECT
  USING (site_id = current_setting('app.site_id', true)::text);
```

#### 4. Run Migrations in Supabase

**Option A: Supabase Dashboard (Recommended)**

1. Open Supabase dashboard
2. Navigate to **SQL Editor**
3. Create new query
4. Paste migration SQL
5. Run query
6. Repeat for each migration file

**Option B: Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref [your-project-ref]

# Run migrations
supabase db push
```

### Alternative: Drizzle Push (Development Only)

For rapid development:

```bash
# Push schema changes directly (no migration files)
npm run db:push
```

**Warning**: Use only in development. Production should use SQL migrations.

## Seeding Data

### Create Seed Script

```typescript
// scripts/seed.ts
import { db } from '../src/db'
import { posts } from '../src/db/schema'

async function seed() {
  console.log('Seeding database...')

  await db.insert(posts).values([
    {
      siteId: 'mysite',
      title: 'First Post',
      slug: 'first-post',
      content: 'This is the first post',
      published: true,
    },
    {
      siteId: 'mysite',
      title: 'Second Post',
      slug: 'second-post',
      content: 'This is the second post',
      published: false,
    },
  ])

  console.log('Seeding complete!')
}

seed()
  .catch((error) => {
    console.error('Seeding failed:', error)
    process.exit(1)
  })
  .finally(() => process.exit(0))
```

### Add Seed Script

```json
{
  "scripts": {
    "db:seed": "tsx scripts/seed.ts"
  }
}
```

### Run Seed

```bash
npm run db:seed
```

## Querying Data

### Basic Queries

```typescript
import { db } from '@/db'
import { posts } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

// Select all posts
const allPosts = await db.select().from(posts)

// Select with conditions
const publishedPosts = await db
  .select()
  .from(posts)
  .where(eq(posts.published, true))

// Select single record
const post = await db
  .select()
  .from(posts)
  .where(eq(posts.slug, 'my-post'))
  .limit(1)

// Order by
const recentPosts = await db
  .select()
  .from(posts)
  .orderBy(desc(posts.createdAt))
  .limit(10)
```

### Advanced Queries

```typescript
import { and, or, like, gt } from 'drizzle-orm'

// Multiple conditions
const results = await db
  .select()
  .from(posts)
  .where(
    and(eq(posts.siteId, 'mysite'), eq(posts.published, true))
  )

// OR conditions
const results = await db
  .select()
  .from(posts)
  .where(
    or(eq(posts.published, true), eq(posts.authorId, userId))
  )

// LIKE queries
const results = await db
  .select()
  .from(posts)
  .where(like(posts.title, '%search%'))

// Greater than
const results = await db
  .select()
  .from(posts)
  .where(gt(posts.createdAt, new Date('2024-01-01')))
```

### Joins

```typescript
import { users, posts } from '@/db/schema'

const postsWithAuthors = await db
  .select({
    post: posts,
    author: users,
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
```

### Insert

```typescript
// Insert single record
const [newPost] = await db
  .insert(posts)
  .values({
    siteId: 'mysite',
    title: 'New Post',
    slug: 'new-post',
    content: 'Content here',
  })
  .returning()

// Insert multiple records
await db.insert(posts).values([
  { title: 'Post 1', slug: 'post-1', content: 'Content 1' },
  { title: 'Post 2', slug: 'post-2', content: 'Content 2' },
])
```

### Update

```typescript
// Update with conditions
await db
  .update(posts)
  .set({ published: true, updatedAt: new Date() })
  .where(eq(posts.id, postId))

// Update with returning
const [updatedPost] = await db
  .update(posts)
  .set({ title: 'Updated Title' })
  .where(eq(posts.id, postId))
  .returning()
```

### Delete

```typescript
// Delete with conditions
await db.delete(posts).where(eq(posts.id, postId))

// Delete all (be careful!)
await db.delete(posts)
```

### Transactions

```typescript
await db.transaction(async (tx) => {
  // Insert post
  const [post] = await tx.insert(posts).values({ ... }).returning()

  // Update user
  await tx.update(users).set({ postCount: sql`post_count + 1` })
})
```

## Best Practices

### 1. Use TypeScript Types

```typescript
import { Post, NewPost } from '@/db/schema'

// Type-safe queries
const posts: Post[] = await db.select().from(posts)

// Type-safe inserts
const newPost: NewPost = {
  title: 'Title',
  slug: 'slug',
  content: 'Content',
}
await db.insert(posts).values(newPost)
```

### 2. Create Reusable Queries

```typescript
// src/db/queries.ts
export async function getPublishedPosts(siteId: string) {
  return db
    .select()
    .from(posts)
    .where(and(eq(posts.siteId, siteId), eq(posts.published, true)))
    .orderBy(desc(posts.createdAt))
}

export async function getPostBySlug(slug: string, siteId: string) {
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.siteId, siteId)))
    .limit(1)

  return post
}
```

### 3. Handle Errors Gracefully

```typescript
try {
  const post = await getPostBySlug(slug, siteId)
  if (!post) {
    throw new Error('Post not found')
  }
  return post
} catch (error) {
  logger.error('Failed to fetch post:', error)
  throw error
}
```

### 4. Use Prepared Statements

```typescript
import { placeholder } from 'drizzle-orm'

const prepared = db
  .select()
  .from(posts)
  .where(eq(posts.slug, placeholder('slug')))
  .prepare('getPostBySlug')

// Execute prepared statement
const post = await prepared.execute({ slug: 'my-post' })
```

### 5. Isolate by Site ID

```typescript
// Always filter by site ID for shared databases
const posts = await db
  .select()
  .from(posts)
  .where(eq(posts.siteId, process.env.NEXT_PUBLIC_SITE_ID))
```

### 6. Use Indexes

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_posts_site_id ON posts(site_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_created_at ON posts(created_at);
```

### 7. Validate Data

```typescript
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  content: z.string().min(10),
})

// Validate before insert
const validated = postSchema.parse(data)
await db.insert(posts).values(validated)
```

---

You now have a complete database setup with Supabase and Drizzle ORM!
