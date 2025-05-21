import * as Sentry from "@sentry/nextjs"

// Extract logger for consistent usage
export const { logger } = Sentry

/**
 * Safely captures an exception with Sentry
 * @param error The error to capture
 * @param context Additional context to include with the error
 */
export function captureException(error: unknown, context?: Record<string, any>): void {
  try {
    Sentry.captureException(error, { extra: context })
  } catch (sentryError) {
    // Prevent Sentry errors from causing issues
    console.error("Failed to capture exception with Sentry:", sentryError)
    console.error("Original error:", error)
  }
}

/**
 * Creates a traced function that will be monitored in Sentry
 * @param options Span options including operation name and type
 * @param callback The function to trace
 * @returns The result of the callback function
 */
export function withSentryTrace<T>(
  options: { name: string; op: string; attributes?: Record<string, any> },
  callback: () => Promise<T> | T,
): Promise<T> | T {
  return Sentry.startSpan(
    {
      name: options.name,
      op: options.op,
      attributes: options.attributes,
    },
    callback,
  )
}

/**
 * Wraps an API handler with Sentry error capturing
 * @param handler The API handler function
 * @returns A wrapped handler function
 */
export function withSentryApiHandler<T extends (...args: any[]) => Promise<any>>(handler: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args)
    } catch (error) {
      captureException(error, { args })
      throw error
    }
  }) as T
}

/**
 * Creates a transaction for measuring UI interactions
 * @param name The name of the interaction
 * @param attributes Additional attributes to include with the transaction
 * @param callback The function to execute within the transaction
 */
export function trackUiInteraction<T>(
  name: string,
  attributes: Record<string, any>,
  callback: () => Promise<T> | T,
): Promise<T> | T {
  return withSentryTrace(
    {
      name,
      op: "ui.interaction",
      attributes,
    },
    callback,
  )
}

/**
 * Creates a transaction for measuring API calls
 * @param method The HTTP method
 * @param url The URL being called
 * @param attributes Additional attributes to include with the transaction
 * @param callback The function to execute within the transaction
 */
export function trackApiCall<T>(
  method: string,
  url: string,
  attributes: Record<string, any>,
  callback: () => Promise<T> | T,
): Promise<T> | T {
  return withSentryTrace(
    {
      name: `${method} ${url}`,
      op: "http.client",
      attributes,
    },
    callback,
  )
}
