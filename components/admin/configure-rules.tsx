"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "convex/react"
import { query, mutation } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ConfigureRulesProps {
  onError?: (message: string) => void
}

export function ConfigureRules({ onError }: ConfigureRulesProps) {
  const {
    results: tenant,
    isLoading,
    isError,
    error,
  } = useQuery(query("getTenantSettings")) || {
    results: null,
    isLoading: true,
    isError: false,
  }

  const [requireDeposit, setRequireDeposit] = useState(false)
  const [depositPercentage, setDepositPercentage] = useState(20)
  const [urgencyFeeMultiplier, setUrgencyFeeMultiplier] = useState(1.5)
  const [stripeAccountId, setStripeAccountId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const queryClient = useQueryClient()
  const updateRules = useMutation(mutation("updateRules"))

  useEffect(() => {
    if (tenant) {
      setRequireDeposit(tenant.requireDeposit || false)
      setDepositPercentage(tenant.depositPercentage || 20)
      setUrgencyFeeMultiplier(tenant.urgencyFeeMultiplier || 1.5)
      setStripeAccountId(tenant.stripeAccountId || "")
    }
  }, [tenant])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    setLocalError(null)
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    setLocalError(null)

    // Validate inputs
    if (requireDeposit && (depositPercentage < 1 || depositPercentage > 100)) {
      const errorMessage = "Deposit percentage must be between 1 and 100"
      setLocalError(errorMessage)
      if (onError) onError(errorMessage)
      setIsSubmitting(false)
      return
    }

    if (urgencyFeeMultiplier < 1) {
      const errorMessage = "Urgency fee multiplier must be at least 1"
      setLocalError(errorMessage)
      if (onError) onError(errorMessage)
      setIsSubmitting(false)
      return
    }

    try {
      await updateRules({
        requireDeposit,
        depositPercentage,
        urgencyFeeMultiplier,
        stripeAccountId,
      })

      queryClient.invalidateQueries(["getTenantSettings"])
    } catch (error) {
      console.error("Failed to update rules:", error)
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred while updating business rules"

      setLocalError(errorMessage)
      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load tenant settings: {error?.message || "Unknown error"}
          <div className="mt-4">
            <Button onClick={handleRetry} size="sm" variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Rules</CardTitle>
        <CardDescription>Configure payment and booking policies</CardDescription>
      </CardHeader>
      <CardContent>
        {localError && !onError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{localError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6 max-w-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Require Deposit</h3>
              <p className="text-sm text-muted-foreground">Require customers to pay a deposit when booking</p>
            </div>
            <Switch checked={requireDeposit} onCheckedChange={setRequireDeposit} />
          </div>

          {requireDeposit && (
            <div>
              <label className="text-sm font-medium mb-1 block">Deposit Percentage</label>
              <div className="flex items-center">
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={depositPercentage}
                  onChange={(e) => setDepositPercentage(Number(e.target.value))}
                  className="max-w-[100px]"
                />
                <span className="ml-2">%</span>
              </div>
              {depositPercentage < 1 || depositPercentage > 100 ? (
                <p className="text-xs text-destructive mt-1">Percentage must be between 1 and 100</p>
              ) : null}
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-1 block">Urgency Fee Multiplier</label>
            <div className="flex items-center">
              <Input
                type="number"
                min="1"
                step="0.1"
                value={urgencyFeeMultiplier}
                onChange={(e) => setUrgencyFeeMultiplier(Number(e.target.value))}
                className="max-w-[100px]"
              />
              <span className="ml-2">×</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Multiplier applied to urgent service requests</p>
            {urgencyFeeMultiplier < 1 ? (
              <p className="text-xs text-destructive mt-1">Multiplier must be at least 1</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Stripe Account ID</label>
            <Input
              value={stripeAccountId}
              onChange={(e) => setStripeAccountId(e.target.value)}
              placeholder="acct_..."
            />
            <p className="text-xs text-muted-foreground mt-1">Your Stripe Connect account ID for payment processing</p>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={
                isSubmitting ||
                (requireDeposit && (depositPercentage < 1 || depositPercentage > 100)) ||
                urgencyFeeMultiplier < 1
              }
            >
              {isSubmitting ? "Saving..." : "Save Rules"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
