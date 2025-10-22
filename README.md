# Eric's Website Template

A modern, production-ready Next.js template with TypeScript, Tailwind CSS, and best practices inspired by the T3 stack.

## 🚀 Tech Stack

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[MDX](https://mdxjs.com/)** - Markdown with JSX support

## 📁 Project Structure

```
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout with metadata
│   │   └── page.tsx          # Homepage
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   └── features/        # Feature-specific components
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   └── utils.ts         # Utility functions (cn helper, etc.)
│   ├── types/               # Shared TypeScript type definitions
│   ├── config/              # App configuration
│   └── styles/
│       └── tailwind.css     # Global styles and Tailwind imports
├── public/                   # Static assets
├── .env.example             # Environment variables template
└── next.config.mjs          # Next.js configuration
```

## 🏃 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Clone or copy this template:**

   ```bash
   git clone <your-repo-url>
   cd <project-name>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your actual values.

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎨 Styling

This template uses **Tailwind CSS v4** with the new PostCSS plugin architecture.

### Using the `cn()` Utility

The `cn()` function in `src/lib/utils.ts` makes it easy to conditionally apply classes:

```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  'base-class',
  isActive && 'active-class',
  'another-class'
)} />
```

## 🧩 Adding Components

### UI Components

Place reusable, generic UI components in `src/components/ui/`:

```typescript
// src/components/ui/button.tsx
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>
}
```

### Feature Components

Place feature-specific components in `src/components/features/`:

```typescript
// src/components/features/hero.tsx
export function Hero() {
  return <section>...</section>
}
```

## 🪝 Custom Hooks

Add custom React hooks in `src/hooks/`:

```typescript
// src/hooks/use-media-query.ts
export function useMediaQuery(query: string) {
  // ...
}
```

## 📝 MDX Support

This template includes MDX support. You can create `.mdx` files in the `src/app/` directory:

```mdx
# My Page

This is content with **MDX**.

<MyComponent />
```


## 🔧 Customization

### Update Metadata

Edit `src/app/layout.tsx` to update the site title and description:

```typescript
export const metadata: Metadata = {
  title: 'Your Site Title',
  description: 'Your site description',
}
```

### Modify Tailwind Configuration

Tailwind CSS v4 uses CSS variables for configuration. Edit `src/styles/tailwind.css`:

```css
@import 'tailwindcss';

/* Add custom theme values here */
```

### Configure Path Aliases

Path aliases are configured in `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```


This template is open source and available under the [MIT License](LICENSE).

## 🙏 Credits

Project structure inspired by [T3 Stack](https://create.t3.gg/).

---

**Happy coding! 🎉**
