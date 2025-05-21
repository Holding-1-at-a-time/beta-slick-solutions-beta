"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle, Clock, ThumbsUp } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface EstimateViewProps {
  orgId: string
  vehicleId: string
  assessmentId: string
}

export function EstimateView({ orgId, vehicleId, assessmentId }: EstimateViewProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const estimateDetails = useQuery(api.assessmentDetails.getEstimateDetails, {
    orgId,
    assessmentId: assessmentId as Id<"assessments">,
  })

  const approveEstimateMutation = useMutation(api.assessmentDetails.approveEstimate)

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    revision_requested: "bg-purple-100 text-purple-800",
    approved: "bg-green-100 text-green-800",
  }

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-4 h-4 mr-1" />,
    in_progress: <Clock className="w-4 h-4 mr-1" />,
    completed: <CheckCircle className="w-4 h-4 mr-1" />,
    revision_requested: <AlertCircle className="w-4 h-4 mr-1" />,
    approved: <CheckCircle className="w-4 h-4 mr-1" />,
  }

  if (!estimateDetails) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b pb-4">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between mt-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/6" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 pt-4 border-t">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/6" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { assessment, vehicle, estimate, lineItems } = estimateDetails

  const navigateToBook = async () => {
    setIsLoading(true)
    try {
      await approveEstimateMutation({
        orgId,
        assessmentId: assessmentId as Id<"assessments">,
      })

      toast({
        title: "Estimate approved",
        description: "You can now book an appointment for your vehicle service.",
      })

      router.push(`/org/${orgId}/dashboard/client/vehicles/${vehicleId}/assessments/${assessmentId}/book`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve estimate. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const navigateToRevisions = () => {
    setIsLoading(true)
    router.push(`/org/${orgId}/dashboard/client/vehicles/${vehicleId}/assessments/${assessmentId}/revisions`)
  }

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.price, 0)
  const taxRate = 0.0825 // 8.25% tax rate
  const tax = subtotal * taxRate
  const total = subtotal + tax

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Service Estimate</CardTitle>
              <CardDescription>
                {vehicle.year} {vehicle.make} {vehicle.model} - Estimate #{estimate._id.substring(0, 8)}
              </CardDescription>
            </div>
            <Badge className={statusColors[estimate.status] || "bg-gray-100"}>
              {statusIcons[estimate.status]}
              {estimate.status.replace("_", " ").charAt(0).toUpperCase() + estimate.status.replace("_", " ").slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500">Assessment Description</h3>
            <p className="mt-1">{assessment.description}</p>
          </div>

          <h3 className="font-medium text-lg mb-4">Line Items</h3>

          <div className="space-y-4">
            {lineItems.map((item) => (
              <div key={item._id} className="border-b pb-4">
                <h4 className="font-medium">{item.description}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    {item.laborHours ? `Labor: ${item.laborHours} hours` : "Parts"}
                  </span>
                  <span className="font-medium">${item.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax (8.25%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={navigateToRevisions}
            disabled={isLoading || estimate.status === "approved"}
          >
            Request Revision
          </Button>
          <Button onClick={navigateToBook} disabled={isLoading || estimate.status === "approved"}>
            <ThumbsUp className="mr-2 h-4 w-4" /> Approve Estimate
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
