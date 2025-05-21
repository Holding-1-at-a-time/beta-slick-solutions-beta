"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils/format-date"
import { formatCurrency } from "@/lib/utils/format-currency"
import { getPricingLogById, getPricingLogSteps } from "@/app/actions/pricing"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { CostBreakdownCard } from "@/components/pricing/cost-breakdown-card"
import { AdjustmentForm } from "@/components/pricing/adjustment-form"
import Link from "next/link"

interface PricingLogDetailProps {
  orgId: string
  logId: string
}

export function PricingLogDetail({ orgId, logId }: PricingLogDetailProps) {
  const [log, setLog] = useState<any>(null)
  const [steps, setSteps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stepsLoading, setStepsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLog() {
      try {
        const logData = await getPricingLogById(logId)
        setLog(logData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching pricing log:", err)
        setError("Failed to load pricing log")
        setLoading(false)
      }
    }

    async function fetchSteps() {
      try {
        const stepsData = await getPricingLogSteps(logId)
        setSteps(stepsData)
        setStepsLoading(false)
      } catch (err) {
        console.error("Error fetching pricing log steps:", err)
        setStepsLoading(false)
      }
    }

    fetchLog()
    fetchSteps()
  }, [logId])

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pricing Log Details</CardTitle>
          <CardDescription>Loading pricing log...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <LoadingPlaceholder />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pricing Log Details</CardTitle>
          <CardDescription>Error loading pricing log</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pricing Log Details</h1>
        <Link href={`/${orgId}/dashboard/client/pricing`} className="text-blue-600 hover:underline">
          Back to Pricing
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p>{formatDate(log.timestamp)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">User</h3>
              <p>{log.user?.name || "Unknown User"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Action</h3>
              <p className="capitalize">{log.action}</p>
            </div>
            {log.aiRoute && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">AI Route</h3>
                <p>{log.aiRoute}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Base Service Rates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(log.settings.tenantBasePrice || {}).map(([service, rate]) => (
                <div key={service} className="flex items-center justify-between">
                  <span className="capitalize">{service.replace(/_/g, " ")}</span>
                  <span className="font-medium">{formatCurrency(rate as number)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Labor Rate</h3>
            <p>{formatCurrency(log.settings.laborRate)}/hour</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Parts Markup</h3>
            <p>
              {log.settings.markup}× (equivalent to {((log.settings.markup - 1) * 100).toFixed(0)}% markup)
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Urgency Multipliers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(log.settings.urgencyMultipliers || {}).map(([urgency, multiplier]) => (
                <div key={urgency} className="flex items-center justify-between">
                  <span className="capitalize">{urgency}</span>
                  <span className="font-medium">{(multiplier as number).toFixed(2)}×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Discount Rules</h3>
            <div className="space-y-4">
              {Object.entries(log.settings.discountRules || {}).map(([discount, rule]) => (
                <div key={discount} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{discount} Discount</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${(rule as any).enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {(rule as any).enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  {(rule as any).enabled && (
                    <div className="space-y-2 text-sm">
                      {discount === "loyalty" && (
                        <div className="flex justify-between">
                          <span>Minimum Services</span>
                          <span>{(rule as any).threshold} services</span>
                        </div>
                      )}
                      {discount === "seasonal" && (
                        <div className="flex justify-between">
                          <span>Applicable Months</span>
                          <span>
                            {(rule as any).months
                              .map((m: number) => {
                                const monthNames = [
                                  "Jan",
                                  "Feb",
                                  "Mar",
                                  "Apr",
                                  "May",
                                  "Jun",
                                  "Jul",
                                  "Aug",
                                  "Sep",
                                  "Oct",
                                  "Nov",
                                  "Dec",
                                ]
                                return monthNames[m - 1]
                              })
                              .join(", ")}
                          </span>
                        </div>
                      )}
                      {discount === "bundle" && (
                        <div className="flex justify-between">
                          <span>Minimum Services</span>
                          <span>{(rule as any).threshold} services</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Discount Percentage</span>
                        <span>{(rule as any).discountPercentage}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {stepsLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>Pricing Calculation Steps</CardTitle>
            <CardDescription>Loading calculation steps...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <LoadingPlaceholder />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Pricing Calculation Steps</CardTitle>
            <CardDescription>Step-by-step breakdown of the pricing calculation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <span className="text-gray-500">|</span>
                  <span>{steps[currentStep]?.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 0}>
                    Previous
                  </Button>
                  <Button onClick={handleNextStep} disabled={currentStep === steps.length - 1}>
                    Next
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">{steps[currentStep]?.title}</h3>
                <p className="text-gray-600 mb-6">{steps[currentStep]?.description}</p>

                {steps[currentStep]?.id === "base_pricing" && <CostBreakdownCard data={steps[currentStep]?.data} />}

                {steps[currentStep]?.id === "urgency_multiplier" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(steps[currentStep]?.data.urgencyMultipliers || {}).map(
                        ([urgency, multiplier]) => (
                          <div
                            key={urgency}
                            className={`border rounded-md p-4 text-center ${
                              urgency === steps[currentStep]?.data.selectedUrgency ? "border-primary bg-primary/10" : ""
                            }`}
                          >
                            <h4 className="font-medium capitalize mb-2">{urgency}</h4>
                            <p className="text-2xl font-bold">{(multiplier as number).toFixed(2)}×</p>
                          </div>
                        ),
                      )}
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <p className="font-medium">
                        Selected: <span className="capitalize">{steps[currentStep]?.data.selectedUrgency}</span>
                      </p>
                      <p>Multiplier: {steps[currentStep]?.data.multiplier.toFixed(2)}×</p>
                    </div>
                  </div>
                )}

                {steps[currentStep]?.id === "discount_rules" && (
                  <AdjustmentForm data={steps[currentStep]?.data} readOnly={true} />
                )}

                {steps[currentStep]?.id === "final_price" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border rounded-md p-4 space-y-2">
                        <h4 className="font-medium">Price Calculation</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Base Price</span>
                            <span>{formatCurrency(steps[currentStep]?.data.basePrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>After Urgency Multiplier</span>
                            <span>{formatCurrency(steps[currentStep]?.data.afterUrgency)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>After Discounts</span>
                            <span>{formatCurrency(steps[currentStep]?.data.afterDiscounts)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-medium">
                            <span>Final Price</span>
                            <span>{formatCurrency(steps[currentStep]?.data.finalPrice)}</span>
                          </div>
                        </div>
                      </div>

                      {log.rlData && (
                        <div className="border rounded-md p-4 space-y-2">
                          <h4 className="font-medium">RL/HER Training</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Training Iterations</span>
                              <span>{log.rlData.iterations}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Reward</span>
                              <span>{log.rlData.reward.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Policy Version</span>
                              <span>{log.rlData.policy.version}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
