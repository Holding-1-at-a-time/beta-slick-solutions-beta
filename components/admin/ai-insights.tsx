"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

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

  // Split insights into bullet points
  const bulletPoints = insights.split("\n").filter((line) => line.trim())

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights & Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 list-disc pl-5">
          {bulletPoints.map((point, index) => (
            <li key={index} className="text-base">
              {point.replace("• ", "")}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
