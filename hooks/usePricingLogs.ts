"use client"

import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import { useState } from "react"

export interface PricingLogFilters {
  startDate?: Date
  endDate?: Date
  search?: string
}

export function usePricingLogs(orgId: string, userId: string, filters: PricingLogFilters = {}, page = 1, limit = 10) {
  const [currentPage, setCurrentPage] = useState(page)

  const result = useQuery(api.pricing.listPricingLogs, {
    orgId,
    userId,
    startDate: filters.startDate?.getTime(),
    endDate: filters.endDate?.getTime(),
    search: filters.search,
    page: currentPage,
    limit,
  })

  const logs = result?.logs || []
  const totalPages = result?.totalPages || 1
  const loading = result === undefined

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return {
    logs,
    loading,
    pagination: {
      currentPage,
      totalPages,
      goToPage,
    },
  }
}
