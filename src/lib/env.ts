import { z } from 'zod'

/**
 * Environment Variable Validation
 * ================================
 * Uses Zod to validate environment variables at startup.
 * Fails fast with clear error messages if required variables are missing.
 *
 * Usage:
 *   import { env } from '@/lib/env'
 *   console.log(env.DATABASE_URL)
 */

const envSchema = z.object({
  // App Configuration
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Public variables (available in browser)
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default('Website Template'),

  // Database (optional - uncomment if using)
  DATABASE_URL: z.string().optional(),

  // Supabase (optional - uncomment if using)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),

  // API (optional - uncomment if using external API)
  // API_URL: z.string().url().optional(),
  // API_KEY: z.string().optional(),

  // Email (optional - for production email sending)
  // SMTP_HOST: z.string().optional(),
  // SMTP_PORT: z.coerce.number().default(587),
  // SMTP_USER: z.string().optional(),
  // SMTP_PASSWORD: z.string().optional(),
  // SMTP_FROM_EMAIL: z.string().email().optional(),
  // SMTP_FROM_NAME: z.string().optional(),

  // Logging
  ENABLE_DEBUG_LOGS: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
  LOG_SERVICE_NAME: z.string().default('website-template'),
})

// Validate environment variables
function validateEnv() {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(parsed.error.flatten().fieldErrors)

    // In development, show detailed errors
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Invalid environment variables')
    }

    // In production, fail fast
    process.exit(1)
  }

  return parsed.data
}

// Export validated environment variables
export const env = validateEnv()

// Type for environment variables
export type Env = z.infer<typeof envSchema>

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return env.NODE_ENV === 'production'
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development'
}

/**
 * Check if we're in test mode
 */
export function isTest(): boolean {
  return env.NODE_ENV === 'test'
}
