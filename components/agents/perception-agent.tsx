"use client"

import { useEffect, useRef, useState } from "react"
import { callVisionAPI } from "@/app/actions/perception"
import { createChatCompletion } from "@/app/actions/ai"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { DetectedIssueList } from "@/components/assessment/detected-issue-list"

export function PerceptionAgent({ assessmentId }: { assessmentId: string }) {
  const [issues, setIssues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const abortRef = useRef<AbortController>()

  useEffect(() => {
    abortRef.current = new AbortController()
    const { signal } = abortRef.current

    const analyzeImages = async () => {
      try {
        setLoading(true)
        // First call vision API to analyze images
        const visionResults = await callVisionAPI(assessmentId, { signal })

        // Then use LLM to interpret the results
        const llmResults = await createChatCompletion(
          `
          You are an auto-inspector. Given this image analysis:
          ${JSON.stringify(visionResults)}
          
          List all detected issues with their severity (High, Medium, Low),
          location on the vehicle, and estimated repair cost.
          Format as JSON array of issues.
        `,
          { signal },
        )

        if (!signal.aborted) {
          setIssues(llmResults.issues || [])
          setLoading(false)
        }
      } catch (error) {
        console.error("Error in PerceptionAgent:", error)
        setLoading(false)
      }
    }

    analyzeImages()

    return () => {
      abortRef.current?.abort()
    }
  }, [assessmentId])

  if (loading) {
    return <LoadingPlaceholder message="Analyzing Images..." />
  }

  return <DetectedIssueList issues={issues} />
}
