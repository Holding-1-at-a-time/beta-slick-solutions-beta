"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Lightbulb, AlertCircle } from "lucide-react"

interface AIInsightsCardProps {
  orgId: string
  userId: string
  notificationId: string
}

export function AIInsightsCard({ orgId, userId, notificationId }: AIInsightsCardProps) {
  const insights = useQuery(api.notifications.getNotificationInsights, {
    orgId,
    userId,
    notificationId,
  })

  if (!insights) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            AI Insights
          </CardTitle>
          <CardDescription>Loading insights...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
          AI Insights
        </CardTitle>
        <CardDescription>Additional context and recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-700">{insights.summary}</div>

        {insights.recommendations && insights.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recommendations:</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {insights.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}

        {insights.relatedData && Object.keys(insights.relatedData).length > 0 && (
          <div className="bg-gray-50 p-3 rounded-md mt-4">
            <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <AlertCircle className="h-4 w-4 mr-1 text-blue-500" />
              Related Information
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(insights.relatedData).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}: </span>
                  <span className="text-gray-600">
                    {key.toLowerCase().includes("date") || key.toLowerCase().includes("time")
                      ? new Date(value as number).toLocaleString()
                      : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
