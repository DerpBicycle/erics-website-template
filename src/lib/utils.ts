import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes with proper precedence.
 * Combines clsx for conditional classes and tailwind-merge for deduplication.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'px-2')
 * // Returns: 'py-2 px-2 bg-blue-500' (px-2 overrides px-4)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a human-readable string.
 *
 * @example
 * formatDate(new Date()) // "December 28, 2025"
 * formatDate(new Date(), 'short') // "Dec 28, 2025"
 */
export function formatDate(
  date: Date | string,
  format: 'long' | 'short' = 'long'
): string {
  const d = typeof date === 'string' ? new Date(date) : date

  const options: Intl.DateTimeFormatOptions =
    format === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' }

  return d.toLocaleDateString('en-US', options)
}

/**
 * Format a relative time (e.g., "2 hours ago", "in 3 days").
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(-diffInSeconds, 'second')
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(-diffInMinutes, 'minute')
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(-diffInHours, 'hour')
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(-diffInDays, 'day')
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(-diffInMonths, 'month')
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return rtf.format(-diffInYears, 'year')
}

/**
 * Debounce a function call.
 *
 * @example
 * const debouncedSearch = debounce((query) => search(query), 300)
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), ms)
  }
}

/**
 * Throttle a function call.
 *
 * @example
 * const throttledScroll = throttle(() => handleScroll(), 100)
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let lastCall = 0

  return function (...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastCall >= ms) {
      lastCall = now
      fn(...args)
    }
  }
}

/**
 * Sleep for a specified number of milliseconds.
 *
 * @example
 * await sleep(1000) // Wait 1 second
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Truncate a string to a maximum length with ellipsis.
 *
 * @example
 * truncate('Hello World', 8) // "Hello..."
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Generate a random string ID.
 *
 * @example
 * generateId() // "x7k9m2"
 * generateId(12) // "a8b3c4d5e6f7"
 */
export function generateId(length: number = 6): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}

/**
 * Check if code is running on the server.
 */
export function isServer(): boolean {
  return typeof window === 'undefined'
}

/**
 * Check if code is running on the client.
 */
export function isClient(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Convert newlines to <br> tags for display in HTML.
 * Escapes HTML entities for security.
 *
 * @example
 * nl2br('Hello\nWorld') // "Hello<br />World"
 */
export function nl2br(str: string): string {
  const escaped = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  return escaped.replace(/\n/g, '<br />')
}

/**
 * Pluralize a word based on count.
 *
 * @example
 * pluralize(1, 'item') // "1 item"
 * pluralize(5, 'item') // "5 items"
 * pluralize(0, 'person', 'people') // "0 people"
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  const word = count === 1 ? singular : (plural ?? `${singular}s`)
  return `${count} ${word}`
}

/**
 * Create a URL-friendly slug from a string.
 *
 * @example
 * slugify('Hello World!') // "hello-world"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Extract initials from a name.
 *
 * @example
 * getInitials('John Doe') // "JD"
 * getInitials('John') // "J"
 */
export function getInitials(name: string, maxLength: number = 2): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, maxLength)
}

/**
 * Format a number with thousands separators.
 *
 * @example
 * formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Format a currency value.
 *
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(1234.56, 'EUR') // "€1,234.56"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Clamp a number between a minimum and maximum value.
 *
 * @example
 * clamp(150, 0, 100) // 100
 * clamp(-5, 0, 100) // 0
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
