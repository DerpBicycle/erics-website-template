# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

[Brief description of what this project does - 1-2 sentences]

**Full documentation available in `docs/`** - see docs/README.md for the complete guide.

## AI Thinking Mode (MANDATORY)

**ALWAYS use ultrathink (max thinking mode) for ALL AI tool commands.** Set `thinking_mode: "max"` for all Zen MCP tools (thinkdeep, codereview, debug, precommit, consensus, planner, chat).

## File Header Comments (REQUIRED)

**Every new file MUST include a header comment** explaining what the file does.

```typescript
/**
 * [File/Module Name]
 *
 * [Brief description - 1-2 sentences]
 */
```

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Runtime**: Bun
- **Styling**: Tailwind CSS 4
- **Database**: Drizzle ORM + PostgreSQL
- **UI**: Radix UI + shadcn/ui patterns
- **Forms**: react-hook-form + zod
- **Testing**: Vitest

## Quick Start

```bash
bun install    # Install dependencies
bun run dev    # Start dev server (port 3000)
```

## Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Start dev server with Turbopack |
| `bun run build` | Build for production |
| `bun run lint` | Run ESLint |
| `bun run typecheck` | TypeScript check |
| `bun run test` | Run tests |
| `bun run db:push` | Push schema to database |
| `bun run db:studio` | Open Drizzle Studio |

## Quality Gates

Before committing:

```bash
bun run typecheck && bun run lint && bun run build
```

## Key Patterns

### API Response Format

```typescript
// Success
{ data: T, message?: string }

// Paginated
{ data: T[], pagination: { page, per_page, total, total_pages } }

// Error
{ error: string, details?: Record<string, string> }
```

### cn Utility

Use `cn()` for class merging:

```typescript
import { cn } from '@/lib/utils'

<div className={cn('base-class', condition && 'conditional-class')} />
```

### Environment Variables

`NEXT_PUBLIC_*` variables are inlined at **build time**. Set them before building.

## Documentation

| Doc | Purpose |
|-----|---------|
| `docs/SETUP.md` | Initial setup |
| `docs/ARCHITECTURE.md` | Project structure |
| `docs/PATTERNS.md` | Code patterns |
| `docs/DATABASE.md` | Database setup |
| `docs/DEPLOYMENT.md` | Deployment guide |
| `docs/CUSTOMIZE.md` | Customization |

## Notes for AI Assistants

1. **Bun-first**: Use `bun` for all package management
2. **Type safety**: Maintain strict TypeScript - no `any` types
3. **File headers**: Add header comments to all new files
4. **Quality gates**: All gates must pass before committing
5. **Check docs/**: Detailed patterns and examples in documentation
