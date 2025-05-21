"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils/format-currency"

interface AdjustmentFormProps {
  data: {
    discountRules: {
      loyalty: {
        enabled: boolean
        threshold: number
        discountPercentage: number
      }
      seasonal: {
        enabled: boolean
        months: number[]
        discountPercentage: number
      }
      bundle: {
        enabled: boolean
        threshold: number
        discountPercentage: number
      }
    }
    appliedDiscounts: Array<{
      id: string
      name: string
      percentage: number
      amount: number
    }>
  }
  readOnly?: boolean
  onChange?: (appliedDiscounts: any[]) => void
}

export function AdjustmentForm({ data, readOnly = false, onChange }: AdjustmentFormProps) {
  const [appliedDiscounts, setAppliedDiscounts] = useState(data.appliedDiscounts || [])
  const [customDiscount, setCustomDiscount] = useState(0)

  const handleDiscountToggle = (discountId: string, checked: boolean) => {
    if (readOnly) return

    let newAppliedDiscounts = [...appliedDiscounts]

    if (checked) {
      // Add the discount
      const discountType = discountId.split("-")[0]
      const discountRule = data.discountRules[discountType as keyof typeof data.discountRules]

      newAppliedDiscounts.push({
        id: discountId,
        name: `${discountType.charAt(0).toUpperCase() + discountType.slice(1)} Discount`,
        percentage: discountRule.discountPercentage,
        amount: 100 * (discountRule.discountPercentage / 100), // Example calculation
      })
    } else {
      // Remove the discount
      newAppliedDiscounts = newAppliedDiscounts.filter((discount) => discount.id !== discountId)
    }

    setAppliedDiscounts(newAppliedDiscounts)
    if (onChange) {
      onChange(newAppliedDiscounts)
    }
  }

  const handleCustomDiscountChange = (value: number) => {
    if (readOnly) return

    setCustomDiscount(value)

    // Update or add custom discount
    const newAppliedDiscounts = appliedDiscounts.filter((discount) => discount.id !== "custom")

    if (value > 0) {
      newAppliedDiscounts.push({
        id: "custom",
        name: "Custom Discount",
        percentage: 0, // Not percentage-based
        amount: value,
      })
    }

    setAppliedDiscounts(newAppliedDiscounts)
    if (onChange) {
      onChange(newAppliedDiscounts)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discount Adjustments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(data.discountRules).map(([discountType, rule]) => {
            if (!rule.enabled) return null

            const discountId = `${discountType}-discount`
            const isApplied = appliedDiscounts.some((discount) => discount.id === discountId)

            return (
              <div key={discountType} className="flex items-start space-x-3 p-2 border-b">
                <Checkbox
                  id={discountId}
                  checked={isApplied}
                  onCheckedChange={(checked) => handleDiscountToggle(discountId, checked as boolean)}
                  disabled={readOnly}
                />
                <div className="space-y-1 flex-1">
                  <Label htmlFor={discountId} className="font-medium capitalize">
                    {discountType} Discount
                  </Label>
                  <p className="text-sm text-gray-500">
                    {discountType === "loyalty" && `Applied after ${rule.threshold} services`}
                    {discountType === "seasonal" && `Applied during specific months`}
                    {discountType === "bundle" && `Applied when booking ${rule.threshold}+ services`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-medium">{rule.discountPercentage}%</span>
                  {isApplied && (
                    <p className="text-sm text-green-600">
                      {formatCurrency(appliedDiscounts.find((d) => d.id === discountId)?.amount || 0)}
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          <div className="pt-4">
            <Label htmlFor="custom-discount" className="font-medium">
              Custom Discount
            </Label>
            <div className="flex items-center mt-2">
              <span className="mr-2">$</span>
              <Input
                id="custom-discount"
                type="number"
                min="0"
                step="5"
                value={customDiscount}
                onChange={(e) => handleCustomDiscountChange(Number(e.target.value))}
                disabled={readOnly}
                className="w-32"
              />
            </div>
          </div>

          {appliedDiscounts.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium mb-2">Applied Discounts</h4>
              <div className="space-y-2">
                {appliedDiscounts.map((discount) => (
                  <div key={discount.id} className="flex justify-between">
                    <span>{discount.name}</span>
                    <span className="text-green-600">-{formatCurrency(discount.amount)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total Discounts</span>
                  <span className="text-green-600">
                    -{formatCurrency(appliedDiscounts.reduce((sum, discount) => sum + discount.amount, 0))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
