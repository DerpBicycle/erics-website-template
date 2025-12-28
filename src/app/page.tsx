export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Website Template
        </h1>
        <p className="mb-8 text-lg text-[rgb(var(--muted-foreground))]">
          A modern, production-ready Next.js template with TypeScript, Tailwind CSS v4,
          and best practices from real-world applications.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[rgb(var(--primary))] px-6 py-3 font-medium text-[rgb(var(--primary-foreground))] transition-colors hover:opacity-90"
          >
            Next.js Docs
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
          <a
            href="https://tailwindcss.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-6 py-3 font-medium transition-colors hover:bg-[rgb(var(--accent))]"
          >
            Tailwind Docs
          </a>
        </div>

        <div className="mt-16 grid gap-6 text-left sm:grid-cols-2">
          <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
            <h2 className="mb-2 text-lg font-semibold">Tech Stack</h2>
            <ul className="space-y-1 text-sm text-[rgb(var(--muted-foreground))]">
              <li>Next.js 16 with App Router</li>
              <li>React 19</li>
              <li>TypeScript 5.9</li>
              <li>Tailwind CSS v4</li>
              <li>Bun runtime</li>
            </ul>
          </div>

          <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
            <h2 className="mb-2 text-lg font-semibold">Features</h2>
            <ul className="space-y-1 text-sm text-[rgb(var(--muted-foreground))]">
              <li>Security headers & CSP</li>
              <li>Dark mode support</li>
              <li>Structured logging</li>
              <li>API client with retry</li>
              <li>Drizzle ORM ready</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
