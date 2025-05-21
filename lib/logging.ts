import { db } from "@/lib/convex"

export type LogLevel = "debug" | "info" | "warn" | "error"

export interface LogEntry {
  level: LogLevel
  source: string
  message: string
  data?: Record<string, any>
  timestamp: number
  orgId?: string
  userId?: string
  sessionId?: string
}

/**
 * Structured logger for agent operations
 */
export class AgentLogger {
  private source: string
  private context: Record<string, any>

  constructor(source: string, context: Record<string, any> = {}) {
    this.source = source
    this.context = context
  }

  /**
   * Log a message with the specified level
   */
  private async log(level: LogLevel, message: string, data: Record<string, any> = {}): Promise<void> {
    const entry: LogEntry = {
      level,
      source: this.source,
      message,
      data: { ...this.context, ...data },
      timestamp: Date.now(),
    }

    // Log to console
    const formattedMessage = `[${level.toUpperCase()}] [${this.source}] ${message}`
    switch (level) {
      case "debug":
        console.debug(formattedMessage, entry.data)
        break
      case "info":
        console.info(formattedMessage, entry.data)
        break
      case "warn":
        console.warn(formattedMessage, entry.data)
        break
      case "error":
        console.error(formattedMessage, entry.data)
        break
    }

    // Store in database for persistent logging
    try {
      await db.insert("agentLogs", entry)
    } catch (error) {
      console.error("Failed to store log entry:", error)
    }
  }

  debug(message: string, data: Record<string, any> = {}): Promise<void> {
    return this.log("debug", message, data)
  }

  info(message: string, data: Record<string, any> = {}): Promise<void> {
    return this.log("info", message, data)
  }

  warn(message: string, data: Record<string, any> = {}): Promise<void> {
    return this.log("warn", message, data)
  }

  error(message: string, data: Record<string, any> = {}): Promise<void> {
    return this.log("error", message, data)
  }

  /**
   * Create a child logger with additional context
   */
  child(additionalContext: Record<string, any>): AgentLogger {
    return new AgentLogger(this.source, { ...this.context, ...additionalContext })
  }

  /**
   * Log the start of an operation
   */
  async logOperationStart(operation: string, data: Record<string, any> = {}): Promise<string> {
    const operationId = `op_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
    await this.info(`Started operation: ${operation}`, { ...data, operationId, operationStatus: "started" })
    return operationId
  }

  /**
   * Log the end of an operation
   */
  async logOperationEnd(
    operationId: string,
    operation: string,
    success: boolean,
    data: Record<string, any> = {},
  ): Promise<void> {
    const status = success ? "completed" : "failed"
    await this.info(`${status.charAt(0).toUpperCase() + status.slice(1)} operation: ${operation}`, {
      ...data,
      operationId,
      operationStatus: status,
    })
  }
}

/**
 * Create a new logger instance
 */
export function createLogger(source: string, context: Record<string, any> = {}): AgentLogger {
  return new AgentLogger(source, context)
}
