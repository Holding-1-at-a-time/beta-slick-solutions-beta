"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Id } from "@/convex/_generated/dataModel"

// Mock AI analysis results - this would be replaced with a real AI integration
const mockAnalysis = {
  damageDetection: [
    { area: "Front Bumper", severity: "Moderate", description: "Visible dent on passenger side" },
    { area: "Hood", severity: "Minor", description: "Surface scratches" },
    { area: "Headlight", severity: "Severe", description: "Driver side headlight broken" },
  ],
  serviceRecommendations: [
    { service: "Bumper Repair", urgency: "High", estimatedCost: 350 },
    { service: "Hood Repainting", urgency: "Medium", estimatedCost: 200 },
    { service: "Headlight Replacement", urgency: "High", estimatedCost: 180 },
  ],
  additionalNotes: "Vehicle appears to have been in a front-end collision. Recommend checking frame alignment.",
}

export default function AIAnalysisAgent({
  assessmentId,
}: {
  assessmentId: Id<"assessments">
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [analysis, setAnalysis] = useState<typeof mockAnalysis | null>(null)

  useEffect(() => {
    // Simulate AI processing delay
    const timer = setTimeout(() => {
      setAnalysis(mockAnalysis)
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [assessmentId])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    )
  }

  if (!analysis) {
    return <p>Error loading AI analysis.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-medium mb-2">Damage Detection</h3>
        <div className="bg-gray-50 rounded-md p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Area</th>
                <th className="pb-2">Severity</th>
                <th className="pb-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {analysis.damageDetection.map((damage, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-2">{damage.area}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        damage.severity === "Severe"
                          ? "bg-red-100 text-red-800"
                          : damage.severity === "Moderate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {damage.severity}
                    </span>
                  </td>
                  <td className="py-2">{damage.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium mb-2">Service Recommendations</h3>
        <div className="bg-gray-50 rounded-md p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Service</th>
                <th className="pb-2">Urgency</th>
                <th className="pb-2">Estimated Cost</th>
              </tr>
            </thead>
            <tbody>
              {analysis.serviceRecommendations.map((service, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-2">{service.service}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        service.urgency === "High"
                          ? "bg-red-100 text-red-800"
                          : service.urgency === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {service.urgency}
                    </span>
                  </td>
                  <td className="py-2">${service.estimatedCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {analysis.additionalNotes && (
        <div>
          <h3 className="text-md font-medium mb-2">Additional Notes</h3>
          <div className="bg-gray-50 rounded-md p-4">
            <p>{analysis.additionalNotes}</p>
          </div>
        </div>
      )}
    </div>
  )
}
