"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/convex"

// Function to train RL agents
export async function trainRLAgent(
  orgId: string,
  agentName: "PerceptionAgent" | "SchedulerAgent" | "DynamicPricingAgent",
  options: {
    batchSize?: number
    epochs?: number
    learningRate?: number
  } = {},
) {
  const { orgId: authOrgId } = auth()
  if (!authOrgId || authOrgId !== orgId) {
    throw new Error("Unauthorized: Must be signed in with the correct organization")
  }

  try {
    // Set default options
    const batchSize = options.batchSize || 32
    const epochs = options.epochs || 10
    const learningRate = options.learningRate || 0.001

    // Fetch experiences from replay buffer
    const experiences = await db
      .query("replayBuffer")
      .withIndex("by_agent_tenant", (q) => q.eq("agentName", agentName).eq("tenantId", orgId))
      .order("desc")
      .take(batchSize * epochs)

    // Get current policy
    const currentPolicy = await db
      .query("policies")
      .withIndex("by_agent_version", (q) => q.eq("agentName", agentName))
      .order("desc")
      .first()

    // In a real implementation, this would use a machine learning framework
    // to update the policy based on the experiences
    console.log(`Training ${agentName} with ${experiences.length} experiences`)

    // Mock policy update
    const newVersion = currentPolicy ? currentPolicy.version + 1 : 1
    const newPolicy = {
      tenantId: orgId,
      agentName,
      version: newVersion,
      weights: {
        /* Updated weights would go here */
      },
      hyperparams: {
        batchSize,
        epochs,
        learningRate,
      },
      performance: {
        averageReward: Math.random() * 10,
        successRate: 0.7 + Math.random() * 0.3,
        convergenceEpoch: Math.floor(Math.random() * epochs),
      },
      createdAt: Date.now(),
    }

    // Save new policy
    await db.insert("policies", newPolicy)

    return {
      success: true,
      policyVersion: newVersion,
      trainingStats: {
        experiencesUsed: experiences.length,
        epochs,
        finalPerformance: newPolicy.performance,
      },
    }
  } catch (error) {
    console.error(`Error in trainRLAgent for ${agentName}:`, error)
    throw new Error(`Failed to train ${agentName}`)
  }
}

// Function to add experience to replay buffer
export async function addExperience(
  orgId: string,
  agentName: "PerceptionAgent" | "SchedulerAgent" | "DynamicPricingAgent",
  experience: {
    state: any
    action: any
    reward: number
    nextState: any
    done: boolean
  },
) {
  const { orgId: authOrgId } = auth()
  if (!authOrgId || authOrgId !== orgId) {
    throw new Error("Unauthorized: Must be signed in with the correct organization")
  }

  try {
    // Add experience to replay buffer
    await db.insert("replayBuffer", {
      tenantId: orgId,
      agentName,
      state: experience.state,
      action: experience.action,
      reward: experience.reward,
      nextState: experience.nextState,
      done: experience.done,
      timestamp: Date.now(),
    })

    return { success: true }
  } catch (error) {
    console.error(`Error in addExperience for ${agentName}:`, error)
    throw new Error(`Failed to add experience for ${agentName}`)
  }
}
