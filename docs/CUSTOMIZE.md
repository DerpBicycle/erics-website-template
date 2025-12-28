# Customization Guide

A comprehensive guide to customizing your site's appearance, functionality, and features.

## Table of Contents

- [Branding & Colors](#branding--colors)
- [Typography](#typography)
- [Adding New Pages](#adding-new-pages)
- [Adding New Routes](#adding-new-routes)
- [Modifying Components](#modifying-components)
- [Extending Component Library](#extending-component-library)
- [Custom Hooks](#custom-hooks)
- [Layout Customization](#layout-customization)
- [SEO & Metadata](#seo--metadata)
- [Animations](#animations)

## Branding & Colors

### Tailwind CSS 4 Theme

Customize colors in `src/styles/tailwind.css`:

```css
@import 'tailwindcss';

@theme {
  /* Primary brand colors */
  --color-primary: #3b82f6;
  --color-primary-foreground: #ffffff;

  /* Secondary colors */
  --color-secondary: #8b5cf6;
  --color-secondary-foreground: #ffffff;

  /* Accent colors */
  --color-accent: #f59e0b;
  --color-accent-foreground: #ffffff;

  /* Semantic colors */
  --color-destructive: #ef4444;
  --color-destructive-foreground: #ffffff;

  /* Background colors */
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;

  /* Muted colors */
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;

  /* Border colors */
  --color-border: #e2e8f0;
  --color-input: #e2e8f0;
  --color-ring: #3b82f6;

  /* Card colors */
  --color-card: #ffffff;
  --color-card-foreground: #0a0a0a;

  /* Popover colors */
  --color-popover: #ffffff;
  --color-popover-foreground: #0a0a0a;

  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: #0a0a0a;
    --color-foreground: #fafafa;
    --color-card: #1a1a1a;
    --color-card-foreground: #fafafa;
    --color-muted: #1e293b;
    --color-muted-foreground: #94a3b8;
    --color-border: #2d3748;
    --color-input: #2d3748;
  }
}
```

### Using Custom Colors

```typescript
// In components
<div className="bg-primary text-primary-foreground">
  Primary background with contrasting text
</div>

<div className="bg-secondary text-secondary-foreground">
  Secondary background
</div>

<button className="bg-accent hover:bg-accent/90">
  Accent button
</button>
```

### CSS Variables Approach

For more dynamic theming:

```css
/* src/styles/globals.css */
:root {
  --brand-color-1: #3b82f6;
  --brand-color-2: #8b5cf6;
  --header-height: 64px;
}

.custom-element {
  background: var(--brand-color-1);
  height: var(--header-height);
}
```

## Typography

### Font Families

Configure fonts in `src/app/layout.tsx`:

```typescript
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### Tailwind Font Configuration

```css
/* src/styles/tailwind.css */
@theme {
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-serif: var(--font-playfair), Georgia, serif;
  --font-mono: 'Fira Code', monospace;
}
```

### Using Custom Fonts

```typescript
<h1 className="font-sans">Sans-serif heading</h1>
<h2 className="font-serif">Serif heading</h2>
<code className="font-mono">Monospace code</code>
```

### Typography Scale

```css
@theme {
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
}
```

## Adding New Pages

### Static Pages

Create a new page in the `app` directory:

```typescript
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <p className="text-lg text-muted-foreground">
        We are a company that...
      </p>
    </div>
  )
}
```

This creates the route: `/about`

### Dynamic Pages

Create a dynamic route with parameters:

```typescript
// src/app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

async function getPost(slug: string) {
  // Fetch post from database or API
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
  })

  if (!post) {
    notFound()
  }

  return post
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  return (
    <article className="container py-12">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="prose max-w-none">{post.content}</div>
    </article>
  )
}
```

### Page with Metadata

Add SEO metadata to your pages:

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company and mission',
  openGraph: {
    title: 'About Us',
    description: 'Learn more about our company',
    images: ['/images/about-og.jpg'],
  },
}

export default function AboutPage() {
  return <div>...</div>
}
```

### Dynamic Metadata

Generate metadata based on page content:

```typescript
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPost(params.slug)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}
```

## Adding New Routes

### Nested Routes

```
app/
├── blog/
│   ├── page.tsx           # /blog
│   ├── [slug]/
│   │   └── page.tsx       # /blog/my-post
│   └── category/
│       └── [name]/
│           └── page.tsx   # /blog/category/news
```

### Route Groups (No URL Segment)

```
app/
├── (marketing)/
│   ├── layout.tsx         # Marketing layout
│   ├── page.tsx           # / (home)
│   └── about/
│       └── page.tsx       # /about
└── (app)/
    ├── layout.tsx         # App layout
    └── dashboard/
        └── page.tsx       # /dashboard
```

### API Routes

```typescript
// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    // Process contact form
    await sendEmail(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}
```

## Modifying Components

### Customizing shadcn/ui Components

Components live in `src/components/ui/`. Modify them directly:

```typescript
// src/components/ui/button.tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        // Add new variant
        gradient:
          'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90',
      },
    },
  }
)

// Use new variant
<Button variant="gradient">Gradient Button</Button>
```

### Creating Compound Components

```typescript
// src/components/ui/card.tsx
export function Card({ className, ...props }: CardProps) {
  return <div className={cn('rounded-lg border', className)} {...props} />
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn('p-6', className)} {...props} />
}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return <h3 className={cn('text-2xl font-bold', className)} {...props} />
}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

// Usage
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

### Wrapping External Components

```typescript
// src/components/ui/date-picker.tsx
'use client'

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { cn } from '@/lib/utils'

export function DatePicker({ className, ...props }) {
  return (
    <ReactDatePicker
      className={cn(
        'rounded-md border border-input px-3 py-2',
        className
      )}
      {...props}
    />
  )
}
```

## Extending Component Library

### Adding New shadcn/ui Components

Install additional shadcn components:

```bash
# Install dialog component
npx shadcn@latest add dialog

# Install form components
npx shadcn@latest add form

# Install toast notifications
npx shadcn@latest add sonner
```

This adds components to `src/components/ui/`.

### Creating Feature Components

```typescript
// src/components/features/hero.tsx
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="container py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Our Site
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Build amazing things with our platform
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
```

### Creating Reusable Layouts

```typescript
// src/components/layouts/two-column.tsx
interface TwoColumnLayoutProps {
  sidebar: React.ReactNode
  main: React.ReactNode
}

export function TwoColumnLayout({ sidebar, main }: TwoColumnLayoutProps) {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">{sidebar}</aside>
        <main className="md:col-span-3">{main}</main>
      </div>
    </div>
  )
}

// Usage
<TwoColumnLayout
  sidebar={<Sidebar />}
  main={<Content />}
/>
```

## Custom Hooks

### Creating Custom Hooks

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }, [key])

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  return [storedValue, setValue]
}

// Usage
function MyComponent() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle theme
    </button>
  )
}
```

### Composing Hooks

```typescript
// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// Usage
function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return <div>{isMobile ? <MobileView /> : <DesktopView />}</div>
}
```

## Layout Customization

### Root Layout

```typescript
// src/app/layout.tsx
import { Header } from '@/components/features/header'
import { Footer } from '@/components/features/footer'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

### Nested Layouts

```typescript
// src/app/dashboard/layout.tsx
import { Sidebar } from '@/components/features/sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
```

### Conditional Layouts

```typescript
// src/app/layout.tsx
import { headers } from 'next/headers'

export default function RootLayout({ children }) {
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || '/'

  const showHeader = !pathname.startsWith('/auth')

  return (
    <html lang="en">
      <body>
        {showHeader && <Header />}
        {children}
      </body>
    </html>
  )
}
```

## SEO & Metadata

### Static Metadata

```typescript
// src/app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - My Site',
  description: 'Learn about our company',
  keywords: ['about', 'company', 'team'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'About Us',
    description: 'Learn about our company',
    url: 'https://mysite.com/about',
    siteName: 'My Site',
    images: [
      {
        url: 'https://mysite.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us',
    description: 'Learn about our company',
    images: ['https://mysite.com/og-image.jpg'],
  },
}
```

### Metadata Template

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://mysite.com'),
  title: {
    default: 'My Site',
    template: '%s | My Site',
  },
  description: 'Default description',
}

// Child pages
export const metadata: Metadata = {
  title: 'About', // Becomes "About | My Site"
}
```

### Structured Data (JSON-LD)

```typescript
export default function BlogPostPage({ post }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.image,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>{/* Post content */}</article>
    </>
  )
}
```

## Animations

### Framer Motion

```typescript
'use client'

import { motion } from 'framer-motion'

export function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-lg border"
    >
      <h2>Animated Card</h2>
      <p>This card fades in and slides up</p>
    </motion.div>
  )
}
```

### Tailwind Animations

```css
/* src/styles/tailwind.css */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}
```

```typescript
<div className="animate-fadeIn">Fades in on load</div>
```

### Scroll Animations

```typescript
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

export function ParallaxSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, -100])

  return (
    <motion.div style={{ y }} className="relative">
      <h1>Parallax Effect</h1>
    </motion.div>
  )
}
```

---

Your site is now fully customized and ready to launch!
