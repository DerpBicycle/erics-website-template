# Eric's Website Template

A modern, production-ready Next.js template with TypeScript, Tailwind CSS v4, and best practices from real-world applications.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 16.1 | React framework with App Router |
| [React](https://react.dev/) | 19.2 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 4.1 | Utility-first CSS with CSS variables |
| [Bun](https://bun.sh/) | 1.2+ | Runtime and package manager |
| [Drizzle ORM](https://orm.drizzle.team/) | 0.45 | Type-safe database ORM |
| [Supabase](https://supabase.com/) | 2.89 | Authentication & PostgreSQL |

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) 1.2 or later

### Installation

```bash
# Clone the template
git clone <your-repo-url> my-project
cd my-project

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
bun run dev         # Start dev server with Turbopack
bun run build       # Build for production
bun run start       # Start production server
bun run lint        # Run ESLint
bun run typecheck   # TypeScript check
bun run format      # Format with Prettier
bun run test        # Run tests (watch mode)
bun run test:run    # Run tests once

# Database (requires DATABASE_URL)
bun run db:push     # Push schema changes to database
bun run db:studio   # Open Drizzle Studio
bun run db:generate # Generate migrations
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Homepage
├── components/
│   ├── ui/                 # Reusable UI components
│   └── features/           # Feature-specific components
├── db/
│   ├── schema.ts           # Drizzle database schema
│   └── index.ts            # Database connection
├── hooks/                  # Custom React hooks
├── lib/
│   ├── api.ts              # API client with retry logic
│   ├── env.ts              # Environment validation (Zod)
│   ├── logger.ts           # Structured logging
│   └── utils.ts            # Utility functions
├── types/                  # Shared TypeScript types
├── config/                 # App configuration
└── styles/
    └── tailwind.css        # Global styles & theme
```

## Features

### Security Headers

The template includes production-ready security headers:

- Content Security Policy (CSP)
- Strict Transport Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

Configure in `next.config.mjs`.

### Tailwind CSS v4 Theming

Uses CSS custom properties for theming (no config file needed):

```css
/* src/styles/tailwind.css */
:root {
  --primary: 59 130 246;        /* blue-500 */
  --background: 254 254 254;    /* off-white */
  /* ... more variables */
}

.dark {
  --primary: 96 165 250;        /* blue-400 */
  --background: 24 24 27;       /* zinc-900 */
}
```

Use in components:

```tsx
<div className="bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]">
  Primary button
</div>
```

### Dark Mode

Built-in dark mode support via `next-themes`:

```tsx
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  )
}
```

### API Client

Production-ready HTTP client with automatic retry:

```tsx
import { api, ApiError } from '@/lib/api'

// GET request
const { data } = await api.get<{ data: User }>('/api/users/1')

// POST request
const { data } = await api.post<{ data: User }>('/api/users', { name: 'John' })

// Error handling
try {
  await api.post('/api/users', data)
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.status, error.message)
  }
}
```

Features:
- Automatic retry with exponential backoff
- Rate limit (429) handling
- Request timeout
- Auth token management

### Structured Logging

JSON-formatted logs for Grafana Loki:

```tsx
import { logger } from '@/lib/logger'

logger.info('User logged in', { userId: '123' })
logger.error('Failed to fetch', { error: err.message })
logger.debug('Processing', { params }) // Hidden in production

// Create child logger with default context
const log = logger.child({ module: 'auth' })
log.info('Session created')
```

### Environment Validation

Zod-based validation at startup:

```tsx
import { env, isProduction } from '@/lib/env'

// Type-safe environment access
console.log(env.NEXT_PUBLIC_SITE_URL)

// Environment checks
if (isProduction()) {
  // Production-only code
}
```

### Database (Drizzle ORM)

Type-safe database queries:

```tsx
import { db, users } from '@/db'
import { eq } from 'drizzle-orm'

// Query
const allUsers = await db.query.users.findMany()

// Insert
await db.insert(users).values({ email: 'user@example.com' })

// Update
await db.update(users).set({ name: 'John' }).where(eq(users.id, userId))
```

### Toast Notifications

Using Sonner for beautiful toasts:

```tsx
import { toast } from 'sonner'

toast.success('Saved successfully')
toast.error('Something went wrong')
toast.loading('Processing...')
```

## Utility Functions

The `@/lib/utils` module includes commonly used utilities:

```tsx
import {
  cn,                  // Merge Tailwind classes
  formatDate,          // Format dates
  formatRelativeTime,  // "2 hours ago"
  debounce,           // Debounce function
  throttle,           // Throttle function
  sleep,              // Async sleep
  truncate,           // Truncate string
  capitalize,         // Capitalize first letter
  generateId,         // Random ID
  slugify,            // URL-friendly slug
  getInitials,        // "JD" from "John Doe"
  formatNumber,       // "1,234,567"
  formatCurrency,     // "$1,234.56"
  clamp,              // Clamp number
  pluralize,          // "5 items"
  nl2br,              // Newlines to <br>
  isServer,           // Check if SSR
  isClient,           // Check if client
} from '@/lib/utils'
```

## Customization

### Update Branding

1. Edit metadata in `src/app/layout.tsx`
2. Change colors in `src/styles/tailwind.css`
3. Update `NEXT_PUBLIC_APP_NAME` in `.env.local`

### Add Components

Use the shadcn/ui pattern for UI components:

```bash
# Example: Add a Button component
npx shadcn@latest add button
```

Or create manually in `src/components/ui/`.

### Configure Database

1. Set `DATABASE_URL` in `.env.local`
2. Define schema in `src/db/schema.ts`
3. Run `bun run db:push` to sync

## Deployment

### Coolify (Recommended)

1. Push to Git repository
2. Create new application in Coolify
3. Set build variables:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
4. Deploy

**Important:** `NEXT_PUBLIC_*` variables are inlined at build time. Set them in Build Variables, then rebuild (not restart).

### Docker

The template uses `output: 'standalone'` for optimized Docker builds:

```dockerfile
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1-slim AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["bun", "server.js"]
```

## Environment Variables

See `.env.example` for all available variables.

**Required:**
- `NEXT_PUBLIC_SITE_URL` - Your site URL

**Optional:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `ENABLE_DEBUG_LOGS` - Enable debug logging
- `LOG_SERVICE_NAME` - Service name for logs

## Quality Gates

Before committing:

```bash
bun run typecheck && bun run lint && bun run test:run
```

## Based On

This template incorporates patterns from production applications:
- **admin-portal** - API client, auth patterns, security headers
- **gamejobs.be** - i18n, structured logging, env validation

## License

MIT
