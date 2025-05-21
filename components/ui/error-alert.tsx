import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorAlertProps {
  title?: string
  error: Error | string
  className?: string
}

export function ErrorAlert({ title = "Error", error, className = "" }: ErrorAlertProps) {
  const errorMessage = error instanceof Error ? error.message : error

  return (
    <Alert variant="destructive" className={`my-4 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  )
}
