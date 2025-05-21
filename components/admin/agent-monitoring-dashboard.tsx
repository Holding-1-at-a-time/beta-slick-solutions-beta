"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentLogsViewer } from "./agent-logs-viewer"
import { AgentPerformanceMonitor } from "./agent-performance-monitor"
import { Button } from "@/components/ui/button"
import { Activity, AlertTriangle, BrainCircuit, CheckCircle, Clock, Settings, XCircle } from "lucide-react"

export function AgentMonitoringDashboard({ orgId }: { orgId: string }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for agent status
  const agentStatus = [
    { name: "PerceptionAgent", status: "healthy", latency: 245, uptime: 99.8, errorRate: 0.2 },
    { name: "SchedulerAgent", status: "healthy", latency: 189, uptime: 99.9, errorRate: 0.1 },
    { name: "DynamicPricingAgent", status: "warning", latency: 312, uptime: 98.5, errorRate: 1.5 },
    { name: "InsightsAgent", status: "healthy", latency: 278, uptime: 99.7, errorRate: 0.3 },
    { name: "RecommendationAgent", status: "error", latency: 456, uptime: 95.2, errorRate: 4.8 },
  ]

  // Mock data for recent errors
  const recentErrors = [
    {
      id: "err_1",
      timestamp: Date.now() - 1000 * 60 * 5,
      agent: "RecommendationAgent",
      message: "Failed to generate recommendations: API timeout",
      severity: "high",
    },
    {
      id: "err_2",
      timestamp: Date.now() - 1000 * 60 * 15,
      agent: "DynamicPricingAgent",
      message: "Error calculating final price: Invalid adjustment value",
      severity: "medium",
    },
    {
      id: "err_3",
      timestamp: Date.now() - 1000 * 60 * 45,
      agent: "PerceptionAgent",
      message: "Image analysis failed: Unable to process corrupted image",
      severity: "medium",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-amber-500"
      case "low":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BrainCircuit className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-2xl font-bold">{agentStatus.length}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Healthy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-2xl font-bold">{agentStatus.filter((a) => a.status === "healthy").length}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                  <span className="text-2xl font-bold">{agentStatus.filter((a) => a.status === "warning").length}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-2xl font-bold">{agentStatus.filter((a) => a.status === "error").length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agent Status</CardTitle>
              <CardDescription>Current status of all AI agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Agent</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Avg. Latency</th>
                      <th className="text-left py-3 px-4">Uptime</th>
                      <th className="text-left py-3 px-4">Error Rate</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentStatus.map((agent) => (
                      <tr key={agent.name} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <BrainCircuit className="h-4 w-4 text-gray-500 mr-2" />
                            <span>{agent.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {getStatusIcon(agent.status)}
                            <span className="ml-2 capitalize">{agent.status}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{agent.latency} ms</td>
                        <td className="py-3 px-4">{agent.uptime}%</td>
                        <td className="py-3 px-4">{agent.errorRate}%</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Activity className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-1" />
                              Configure
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Errors</CardTitle>
              <CardDescription>Latest errors from AI agents</CardDescription>
            </CardHeader>
            <CardContent>
              {recentErrors.length === 0 ? (
                <div className="text-center py-6 text-gray-500">No recent errors</div>
              ) : (
                <div className="space-y-4">
                  {recentErrors.map((error) => (
                    <div key={error.id} className="border rounded-md p-4">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <XCircle className={`h-5 w-5 mr-2 ${getSeverityColor(error.severity)}`} />
                          <span className="font-medium">{error.agent}</span>
                        </div>
                        <span className="text-sm text-gray-500">{formatTimestamp(error.timestamp)}</span>
                      </div>
                      <p className="mt-2 text-gray-700">{error.message}</p>
                      <div className="mt-3 flex justify-end">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <AgentPerformanceMonitor orgId={orgId} />
        </TabsContent>

        <TabsContent value="logs">
          <AgentLogsViewer orgId={orgId} />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Agent Settings</CardTitle>
              <CardDescription>Configure global settings for all AI agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Error Handling</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Automatic Retry</p>
                        <p className="text-sm text-gray-500">Automatically retry failed operations</p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="auto-retry" className="mr-2" defaultChecked />
                        <label htmlFor="auto-retry">Enabled</label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Max Retry Attempts</p>
                        <p className="text-sm text-gray-500">Maximum number of retry attempts</p>
                      </div>
                      <input type="number" className="w-20 p-2 border rounded-md" min="1" max="10" defaultValue="3" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Error Notification</p>
                        <p className="text-sm text-gray-500">Send notifications for critical errors</p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="error-notification" className="mr-2" defaultChecked />
                        <label htmlFor="error-notification">Enabled</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Logging</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Log Level</p>
                        <p className="text-sm text-gray-500">Minimum level of logs to record</p>
                      </div>
                      <select className="p-2 border rounded-md">
                        <option value="debug">Debug</option>
                        <option value="info" selected>
                          Info
                        </option>
                        <option value="warn">Warning</option>
                        <option value="error">Error</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Log Retention</p>
                        <p className="text-sm text-gray-500">Number of days to retain logs</p>
                      </div>
                      <input type="number" className="w-20 p-2 border rounded-md" min="1" max="90" defaultValue="30" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Detailed Logging</p>
                        <p className="text-sm text-gray-500">Include detailed context in logs</p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="detailed-logging" className="mr-2" defaultChecked />
                        <label htmlFor="detailed-logging">Enabled</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
