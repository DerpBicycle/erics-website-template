/**
 * Structured Logger
 * =================
 * Production-ready logging with structured JSON output for Grafana Loki.
 * In development, outputs human-readable logs.
 *
 * Usage:
 *   import { logger } from '@/lib/logger'
 *
 *   logger.info('User logged in', { userId: '123' })
 *   logger.error('Failed to fetch data', { error: err.message })
 *   logger.debug('Processing request', { params })
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  service: string
  environment: string
  [key: string]: unknown
}

const SERVICE_NAME = process.env.LOG_SERVICE_NAME || 'website-template'
const ENVIRONMENT = process.env.NODE_ENV || 'development'
const IS_PRODUCTION = ENVIRONMENT === 'production'
const DEBUG_ENABLED =
  process.env.ENABLE_DEBUG_LOGS === 'true' || !IS_PRODUCTION

/**
 * Format a log entry as JSON for structured logging
 */
function formatLogEntry(
  level: LogLevel,
  message: string,
  context?: LogContext
): string {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: SERVICE_NAME,
    environment: ENVIRONMENT,
    ...context,
  }

  return JSON.stringify(entry)
}

/**
 * Format a log entry for development (human-readable)
 */
function formatDevLog(
  level: LogLevel,
  message: string,
  context?: LogContext
): string {
  const timestamp = new Date().toISOString()
  const levelColors: Record<LogLevel, string> = {
    debug: '\x1b[36m', // cyan
    info: '\x1b[32m', // green
    warn: '\x1b[33m', // yellow
    error: '\x1b[31m', // red
  }
  const reset = '\x1b[0m'

  let log = `${levelColors[level]}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}`

  if (context && Object.keys(context).length > 0) {
    log += ` ${JSON.stringify(context)}`
  }

  return log
}

/**
 * Log a message with the specified level
 */
function log(level: LogLevel, message: string, context?: LogContext): void {
  // Skip debug logs in production unless explicitly enabled
  if (level === 'debug' && !DEBUG_ENABLED) {
    return
  }

  const output = IS_PRODUCTION
    ? formatLogEntry(level, message, context)
    : formatDevLog(level, message, context)

  switch (level) {
    case 'debug':
      console.debug(output)
      break
    case 'info':
      console.info(output)
      break
    case 'warn':
      console.warn(output)
      break
    case 'error':
      console.error(output)
      break
  }
}

/**
 * Logger instance with typed methods
 */
export const logger = {
  /**
   * Debug-level logging (hidden in production unless ENABLE_DEBUG_LOGS=true)
   */
  debug(message: string, context?: LogContext): void {
    log('debug', message, context)
  },

  /**
   * Info-level logging for normal operations
   */
  info(message: string, context?: LogContext): void {
    log('info', message, context)
  },

  /**
   * Warning-level logging for potential issues
   */
  warn(message: string, context?: LogContext): void {
    log('warn', message, context)
  },

  /**
   * Error-level logging for failures
   */
  error(message: string, context?: LogContext): void {
    log('error', message, context)
  },

  /**
   * Log an Error object with stack trace
   */
  logError(error: Error, context?: LogContext): void {
    log('error', error.message, {
      ...context,
      name: error.name,
      stack: error.stack,
    })
  },

  /**
   * Create a child logger with default context
   */
  child(defaultContext: LogContext) {
    return {
      debug: (message: string, context?: LogContext) =>
        log('debug', message, { ...defaultContext, ...context }),
      info: (message: string, context?: LogContext) =>
        log('info', message, { ...defaultContext, ...context }),
      warn: (message: string, context?: LogContext) =>
        log('warn', message, { ...defaultContext, ...context }),
      error: (message: string, context?: LogContext) =>
        log('error', message, { ...defaultContext, ...context }),
      logError: (error: Error, context?: LogContext) =>
        log('error', error.message, {
          ...defaultContext,
          ...context,
          name: error.name,
          stack: error.stack,
        }),
    }
  },
}

/**
 * Initialize logger on server startup
 * Called from instrumentation.ts
 */
export function initLogger(): void {
  logger.info('Logger initialized', {
    service: SERVICE_NAME,
    environment: ENVIRONMENT,
    debugEnabled: DEBUG_ENABLED,
  })
}
