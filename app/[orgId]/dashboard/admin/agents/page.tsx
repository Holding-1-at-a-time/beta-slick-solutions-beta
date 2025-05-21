import { AgentMonitoringDashboard } from "@/components/admin/agent-monitoring-dashboard"

export default function AgentsMonitoringPage({ params }: { params: { orgId: string } }) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">AI Agents Monitoring</h1>
      <p className="text-gray-500">Monitor and analyze the performance of AI agents in your organization</p>

      <AgentMonitoringDashboard orgId={params.orgId} />
    </div>
  )
}
