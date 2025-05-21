"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils/format-currency"

interface FinalPricingCardProps {
  total: number
  onApprove?: () => void
  onReject?: () => void
}

export function FinalPricingCard({ total, onApprove, onReject }: FinalPricingCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Final Price</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Price</p>
            <p className="text-3xl font-bold">{formatCurrency(total)}</p>
          </div>

          {(onApprove || onReject) && (
            <div className="flex space-x-2 pt-2">
              {onApprove && (
                <Button className="flex-1" onClick={onApprove}>
                  Approve
                </Button>
              )}
              {onReject && (
                <Button variant="outline" className="flex-1" onClick={onReject}>
                  Reject
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
