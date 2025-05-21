"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { supervisorAgent } from "@/app/actions/supervisor"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, Clock } from "lucide-react"

interface SupervisorAgentProps {
  orgId: string
}

export function SupervisorAgent({ orgId }: SupervisorAgentProps) {
  const [task, setTask] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task.trim()) return

    setIsProcessing(true)
    try {
      const response = await supervisorAgent(orgId, task)
      setResults(response)
      toast({
        title: "Task processed",
        description: "The supervisor agent has completed the task.",
      })
    } catch (error) {
      console.error("Error processing task:", error)
      toast({
        title: "Processing failed",
        description: "Failed to process the task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Supervisor</CardTitle>
        <CardDescription>Coordinate multiple AI agents to solve complex tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter a task for the AI to handle..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isProcessing || !task.trim()}
              className="bg-[#00AE98] hover:bg-[#00AE98]/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process"
              )}
            </Button>
          </div>
        </form>

        {results && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Task Progress</h3>
            <div className="space-y-2">
              {results.tasks.map((t: any, i: number) => (
                <div key={i} className="flex items-center space-x-2 p-2 border rounded-md">
                  {t.status === "done" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-amber-500" />
                  )}
                  <div>
                    <p className="font-medium">{t.label}</p>
                    <p className="text-sm text-gray-500">{t.details}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium mb-2">Summary</h3>
              <p className="text-gray-700">{results.summary}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
