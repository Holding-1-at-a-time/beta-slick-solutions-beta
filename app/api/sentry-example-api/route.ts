import { NextResponse } from "next/server"
import { captureException, logger, withSentryTrace } from "@/lib/sentry-utils"

export const dynamic = "force-dynamic"

// A faulty API route to test Sentry's error monitoring
export async function GET() {
  try {
    // Log information about the request
    logger.info("Sentry example API route called", {
      timestamp: new Date().toISOString(),
    })

    // Create a span to measure performance
    return await withSentryTrace(
      {
        name: "GET /api/sentry-example-api",
        op: "http.server",
        attributes: {
          endpoint: "/api/sentry-example-api",
          method: "GET",
        },
      },
      async () => {
        // Simulate an error
        throw new Error("Sentry Example API Route Error")

        // This code will never execute
        return NextResponse.json({ data: "Testing Sentry Error..." })
      },
    )
  } catch (error) {
    // Capture the exception with Sentry
    captureException(error, {
      endpoint: "/api/sentry-example-api",
      method: "GET",
    })

    // Log the error
    logger.error("Error in Sentry example API route", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Return an error response
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
