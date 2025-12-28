# Documentation

Complete documentation for the erics-website-template.

## Quick Start

New to this template? Start here:

1. **[SETUP.md](./SETUP.md)** - Get your development environment running
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Understand the project structure
3. **[PATTERNS.md](./PATTERNS.md)** - Learn coding conventions

## Documentation Index

### Getting Started

**[SETUP.md](./SETUP.md)** - Complete setup guide
- Prerequisites and installation
- Environment configuration
- Database connection
- First-time customization
- Troubleshooting

### Understanding the System

**[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- Technology stack overview
- Folder structure explanation
- Component patterns (shadcn/ui)
- Routing architecture
- State management approaches
- Database layer design
- API integration patterns
- Deployment architecture

**[PATTERNS.md](./PATTERNS.md)** - Coding patterns and best practices
- Component patterns (UI & Feature components)
- Hook patterns (useApi, useFormPersistence, useDebounce)
- Context patterns (LanguageContext example)
- Form handling with React Hook Form + Zod
- Error handling strategies
- Async state management
- API route patterns
- Database query organization
- File organization conventions
- TypeScript best practices
- Testing patterns

### Database & Backend

**[DATABASE.md](./DATABASE.md)** - Database setup and usage
- Shared database concept (multi-site support)
- Supabase setup and configuration
- Drizzle ORM schema definition
- Connection pooling with PgBouncer
- Schema management strategies
- Migration workflows (SQL recommended)
- Seeding data
- Query patterns and best practices
- Row-level security (RLS)

### Deployment

**[DEPLOYMENT.md](./DEPLOYMENT.md)** - Coolify deployment guide
- Prerequisites and initial setup
- Environment variable configuration
- Docker multi-stage build setup
- Coolify integration step-by-step
- Health check configuration
- Monitoring and logging
- Rollback procedures
- Troubleshooting deployment issues
- Continuous deployment setup

### Customization

**[CUSTOMIZE.md](./CUSTOMIZE.md)** - Customize your site
- Branding and color theming
- Typography customization
- Adding new pages and routes
- Modifying existing components
- Extending the component library
- Creating custom hooks
- Layout customization
- SEO and metadata configuration
- Animation setup (Framer Motion & Tailwind)

### Future Planning

**[FUTURE-MONOREPO.md](./FUTURE-MONOREPO.md)** - Monorepo migration reference
- When to consider monorepo (3+ sites)
- Benefits and trade-offs
- Recommended structure (Turborepo)
- Step-by-step migration guide
- Shared package extraction
- Tooling options (Turborepo vs Nx)
- Testing and rollback strategies

## Documentation by Use Case

### "I'm starting a new site"

1. Read [SETUP.md](./SETUP.md) - Get your environment running
2. Read [CUSTOMIZE.md](./CUSTOMIZE.md) - Make it your own
3. Reference [PATTERNS.md](./PATTERNS.md) - Follow best practices

### "I need to add a database"

1. Read [DATABASE.md](./DATABASE.md) - Set up Supabase and Drizzle
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand the database layer
3. Check [PATTERNS.md](./PATTERNS.md) - Learn database query patterns

### "I'm ready to deploy"

1. Read [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy with Coolify
2. Review [SETUP.md](./SETUP.md) - Environment variables checklist
3. Check [DATABASE.md](./DATABASE.md) - Production database setup

### "I'm building multiple related sites"

1. Build sites individually first using this template
2. When you have 3+ sites, read [FUTURE-MONOREPO.md](./FUTURE-MONOREPO.md)
3. Plan migration to monorepo for code sharing

### "I need to understand the codebase"

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) - High-level system design
2. Read [PATTERNS.md](./PATTERNS.md) - Code organization and conventions
3. Explore the `/src` directory alongside documentation

## Reference Project

This template is based on **gamejobs.be**, a production job board that demonstrates:

- Multi-language support with AI translation
- Passwordless authentication via magic links
- Supabase + Drizzle ORM integration
- Coolify deployment
- Email notification system
- Form persistence and auto-save
- shadcn/ui component library
- Next.js 16 App Router

The gamejobs.be implementation serves as a reference for production-ready patterns.

## Key Features

### Built-in Patterns

- **shadcn/ui components** - Customizable, accessible UI components
- **TypeScript** - Full type safety throughout
- **Tailwind CSS 4** - Modern utility-first styling
- **Drizzle ORM** - Type-safe database queries
- **React Hook Form + Zod** - Robust form handling
- **Next.js 16 App Router** - Modern routing and data fetching
- **Coolify deployment** - Easy production deployment

### Optional Features

- **Supabase** - PostgreSQL database with additional features
- **Multi-site database** - Share data across multiple sites
- **Form persistence** - Auto-save forms to localStorage
- **AI integration** - Translation and other AI features
- **Email system** - Nodemailer integration

## Contributing

When adding new features or patterns:

1. Update relevant documentation
2. Add code examples
3. Update this README if adding new docs
4. Keep documentation in sync with code

## Getting Help

1. **Check documentation** - Most questions are answered here
2. **Review gamejobs.be** - See production implementation
3. **Check troubleshooting sections** - Common issues and solutions
4. **Search issues** - See if others had similar problems

## Documentation Standards

All documentation follows these principles:

- **Clear examples** - Show, don't just tell
- **Step-by-step** - Break complex tasks into steps
- **Troubleshooting** - Include common issues and solutions
- **Cross-references** - Link to related documentation
- **Up-to-date** - Keep in sync with codebase

## Quick Reference

### Essential Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Lint code
npm run format       # Format code

# Database (if using)
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

### Project Structure

```
erics-website-template/
├── src/
│   ├── app/              # Next.js pages and routes
│   ├── components/       # React components
│   │   ├── ui/          # Generic UI components
│   │   └── features/    # Feature-specific components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities
│   ├── db/              # Database (optional)
│   └── styles/          # Global styles
├── docs/                # This documentation
├── public/              # Static assets
└── package.json
```

### Key Files

- `src/app/layout.tsx` - Root layout and metadata
- `src/app/page.tsx` - Homepage
- `src/lib/utils.ts` - Utility functions
- `src/styles/tailwind.css` - Tailwind config
- `.env.local` - Environment variables (git-ignored)
- `next.config.mjs` - Next.js configuration

---

**Last Updated**: November 2024

**Template Version**: 1.0.0

**Based on**: gamejobs.be production implementation
