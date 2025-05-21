import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"

export function usePricingLog(orgId: string, userId: string, logId: string) {
  const log = useQuery(api.pricing.getPricingLogById, { orgId, userId, logId })
  const loading = log === undefined

  return { log, loading }
}
