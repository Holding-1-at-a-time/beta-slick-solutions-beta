"use client"

import type React from "react"

import ErrorBoundary from "./error-boundary"

interface GlobalErrorBoundaryProps {
  children: React.ReactNode
}

export function GlobalErrorBoundary({ children }: GlobalErrorBoundaryProps) {
  return (
    <ErrorBoundary componentName="GlobalApp" showHomeButton={true} homeHref="/">
      {children}
    </ErrorBoundary>
  )
}
