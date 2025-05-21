"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertTriangle, ThumbsUp, ThumbsDown } from "lucide-react"
import type { ServiceItem } from "./assessment-form"
import SignaturePad from "./signature-pad"
import { useRouter } from "next/navigation"

export interface Assessment {
  id: string
  vehicleId: string
  tenantId: string
  title: string
  description: string
  mileage: number
  status: string
  customerConcerns?: string
  technicianNotes?: string
  createdAt: number
  updatedAt: number
}

interface EstimateViewerProps {
  assessment: Assessment
  serviceItems: ServiceItem[]
  onApprove?: () => void
  onReject?: () => void
}

export default function EstimateViewer({ assessment, serviceItems, onApprove, onReject }: EstimateViewerProps) {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showSignaturePad, setShowSignaturePad] = useState(false)
  const [signatureData, setSignatureData] = useState<string | null>(null)

  const router = useRouter()

  // Mutations
  const approveEstimate = useMutation(api.assessments.approveEstimate)
  const rejectEstimate = useMutation(api.assessments.rejectEstimate)

  // Calculate totals
  const subtotal = serviceItems.reduce((sum, item) => sum + item.price, 0)
  const taxRate = 0.0825 // 8.25% tax rate
  const tax = subtotal * taxRate
  const total = subtotal + tax

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handleApprove = async () => {
    if (!signatureData) {
      setShowSignaturePad(true)
      return
    }

    setIsApproving(true)

    try {
      if (onApprove) {
        onApprove()
      } else {
        await approveEstimate({
          assessmentId: assessment.id,
          signatureData,
        })

        toast({
          title: "Estimate approved",
          description: "Your estimate has been approved. We'll begin work shortly.",
        })

        // Navigate to the assessment detail page
        router.push(`/dashboard/client/vehicles/${assessment.vehicleId}/assessments/${assessment.id}`)
      }
    } catch (error) {
      console.error("Error approving estimate:", error)
      toast({
        title: "Error",
        description: "Failed to approve estimate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    setIsRejecting(true)

    try {
      if (onReject) {
        onReject()
      } else {
        await rejectEstimate({
          assessmentId: assessment.id,
        })

        toast({
          title: "Estimate rejected",
          description: "Your estimate has been rejected. We'll contact you to discuss alternatives.",
        })

        // Navigate to the assessment detail page
        router.push(`/dashboard/client/vehicles/${assessment.vehicleId}/assessments/${assessment.id}`)
      }
    } catch (error) {
      console.error("Error rejecting estimate:", error)
      toast({
        title: "Error",
        description: "Failed to reject estimate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRejecting(false)
    }
  }

  const handleSignatureComplete = (data: string) => {
    setSignatureData(data)
    setShowSignaturePad(false)
    handleApprove()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Service Estimate</CardTitle>
        <CardDescription>Review the estimated costs for your vehicle service</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Assessment Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Title</p>
                <p className="font-medium">{assessment.title}</p>
              </div>
              <div>
                <p className="text-gray-500">Mileage</p>
                <p className="font-medium">{assessment.mileage.toLocaleString()} miles</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Description</p>
                <p>{assessment.description}</p>
              </div>
              {assessment.customerConcerns && (
                <div className="col-span-2">
                  <p className="text-gray-500">Customer Concerns</p>
                  <p>{assessment.customerConcerns}</p>
                </div>
              )}
              {assessment.technicianNotes && (
                <div className="col-span-2">
                  <p className="text-gray-500">Technician Notes</p>
                  <p>{assessment.technicianNotes}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Service Items</h3>
            <div className="space-y-4">
              {serviceItems.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No service items found</p>
              ) : (
                serviceItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.price)}</p>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between">
                <p className="text-gray-500">Subtotal</p>
                <p>{formatCurrency(subtotal)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Tax (8.25%)</p>
                <p>{formatCurrency(tax)}</p>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium text-lg">
                <p>Total</p>
                <p>{formatCurrency(total)}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
            <AlertTriangle className="text-yellow-500 h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Important Note</p>
              <p className="text-sm text-yellow-700">
                This is an estimate only. Actual costs may vary based on additional parts or labor required during
                service.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
        <Button
          variant="outline"
          className="w-full sm:w-auto flex items-center py-6 sm:py-2"
          onClick={handleReject}
          disabled={isRejecting || isApproving}
        >
          {isRejecting ? (
            <>
              <LoadingSpinner className="mr-2" />
              Rejecting...
            </>
          ) : (
            <>
              <ThumbsDown className="mr-2 h-4 w-4" />
              Reject Estimate
            </>
          )}
        </Button>
        <Button
          className="w-full sm:w-auto flex items-center py-6 sm:py-2"
          onClick={handleApprove}
          disabled={isApproving || isRejecting}
        >
          {isApproving ? (
            <>
              <LoadingSpinner className="mr-2" />
              Approving...
            </>
          ) : (
            <>
              <ThumbsUp className="mr-2 h-4 w-4" />
              Approve Estimate
            </>
          )}
        </Button>
      </CardFooter>

      {showSignaturePad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <Card className="w-full max-w-[95%] sm:max-w-md">
            <CardHeader>
              <CardTitle>Signature Required</CardTitle>
              <CardDescription>Please sign below to approve the estimate</CardDescription>
            </CardHeader>
            <CardContent>
              <SignaturePad onSign={handleSignatureComplete} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowSignaturePad(false)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Card>
  )
}
