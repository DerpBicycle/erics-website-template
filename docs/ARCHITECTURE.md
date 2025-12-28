# Architecture Documentation

A detailed explanation of the erics-website-template architecture, structure, and design patterns.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Component Patterns](#component-patterns)
- [Routing Architecture](#routing-architecture)
- [State Management](#state-management)
- [Database Layer](#database-layer)
- [API Integration](#api-integration)
- [Styling Architecture](#styling-architecture)
- [Deployment Architecture](#deployment-architecture)

## Overview

This template is built on **Next.js 16 App Router** with **React 19** and follows modern best practices for building performant, maintainable web applications.

### Design Philosophy

1. **Convention over Configuration** - Sensible defaults with escape hatches
2. **Type Safety First** - TypeScript everywhere with strict mode
3. **Component Composition** - Small, reusable components following shadcn patterns
4. **Separation of Concerns** - Clear boundaries between UI, logic, and data
5. **Progressive Enhancement** - Works without JavaScript, enhanced with it

### Reference Implementation

This template is based on **gamejobs.be**, a production job board that demonstrates:

- Multi-language support with AI translation
- Passwordless authentication via magic links
- Supabase integration with Drizzle ORM
- Coolify deployment
- Email notification system
- Form persistence and auto-save

## Technology Stack

### Core Framework

- **Next.js 16** - React framework with App Router and Turbopack
- **React 19** - UI library with Server Components
- **TypeScript 5.8** - Type safety and developer experience

### Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **clsx + tailwind-merge** - Conditional class merging

### UI Components

- **shadcn/ui** - Unstyled, accessible components built on Radix UI
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### Data Layer

- **Drizzle ORM** - TypeScript ORM for SQL databases
- **Supabase** - PostgreSQL database and backend services
- **Zod** - Schema validation and type inference

### Forms & Validation

- **React Hook Form** - Performant form state management
- **@hookform/resolvers** - Zod integration for validation
- **Zod** - Runtime validation and type safety

### Development Tools

- **ESLint 9** - Code linting
- **Prettier** - Code formatting with Tailwind plugin
- **Vitest** - Unit testing framework
- **Testing Library** - Component testing utilities

## Folder Structure

### Complete Structure

```
erics-website-template/
├── src/
│   ├── app/                    # Next.js App Router (file-based routing)
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Homepage (/)
│   │   ├── api/                # API routes
│   │   │   └── health/         # Health check endpoint
│   │   └── [feature]/          # Feature-based routes
│   │
│   ├── components/
│   │   ├── ui/                 # Generic, reusable UI components
│   │   │   ├── button.tsx      # shadcn-style components
│   │   │   ├── card.tsx
│   │   │   └── ...             # Other UI primitives
│   │   │
│   │   └── features/           # Feature-specific components
│   │       ├── hero.tsx        # Landing page hero
│   │       └── nav.tsx         # Navigation
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useApi.ts           # API fetching hook
│   │   ├── useMediaQuery.ts    # Responsive design hook
│   │   └── useFormPersistence.ts # Form auto-save hook
│   │
│   ├── lib/                    # Utilities and helpers
│   │   ├── utils.ts            # cn() helper and utilities
│   │   ├── logger.ts           # Production-safe logging
│   │   └── api.ts              # API client setup
│   │
│   ├── db/                     # Database layer (optional)
│   │   ├── schema.ts           # Drizzle ORM schema
│   │   ├── index.ts            # Database connection
│   │   └── queries.ts          # Reusable queries
│   │
│   ├── contexts/               # React contexts (optional)
│   │   └── LanguageContext.tsx # i18n context example
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── index.ts            # Shared types
│   │   └── api.ts              # API response types
│   │
│   ├── config/                 # Application configuration
│   │   └── site.ts             # Site metadata, navigation
│   │
│   └── styles/                 # Global styles
│       └── tailwind.css        # Tailwind imports and theme
│
├── public/                     # Static assets
│   ├── images/                 # Images
│   ├── fonts/                  # Custom fonts
│   └── favicon.ico             # Favicon
│
├── docs/                       # Documentation
│   ├── SETUP.md                # Setup guide
│   ├── ARCHITECTURE.md         # This file
│   ├── PATTERNS.md             # Code patterns
│   ├── DATABASE.md             # Database guide
│   ├── DEPLOYMENT.md           # Deployment guide
│   ├── CUSTOMIZE.md            # Customization guide
│   └── FUTURE-MONOREPO.md      # Monorepo migration
│
├── .env.example                # Environment variables template
├── .env.local                  # Local env vars (git-ignored)
├── next.config.mjs             # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind configuration
├── prettier.config.js          # Prettier configuration
├── .eslintrc.json              # ESLint configuration
└── package.json                # Dependencies and scripts
```

### Directory Purposes

#### `src/app/` - Next.js App Router

The `app` directory uses Next.js file-based routing:

- `layout.tsx` - Wraps pages with shared UI (header, footer)
- `page.tsx` - Route component (e.g., `app/about/page.tsx` → `/about`)
- `loading.tsx` - Loading UI while page loads
- `error.tsx` - Error boundary for error handling
- `not-found.tsx` - 404 page
- `api/` - API routes for backend functionality

**Example structure:**

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # / (homepage)
├── about/
│   └── page.tsx        # /about
├── blog/
│   ├── page.tsx        # /blog (list)
│   └── [slug]/
│       └── page.tsx    # /blog/my-post (dynamic)
└── api/
    └── posts/
        └── route.ts    # /api/posts (API endpoint)
```

#### `src/components/` - React Components

**ui/** - Generic, reusable components:

- Built using shadcn/ui patterns
- Accepts props for customization
- No business logic
- Fully typed with TypeScript
- Examples: Button, Card, Input, Dialog

**features/** - Feature-specific components:

- Contains business logic
- May use multiple UI components
- Can fetch data or manage state
- Examples: Hero, Navigation, ContactForm

#### `src/hooks/` - Custom Hooks

Reusable React hooks for common patterns:

- `useApi` - Fetch data from APIs
- `useMediaQuery` - Responsive breakpoints
- `useFormPersistence` - localStorage auto-save
- `useDebounce` - Debounce input values

#### `src/lib/` - Utilities

Helper functions and shared logic:

- `utils.ts` - The `cn()` helper for class merging
- `logger.ts` - Production-safe logging
- `api.ts` - API client configuration
- `validations.ts` - Shared validation schemas

#### `src/db/` - Database Layer

Database schema and queries (see [DATABASE.md](./DATABASE.md)):

- `schema.ts` - Drizzle ORM table definitions
- `index.ts` - Database connection
- `queries.ts` - Reusable database queries

#### `src/types/` - TypeScript Types

Shared type definitions:

- API response types
- Database model types
- Component prop types
- Utility types

## Component Patterns

### shadcn/ui Pattern

All UI components follow the shadcn/ui pattern:

```typescript
// src/components/ui/button.tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
```

**Key characteristics:**

- Class Variance Authority (CVA) for variant management
- `cn()` helper for conditional classes
- Radix UI's `Slot` for composition
- Full TypeScript typing
- forwardRef for ref forwarding

### Feature Component Pattern

```typescript
// src/components/features/contact-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFormPersistence } from '@/hooks/useFormPersistence'

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})

type FormData = z.infer<typeof formSchema>

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  // Auto-save form to localStorage
  const { clearSavedData } = useFormPersistence({
    watch: form.watch,
    setValue: form.setValue,
    storageKey: 'contact-form',
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        form.reset()
        clearSavedData()
        // Show success message
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
```

## Routing Architecture

### File-Based Routing

Next.js App Router uses the file system for routes:

```
app/
├── page.tsx                    # / (home)
├── about/page.tsx              # /about
├── blog/
│   ├── page.tsx                # /blog
│   └── [slug]/page.tsx         # /blog/:slug
├── dashboard/
│   ├── layout.tsx              # Dashboard layout
│   ├── page.tsx                # /dashboard
│   └── settings/page.tsx       # /dashboard/settings
└── api/
    └── posts/route.ts          # /api/posts
```

### Route Groups

Organize routes without affecting URL structure:

```
app/
├── (marketing)/
│   ├── layout.tsx              # Marketing layout
│   ├── page.tsx                # /
│   └── about/page.tsx          # /about
└── (app)/
    ├── layout.tsx              # App layout
    └── dashboard/page.tsx      # /dashboard
```

### Dynamic Routes

Create dynamic routes with brackets:

```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <article>Post: {params.slug}</article>
}

// Generates: /blog/my-first-post, /blog/another-post, etc.
```

### API Routes

Create backend endpoints with `route.ts`:

```typescript
// app/api/posts/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = await db.select().from(posts)
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const body = await request.json()
  // Create post
  return NextResponse.json({ success: true })
}
```

## State Management

### Local State (useState)

For component-specific state:

```typescript
const [count, setCount] = useState(0)
```

### Form State (React Hook Form)

For forms:

```typescript
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { ... },
})
```

### Context (React Context)

For sharing state across components:

```typescript
// src/contexts/LanguageContext.tsx
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
```

### Global State (Zustand) - Optional

For complex global state:

```typescript
import { create } from 'zustand'

interface AppState {
  user: User | null
  setUser: (user: User | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

## Database Layer

See [DATABASE.md](./DATABASE.md) for full details.

### Schema Definition

```typescript
// src/db/schema.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
```

### Database Queries

```typescript
// src/db/queries.ts
import { db } from './index'
import { posts } from './schema'

export async function getPosts() {
  return db.select().from(posts).orderBy(posts.createdAt)
}

export async function getPostBySlug(slug: string) {
  return db.select().from(posts).where(eq(posts.slug, slug)).limit(1)
}
```

## API Integration

### Client-Side API Calls

```typescript
// src/hooks/useApi.ts
export function useApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [endpoint])

  return { data, loading, error }
}
```

### Server-Side Data Fetching

```typescript
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  return <div>{/* Render posts */}</div>
}
```

## Styling Architecture

### Tailwind CSS 4

Uses the new CSS-first configuration:

```css
/* src/styles/tailwind.css */
@import 'tailwindcss';

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;

  --font-sans: 'Inter', system-ui, sans-serif;
}
```

### Class Merging with cn()

```typescript
import { cn } from '@/lib/utils'

<div className={cn('base-class', isActive && 'active-class', className)} />
```

### Component Variants with CVA

```typescript
import { cva } from 'class-variance-authority'

const buttonVariants = cva('base-styles', {
  variants: {
    variant: {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-500',
    },
    size: {
      sm: 'text-sm',
      lg: 'text-lg',
    },
  },
})
```

## Deployment Architecture

### Build Process

1. **Dependencies** - Install packages
2. **Type Check** - Verify TypeScript
3. **Build** - Next.js production build with Turbopack
4. **Optimize** - Static optimization and code splitting

### Docker Deployment

Multi-stage Dockerfile for minimal image size:

```dockerfile
FROM node:24-alpine AS deps
COPY package*.json ./
RUN npm ci

FROM node:24-alpine AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-alpine AS runner
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

### Coolify Integration

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete details.

Key features:

- Automatic deployments from Git
- Environment variable management
- Health checks
- Zero-downtime deployments
- Rollback support

---

This architecture provides a solid foundation for building scalable, maintainable web applications while remaining flexible enough to adapt to specific project needs.
