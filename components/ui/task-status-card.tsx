import { CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TaskStatusCardProps {
  label: string
  status: "pending" | "running" | "done" | "error"
  details?: string
}

export function TaskStatusCard({ label, status, details }: TaskStatusCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-base font-medium">
          {status === "pending" && <Clock className="mr-2 h-4 w-4 text-muted-foreground" />}
          {status === "running" && <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-500" />}
          {status === "done" && <CheckCircle className="mr-2 h-4 w-4 text-green-500" />}
          {status === "error" && <AlertCircle className="mr-2 h-4 w-4 text-red-500" />}
          {label}
        </CardTitle>
      </CardHeader>
      {details && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{details}</p>
        </CardContent>
      )}
    </Card>
  )
}
