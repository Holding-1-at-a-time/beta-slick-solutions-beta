import { RevenueAnalytics } from "./revenue-analytics"
import { CustomerAnalytics } from "./customer-analytics"
import { ServiceAnalytics } from "./service-analytics"
import { AIInsights } from "./ai-insights"

export function AnalyticsOverview() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Overview</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueAnalytics />
        <CustomerAnalytics />
        <ServiceAnalytics />
        <AIInsights />
      </div>
    </div>
  )
}
