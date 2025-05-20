"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function TenantErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Tenant error boundary caught error:", error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground">
          An unexpected error occurred within the tenant.
          {process.env.NODE_ENV === "development" && (
            <span className="block mt-2 text-sm font-mono bg-muted p-2 rounded">{error.message}</span>
          )}
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
