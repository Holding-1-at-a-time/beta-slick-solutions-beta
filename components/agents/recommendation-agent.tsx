"use client"

import { useState } from "react"
import { CustomerContextSelector } from "@/components/ui/customer-context-selector"
import { Button } from "@/components/ui/button"
import { createChatCompletion } from "@/app/actions/ai"
import { recommendationTool } from "@/app/actions/recommend"
import { RecommendationCard } from "@/components/recommendations/recommendation-card"
import { FeedbackButtons } from "@/components/recommendations/feedback-buttons"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"

export function RecommendationAgent({ orgId }: { orgId: string }) {
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])

  const generateRecommendations = async () => {
    if (!customerId) return

    try {
      setLoading(true)
      setRecommendations([])

      // Fetch customer history
      const history = await recommendationTool(orgId, customerId)

      // Generate recommendations using LLM
      const response = await createChatCompletion(`
        You are a vehicle service advisor. Based on this customer history:
        ${JSON.stringify(history)}
        
        Generate 3 personalized service recommendations. Each recommendation should include:
        1. A title
        2. A description of why this service is recommended
        3. An estimated price
        4. A priority level (High, Medium, Low)
        
        Format as a JSON array of recommendations.
      `)

      setRecommendations(response.recommendations || [])
      setLoading(false)

      // Log for HER
      await logFeedback({
        orgId,
        customerId,
        event: "recommendations_generated",
        data: response.recommendations,
      })
    } catch (error) {
      console.error("Error in RecommendationAgent:", error)
      setLoading(false)
    }
  }

  // Helper function to log feedback
  const logFeedback = async (data: any) => {
    // In a real implementation, this would call a server action to log feedback
    console.log("Logging feedback:", data)
  }

  const handleFeedback = async (recommendationId: string, feedback: "positive" | "negative") => {
    await logFeedback({
      orgId,
      customerId,
      event: "recommendation_feedback",
      recommendationId,
      feedback,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <CustomerContextSelector orgId={orgId} onSelect={(id) => setCustomerId(id)} />
        </div>
        <Button onClick={generateRecommendations} disabled={!customerId || loading}>
          Generate Recommendations
        </Button>
      </div>

      {loading && <LoadingPlaceholder message="Generating Recommendations..." />}

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="border rounded-lg p-4">
            <RecommendationCard recommendation={rec} />
            <div className="mt-4">
              <FeedbackButtons onFeedback={(feedback) => handleFeedback(rec.id, feedback)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
