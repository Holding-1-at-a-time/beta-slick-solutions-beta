"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/convex"

export async function vectorSearch(
  orgId: string,
  query: string,
  collection: string,
  limit = 5,
  filters?: Record<string, any>,
) {
  const { orgId: authOrgId } = auth()
  if (!authOrgId || authOrgId !== orgId) {
    throw new Error("Unauthorized: Must be signed in with the correct organization")
  }

  try {
    // Convert query to embedding
    // In a real implementation, this would call an embedding API
    const mockEmbedding = Array(1536)
      .fill(0)
      .map(() => Math.random() - 0.5)

    // Perform vector search based on collection type
    switch (collection) {
      case "agentMemory":
        return await db
          .query("agentMemory")
          .withIndex("by_embedding", (q) => q.eq("tenantId", orgId).vectorSearch("embedding", mockEmbedding, limit))
          .collect()

      case "mediaAnalysis":
        return await db
          .query("mediaAnalysis")
          .withIndex("by_embedding", (q) => q.eq("tenantId", orgId).vectorSearch("embedding", mockEmbedding, limit))
          .collect()

      default:
        throw new Error(`Unsupported collection: ${collection}`)
    }
  } catch (error) {
    console.error("Error in vectorSearch:", error)
    throw new Error("Failed to perform vector search")
  }
}
