"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { callVisionAPI } from "@/app/actions/perception"
import { createChatCompletion } from "@/app/actions/ai"
import { useToast } from "@/hooks/use-toast"
import { createLogger } from "@/lib/logging"
import { Loader2, Camera, Check, AlertTriangle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const logger = createLogger("PerceptionAgentUI")

interface Issue {
  type: string
  severity: string
  location: string
  confidence: number
  estimatedCost?: number
}

interface PerceptionAgentProps {
  assessmentId: string
  orgId: string
  onAnalysisComplete?: (results: any) => void
}

export function PerceptionAgent({ assessmentId, orgId, onAnalysisComplete }: PerceptionAgentProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController>()
  const { toast } = useToast()

  const handleAnalyze = async () => {
    // Abort any ongoing request
    abortRef.current?.abort()

    // Create a new abort controller
    abortRef.current = new AbortController()
    const { signal } = abortRef.current

    const operationId = await logger.logOperationStart("handleAnalyze", { assessmentId, orgId })

    setIsAnalyzing(true)
    setError(null)

    try {
      logger.info("Starting image analysis", { assessmentId, orgId })

      // First call vision API to analyze images
      const visionResponse = await callVisionAPI(assessmentId, { signal })

      if (!visionResponse.success) {
        throw new Error(visionResponse.error.message)
      }

      const visionResults = visionResponse.data
      logger.info("Vision API call complete", {
        assessmentId,
        resultsCount: visionResults.results.length,
      })

      // Then use LLM to interpret the results
      const llmResponse = await createChatCompletion(
        `
        You are an auto-inspector. Given this image analysis:
        ${JSON.stringify(visionResults)}
        
        List all detected issues with their severity (High, Medium, Low),
        location on the vehicle, and estimated repair cost.
        Format as JSON array of issues.
      `,
        { signal },
      )

      if (!llmResponse.success) {
        throw new Error(llmResponse.error.message)
      }

      if (!signal.aborted) {
        setResults(visionResults)
        setIssues(llmResponse.data.issues || [])

        if (onAnalysisComplete) {
          onAnalysisComplete({
            ...visionResults,
            interpretedIssues: llmResponse.data.issues,
          })
        }

        toast({
          title: "Analysis complete",
          description: "Vehicle damage assessment has been completed successfully.",
        })

        logger.info("Analysis complete", {
          assessmentId,
          issuesCount: llmResponse.data.issues?.length || 0,
        })

        await logger.logOperationEnd(operationId, "handleAnalyze", true, {
          assessmentId,
          issuesCount: llmResponse.data.issues?.length || 0,
        })
      }
    } catch (error) {
      if (!signal.aborted) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        logger.error("Error in PerceptionAgent", { assessmentId, error: errorMessage })
        setError(errorMessage)

        toast({
          title: "Analysis failed",
          description: `Failed to analyze vehicle images: ${errorMessage}`,
          variant: "destructive",
        })

        await logger.logOperationEnd(operationId, "handleAnalyze", false, {
          assessmentId,
          error: errorMessage,
        })
      }
    } finally {
      if (!signal.aborted) {
        setIsAnalyzing(false)
      }
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Damage Assessment</CardTitle>
        <CardDescription>Our AI will analyze vehicle images to detect and assess damage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription className="flex flex-col gap-2">
                <p>{error}</p>
                <Button variant="outline" size="sm" onClick={handleAnalyze} className="self-start mt-2">
                  Retry Analysis
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {!results ? (
            <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg">
              <Camera className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500 mb-4">
                Click analyze to process the uploaded images and detect vehicle damage
              </p>
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="bg-[#00AE98] hover:bg-[#00AE98]/90">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Images"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium">Analysis Complete</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setResults(null)}>
                  Reset
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detected Issues</h3>
                {issues.length === 0 ? (
                  <p className="text-gray-500">No issues detected in the vehicle images.</p>
                ) : (
                  <div className="space-y-3">
                    {issues.map((issue, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className={`h-5 w-5 mt-0.5 ${getSeverityColor(issue.severity)}`} />
                          <div>
                            <p className="font-medium">
                              {issue.type} - {issue.severity} severity
                            </p>
                            <p className="text-sm text-gray-500">
                              Location: {issue.location}
                              {issue.confidence && ` (Confidence: ${Math.round(issue.confidence * 100)}%)`}
                            </p>
                            {issue.estimatedCost && (
                              <p className="text-sm font-medium mt-1">
                                Estimated repair cost: ${issue.estimatedCost.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.summary && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Summary</h3>
                    <p className="text-gray-700">{results.summary}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function getSeverityColor(severity: string): string {
  const lowerSeverity = severity.toLowerCase()
  if (lowerSeverity === "high") return "text-red-500"
  if (lowerSeverity === "medium") return "text-amber-500"
  if (lowerSeverity === "low") return "text-yellow-500"
  return "text-gray-500"
}
