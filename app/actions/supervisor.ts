"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/convex"
import { createChatCompletion } from "./ai"

export async function supervisorAgent(orgId: string, task: string) {
  const { orgId: authOrgId } = auth()
  if (!authOrgId || authOrgId !== orgId) {
    throw new Error("Unauthorized: Must be signed in with the correct organization")
  }

  try {
    // Step 1: Determine which agents to use
    const routingDecision = await createChatCompletion(`
      You are a supervisor agent that routes tasks to specialized agents.
      Given this task: "${task}"
      
      Determine which of these agents should handle it:
      - PerceptionAgent: Analyzes vehicle images for damage
      - SchedulerAgent: Optimizes appointment scheduling
      - DynamicPricingAgent: Calculates service pricing
      - InsightsAgent: Analyzes business metrics
      - RecommendationAgent: Suggests services for customers
      
      Return a JSON object with the agents to use and the order they should be called.
    `)

    const agentSequence = routingDecision.agents || []

    // Step 2: Execute each agent in sequence
    const tasks = []
    let contextData = {}

    for (const agent of agentSequence) {
      tasks.push({
        label: `Running ${agent}`,
        status: "running",
        details: `Processing ${agent} for task: ${task}`,
      })

      // Mock agent execution
      // In a real implementation, this would call the actual agent
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update task status
      tasks[tasks.length - 1].status = "done"
      tasks[tasks.length - 1].details = `Completed ${agent} successfully`

      // Update context data
      contextData = {
        ...contextData,
        [`${agent.toLowerCase()}Result`]: `Result from ${agent}`,
      }
    }

    // Step 3: Generate summary
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

    return {
      tasks,
      summary: summary.summary,
    }
  } catch (error) {
    console.error("Error in supervisorAgent:", error)
    throw new Error("Failed to execute supervisor agent")
  }
}
