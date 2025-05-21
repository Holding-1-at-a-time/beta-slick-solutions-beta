"use client"

import { Card } from "@/components/ui/card"

export function AIInsightsAgent({
  orgId,
}: {
  orgId: string
}) {
  // In a real implementation, this would fetch AI-generated insights
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-muted/50">
        <h3 className="font-medium mb-2">Performance Summary</h3>
        <p>
          Your performance metrics show a 12% increase in completed appointments compared to last month. Revenue has
          increased by 8%, primarily driven by higher-value services like comprehensive assessments and major repairs.
        </p>
      </Card>

      <Card className="p-4 bg-muted/50">
        <h3 className="font-medium mb-2">Efficiency Insights</h3>
        <p>
          Your average turnaround time of 1.8 days is 15% faster than the organization average. Consider sharing your
          workflow techniques with the team to improve overall efficiency.
        </p>
      </Card>

      <Card className="p-4 bg-muted/50">
        <h3 className="font-medium mb-2">Customer Satisfaction</h3>
        <p>
          You've received consistently positive feedback from customers, with 94% rating their experience as
          "excellent". The most frequently mentioned positive aspects are your clear communication and attention to
          detail.
        </p>
      </Card>

      <Card className="p-4 bg-muted/50">
        <h3 className="font-medium mb-2">Recommendations</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Consider offering package deals for customers with multiple vehicles to increase revenue per customer.
          </li>
          <li>Your diagnostic accuracy is high - you could mentor newer team members in this area.</li>
          <li>Schedule optimization could further reduce your turnaround time by an estimated 0.3 days.</li>
        </ul>
      </Card>
    </div>
  )
}
