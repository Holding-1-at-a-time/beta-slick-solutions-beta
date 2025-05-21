"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// Mock data for AI insights - would be replaced with real AI-generated insights
const mockInsights = {
  performanceData: [
    { day: "Mon", appointments: 4, completed: 3 },
    { day: "Tue", appointments: 6, completed: 5 },
    { day: "Wed", appointments: 5, completed: 4 },
    { day: "Thu", appointments: 7, completed: 6 },
    { day: "Fri", appointments: 8, completed: 7 },
    { day: "Sat", appointments: 3, completed: 3 },
    { day: "Sun", appointments: 0, completed: 0 },
  ],
  revenueData: [
    { day: "Mon", revenue: 450 },
    { day: "Tue", revenue: 780 },
    { day: "Wed", revenue: 620 },
    { day: "Thu", revenue: 910 },
    { day: "Fri", revenue: 1050 },
    { day: "Sat", revenue: 380 },
    { day: "Sun", revenue: 0 },
  ],
  insights: [
    "Your completion rate is 15% higher than the shop average.",
    "Friday is your most productive day, with 8 appointments on average.",
    "Your average service time is 20 minutes faster than other staff members.",
    "Customers rate your service quality 4.8/5 stars on average.",
  ],
  recommendations: [
    "Consider taking on more appointments on Mondays, which tend to be lighter.",
    "Your expertise in brake repairs could be leveraged for training other staff.",
    "Customers appreciate your detailed explanations - continue this practice.",
  ],
}

export default function AIInsightsAgent() {
  const [isLoading, setIsLoading] = useState(true)
  const [insights, setInsights] = useState<typeof mockInsights | null>(null)

  useEffect(() => {
    // Simulate AI processing delay
    const timer = setTimeout(() => {
      setInsights(mockInsights)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!insights) {
    return <p>Error loading AI insights.</p>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-md font-medium mb-4">Weekly Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#94a3b8" name="Scheduled" />
                <Bar dataKey="completed" fill="#00AE98" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-md font-medium mb-4">Weekly Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={insights.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#00AE98" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-md font-medium mb-4">Performance Insights</h3>
          <ul className="space-y-2">
            {insights.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4">
          <h3 className="text-md font-medium mb-4">Recommendations</h3>
          <ul className="space-y-2">
            {insights.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
