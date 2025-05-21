"use client"

import { useCallback, useState } from "react"

interface ErrorBoundaryHook {
  error: Error | null
  resetError: () => void
  throwError: (error: Error) => void
}

export function useErrorBoundary(): ErrorBoundaryHook {
  const [error, setError] = useState<Error | null>(null)

  // This will be caught by the nearest error boundary
  if (error) {
    throw error
  }

  const throwError = useCallback((error: Error) => {
    setError(error)
  }, [])

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  return { error, resetError, throwError }
}
