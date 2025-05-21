"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils/format-currency"

interface CostBreakdownCardProps {
  data: {
    basePrice: Record<string, number>
    laborRate: number
  }
}

export function CostBreakdownCard({ data }: CostBreakdownCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Base Price Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.basePrice).map(([service, price]) => (
              <div key={service} className="flex justify-between items-center p-2 border-b">
                <span className="capitalize">{service.replace(/_/g, " ")}</span>
                <span className="font-medium">{formatCurrency(price)}</span>
              </div>
            ))}
          </div>
          <div className="pt-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <span>Labor Rate</span>
              <span className="font-medium">{formatCurrency(data.laborRate)}/hour</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
