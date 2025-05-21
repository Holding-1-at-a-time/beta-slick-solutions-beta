"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/convex"

export async function insightsTool(orgId: string, range: { start: number; end: number }) {
  const { orgId: authOrgId } = auth()
  if (!authOrgId || authOrgId !== orgId) {
    throw new Error("Unauthorized: Must be signed in with the correct organization")
  }

  try {
    // Fetch data for the specified date range
    const invoices = await db
      .query("invoices")
      .withIndex("by_tenant_date", (q) =>
        q.eq("tenantId", orgId).gte("createdAt", range.start).lte("createdAt", range.end),
      )
      .collect()

    const appointments = await db
      .query("appointments")
      .withIndex("by_tenant_date", (q) =>
        q.eq("tenantId", orgId).gte("createdAt", range.start).lte("createdAt", range.end),
      )
      .collect()

    // Generate insights
    // In a real implementation, this would use an LLM to generate insights
    return [
      {
        type: "chart",
        title: "Revenue by Service Type",
        data: {
          labels: ["Oil Change", "Brake Service", "Tire Replacement", "Engine Repair"],
          datasets: [
            {
              label: "Revenue",
              data: [4500, 8200, 6700, 12500],
              backgroundColor: ["#00AE98", "#4C9AFF", "#6554C0", "#FF5630"],
            },
          ],
        },
      },
      {
        type: "card",
        title: "Key Performance Insights",
        content:
          "Revenue has increased by 12% compared to the previous period. The most profitable service is Engine Repair, accounting for 39% of total revenue.",
        metrics: [
          { label: "Total Revenue", value: "$31,900" },
          { label: "Average Invoice", value: "$420" },
          { label: "Completion Rate", value: "94%" },
        ],
      },
      {
        type: "chart",
        title: "Appointments by Day",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Appointments",
              data: [12, 19, 15, 8, 22, 14, 5],
              backgroundColor: "#00AE98",
            },
          ],
        },
      },
      {
        type: "card",
        title: "Recommendations",
        content:
          "Consider adding more staff on Fridays to handle the increased appointment volume. Engine Repair services have the highest profit margin - consider promoting these services more prominently.",
        metrics: [],
      },
    ]
  } catch (error) {
    console.error("Error in insightsTool:", error)
    throw new Error("Failed to generate insights")
  }
}
