import { captureException } from "@sentry/nextjs"

export type ErrorSeverity = "low" | "medium" | "high" | "critical"

export interface ErrorDetails {
  message: string
  code?: string
  source: string
  severity: ErrorSeverity
  context?: Record<string, any>
  timestamp?: number
}

export interface ErrorResponse<T = any> {
  success: false
  error: ErrorDetails
  data?: T
}

export interface SuccessResponse<T = any> {
  success: true
  data: T
}

export type ApiResponse<T = any> = ErrorResponse<T> | SuccessResponse<T>

/**
 * Centralized error handler for agent operations
 */
export class AgentError extends Error {
  code: string
  source: string
  severity: ErrorSeverity
  context: Record<string, any>
  timestamp: number

  constructor({
    message,
    code = "AGENT_ERROR",
    source,
    severity = "medium",
    context = {},
  }: Omit<ErrorDetails, "timestamp">) {
    super(message)
    this.name = "AgentError"
    this.code = code
    this.source = source
    this.severity = severity
    this.context = context
    this.timestamp = Date.now()

    // Report critical and high severity errors to Sentry
    if (severity === "critical" || severity === "high") {
      captureException(this)
    }
  }

  toJSON(): ErrorDetails {
    return {
      message: this.message,
      code: this.code,
      source: this.source,
      severity: this.severity,
      context: this.context,
      timestamp: this.timestamp,
    }
  }
}

/**
 * Wraps an async function with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorDetails: Omit<ErrorDetails, "message" | "timestamp">,
): Promise<ApiResponse<T>> {
  try {
    const result = await fn()
    return { success: true, data: result }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const agentError = new AgentError({
      message,
      ...errorDetails,
    })

    // Log the error
    console.error(
      `[${agentError.severity.toUpperCase()}] ${agentError.source}: ${agentError.message}`,
      agentError.context,
    )

    return {
      success: false,
      error: agentError.toJSON(),
    }
  }
}
