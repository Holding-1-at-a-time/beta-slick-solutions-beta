"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ErrorBoundary from "./error-boundary"
import { useErrorBoundary } from "@/hooks/use-error-boundary"

// Component that will throw an error
function BuggyCounter() {
  const [counter, setCounter] = useState(0)

  const handleClick = () => {
    setCounter((prevCounter) => prevCounter + 1)
  }

  if (counter === 5) {
    // Simulate an error when counter reaches 5
    throw new Error("I crashed when counter reached 5!")
  }

  return (
    <div className="text-center">
      <p className="mb-4">Counter: {counter}</p>
      <Button onClick={handleClick}>Increment</Button>
      <p className="mt-4 text-sm text-muted-foreground">(This component will crash when counter reaches 5)</p>
    </div>
  )
}

// Component that uses the hook to throw errors
function HookErrorDemo() {
  const { throwError } = useErrorBoundary()

  const handleThrowError = () => {
    throwError(new Error("Error thrown from hook!"))
  }

  return (
    <div className="text-center">
      <Button variant="destructive" onClick={handleThrowError}>
        Throw Error Using Hook
      </Button>
    </div>
  )
}

// Component that causes a render error
function RenderErrorComponent() {
  // This will cause a render error
  const badCode = () => {
    const obj = null
    return obj.nonExistentProperty
  }

  return <div>{badCode()}</div>
}

export function ErrorBoundaryDemo() {
  const [showRenderError, setShowRenderError] = useState(false)

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">Error Boundary Demos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demo 1: Component that throws during event handler */}
        <Card>
          <CardHeader>
            <CardTitle>Event Handler Error</CardTitle>
            <CardDescription>This demonstrates catching an error thrown during an event handler.</CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorBoundary componentName="BuggyCounter">
              <BuggyCounter />
            </ErrorBoundary>
          </CardContent>
        </Card>

        {/* Demo 2: Component that uses hook to throw errors */}
        <Card>
          <CardHeader>
            <CardTitle>Hook Error</CardTitle>
            <CardDescription>
              This demonstrates using a hook to throw errors that are caught by the boundary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorBoundary componentName="HookErrorDemo">
              <HookErrorDemo />
            </ErrorBoundary>
          </CardContent>
        </Card>

        {/* Demo 3: Component that errors during render */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Render Error</CardTitle>
            <CardDescription>This demonstrates catching an error that occurs during rendering.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {showRenderError ? (
                <ErrorBoundary componentName="RenderErrorComponent" onReset={() => setShowRenderError(false)}>
                  <RenderErrorComponent />
                </ErrorBoundary>
              ) : (
                <Button variant="outline" onClick={() => setShowRenderError(true)}>
                  Show Component with Render Error
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
