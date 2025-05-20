"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Invoice {
  _id: string
  amount: number
  status: string
  dueDate: number
}

interface OutstandingInvoicesSummaryProps {
  invoices: Invoice[]
  orgId: string
}

export function OutstandingInvoicesSummary({ invoices, orgId }: OutstandingInvoicesSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Outstanding Invoices</span>
          <FileText className="h-5 w-5" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No outstanding invoices</p>
          </div>
        ) : (
          invoices.map((invoice) => (
            <div key={invoice._id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Due: {format(new Date(invoice.dueDate), "MMM d, yyyy")}</p>
              </div>
              <Badge variant={invoice.status === "overdue" ? "destructive" : "outline"}>{invoice.status}</Badge>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/org/${orgId}/dashboard/client/invoices`} className="w-full">
          <Button variant="outline" className="w-full">
            View All Invoices
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
