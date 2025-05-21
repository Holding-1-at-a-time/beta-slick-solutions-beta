"use client"

import { useState, useEffect } from "react"
import { listInvoices } from "@/app/actions/invoices"

export interface InvoiceFilters {
  status?: string
  startDate?: number
  endDate?: number
  search?: string
}

export function useInvoices(orgId: string, userId: string, filters: InvoiceFilters = {}) {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    goToPage: (page: number) => {},
  })

  useEffect(() => {
    fetchInvoices(1)
  }, [orgId, userId, filters])

  const fetchInvoices = async (page: number) => {
    try {
      setLoading(true)
      const result = await listInvoices(page, { ...filters, userId })
      setInvoices(result.invoices)
      setPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
        goToPage: fetchInvoices,
      })
      setLoading(false)
    } catch (error) {
      console.error("Error fetching invoices:", error)
      setLoading(false)
    }
  }

  return { invoices, loading, pagination }
}
