import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Metric {
  label: string
  value: string
}

interface InsightCardProps {
  title: string
  content: string
  metrics: Metric[]
}

export function InsightCard({ title, content, metrics }: InsightCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>{content}</p>

          {metrics.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
