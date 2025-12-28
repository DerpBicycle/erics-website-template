# Future Monorepo Migration Guide

A reference guide for migrating from standalone sites to a monorepo structure when you have multiple related sites.

## Table of Contents

- [When to Consider Monorepo](#when-to-consider-monorepo)
- [Benefits & Trade-offs](#benefits--trade-offs)
- [Recommended Structure](#recommended-structure)
- [Step-by-Step Migration](#step-by-step-migration)
- [Shared Packages](#shared-packages)
- [Tooling Options](#tooling-options)
- [Testing the Migration](#testing-the-migration)
- [Rollback Plan](#rollback-plan)

## When to Consider Monorepo

Consider migrating to a monorepo when:

- **3+ related sites** sharing significant code
- **Common design system** across all sites
- **Shared utilities** being copy-pasted between projects
- **Coordinated deployments** needed across sites
- **Team growth** requiring better code organization
- **Dependency synchronization** becoming painful

**Don't migrate if:**

- You have 1-2 sites with minimal shared code
- Sites are completely independent
- Team is small (1-2 developers)
- Projects use different tech stacks

## Benefits & Trade-offs

### Benefits

**Code Sharing:**
- Shared UI components (design system)
- Common utilities and hooks
- Shared types and schemas
- Centralized configuration

**Development:**
- Single dependency installation
- Unified tooling and scripts
- Easier refactoring across projects
- Atomic commits across sites

**Consistency:**
- Enforced code standards
- Shared linting/formatting rules
- Unified testing approach
- Single source of truth

### Trade-offs

**Complexity:**
- Steeper learning curve for new developers
- More complex build configuration
- Potential for build cache issues
- Requires monorepo tooling knowledge

**Performance:**
- Longer CI/CD times (without proper caching)
- Larger repository size
- More complex deployment pipelines

**Coordination:**
- Breaking changes affect all sites
- Requires more careful versioning
- Need for good communication

## Recommended Structure

### Turborepo Structure (Recommended)

```
belgian-industry-sites/
├── apps/
│   ├── gamejobs/              # gamejobs.be
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   ├── next.config.mjs
│   │   └── tsconfig.json
│   │
│   ├── gameindustry/          # gameindustry.be
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
│   │
│   └── techstartups/          # techstartups.be
│       ├── src/
│       └── ...
│
├── packages/
│   ├── ui/                    # Shared UI components
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── database/              # Shared database layer
│   │   ├── src/
│   │   │   ├── schema.ts
│   │   │   ├── queries/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── hooks/                 # Shared React hooks
│   │   ├── src/
│   │   │   ├── useApi.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── utils/                 # Shared utilities
│   │   ├── src/
│   │   │   ├── logger.ts
│   │   │   ├── validation.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── config/                # Shared configuration
│   │   ├── eslint-config/
│   │   ├── tailwind-config/
│   │   └── typescript-config/
│   │
│   └── types/                 # Shared TypeScript types
│       ├── src/
│       │   ├── api.ts
│       │   ├── database.ts
│       │   └── index.ts
│       └── package.json
│
├── supabase/                  # Shared database migrations
│   └── migrations/
│       ├── 001_initial_schema.sql
│       └── ...
│
├── scripts/                   # Shared scripts
│   ├── seed.ts
│   └── translate.ts
│
├── package.json               # Root package.json
├── turbo.json                 # Turborepo configuration
├── pnpm-workspace.yaml        # pnpm workspaces
└── README.md
```

### Key Principles

1. **apps/** - Deployable applications (Next.js sites)
2. **packages/** - Shared code libraries
3. **Separation** - Each package has its own package.json
4. **Internal dependencies** - Apps import from packages via aliases

## Step-by-Step Migration

### Phase 1: Preparation (Week 1)

#### 1. Audit Shared Code

Identify code that's duplicated across sites:

```bash
# Create inventory spreadsheet
- Components: Button, Card, Input, etc.
- Hooks: useApi, useFormPersistence, etc.
- Utilities: cn(), logger, validation, etc.
- Types: Post, User, Company, etc.
- Database: Shared schemas, queries
```

#### 2. Choose Monorepo Tool

**Recommended: Turborepo**

- Built for Next.js
- Excellent caching
- Simple setup
- Good documentation

**Alternative: Nx**

- More features
- Complex setup
- Better for large teams

#### 3. Set Up Repository Structure

```bash
# Create new monorepo repository
mkdir belgian-industry-sites
cd belgian-industry-sites
git init

# Initialize with Turborepo
npx create-turbo@latest .

# Or manually set up structure
mkdir -p apps packages
```

### Phase 2: Foundation Setup (Week 2)

#### 1. Configure Root package.json

```json
{
  "name": "belgian-industry-sites",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.8.3"
  },
  "packageManager": "pnpm@9.0.0"
}
```

#### 2. Configure Turborepo

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

#### 3. Configure pnpm Workspaces

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Phase 3: Extract Shared Packages (Week 3-4)

#### 1. Create Shared UI Package

```bash
mkdir -p packages/ui/src
cd packages/ui
```

```json
// packages/ui/package.json
{
  "name": "@belgian-industry/ui",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint src/",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^2.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@types/react": "^19",
    "react": "^19",
    "typescript": "^5.8.3"
  },
  "peerDependencies": {
    "react": "^19"
  }
}
```

```typescript
// packages/ui/src/index.ts
export { Button } from './button'
export { Card } from './card'
export { Input } from './input'
// ... other exports
```

#### 2. Create Shared Hooks Package

```json
// packages/hooks/package.json
{
  "name": "@belgian-industry/hooks",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "devDependencies": {
    "@types/react": "^19",
    "react": "^19",
    "typescript": "^5.8.3"
  },
  "peerDependencies": {
    "react": "^19"
  }
}
```

```typescript
// packages/hooks/src/index.ts
export { useApi } from './useApi'
export { useDebounce } from './useDebounce'
export { useFormPersistence } from './useFormPersistence'
```

#### 3. Create Database Package

```json
// packages/database/package.json
{
  "name": "@belgian-industry/database",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "drizzle-orm": "^0.44.7",
    "postgres": "^3.4.5"
  }
}
```

```typescript
// packages/database/src/index.ts
export { db } from './client'
export * from './schema'
export * as queries from './queries'
```

### Phase 4: Migrate First App (Week 5)

#### 1. Copy App to Monorepo

```bash
# Copy gamejobs.be into apps/
cp -r ~/path/to/gamejobs.be ./apps/gamejobs
cd apps/gamejobs
```

#### 2. Update package.json Dependencies

```json
// apps/gamejobs/package.json
{
  "name": "gamejobs",
  "dependencies": {
    // Add internal dependencies
    "@belgian-industry/ui": "workspace:*",
    "@belgian-industry/hooks": "workspace:*",
    "@belgian-industry/database": "workspace:*",
    "@belgian-industry/utils": "workspace:*",

    // External dependencies remain
    "next": "^16.0.0",
    "react": "^19"
  }
}
```

#### 3. Update Imports

```typescript
// Before
import { Button } from '@/components/ui/button'
import { useApi } from '@/hooks/useApi'
import { db } from '@/db'

// After
import { Button } from '@belgian-industry/ui'
import { useApi } from '@belgian-industry/hooks'
import { db } from '@belgian-industry/database'
```

#### 4. Update tsconfig.json

```json
// apps/gamejobs/tsconfig.json
{
  "extends": "@belgian-industry/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### 5. Test the App

```bash
# Install all dependencies
pnpm install

# Run development server
pnpm dev --filter=gamejobs

# Test build
pnpm build --filter=gamejobs
```

### Phase 5: Migrate Remaining Apps (Week 6-7)

Repeat Phase 4 for each remaining site:

1. Copy app to `apps/` directory
2. Update dependencies to use workspace packages
3. Update imports
4. Test thoroughly

### Phase 6: Shared Configuration (Week 8)

#### 1. Create Shared ESLint Config

```javascript
// packages/config/eslint-config/index.js
module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    // Shared rules
  },
}
```

#### 2. Create Shared Tailwind Config

```javascript
// packages/config/tailwind-config/index.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Shared color palette
      },
    },
  },
  plugins: [],
}
```

#### 3. Update Apps to Use Shared Configs

```javascript
// apps/gamejobs/tailwind.config.ts
import baseConfig from '@belgian-industry/tailwind-config'

export default {
  ...baseConfig,
  content: ['./src/**/*.{ts,tsx}'],
  // Site-specific overrides
}
```

## Shared Packages

### Creating a New Shared Package

```bash
# Create package directory
mkdir -p packages/my-package/src

# Create package.json
cat > packages/my-package/package.json << EOF
{
  "name": "@belgian-industry/my-package",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
EOF

# Create index file
echo "export const hello = 'world'" > packages/my-package/src/index.ts

# Install in apps
cd apps/gamejobs
pnpm add @belgian-industry/my-package@workspace:*
```

### Using Shared Packages

```typescript
// In any app
import { hello } from '@belgian-industry/my-package'
```

## Tooling Options

### Turborepo (Recommended)

**Pros:**
- Built for Next.js
- Fast builds with caching
- Simple configuration
- Good DX

**Cons:**
- Fewer features than Nx
- Less mature ecosystem

### Nx

**Pros:**
- Feature-rich
- Great visualization tools
- Excellent caching
- Large ecosystem

**Cons:**
- More complex
- Steeper learning curve
- Overkill for small teams

### pnpm Workspaces

**Pros:**
- Simple
- No additional tooling
- Fast installs

**Cons:**
- No task orchestration
- Manual dependency management
- No caching

## Testing the Migration

### Checklist

- [ ] All apps build successfully
- [ ] Development servers run without errors
- [ ] Tests pass in all packages
- [ ] Shared components work in all apps
- [ ] Database connections work
- [ ] Environment variables configured
- [ ] Deployments work via Coolify
- [ ] No duplicate dependencies
- [ ] TypeScript types resolve correctly
- [ ] Linting passes
- [ ] Production builds succeed

### Testing Commands

```bash
# Install all dependencies
pnpm install

# Run all dev servers
pnpm dev

# Build all apps
pnpm build

# Run all tests
pnpm test

# Lint all code
pnpm lint

# Type check
pnpm type-check
```

## Rollback Plan

### If Migration Fails

#### Option 1: Keep Old Repositories

Maintain original standalone repos until monorepo is stable:

```bash
# Old repos continue to work
gamejobs.be/ (original)
gameindustry.be/ (original)

# New monorepo in parallel
belgian-industry-sites/ (testing)
```

Deploy from old repos until confident in monorepo.

#### Option 2: Emergency Rollback

If monorepo breaks in production:

1. **Revert deployments** to last stable version
2. **Fix issues** in monorepo
3. **Test thoroughly** before redeploying
4. **Document problems** for future reference

#### Option 3: Gradual Migration

Migrate one site at a time:

1. Move gamejobs.be first (test in production)
2. Wait 1-2 weeks, monitor
3. Move gameindustry.be next
4. Continue until all sites migrated

### Migration Safety Tips

1. **Backup everything** before starting
2. **Test in staging** environment first
3. **Migrate during low-traffic** periods
4. **Have rollback plan** ready
5. **Monitor closely** after migration
6. **Keep old repos** for 2-3 months

## Maintenance

### Adding New Sites

```bash
# Create new app from template
cp -r apps/gamejobs apps/newsite
cd apps/newsite

# Update package.json
# Update environment variables
# Customize content
```

### Updating Shared Packages

```bash
# Make changes to package
cd packages/ui
# Edit files

# Rebuild dependent apps
cd ../..
pnpm build --filter=gamejobs
```

### Dependency Updates

```bash
# Update all dependencies
pnpm update -r

# Update specific package
pnpm update next --filter=gamejobs
```

## Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Nx Documentation](https://nx.dev)

---

**Note**: This is a reference guide for future use. Only migrate when you have 3+ sites with significant code sharing.
