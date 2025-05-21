"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/convex"
import type { LogLevel } from "@/lib/logging"

interface AgentLog {
  id: string
  level: LogLevel
  source: string
  message: string
  data?: Record<string, any>
  timestamp: number
}

export function AgentLogsViewer({ orgId }: { orgId: string }) {
  const [logs, setLogs] = useState<AgentLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    level: "all",
    source: "all",
    search: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        // In a real implementation, this would fetch logs from the database
        const fetchedLogs = await db
          .query("agentLogs")
          .withIndex("by_org", (q) => q.eq("orgId", orgId))
          .order("desc")
          .take(100)

        setLogs(fetchedLogs)
      } catch (error) {
        console.error("Error fetching logs:", error)
        toast({
          title: "Error",
          description: "Failed to fetch agent logs",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [orgId, toast])

  const filteredLogs = logs.filter((log) => {
    if (filter.level !== "all" && log.level !== filter.level) return false
    if (filter.source !== "all" && log.source !== filter.source) return false
    if (filter.search && !log.message.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })

  const sources = Array.from(new Set(logs.map((log) => log.source)))

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "debug":
        return "bg-gray-500"
      case "info":
        return "bg-blue-500"
      case "warn":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Agent Logs</CardTitle>
        <CardDescription>View and filter logs from AI agents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search logs..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filter.level} onValueChange={(value) => setFilter({ ...filter, level: value })}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filter.source} onValueChange={(value) => setFilter({ ...filter, source: value })}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setFilter({ level: "all", source: "all", search: "" })}>
                Reset
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center p-8 text-gray-500">No logs found matching your filters</div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Timestamp</th>
                      <th className="px-4 py-2 text-left">Level</th>
                      <th className="px-4 py-2 text-left">Source</th>
                      <th className="px-4 py-2 text-left">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-500">{formatDate(log.timestamp)}</td>
                        <td className="px-4 py-2">
                          <Badge className={`${getLevelColor(log.level)} text-white`}>{log.level}</Badge>
                        </td>
                        <td className="px-4 py-2 text-sm">{log.source}</td>
                        <td className="px-4 py-2">{log.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
