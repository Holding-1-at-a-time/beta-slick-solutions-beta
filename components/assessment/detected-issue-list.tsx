import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Issue {
  type: string
  location: string
  severity: "High" | "Medium" | "Low"
  estimatedCost?: number
  confidence?: number
  boundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
}

interface DetectedIssueListProps {
  issues: Issue[]
}

export function DetectedIssueList({ issues }: DetectedIssueListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Detected Issues</h3>

      {issues.length === 0 ? (
        <p className="text-muted-foreground">No issues detected.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {issues.map((issue, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">{issue.type}</CardTitle>
                  <Badge
                    variant={
                      issue.severity === "High" ? "destructive" : issue.severity === "Medium" ? "warning" : "default"
                    }
                  >
                    {issue.severity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Location:</span> {issue.location}
                  </p>
                  {issue.estimatedCost && (
                    <p className="text-sm">
                      <span className="font-medium">Est. Cost:</span> ${issue.estimatedCost.toFixed(2)}
                    </p>
                  )}
                  {issue.confidence && (
                    <p className="text-sm">
                      <span className="font-medium">Confidence:</span> {(issue.confidence * 100).toFixed(0)}%
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
