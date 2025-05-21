import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils/format-currency"

interface Recommendation {
  title: string
  description: string
  price: number
  priority: "High" | "Medium" | "Low"
}

interface RecommendationCardProps {
  recommendation: Recommendation
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{recommendation.title}</CardTitle>
          <Badge
            variant={
              recommendation.priority === "High"
                ? "destructive"
                : recommendation.priority === "Medium"
                  ? "warning"
                  : "default"
            }
          >
            {recommendation.priority} Priority
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">{recommendation.description}</p>
          <p className="text-sm font-medium">Estimated Price: {formatCurrency(recommendation.price)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
