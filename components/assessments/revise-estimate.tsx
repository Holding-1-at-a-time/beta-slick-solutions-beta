"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

interface ReviseEstimateProps {
  orgId: string
  vehicleId: string
  assessmentId: string
}

export function ReviseEstimate({ orgId, vehicleId, assessmentId }: ReviseEstimateProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [revisionNotes, setRevisionNotes] = useState("")
  const [issueAdjustments, setIssueAdjustments] = useState<{
    [key: string]: {
      newSeverity?: string
      remove?: boolean
    }
  }>({})

  const assessmentDetails = useQuery(api.assessmentDetails.getAssessmentDetails, {
    orgId,
    assessmentId: assessmentId as Id<"assessments">,
  })

  const requestRevisionMutation = useMutation(api.assessmentDetails.requestEstimateRevision)

  const severityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ]

  const severityColors: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
    critical: "bg-red-500 text-white",
  }

  if (!assessmentDetails) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full mb-4" />
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-8 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { assessment, vehicle, issues } = assessmentDetails

  const handleSeverityChange = (issueId: string, severity: string) => {
    setIssueAdjustments((prev) => ({
      ...prev,
      [issueId]: {
        ...prev[issueId],
        newSeverity: severity,
      },
    }))
  }

  const handleRemoveChange = (issueId: string, checked: boolean) => {
    setIssueAdjustments((prev) => ({
      ...prev,
      [issueId]: {
        ...prev[issueId],
        remove: checked,
      },
    }))
  }

  const handleSubmit = async () => {
    if (!revisionNotes.trim()) {
      toast({
        title: "Error",
        description: "Please provide revision notes explaining your requested changes.",
        variant: "destructive",
      })
      return
    }

    const adjustments = Object.entries(issueAdjustments).map(([issueId, adjustment]) => ({
      issueId: issueId as Id<"assessmentIssues">,
      newSeverity: adjustment.newSeverity,
      remove: adjustment.remove,
    }))

    if (adjustments.length === 0) {
      toast({
        title: "Error",
        description: "Please make at least one adjustment to the assessment.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await requestRevisionMutation({
        orgId,
        assessmentId: assessmentId as Id<"assessments">,
        revisionNotes,
        issueAdjustments: adjustments,
      })

      toast({
        title: "Revision requested",
        description: "Your revision request has been submitted successfully.",
      })

      router.push(`/org/${orgId}/dashboard/client/vehicles/${vehicleId}/assessments/${assessmentId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit revision request. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Request Estimate Revision</CardTitle>
          <CardDescription>Adjust the severity of issues or request their removal from the assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="revisionNotes">Revision Notes</Label>
            <Textarea
              id="revisionNotes"
              placeholder="Please explain why you're requesting these changes..."
              className="mt-2"
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
            />
          </div>

          <h3 className="font-medium text-lg mb-4">Assessment Issues</h3>

          <div className="space-y-6">
            {issues.map((issue) => (
              <Card key={issue._id} className="border">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{issue.title}</CardTitle>
                    <Badge className={severityColors[issue.severity] || "bg-gray-100"}>{issue.severity}</Badge>
                  </div>
                  <CardDescription>{issue.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Adjust Severity</Label>
                      <RadioGroup
                        defaultValue={issue.severity}
                        onValueChange={(value) => handleSeverityChange(issue._id, value)}
                        className="flex space-x-4"
                      >
                        {severityOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={option.value}
                              id={`${issue._id}-${option.value}`}
                              disabled={issueAdjustments[issue._id]?.remove}
                            />
                            <Label
                              htmlFor={`${issue._id}-${option.value}`}
                              className={`text-sm ${issueAdjustments[issue._id]?.remove ? "text-gray-400" : ""}`}
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`remove-${issue._id}`}
                        checked={issueAdjustments[issue._id]?.remove}
                        onCheckedChange={(checked) => handleRemoveChange(issue._id, checked as boolean)}
                      />
                      <Label htmlFor={`remove-${issue._id}`} className="text-sm">
                        Remove this issue from assessment
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Revision Request"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
