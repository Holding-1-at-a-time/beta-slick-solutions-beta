"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AgentMetric {
  timestamp: number
  successRate: number
  latency: number
  errorRate: number
  throughput: number
}

interface AgentPerformance {
  agent: string
  metrics: AgentMetric[]
}

export function AgentPerformanceMonitor({ orgId }: { orgId: string }) {
  const [performance, setPerformance] = useState<AgentPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("day")
  const { toast } = useToast()

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true)

        // In a real implementation, this would fetch performance metrics from the database
        // For now, we'll generate mock data
        const agents = [
          "PerceptionAgent",
          "SchedulerAgent",
          "DynamicPricingAgent",
          "InsightsAgent",
          "RecommendationAgent",
        ]
        const mockPerformance: AgentPerformance[] = agents.map((agent) => {
          const now = Date.now()
          const metrics: AgentMetric[] = []

          // Generate 24 hourly data points
          for (let i = 0; i < 24; i++) {
            metrics.push({
              timestamp: now - (23 - i) * 3600000,
              successRate: 0.85 + Math.random() * 0.15,
              latency: 200 + Math.random() * 300,
              errorRate: Math.random() * 0.1,
              throughput: 10 + Math.random() * 20,
            })
          }

          return { agent, metrics }
        })

        setPerformance(mockPerformance)
      } catch (error) {
        console.error("Error fetching performance metrics:", error)
        toast({
          title: "Error",
          description: "Failed to fetch agent performance metrics",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPerformance()
  }, [orgId, timeRange, toast])

  const filteredPerformance =
    selectedAgent === "all" ? performance : performance.filter((p) => p.agent === selectedAgent)

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "hour":
        return "Last Hour"
      case "day":
        return "Last 24 Hours"
      case "week":
        return "Last Week"
      case "month":
        return "Last Month"
      default:
        return "Last 24 Hours"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Agent Performance</CardTitle>
        <CardDescription>Monitor the performance metrics of AI agents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {performance.map((p) => (
                  <SelectItem key={p.agent} value={p.agent}>
                    {p.agent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Last Hour</SelectItem>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <Tabs defaultValue="success-rate">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="success-rate">Success Rate</TabsTrigger>
                <TabsTrigger value="latency">Latency</TabsTrigger>
                <TabsTrigger value="error-rate">Error Rate</TabsTrigger>
                <TabsTrigger value="throughput">Throughput</TabsTrigger>
              </TabsList>

              <TabsContent value="success-rate" className="pt-4">
                <h3 className="text-lg font-medium mb-4">Success Rate {getTimeRangeLabel()}</h3>
                <div className="h-[400px]">
                  <ChartContainer
                    config={filteredPerformance.reduce(
                      (acc, p) => {
                        acc[p.agent] = {
                          label: p.agent,
                          color: `hsl(${(performance.findIndex((x) => x.agent === p.agent) * 60) % 360}, 70%, 50%)`,
                        }
                        return acc
                      },
                      {} as Record<string, { label: string; color: string }>,
                    )}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={formatTimestamp}
                          type="number"
                          domain={["dataMin", "dataMax"]}
                          scale="time"
                        />
                        <YAxis domain={[0, 1]} tickFormatter={(value) => `${Math.round(value * 100)}%`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        {filteredPerformance.map((p) => (
                          <Line
                            key={p.agent}
                            type="monotone"
                            data={p.metrics}
                            dataKey="successRate"
                            name={p.agent}
                            stroke={`var(--color-${p.agent})`}
                            activeDot={{ r: 8 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>

              <TabsContent value="latency" className="pt-4">
                <h3 className="text-lg font-medium mb-4">Latency (ms) {getTimeRangeLabel()}</h3>
                <div className="h-[400px]">
                  <ChartContainer
                    config={filteredPerformance.reduce(
                      (acc, p) => {
                        acc[p.agent] = {
                          label: p.agent,
                          color: `hsl(${(performance.findIndex((x) => x.agent === p.agent) * 60) % 360}, 70%, 50%)`,
                        }
                        return acc
                      },
                      {} as Record<string, { label: string; color: string }>,
                    )}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={formatTimestamp}
                          type="number"
                          domain={["dataMin", "dataMax"]}
                          scale="time"
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        {filteredPerformance.map((p) => (
                          <Line
                            key={p.agent}
                            type="monotone"
                            data={p.metrics}
                            dataKey="latency"
                            name={p.agent}
                            stroke={`var(--color-${p.agent})`}
                            activeDot={{ r: 8 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>

              <TabsContent value="error-rate" className="pt-4">
                {/* Similar chart for error rate */}
              </TabsContent>

              <TabsContent value="throughput" className="pt-4">
                {/* Similar chart for throughput */}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
