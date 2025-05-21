"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import * as Sentry from "@sentry/nextjs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
  componentName?: string
  showHomeButton?: boolean
  homeHref?: string
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Capture error details for logging
    this.setState({ errorInfo })

    // Log the error to Sentry with component context
    Sentry.withScope((scope) => {
      scope.setTag("component", this.props.componentName || "unknown")
      scope.setExtra("componentStack", errorInfo.componentStack)
      scope.setExtra("errorInfo", errorInfo)
      Sentry.captureException(error)
    })

    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  private handleReset = (): void => {
    // Reset the error boundary state
    this.setState({ hasError: false, error: null, errorInfo: null })

    // Call the onReset prop if provided
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Otherwise, use the default fallback UI
      return (
        <Card className="w-full max-w-3xl mx-auto my-8 shadow-lg">
          <CardHeader className="bg-red-50 dark:bg-red-900/20">
            <CardTitle className="text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{this.state.error?.message || "An unexpected error occurred"}</AlertDescription>
            </Alert>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                This error has been automatically reported to our team. If you continue to experience issues, please
                contact support.
              </p>

              {process.env.NODE_ENV === "development" && this.state.errorInfo && (
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium">Technical Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap text-xs bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-auto">
                    {this.state.error?.stack}
                    {"\n\nComponent Stack:\n"}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-4">
            <Button variant="outline" onClick={this.handleReset} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            {this.props.showHomeButton && (
              <Button asChild className="flex-1">
                <Link href={this.props.homeHref || "/"}>
                  <Home className="mr-2 h-4 w-4" />
                  Go to Home
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      )
    }

    // If there's no error, render children normally
    return this.props.children
  }
}

export default ErrorBoundary
