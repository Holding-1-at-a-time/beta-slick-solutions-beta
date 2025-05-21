"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/convex"

export async function callVisionAPI(assessmentId: string, options: { signal?: AbortSignal } = {}) {
  const { orgId } = auth()
  if (!orgId) {
    throw new Error("Unauthorized: Must be signed in with an organization")
  }

  try {
    // Fetch assessment and related media
    const assessment = await db
      .query("assessments")
      .withIndex("by_id_tenant", (q) => q.eq("_id", assessmentId).eq("tenantId", orgId))
      .first()

    if (!assessment) {
      throw new Error("Assessment not found")
    }

    const mediaItems = await db
      .query("media")
      .withIndex("by_assessment", (q) => q.eq("assessmentId", assessmentId).eq("tenantId", orgId))
      .collect()

    // Mock vision API call for now
    // In a real implementation, this would call OpenAI's vision API
    const results = mediaItems.map((media) => ({
      mediaId: media._id,
      issues: [
        {
          type: "damage",
          location: "front bumper",
          severity: "medium",
          boundingBox: { x: 0.2, y: 0.3, width: 0.3, height: 0.2 },
          confidence: 0.87,
        },
        {
          type: "scratch",
          location: "driver door",
          severity: "low",
          boundingBox: { x: 0.5, y: 0.4, width: 0.1, height: 0.3 },
          confidence: 0.92,
        },
      ],
    }))

    return {
      assessmentId,
      results,
      summary: "Vehicle has medium damage on front bumper and minor scratches on driver door.",
    }
  } catch (error) {
    console.error("Error in callVisionAPI:", error)
    throw new Error("Failed to analyze images")
  }
}
