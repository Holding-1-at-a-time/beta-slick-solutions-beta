import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils/format-currency"

interface CostBreakdownCardProps {
  breakdown: {
    laborHours: number
    laborRate: number
    laborCost: number
    parts: Array<{
      name: string
      cost: number
      markup: number
    }>
    partsCost: number
    subtotal: number
    tax: number
    total: number
  }
}

export function CostBreakdownCard({ breakdown }: CostBreakdownCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Labor</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Labor Rate</span>
                <span>{formatCurrency(breakdown.laborRate)}/hr</span>
              </div>
              <div className="flex justify-between">
                <span>Labor Hours</span>
                <span>{breakdown.laborHours} hrs</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Labor Subtotal</span>
                <span>{formatCurrency(breakdown.laborCost)}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Parts</h4>
            <div className="text-sm space-y-1">
              {breakdown.parts.map((part, index) => (
                <div key={index} className="flex justify-between">
                  <span>{part.name}</span>
                  <span>{formatCurrency(part.cost * part.markup)}</span>
                </div>
              ))}
              <div className="flex justify-between font-medium">
                <span>Parts Subtotal</span>
                <span>{formatCurrency(breakdown.partsCost)}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(breakdown.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(breakdown.tax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-1 border-t">
                <span>Total</span>
                <span>{formatCurrency(breakdown.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
