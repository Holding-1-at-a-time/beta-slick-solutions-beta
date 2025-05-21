"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

export function AIAnalysisAgent({
  assessmentId,
  orgId,
}: {
  assessmentId: string
  orgId: string
}) {
  // This would be a real AI analysis query in production
  const aiSuggestions = useQuery(query("getAISuggestions"), orgId, assessmentId) || []

  if (!aiSuggestions) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    )
  }

  // For demo purposes, we'll show a placeholder
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 relative overflow-hidden h-64">
          <Image src="/ai-car-damage-analysis.png" alt="AI Car Damage Analysis" fill className="object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
            Front bumper damage detected
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="font-medium">AI-Detected Issues:</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">High</span>
              <span>Front bumper damage - requires replacement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Medium</span>
              <span>Headlight alignment - requires adjustment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Low</span>
              <span>Minor scratches on hood - cosmetic only</span>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">AI Assessment Summary:</h3>
        <p className="text-muted-foreground">
          The vehicle has sustained moderate front-end damage, primarily affecting the bumper and headlight assembly.
          The bumper will need replacement due to structural damage, while the headlights require realignment. Minor
          cosmetic scratches on the hood can be addressed with touch-up paint. No frame damage detected. Estimated
          repair time: 2-3 days.
        </p>
      </div>
    </div>
  )
}
