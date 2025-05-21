"use client"

import { useEffect, useState } from "react"
import { dynamicPricingAgent } from "@/app/actions/pricing"
import { CostBreakdownCard } from "@/components/pricing/cost-breakdown-card"
import { AdjustmentForm } from "@/components/pricing/adjustment-form"
import { FinalPricingCard } from "@/components/pricing/final-pricing-card"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { useToast } from "@/hooks/use-toast"
import { createLogger } from "@/lib/logging"

const logger = createLogger("DynamicPricingAgentUI")

export function DynamicPricingAgent({ contextId }: { contextId: string }) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [breakdown, setBreakdown] = useState<any>(null)
  const [adjustment, setAdjustment] = useState<any>(null)
  const [finalPrice, setFinalPrice] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const runPricingFlow = async () => {
      const operationId = await logger.logOperationStart("runPricingFlow", { contextId })

      try {
        setLoading(true)
        setError(null)

        // Step 1: Get cost breakdown
        logger.info("Starting cost breakdown calculation", { contextId, step: 1 })
        setStep(1)
        const breakdownResponse = await dynamicPricingAgent(contextId, "breakdown")

        if (!breakdownResponse.success) {
          throw new Error(breakdownResponse.error.message)
        }

        setBreakdown(breakdownResponse.data)
        setLoading(false)
        logger.info("Cost breakdown calculation complete", { contextId })

        // Step 2: Get adjustment options
        logger.info("Starting adjustment options calculation", { contextId, step: 2 })
        setStep(2)
        const adjustmentResponse = await dynamicPricingAgent(contextId, "adjustment")

        if (!adjustmentResponse.success) {
          throw new Error(adjustmentResponse.error.message)
        }

        setAdjustment(adjustmentResponse.data)
        logger.info("Adjustment options calculation complete", { contextId })

        // Step 3: Calculate final price
        logger.info("Starting final price calculation", { contextId, step: 3 })
        setStep(3)
        const finalPriceResponse = await dynamicPricingAgent(contextId, "final", adjustment)

        if (!finalPriceResponse.success) {
          throw new Error(finalPriceResponse.error.message)
        }

        setFinalPrice(finalPriceResponse.data.total)
        logger.info("Final price calculation complete", { contextId, finalPrice: finalPriceResponse.data.total })

        // Log the trajectory for RL/HER
        await logTrajectory(contextId, "pricing", {
          breakdown: breakdownResponse.data,
          adjustment: adjustmentResponse.data,
          finalPrice: finalPriceResponse.data,
        })

        await logger.logOperationEnd(operationId, "runPricingFlow", true, {
          contextId,
          finalPrice: finalPriceResponse.data.total,
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        logger.error("Error in DynamicPricingAgent", { contextId, error: errorMessage })
        setError(errorMessage)
        setLoading(false)

        toast({
          title: "Error",
          description: `Failed to calculate pricing: ${errorMessage}`,
          variant: "destructive",
        })

        await logger.logOperationEnd(operationId, "runPricingFlow", false, {
          contextId,
          error: errorMessage,
        })
      }
    }

    runPricingFlow()
  }, [contextId, toast])

  // Helper function to log trajectory
  const logTrajectory = async (contextId: string, type: string, data: any) => {
    try {
      logger.info("Logging trajectory", { contextId, type })
      // In a real implementation, this would call a server action to log the trajectory
      console.log("Logging trajectory:", { contextId, type, data })
    } catch (error) {
      logger.error("Error logging trajectory", { contextId, type, error })
    }
  }

  if (loading && step === 0) {
    return <LoadingPlaceholder message="Calculating Cost..." />
  }

  if (error) {
    return (
      <div className="p-6 border border-red-200 rounded-lg bg-red-50">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Calculating Price</h3>
        <p className="text-red-600">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    )
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
