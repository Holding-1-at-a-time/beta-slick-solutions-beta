"use client"

import type React from "react"
import ErrorBoundary from "./error-boundary"

interface WithErrorBoundaryProps {
  componentName: string
  fallback?: React.ReactNode
  onReset?: () => void
  showHomeButton?: boolean
  homeHref?: string
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: WithErrorBoundaryProps,
): React.FC<P> {
  const { componentName, fallback, onReset, showHomeButton, homeHref } = options

  const WithErrorBoundary: React.FC<P> = (props) => {
    return (
      <ErrorBoundary
        componentName={componentName}
        fallback={fallback}
        onReset={onReset}
        showHomeButton={showHomeButton}
        homeHref={homeHref}
      >
        <Component {...props} />
      </ErrorBoundary>
    )
  }

  // Set display name for better debugging
  WithErrorBoundary.displayName = `WithErrorBoundary(${componentName})`

  return WithErrorBoundary
}
