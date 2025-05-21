"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertCircle, TrendingUp, Users, Zap } from "lucide-react"

export function AIInsights() {
  const insights = useQuery(query("insightsAgent")) || ""
  const isLoading = insights === ""

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  // Parse insights from bullet points
  const insightPoints = insights
    .split("\n")
    .filter((line) => line.trim().startsWith("•"))
    .map((line) => line.trim().substring(1).trim())

  // Map icons to insights based on content keywords
  const getIconForInsight = (insight: string) => {
    if (insight.toLowerCase().includes("revenue") || insight.toLowerCase().includes("increase")) {
      return <TrendingUp className="h-5 w-5 text-green-500" />
    } else if (insight.toLowerCase().includes("customer") || insight.toLowerCase().includes("churn")) {
      return <Users className="h-5 w-5 text-blue-500" />
    } else if (insight.toLowerCase().includes("implement") || insight.toLowerCase().includes("consider")) {
      return <AlertCircle className="h-5 w-5 text-amber-500" />
    } else {
      return <Zap className="h-5 w-5 text-purple-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights & Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insightPoints.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              {getIconForInsight(insight)}
              <p>{insight}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
