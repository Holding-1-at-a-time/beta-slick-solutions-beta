"use client"

import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import { useState } from "react"

export interface InvoiceFilters {
  status?: string
  startDate?: Date
  endDate?: Date
  search?: string
}

export function useInvoices(orgId: string, userId: string, filters: InvoiceFilters = {}, page = 1, limit = 10) {
  const [currentPage, setCurrentPage] = useState(page)

  const result = useQuery(api.invoices.listClientInvoices, {
    orgId,
    userId,
    status: filters.status,
    startDate: filters.startDate?.getTime(),
    endDate: filters.endDate?.getTime(),
    search: filters.search,
    page: currentPage,
    limit,
  })

  const invoices = result?.invoices || []
  const totalPages = result?.totalPages || 1
  const loading = result === undefined

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return {
    invoices,
    loading,
    pagination: {
      currentPage,
      totalPages,
      goToPage,
    },
  }
}
