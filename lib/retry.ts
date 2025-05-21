import { createLogger } from "./logging"

const logger = createLogger("RetryUtility")

export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffFactor?: number
  retryableErrors?: Array<string | RegExp>
  onRetry?: (error: Error, attempt: number) => void
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffFactor: 2,
  retryableErrors: [], // By default, retry all errors
  onRetry: () => {},
}

/**
 * Executes a function with exponential backoff retry logic
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const opts = { ...defaultOptions, ...options }
  let attempt = 0
  let delay = opts.initialDelay

  while (true) {
    try {
      return await fn()
    } catch (error) {
      attempt++

      // If we've reached the max retries, throw the error
      if (attempt >= opts.maxRetries) {
        logger.warn(`Max retries (${opts.maxRetries}) reached, giving up`, {
          attempts: attempt,
          error: error instanceof Error ? error.message : String(error),
        })
        throw error
      }

      // Check if the error is retryable
      const errorMessage = error instanceof Error ? error.message : String(error)
      const isRetryable =
        opts.retryableErrors.length === 0 ||
        opts.retryableErrors.some((pattern) =>
          typeof pattern === "string" ? errorMessage.includes(pattern) : pattern.test(errorMessage),
        )

      if (!isRetryable) {
        logger.warn(`Error is not retryable, giving up`, {
          attempts: attempt,
          error: errorMessage,
        })
        throw error
      }

      // Calculate the next delay with exponential backoff
      delay = Math.min(delay * opts.backoffFactor, opts.maxDelay)

      // Add some jitter to prevent thundering herd
      const jitter = delay * 0.2 * Math.random()
      const actualDelay = delay + jitter

      logger.info(`Retrying after error (attempt ${attempt}/${opts.maxRetries})`, {
        delay: actualDelay,
        error: errorMessage,
      })

      // Call the onRetry callback
      opts.onRetry(error instanceof Error ? error : new Error(errorMessage), attempt)

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, actualDelay))
    }
  }
}

/**
 * Creates a retryable version of a function
 */
export function createRetryable<T extends (...args: any[]) => Promise<any>>(fn: T, options: RetryOptions = {}): T {
  return ((...args: Parameters<T>) => {
    return withRetry(() => fn(...args), options)
  }) as T
}
