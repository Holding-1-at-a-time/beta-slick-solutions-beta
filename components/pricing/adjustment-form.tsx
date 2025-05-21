"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils/format-currency"

interface AdjustmentOption {
  id: string
  label: string
  value: number
  applied: boolean
}

interface AdjustmentFormProps {
  adjustment: {
    options: AdjustmentOption[]
    customAdjustment: number
  }
  onAdjust: (adjustment: {
    options: AdjustmentOption[]
    customAdjustment: number
  }) => void
}

export function AdjustmentForm({ adjustment, onAdjust }: AdjustmentFormProps) {
  const [options, setOptions] = useState(adjustment.options)
  const [customAdjustment, setCustomAdjustment] = useState(adjustment.customAdjustment)

  const handleOptionChange = (id: string, applied: boolean) => {
    const newOptions = options.map((opt) => (opt.id === id ? { ...opt, applied } : opt))
    setOptions(newOptions)
    onAdjust({ options: newOptions, customAdjustment })
  }

  const handleCustomAdjustmentChange = (value: number) => {
    setCustomAdjustment(value)
    onAdjust({ options, customAdjustment: value })
  }

  const totalAdjustment = options.reduce((sum, opt) => sum + (opt.applied ? opt.value : 0), 0) + customAdjustment

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Adjustments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={option.applied}
                    onCheckedChange={(checked) => handleOptionChange(option.id, checked === true)}
                  />
                  <Label htmlFor={option.id}>{option.label}</Label>
                </div>
                <span className={option.value < 0 ? "text-green-600" : "text-red-600"}>
                  {option.value < 0 ? "-" : "+"}
                  {formatCurrency(Math.abs(option.value))}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-adjustment">Custom Adjustment</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="custom-adjustment"
                type="number"
                value={customAdjustment}
                onChange={(e) => handleCustomAdjustmentChange(Number.parseFloat(e.target.value) || 0)}
                className="w-full"
              />
              <Button variant="outline" onClick={() => handleCustomAdjustmentChange(0)}>
                Reset
              </Button>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between font-medium">
              <span>Total Adjustment</span>
              <span className={totalAdjustment < 0 ? "text-green-600" : totalAdjustment > 0 ? "text-red-600" : ""}>
                {totalAdjustment < 0 ? "-" : totalAdjustment > 0 ? "+" : ""}
                {formatCurrency(Math.abs(totalAdjustment))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
