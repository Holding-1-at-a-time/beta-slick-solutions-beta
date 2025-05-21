"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/convex"

export async function recommendationTool(orgId: string, customerId: string) {
  const { orgId: authOrgId } = auth()
  if (!authOrgId || authOrgId !== orgId) {
    throw new Error("Unauthorized: Must be signed in with the correct organization")
  }

  try {
    // Fetch customer history
    const customer = await db
      .query("users")
      .withIndex("by_id_tenant", (q) => q.eq("_id", customerId).eq("tenantId", orgId))
      .first()

    if (!customer) {
      throw new Error("Customer not found")
    }

    const vehicles = await db
      .query("vehicles")
      .withIndex("by_owner_tenant", (q) => q.eq("ownerId", customerId).eq("tenantId", orgId))
      .collect()

    const appointments = await db
      .query("appointments")
      .withIndex("by_user_tenant", (q) => q.eq("userId", customerId).eq("tenantId", orgId))
      .order("desc")
      .take(10)

    const invoices = await db
      .query("invoices")
      .withIndex("by_user_tenant", (q) => q.eq("userId", customerId).eq("tenantId", orgId))
      .order("desc")
      .take(10)

    // Return customer history
    return {
      customer,
      vehicles,
      appointments,
      invoices,
      lastService: appointments[0]?.date || null,
      preferredServices: ["Oil Change", "Tire Rotation"],
      averageSpend: invoices.reduce((sum, inv) => sum + inv.amount, 0) / invoices.length,
    }
  } catch (error) {
    console.error("Error in recommendationTool:", error)
    throw new Error("Failed to fetch customer history")
  }
}
