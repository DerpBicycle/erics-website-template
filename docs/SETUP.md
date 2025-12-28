# Setup Guide

A comprehensive guide to setting up a new website using the erics-website-template.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Connection](#database-connection)
- [First-Time Customization](#first-time-customization)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** and npm
- **Git** for version control
- **PostgreSQL 14+** (for database-backed sites)
- A code editor (VS Code, Cursor, or similar)

Optional but recommended:

- **Supabase account** (for shared database across multiple sites)
- **Coolify account** (for deployment)

## Installation

### 1. Clone or Copy the Template

```bash
# Option A: Clone from repository
git clone https://github.com/your-username/erics-website-template.git my-new-site
cd my-new-site

# Option B: Use GitHub's "Use this template" button
# Then clone your new repository
```

### 2. Remove Existing Git History (Optional)

If you want to start fresh with a new git repository:

```bash
rm -rf .git
git init
git add .
git commit -m "Initial commit from erics-website-template"
```

### 3. Install Dependencies

```bash
npm install
```

This will install all required packages including:

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Drizzle ORM
- Supabase client
- shadcn/ui components
- Framer Motion

### 4. Verify Installation

```bash
npm run dev
```

Visit `http://localhost:3000` to see the template running with default content.

## Environment Setup

### 1. Create Environment File

```bash
cp .env.example .env.local
```

### 2. Configure Basic Variables

Edit `.env.local` with your site's information:

```bash
# ===================================
# App Configuration
# ===================================

NEXT_PUBLIC_APP_NAME="My Awesome Site"
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production URL (for emails, absolute links, etc.)
PRODUCTION_SITE_URL=https://mysite.com
```

### 3. Add Site-Specific Variables

Depending on your needs, add additional configuration:

```bash
# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# External APIs (optional)
API_KEY=your-api-key
API_SECRET=your-api-secret
```

## Database Connection

### Option 1: Shared Supabase Database (Recommended)

This approach allows multiple sites to share a single PostgreSQL database using Drizzle ORM and row-level security.

#### 1. Create Supabase Project (or use existing)

```bash
# If creating a new project:
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Note your project URL and anon key
```

#### 2. Configure Environment Variables

```bash
# Database
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Supabase (optional, for additional features)
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### 3. Set Up Database Schema

```bash
# Create your database schema in src/db/schema.ts
# Then generate and push to database
npm run db:push
```

For detailed database setup, see [DATABASE.md](./DATABASE.md).

### Option 2: Local PostgreSQL (Development Only)

#### 1. Install PostgreSQL

```bash
# macOS with Homebrew
brew install postgresql@14
brew services start postgresql@14

# Or use Docker
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:14
```

#### 2. Create Database

```bash
psql postgres
CREATE DATABASE mysite;
\q
```

#### 3. Configure Environment

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mysite
```

### Option 3: No Database (Static Sites)

If you don't need a database:

1. Skip database setup entirely
2. Remove database-related dependencies if desired
3. Delete or ignore `src/db/` directory

## First-Time Customization

### 1. Update Package Information

Edit `package.json`:

```json
{
  "name": "my-new-site",
  "version": "1.0.0",
  "description": "My awesome new site"
}
```

### 2. Update Site Metadata

Edit `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'My Site Name',
  description: 'A brief description of my site',
  // Add other metadata as needed
}
```

### 3. Customize Tailwind Theme

Edit `src/styles/tailwind.css` for your brand colors:

```css
@import 'tailwindcss';

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
}
```

### 4. Replace Homepage Content

Edit `src/app/page.tsx` with your landing page content:

```typescript
export default function HomePage() {
  return (
    <main>
      <h1>Welcome to My Site</h1>
      {/* Your content here */}
    </main>
  )
}
```

For detailed customization options, see [CUSTOMIZE.md](./CUSTOMIZE.md).

## Development Workflow

### Start Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:3000` with hot-reload enabled.

### Run Linting

```bash
npm run lint
```

Fix linting issues automatically:

```bash
npm run lint -- --fix
```

### Format Code

```bash
npm run format
```

### Run Tests

```bash
npm run test        # Run once
npm run test:ui     # Open test UI
```

### Build for Production

```bash
npm run build
npm run start       # Test production build locally
```

## Troubleshooting

### Common Issues

#### Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port
PORT=3001 npm run dev

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill
```

#### Database Connection Errors

```bash
# Verify DATABASE_URL is correct
echo $DATABASE_URL  # Should show connection string

# Test database connection
psql $DATABASE_URL -c "SELECT 1"
```

#### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### Getting Help

If you encounter issues:

1. Check the [ARCHITECTURE.md](./ARCHITECTURE.md) for system design details
2. Review the [PATTERNS.md](./PATTERNS.md) for code examples
3. Check the gamejobs.be reference implementation
4. Search existing issues in the repository

## Next Steps

After completing setup:

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system structure
2. Review [PATTERNS.md](./PATTERNS.md) to learn coding conventions
3. Check [CUSTOMIZE.md](./CUSTOMIZE.md) for branding and styling options
4. When ready to deploy, see [DEPLOYMENT.md](./DEPLOYMENT.md)
5. For database-backed sites, review [DATABASE.md](./DATABASE.md)

## Quick Reference

### Essential Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Check code quality
npm run format       # Format code
npm run test         # Run tests

# Database (if using)
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

### Project Structure

```
my-new-site/
├── src/
│   ├── app/                # Next.js pages and routes
│   ├── components/         # React components
│   │   ├── ui/            # Generic UI components
│   │   └── features/      # Feature-specific components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and helpers
│   ├── db/                # Database schema (optional)
│   ├── types/             # TypeScript types
│   └── styles/            # Global styles
├── public/                # Static assets
├── .env.local            # Environment variables (git-ignored)
└── docs/                 # Documentation
```

### Key Files

- `src/app/layout.tsx` - Root layout and metadata
- `src/app/page.tsx` - Homepage
- `src/lib/utils.ts` - Utility functions (cn helper)
- `src/styles/tailwind.css` - Tailwind configuration
- `src/db/schema.ts` - Database schema (if using)
- `next.config.mjs` - Next.js configuration

---

**Congratulations!** Your site is now set up and ready for development.
