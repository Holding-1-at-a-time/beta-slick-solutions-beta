"use client"

import { useState, useEffect } from "react"
import { listPricingLogs } from "@/app/actions/pricing"

export interface PricingLogFilters {
  startDate?: number
  endDate?: number
  search?: string
}

export function usePricingLogs(orgId: string, userId: string, filters: PricingLogFilters = {}) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    goToPage: (page: number) => {},
  })

  useEffect(() => {
    fetchLogs(1)
  }, [orgId, userId, filters])

  const fetchLogs = async (page: number) => {
    try {
      setLoading(true)
      const result = await listPricingLogs(page, filters)
      setLogs(result.logs)
      setPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
        goToPage: fetchLogs,
      })
      setLoading(false)
    } catch (error) {
      console.error("Error fetching pricing logs:", error)
      setLoading(false)
    }
  }

  return { logs, loading, pagination }
}
