"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/convex"
import { createChatCompletion } from "./ai"
import { withErrorHandling } from "@/lib/error-handling"
import { createLogger } from "@/lib/logging"
import { ToolsRegistry } from "@/lib/tools-registry"

const logger = createLogger("SupervisorAgent")

export async function supervisorAgent(orgId: string, task: string) {
  const { orgId: authOrgId } = auth()
  if (!authOrgId || authOrgId !== orgId) {
    throw new Error("Unauthorized: Must be signed in with the correct organization")
  }

  const operationId = await logger.logOperationStart("supervisorAgent", { orgId, task })

  return withErrorHandling(
    async () => {
      // Step 1: Determine which agents to use
      logger.info("Determining which agents to use", { task })
      const routingDecision = await createChatCompletion(`
        You are a supervisor agent that routes tasks to specialized agents.
        Given this task: "${task}"
        
        Determine which of these agents and tools should handle it:
        - PerceptionAgent: Analyzes vehicle images for damage
        - SchedulerAgent: Optimizes appointment scheduling
        - DynamicPricingAgent: Calculates service pricing
        - InsightsAgent: Analyzes business metrics
        - RecommendationAgent: Suggests services for customers
        - SentimentTool: Analyzes sentiment in text
        - DocumentTool: Processes documents and extracts data
        - TranslationTool: Translates text between languages
        - ForecastingTool: Generates forecasts from time series data
        
        Return a JSON object with the agents to use and the order they should be called.
      `)

      const agentSequence = routingDecision.agents || []
      logger.info("Agent sequence determined", { agentSequence })

      // Step 2: Execute each agent in sequence
      const tasks = []
      let contextData = {}

      for (const agent of agentSequence) {
        const taskLogger = logger.child({ agent })
        taskLogger.info(`Starting agent execution`, { agent })

        tasks.push({
          label: `Running ${agent}`,
          status: "running",
          details: `Processing ${agent} for task: ${task}`,
        })

        try {
          // Determine which tool to use based on the agent name
          let result
          switch (agent) {
            case "PerceptionAgent":
              // Mock execution - in a real implementation, this would call the actual agent
              result = { status: "success", data: "Perception analysis complete" }
              break
            case "SchedulerAgent":
              result = { status: "success", data: "Scheduling optimization complete" }
              break
            case "DynamicPricingAgent":
              result = { status: "success", data: "Pricing calculation complete" }
              break
            case "InsightsAgent":
              result = { status: "success", data: "Business insights generated" }
              break
            case "RecommendationAgent":
              result = { status: "success", data: "Service recommendations generated" }
              break
            case "SentimentTool":
              if (task.includes("sentiment") || task.includes("feedback")) {
                result = await ToolsRegistry.SentimentTool.analyzeSentiment(task)
              }
              break
            case "DocumentTool":
              if (task.includes("document") || task.includes("extract")) {
                result = await ToolsRegistry.DocumentTool.extractDocumentData(task, {
                  title: "Document title",
                  content: "Main content",
                  date: "Document date",
                })
              }
              break
            case "TranslationTool":
              if (task.includes("translate") || task.includes("language")) {
                result = await ToolsRegistry.TranslationTool.translateText(task, "Spanish")
              }
              break
            case "ForecastingTool":
              if (task.includes("forecast") || task.includes("predict")) {
                result = await ToolsRegistry.ForecastingTool.generateForecast(
                  [
                    { timestamp: Date.now() - 86400000 * 7, value: 100 },
                    { timestamp: Date.now() - 86400000 * 6, value: 110 },
                    { timestamp: Date.now() - 86400000 * 5, value: 105 },
                    { timestamp: Date.now() - 86400000 * 4, value: 115 },
                    { timestamp: Date.now() - 86400000 * 3, value: 120 },
                    { timestamp: Date.now() - 86400000 * 2, value: 125 },
                    { timestamp: Date.now() - 86400000, value: 130 },
                  ],
                  { forecastPeriods: 7, periodType: "day" },
                )
              }
              break
            default:
              result = { status: "unknown_agent", data: null }
          }

          // Update task status
          tasks[tasks.length - 1].status = "done"
          tasks[tasks.length - 1].details = `Completed ${agent} successfully`

          // Update context data
          contextData = {
            ...contextData,
            [`${agent.toLowerCase()}Result`]: result,
          }

          taskLogger.info(`Completed agent execution`, { agent, result })
        } catch (error) {
          taskLogger.error(`Failed agent execution`, { agent, error })

          // Update task status to failed
          tasks[tasks.length - 1].status = "failed"
          tasks[tasks.length - 1].details =
            `Failed to execute ${agent}: ${error instanceof Error ? error.message : String(error)}`

          // Continue with the next agent
        }
      }

      // Step 3: Generate summary
      logger.info("Generating summary", { contextData })
      const summary = await createChatCompletion(`
        You are a supervisor agent summarizing the results of multiple agent executions.
        Given these results: ${JSON.stringify(contextData)}
        
        Provide a concise summary of the findings and recommendations.
      `)

      // Step 4: Log the experience for RL/HER
      await db.insert("agentMemory", {
        tenantId: orgId,
        agentName: "SupervisorAgent",
        content: JSON.stringify({
          task,
          agentSequence,
          contextData,
          summary: summary.summary,
        }),
        timestamp: Date.now(),
      })

      await logger.logOperationEnd(operationId, "supervisorAgent", true, {
        taskCount: tasks.length,
        summary: summary.summary,
      })

      return {
        tasks,
        summary: summary.summary,
      }
    },
    {
      source: "SupervisorAgent",
      code: "SUPERVISOR_EXECUTION_ERROR",
      severity: "high",
      context: { orgId, task },
    },
  )
}
