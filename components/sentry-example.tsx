"use client"

import { useState } from "react"
import * as Sentry from "@sentry/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { trackUiInteraction, trackApiCall, captureException, logger } from "@/lib/sentry-utils"

export function SentryExample() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleTestButtonClick = async () => {
    // Track UI interaction
    await trackUiInteraction(
      "Test Sentry Button Click",
      {
        component: "SentryExample",
        buttonType: "test",
      },
      async () => {
        try {
          setLoading(true)
          setResult(null)

          // Log the button click
          logger.info("Sentry test button clicked", {
            timestamp: new Date().toISOString(),
          })

          // Make an API call that will trigger an error
          await trackApiCall(
            "GET",
            "/api/sentry-example-api",
            {
              component: "SentryExample",
            },
            async () => {
              const response = await fetch("/api/sentry-example-api")
              const data = await response.json()
              return data
            },
          )

          setResult("Success")
        } catch (error) {
          // Capture the exception
          captureException(error, {
            component: "SentryExample",
            action: "testButtonClick",
          })

          // Log the error
          logger.error("Error in test button click handler", {
            error: error instanceof Error ? error.message : String(error),
          })

          setResult("Error: " + (error instanceof Error ? error.message : String(error)))
        } finally {
          setLoading(false)
        }
      },
    )
  }

  const handleManualErrorClick = () => {
    // Create a transaction/span to measure performance
    Sentry.startSpan(
      {
        op: "ui.click",
        name: "Manual Error Button Click",
        attributes: {
          component: "SentryExample",
          buttonType: "manualError",
        },
      },
      () => {
        try {
          // Deliberately throw an error
          throw new Error("Manual error triggered by user")
        } catch (error) {
          // Capture the exception
          Sentry.captureException(error)

          // Set the result
          setResult("Manual error captured by Sentry")
        }
      },
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sentry Integration Example</CardTitle>
        <CardDescription>Test Sentry error monitoring and performance tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500">
          Click the buttons below to test different Sentry features. The first button will make an API call that throws
          an error. The second button will trigger a client-side error.
        </p>
        {result && (
          <div
            className={`p-3 rounded text-sm ${result.startsWith("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
          >
            {result}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleTestButtonClick} disabled={loading} variant="default">
          {loading ? "Loading..." : "Test API Error"}
        </Button>
        <Button onClick={handleManualErrorClick} variant="outline">
          Trigger Manual Error
        </Button>
      </CardFooter>
    </Card>
  )
}
