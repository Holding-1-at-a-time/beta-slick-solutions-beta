"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ConfigureRulesProps {
  tenant?: any
  onError?: (error: Error) => void
}

export function ConfigureRules({ tenant, onError }: ConfigureRulesProps) {
  const { toast } = useToast()
  const updateRules = useMutation(api.admin.updateRules)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    requireDeposit: tenant?.requireDeposit || false,
    depositPercentage: tenant?.depositPercentage || 20,
    urgencyFeeMultiplier: tenant?.urgencyFeeMultiplier || 1.5,
    stripeAccountId: tenant?.stripeAccountId || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)

    try {
      await updateRules(formData)
      toast({
        title: "Business rules updated",
        description: "Your business rules have been updated successfully.",
      })
    } catch (error) {
      const err = error as Error
      setFormError(err.message)
      if (onError) {
        onError(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Rules</CardTitle>
        <CardDescription>Configure your organization's business rules and policies.</CardDescription>
      </CardHeader>

      {formError && (
        <CardContent className="pt-0">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        </CardContent>
      )}

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="requireDeposit">Require Deposit</Label>
              <p className="text-sm text-muted-foreground">
                Require customers to pay a deposit before scheduling service.
              </p>
            </div>
            <Switch
              id="requireDeposit"
              checked={formData.requireDeposit}
              onCheckedChange={(checked) => setFormData({ ...formData, requireDeposit: checked })}
              disabled={isSubmitting}
            />
          </div>

          {formData.requireDeposit && (
            <div className="space-y-2">
              <Label htmlFor="depositPercentage">Deposit Percentage</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="depositPercentage"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.depositPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, depositPercentage: Number.parseInt(e.target.value) || 0 })
                  }
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <span className="text-lg">%</span>
              </div>
              <p className="text-sm text-muted-foreground">Percentage of the total service cost required as deposit.</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="urgencyFeeMultiplier">Urgency Fee Multiplier</Label>
            <Input
              id="urgencyFeeMultiplier"
              type="number"
              min="1"
              step="0.1"
              value={formData.urgencyFeeMultiplier}
              onChange={(e) =>
                setFormData({ ...formData, urgencyFeeMultiplier: Number.parseFloat(e.target.value) || 1 })
              }
              disabled={isSubmitting}
            />
            <p className="text-sm text-muted-foreground">
              Multiplier applied to service cost for urgent requests (e.g., 1.5 = 50% increase).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripeAccountId">Stripe Account ID</Label>
            <Input
              id="stripeAccountId"
              value={formData.stripeAccountId}
              onChange={(e) => setFormData({ ...formData, stripeAccountId: e.target.value })}
              placeholder="acct_..."
              disabled={isSubmitting}
            />
            <p className="text-sm text-muted-foreground">Your Stripe account ID for processing payments.</p>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Rules"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
