"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "convex/react"
import { query, mutation } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function ConfigureRules() {
  const tenant = useQuery(query("getTenantSettings")) || null
  const [requireDeposit, setRequireDeposit] = useState(false)
  const [depositPercentage, setDepositPercentage] = useState(20)
  const [urgencyFeeMultiplier, setUrgencyFeeMultiplier] = useState(1.5)
  const [stripeAccountId, setStripeAccountId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSave = async () => {
    setIsSubmitting(true)

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
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!tenant) {
    return <LoadingSpinner />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Rules</CardTitle>
        <CardDescription>Configure payment and booking policies</CardDescription>
      </CardHeader>
      <CardContent>
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
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Rules"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
