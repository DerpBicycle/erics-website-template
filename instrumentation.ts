/**
 * Next.js Instrumentation Hook
 * ============================
 * This file runs once when the Next.js server starts.
 * Used for initializing services, loggers, and other server-side setup.
 *
 * See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on the server (Node.js runtime)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initLogger } = await import('@/lib/logger')
    initLogger()
  }
}
