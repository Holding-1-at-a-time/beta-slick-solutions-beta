"use client"

import { useEffect, useState } from "react"
import { supervisorAgent } from "@/app/actions/supervisor"
import { TaskStatusCard } from "@/components/ui/task-status-card"
import { SupervisorSummary } from "@/components/supervisor/supervisor-summary"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"

export function SupervisorAgent({ orgId, task }: { orgId: string; task: string }) {
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<any[]>([])
  const [summary, setSummary] = useState<string | null>(null)

  useEffect(() => {
    const runSupervisor = async () => {
      try {
        setLoading(true)
        setTasks([])
        setSummary(null)

        // Call the supervisor agent
        const result = await supervisorAgent(orgId, task)

        // Update tasks and summary
        setTasks(result.tasks || [])
        setSummary(result.summary || null)
        setLoading(false)
      } catch (error) {
        console.error("Error in SupervisorAgent:", error)
        setLoading(false)
      }
    }

    runSupervisor()
  }, [orgId, task])

  if (loading) {
    return <LoadingPlaceholder message="Orchestrating Tasks..." />
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <TaskStatusCard key={index} label={task.label} status={task.status} details={task.details} />
        ))}
      </div>

      {summary && <SupervisorSummary text={summary} />}
    </div>
  )
}
