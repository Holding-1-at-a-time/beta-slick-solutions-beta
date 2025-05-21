"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/convex"

export async function dynamicPricingAgent(
  contextId: string,
  step: "breakdown" | "adjustment" | "final" = "breakdown",
  adjustmentData?: any,
) {
  const { orgId } = auth()
  if (!orgId) {
    throw new Error("Unauthorized: Must be signed in with an organization")
  }

  try {
    // Fetch context data (assessment, vehicle, etc.)
    const assessment = await db
      .query("assessments")
      .withIndex("by_id_tenant", (q) => q.eq("_id", contextId).eq("tenantId", orgId))
      .first()

    if (!assessment) {
      throw new Error("Assessment not found")
    }

    // Get pricing settings
    const pricingSettings = await db
      .query("pricingLogs")
      .withIndex("by_tenant", (q) => q.eq("tenantId", orgId))
      .order("desc")
      .first()

    if (step === "breakdown") {
      // Generate cost breakdown
      return {
        laborHours: 2.5,
        laborRate: pricingSettings?.laborRate || 85,
        laborCost: 2.5 * (pricingSettings?.laborRate || 85),
        parts: [
          { name: "Front Bumper", cost: 350, markup: 1.2 },
          { name: "Paint Materials", cost: 120, markup: 1.15 },
        ],
        partsCost: 350 * 1.2 + 120 * 1.15,
        subtotal: 2.5 * (pricingSettings?.laborRate || 85) + 350 * 1.2 + 120 * 1.15,
        tax: 0.08 * (2.5 * (pricingSettings?.laborRate || 85) + 350 * 1.2 + 120 * 1.15),
        total: 1.08 * (2.5 * (pricingSettings?.laborRate || 85) + 350 * 1.2 + 120 * 1.15),
      }
    } else if (step === "adjustment") {
      // Generate adjustment options
      return {
        options: [
          { id: "loyalty", label: "Loyalty Discount", value: -50, applied: false },
          { id: "urgency", label: "Urgency Fee", value: 75, applied: false },
          { id: "warranty", label: "Extended Warranty", value: 120, applied: false },
        ],
        customAdjustment: 0,
      }
    } else if (step === "final") {
      // Calculate final price with adjustments
      const breakdown = await dynamicPricingAgent(contextId, "breakdown")

      let adjustmentTotal = 0
      if (adjustmentData) {
        // Apply selected adjustments
        adjustmentData.options.forEach((opt: any) => {
          if (opt.applied) {
            adjustmentTotal += opt.value
          }
        })

        // Apply custom adjustment
        adjustmentTotal += adjustmentData.customAdjustment || 0
      }

      return {
        ...breakdown,
        adjustments: adjustmentTotal,
        total: breakdown.total + adjustmentTotal,
      }
    }

    throw new Error("Invalid step")
  } catch (error) {
    console.error("Error in dynamicPricingAgent:", error)
    throw new Error("Failed to generate pricing")
  }
}
