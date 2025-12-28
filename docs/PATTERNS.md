# Coding Patterns & Best Practices

A comprehensive guide to coding patterns, conventions, and best practices used in this template.

## Table of Contents

- [Component Patterns](#component-patterns)
- [Hook Patterns](#hook-patterns)
- [Context Patterns](#context-patterns)
- [Form Handling](#form-handling)
- [Error Handling](#error-handling)
- [Async State Management](#async-state-management)
- [API Patterns](#api-patterns)
- [Database Patterns](#database-patterns)
- [File Organization](#file-organization)
- [TypeScript Patterns](#typescript-patterns)
- [Testing Patterns](#testing-patterns)

## Component Patterns

### shadcn/ui Pattern

All UI components follow the shadcn/ui pattern for consistency and reusability.

```typescript
// src/components/ui/button.tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
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

**Key Features:**

- **CVA (Class Variance Authority)** - Type-safe variant management
- **cn() helper** - Conditional class merging
- **Radix Slot** - Composition via `asChild` prop
- **forwardRef** - Proper ref forwarding
- **TypeScript** - Full type safety

### Feature Component Pattern

Feature components contain business logic and compose UI components.

```typescript
// src/components/features/newsletter-signup.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

type FormData = z.infer<typeof schema>

export function NewsletterSignup() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to subscribe')

      toast.success('Successfully subscribed!')
      form.reset()
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="email"
        placeholder="Enter your email"
        {...form.register('email')}
        disabled={isLoading}
      />
      {form.formState.errors.email && (
        <p className="text-sm text-red-500">
          {form.formState.errors.email.message}
        </p>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  )
}
```

**Best Practices:**

- Use `'use client'` for client-side interactivity
- Separate UI components from business logic
- Handle loading and error states
- Provide user feedback (toast notifications)
- Reset form after successful submission

### Server Component Pattern

Server components fetch data on the server.

```typescript
// app/blog/page.tsx
import { db } from '@/db'
import { posts } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { PostCard } from '@/components/features/post-card'

async function getPosts() {
  return db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
```

**Best Practices:**

- Fetch data directly in server components
- No `useState` or `useEffect` needed
- Automatic request deduplication
- SEO-friendly (rendered on server)

## Hook Patterns

### useApi Pattern

Custom hook for API fetching with loading and error states.

```typescript
// src/hooks/useApi.ts
import { useState, useEffect } from 'react'

interface UseApiOptions {
  skip?: boolean
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(!options.skip)
  const [error, setError] = useState<Error | null>(null)

  const refetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error('Failed to fetch')
      const json = await response.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!options.skip) {
      refetch()
    }
  }, [endpoint, options.skip])

  return { data, loading, error, refetch }
}

// Usage
function MyComponent() {
  const { data, loading, error } = useApi<Post[]>('/api/posts')

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>{data?.map((post) => ...)}</div>
}
```

### useFormPersistence Pattern

Auto-save form data to localStorage (from gamejobs.be).

```typescript
// src/hooks/useFormPersistence.ts
import { useEffect, useRef, useMemo } from 'react'
import { UseFormWatch, UseFormSetValue, FieldValues } from 'react-hook-form'

interface UseFormPersistenceOptions<T extends FieldValues> {
  watch: UseFormWatch<T>
  setValue: UseFormSetValue<T>
  storageKey: string
  exclude?: (keyof T)[]
  onRestore?: () => void
  disabled?: boolean
}

export function useFormPersistence<T extends FieldValues>({
  watch,
  setValue,
  storageKey,
  exclude = [],
  onRestore,
  disabled = false,
}: UseFormPersistenceOptions<T>) {
  const hasRestoredRef = useRef(false)
  const isRestoringRef = useRef(false)

  // Memoize exclude list to prevent re-renders
  const excludeSet = useMemo(() => new Set(exclude), [exclude.join(',')])

  // Restore saved form data on mount
  useEffect(() => {
    if (disabled || hasRestoredRef.current) return

    try {
      const savedData = localStorage.getItem(storageKey)
      if (savedData) {
        isRestoringRef.current = true
        const parsedData = JSON.parse(savedData)

        Object.keys(parsedData).forEach((key) => {
          if (!excludeSet.has(key as keyof T)) {
            setValue(key as any, parsedData[key], { shouldValidate: false })
          }
        })

        hasRestoredRef.current = true
        isRestoringRef.current = false
        onRestore?.()
      } else {
        hasRestoredRef.current = true
      }
    } catch (error) {
      console.error('Failed to restore form data:', error)
      hasRestoredRef.current = true
      isRestoringRef.current = false
    }
  }, [setValue, storageKey, excludeSet, onRestore, disabled])

  // Save form data on every change
  useEffect(() => {
    if (disabled || !hasRestoredRef.current || isRestoringRef.current) return

    const subscription = watch((formData) => {
      try {
        const dataToSave: Record<string, any> = {}
        Object.keys(formData).forEach((key) => {
          if (!excludeSet.has(key as keyof T)) {
            dataToSave[key] = formData[key]
          }
        })
        localStorage.setItem(storageKey, JSON.stringify(dataToSave))
      } catch (error) {
        console.error('Failed to save form data:', error)
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, storageKey, excludeSet, disabled])

  const clearSavedData = () => {
    try {
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.error('Failed to clear saved form data:', error)
    }
  }

  const hasSavedData = () => {
    try {
      return localStorage.getItem(storageKey) !== null
    } catch {
      return false
    }
  }

  return { clearSavedData, hasSavedData }
}

// Usage
function ContactForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { ... },
  })

  const { clearSavedData, hasSavedData } = useFormPersistence({
    watch: form.watch,
    setValue: form.setValue,
    storageKey: 'contact-form',
    exclude: ['expiryDate'], // Don't persist certain fields
  })

  const onSubmit = async (data: FormData) => {
    // ... handle submission
    clearSavedData() // Clear draft after submission
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {hasSavedData() && (
        <button type="button" onClick={clearSavedData}>
          Clear Draft
        </button>
      )}
      {/* Form fields */}
    </form>
  )
}
```

### useDebounce Pattern

Debounce input values for search or API calls.

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// Usage
function SearchInput() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery) {
      // Fetch search results
      fetchResults(debouncedQuery)
    }
  }, [debouncedQuery])

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />
}
```

## Context Patterns

### Language Context Pattern

From gamejobs.be for multi-language support.

```typescript
// src/contexts/LanguageContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'en' | 'nl' | 'fr'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

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

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

// Usage in layout
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}

// Usage in components
function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()
  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="nl">Nederlands</option>
      <option value="fr">Français</option>
    </select>
  )
}
```

## Form Handling

### React Hook Form + Zod Pattern

Standard form handling with validation.

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms',
  }),
})

type FormData = z.infer<typeof formSchema>

function ContactForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      terms: false,
    },
  })

  const onSubmit = async (data: FormData) => {
    // Handle form submission
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('name')} />
      {form.formState.errors.name && (
        <span>{form.formState.errors.name.message}</span>
      )}

      <input {...form.register('email')} />
      {form.formState.errors.email && (
        <span>{form.formState.errors.email.message}</span>
      )}

      <textarea {...form.register('message')} />
      {form.formState.errors.message && (
        <span>{form.formState.errors.message.message}</span>
      )}

      <input type="checkbox" {...form.register('terms')} />
      {form.formState.errors.terms && (
        <span>{form.formState.errors.terms.message}</span>
      )}

      <button type="submit" disabled={form.formState.isSubmitting}>
        Submit
      </button>
    </form>
  )
}
```

### shadcn Form Components

Use shadcn form components for better DX.

```typescript
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

function ContactForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>Your email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

## Error Handling

### Try-Catch Pattern

Always handle errors gracefully.

```typescript
async function fetchData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    logger.error('Failed to fetch data:', error)
    throw error // Re-throw or handle appropriately
  }
}
```

### Error Boundaries

Create error boundaries for React errors.

```typescript
// src/components/ErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 border border-red-500 rounded">
            <h2 className="text-red-500 font-bold">Something went wrong</h2>
            <p>{this.state.error?.message}</p>
          </div>
        )
      )
    }

    return this.props.children
  }
}
```

### Production-Safe Logging

Use logger utility instead of console.log.

```typescript
// src/lib/logger.ts
const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args)
    }
  },
  info: (...args: any[]) => {
    console.log('[INFO]', ...args)
  },
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args)
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args)
  },
}

// Usage
import { logger } from '@/lib/logger'

logger.debug('Debug info') // Only in development
logger.info('User logged in')
logger.error('Failed to save:', error)
```

## Async State Management

### Loading States

Always show loading indicators.

```typescript
function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return <div>{posts.map((post) => ...)}</div>
}
```

### Optimistic Updates

Update UI immediately, rollback on error.

```typescript
function TodoItem({ todo }: { todo: Todo }) {
  const [optimisticCompleted, setOptimisticCompleted] = useState(
    todo.completed
  )

  const toggleCompleted = async () => {
    const previousState = optimisticCompleted

    // Optimistic update
    setOptimisticCompleted(!optimisticCompleted)

    try {
      await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !optimisticCompleted }),
      })
    } catch (error) {
      // Rollback on error
      setOptimisticCompleted(previousState)
      toast.error('Failed to update')
    }
  }

  return (
    <div>
      <input
        type="checkbox"
        checked={optimisticCompleted}
        onChange={toggleCompleted}
      />
      <span>{todo.title}</span>
    </div>
  )
}
```

