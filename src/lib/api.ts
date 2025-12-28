/**
 * API Client
 * ==========
 * Production-ready HTTP client with:
 * - Automatic retry with exponential backoff
 * - Rate limit handling (429 responses)
 * - Request timeout
 * - Type-safe responses
 * - Auth token management
 *
 * Usage:
 *   import { api, ApiError } from '@/lib/api'
 *
 *   // GET request
 *   const { data } = await api.get<{ data: User }>('/api/users/1')
 *
 *   // POST request
 *   const { data } = await api.post<{ data: User }>('/api/users', { name: 'John' })
 */

import { logger } from './logger'

// Configuration
const DEFAULT_TIMEOUT = 30_000 // 30 seconds
const UPLOAD_TIMEOUT = 60_000 // 60 seconds for file uploads
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000 // 1 second
const MAX_RETRY_DELAY = 10_000 // 10 seconds

/**
 * API Error class for typed error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: Record<string, string | string[]>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Request configuration
 */
interface RequestConfig extends RequestInit {
  timeout?: number
  retries?: number
  skipRetry?: boolean
}

/**
 * Calculate retry delay with exponential backoff and jitter
 */
function calculateRetryDelay(attempt: number): number {
  const baseDelay = INITIAL_RETRY_DELAY * Math.pow(2, attempt)
  const jitter = Math.random() * 1000 // Add up to 1 second of jitter
  return Math.min(baseDelay + jitter, MAX_RETRY_DELAY)
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Check if an error is retryable
 */
function isRetryableError(status: number): boolean {
  // Retry on server errors and rate limits
  return status >= 500 || status === 429 || status === 408
}

/**
 * API Client class
 */
class ApiClient {
  private baseUrl: string
  private authToken: string | null = null
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  constructor(baseUrl?: string) {
    // Use environment variable or fallback to relative URLs
    this.baseUrl =
      baseUrl ||
      process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== 'undefined' ? '' : 'http://localhost:4000')
  }

  /**
   * Set the auth token for authenticated requests
   */
  setAuthToken(token: string | null): void {
    this.authToken = token
  }

  /**
   * Get the current auth token
   */
  getAuthToken(): string | null {
    return this.authToken
  }

  /**
   * Set a default header for all requests
   */
  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value
  }

  /**
   * Remove a default header
   */
  removeHeader(key: string): void {
    delete this.defaultHeaders[key]
  }

  /**
   * Make an HTTP request with retry logic
   */
  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      timeout = body instanceof FormData ? UPLOAD_TIMEOUT : DEFAULT_TIMEOUT,
      retries = MAX_RETRIES,
      skipRetry = false,
      headers: configHeaders,
      ...fetchConfig
    } = config

    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`

    // Build headers
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(configHeaders as Record<string, string>),
    }

    // Add auth header if token is set
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    // Don't set Content-Type for FormData (browser will set with boundary)
    if (body instanceof FormData) {
      delete headers['Content-Type']
    }

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(url, {
          method,
          headers,
          body: body instanceof FormData ? body : JSON.stringify(body),
          signal: controller.signal,
          ...fetchConfig,
        })

        clearTimeout(timeoutId)

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After')
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : 60_000

          logger.warn('Rate limited', { url, delay, attempt })

          if (attempt < retries && !skipRetry) {
            await sleep(delay)
            continue
          }
        }

        // Handle auth expiry
        if (response.status === 401) {
          // Emit auth-expired event for auth context to handle
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth-expired'))
          }

          throw new ApiError('Authentication expired', 401)
        }

        // Handle error responses
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))

          // Check if retryable
          if (
            isRetryableError(response.status) &&
            attempt < retries &&
            !skipRetry
          ) {
            const delay = calculateRetryDelay(attempt)
            logger.warn('Request failed, retrying', {
              url,
              status: response.status,
              attempt,
              delay,
            })
            await sleep(delay)
            continue
          }

          throw new ApiError(
            errorData.error || errorData.message || `HTTP ${response.status}`,
            response.status,
            errorData.details
          )
        }

        // Parse response
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          return (await response.json()) as T
        }

        // Return empty object for non-JSON responses (e.g., 204 No Content)
        return {} as T
      } catch (error) {
        lastError = error as Error

        // Don't retry on abort (timeout)
        if ((error as Error).name === 'AbortError') {
          throw new ApiError('Request timeout', 408)
        }

        // Don't retry on client errors
        if (error instanceof ApiError && error.status < 500) {
          throw error
        }

        // Retry on network errors
        if (attempt < retries && !skipRetry) {
          const delay = calculateRetryDelay(attempt)
          logger.warn('Network error, retrying', {
            url,
            error: (error as Error).message,
            attempt,
            delay,
          })
          await sleep(delay)
          continue
        }
      }
    }

    throw lastError || new ApiError('Request failed', 500)
  }

  /**
   * GET request
   */
  async get<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', path, undefined, config)
  }

  /**
   * POST request
   */
  async post<T>(
    path: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>('POST', path, body, config)
  }

  /**
   * PUT request
   */
  async put<T>(
    path: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>('PUT', path, body, config)
  }

  /**
   * PATCH request
   */
  async patch<T>(
    path: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>('PATCH', path, body, config)
  }

  /**
   * DELETE request
   */
  async delete<T = void>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', path, undefined, config)
  }
}

// Export singleton instance
export const api = new ApiClient()

// Export class for custom instances
export { ApiClient }
