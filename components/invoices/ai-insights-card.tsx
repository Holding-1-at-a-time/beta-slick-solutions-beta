"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getInvoiceStatistics } from "@/app/actions/invoices"
import { formatCurrency } from "@/lib/utils/format-currency"
import { AIInsightsAgent } from "@/components/invoices/ai-insights-agent"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"

interface AIInsightsCardProps {
  orgId: string
  userId: string
  invoiceId: string
}

export function AIInsightsCard({ orgId, userId, invoiceId }: AIInsightsCardProps) {
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStatistics() {
      try {
        const stats = await getInvoiceStatistics(invoiceId)
        setStatistics(stats)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching invoice statistics:", err)
        setError("Failed to load invoice insights")
        setLoading(false)
      }
    }

    fetchStatistics()
  }, [invoiceId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Loading invoice insights...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <LoadingPlaceholder />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Error loading insights</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
        <CardDescription>AI-generated analysis of your invoice</CardDescription>
      </CardHeader>
      <CardContent>
        <AIInsightsAgent statistics={statistics} />

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium mb-2">Comparison to Average</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Your Invoice</span>
                <span className="font-medium">{formatCurrency(statistics.invoiceAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Average Invoice</span>
                <span>{formatCurrency(statistics.averageAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Difference</span>
                <span className={statistics.percentageDifference > 0 ? "text-red-600" : "text-green-600"}>
                  {statistics.percentageDifference > 0 ? "+" : ""}
                  {statistics.percentageDifference.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium mb-2">Your History</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Your Average</span>
                <span>{formatCurrency(statistics.userAverageAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Invoices</span>
                <span>{statistics.userInvoiceCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Compared to Your Average</span>
                <span className={statistics.userPercentageDifference > 0 ? "text-red-600" : "text-green-600"}>
                  {statistics.userPercentageDifference > 0 ? "+" : ""}
                  {statistics.userPercentageDifference.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
