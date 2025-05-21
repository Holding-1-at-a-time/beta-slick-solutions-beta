"use client"

import { useState, useEffect } from "react"
import { getPricingLogById, getPricingLogSteps } from "@/app/actions/pricing"

export function usePricingLog(orgId: string, userId: string, logId: string) {
  const [log, setLog] = useState<any>(null)
  const [steps, setSteps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stepsLoading, setStepsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLog()
    fetchSteps()
  }, [orgId, userId, logId])

  const fetchLog = async () => {
    try {
      setLoading(true)
      const result = await getPricingLogById(logId)
      setLog(result)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching pricing log:", error)
      setError("Failed to load pricing log")
      setLoading(false)
    }
  }

  const fetchSteps = async () => {
    try {
      setStepsLoading(true)
      const result = await getPricingLogSteps(logId)
      setSteps(result)
      setStepsLoading(false)
    } catch (error) {
      console.error("Error fetching pricing log steps:", error)
      setStepsLoading(false)
    }
  }

  return {
    log,
    steps,
    loading,
    stepsLoading,
    error,
    refreshLog: fetchLog,
    refreshSteps: fetchSteps,
  }
}
