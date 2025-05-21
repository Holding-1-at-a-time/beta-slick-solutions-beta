"use client"

import { useEffect, useState } from "react"
import { dynamicPricingAgent } from "@/app/actions/pricing"
import { CostBreakdownCard } from "@/components/pricing/cost-breakdown-card"
import { AdjustmentForm } from "@/components/pricing/adjustment-form"
import { FinalPricingCard } from "@/components/pricing/final-pricing-card"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"

export function DynamicPricingAgent({ contextId }: { contextId: string }) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [breakdown, setBreakdown] = useState<any>(null)
  const [adjustment, setAdjustment] = useState<any>(null)
  const [finalPrice, setFinalPrice] = useState<number | null>(null)

  useEffect(() => {
    const runPricingFlow = async () => {
      try {
        setLoading(true)

        // Step 1: Get cost breakdown
        setStep(1)
        const breakdownData = await dynamicPricingAgent(contextId, "breakdown")
        setBreakdown(breakdownData)
        setLoading(false)

        // Step 2: Get adjustment options
        setStep(2)
        const adjustmentData = await dynamicPricingAgent(contextId, "adjustment")
        setAdjustment(adjustmentData)

        // Step 3: Calculate final price
        setStep(3)
        const finalPriceData = await dynamicPricingAgent(contextId, "final", adjustment)
        setFinalPrice(finalPriceData.total)

        // Log the trajectory for RL/HER
        await logTrajectory(contextId, "pricing", {
          breakdown: breakdownData,
          adjustment: adjustmentData,
          finalPrice: finalPriceData,
        })
      } catch (error) {
        console.error("Error in DynamicPricingAgent:", error)
        setLoading(false)
      }
    }

    runPricingFlow()
  }, [contextId])

  // Helper function to log trajectory
  const logTrajectory = async (contextId: string, type: string, data: any) => {
    // In a real implementation, this would call a server action to log the trajectory
    console.log("Logging trajectory:", { contextId, type, data })
  }

  if (loading && step === 0) {
    return <LoadingPlaceholder message="Calculating Cost..." />
  }

  return (
    <div className="space-y-6">
      {breakdown && <CostBreakdownCard breakdown={breakdown} />}

      {step >= 2 && adjustment && (
        <AdjustmentForm adjustment={adjustment} onAdjust={(newAdjustment) => setAdjustment(newAdjustment)} />
      )}

      {step >= 3 && finalPrice !== null && <FinalPricingCard total={finalPrice} />}
    </div>
  )
}