## API Patterns

### API Route Pattern

Standard Next.js API route structure.

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { posts } from '@/db/schema'
import { z } from 'zod'

// GET /api/posts
export async function GET(request: NextRequest) {
  try {
    const allPosts = await db.select().from(posts)
    return NextResponse.json(allPosts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST /api/posts
const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = createPostSchema.parse(body)

    const [newPost] = await db.insert(posts).values(validated).returning()

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
```

### Dynamic API Routes

```typescript
// app/api/posts/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const postId = parseInt(params.id)

  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json(post)
}
```

## Database Patterns

See [DATABASE.md](./DATABASE.md) for complete database patterns.

### Query Organization

```typescript
// src/db/queries.ts
import { db } from './index'
import { posts } from './schema'
import { eq, desc } from 'drizzle-orm'

export async function getPublishedPosts() {
  return db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
}

export async function getPostBySlug(slug: string) {
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1)

  return post
}
```

## File Organization

### Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `PostCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useApi.ts`, `useDebounce.ts`)
- **Utilities**: camelCase (`utils.ts`, `logger.ts`)
- **Types**: PascalCase (`User.ts`, `Post.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_ITEMS`)

### Import Organization

```typescript
// 1. React imports
import { useState, useEffect } from 'react'

// 2. Third-party imports
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// 3. Internal imports (organized by type)
import { Button } from '@/components/ui/button'
import { useApi } from '@/hooks/useApi'
import { db } from '@/db'
import { logger } from '@/lib/logger'
import type { Post } from '@/types'

// 4. Relative imports (if needed)
import { helper } from './helper'
```

## TypeScript Patterns

### Type Inference

Let TypeScript infer types when possible.

```typescript
// ❌ Redundant type annotation
const posts: Post[] = await getPosts()

// ✅ Type inferred from function return type
const posts = await getPosts()
```

### Type Assertions

Use type assertions sparingly.

```typescript
// ❌ Unsafe assertion
const element = document.getElementById('root') as HTMLDivElement

// ✅ Safe assertion with check
const element = document.getElementById('root')
if (element instanceof HTMLDivElement) {
  // Use element
}
```

### Generic Constraints

Use constraints for better type safety.

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const post = { title: 'Hello', content: 'World' }
const title = getProperty(post, 'title') // Type: string
```

## Testing Patterns

### Component Testing

```typescript
// src/components/ui/button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    screen.getByText('Click me').click()
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### Hook Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { useApi } from './useApi'

describe('useApi', () => {
  it('fetches data', async () => {
    const { result } = renderHook(() => useApi('/api/posts'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBeDefined()
  })
})
```

---

Following these patterns ensures consistent, maintainable, and scalable code across your projects.
