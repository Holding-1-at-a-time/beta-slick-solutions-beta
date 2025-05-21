"use client"

import { useState } from "react"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import { insightsTool } from "@/app/actions/insights"
import { InsightChart } from "@/components/insights/insight-chart"
import { InsightCard } from "@/components/insights/insight-card"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"

export function InsightsAgent({ orgId }: { orgId: string }) {
  const [range, setRange] = useState<{ start: number; end: number }>({
    start: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    end: Date.now(),
  })
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState<any[]>([])

  const onRun = async () => {
    try {
      setLoading(true)
      setInsights([])

      // Call the insights tool with the date range
      const result = await insightsTool(orgId, range)

      // Process the results
      setInsights(result)
      setLoading(false)
    } catch (error) {
      console.error("Error in InsightsAgent:", error)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <DateRangePicker value={range} onChange={setRange} />
        </div>
        <Button onClick={onRun} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>

      {loading && <LoadingPlaceholder message="Generating Insights..." />}

      <div className="space-y-6">
        {insights.map((insight, index) => (
          <div key={index}>
            {insight.type === "chart" ? (
              <InsightChart data={insight.data} title={insight.title} />
            ) : (
              <InsightCard title={insight.title} content={insight.content} metrics={insight.metrics} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
