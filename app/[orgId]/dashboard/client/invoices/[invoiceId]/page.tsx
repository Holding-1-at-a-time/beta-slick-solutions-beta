import { InvoiceDetail } from "@/components/invoices"

export default function InvoiceDetailPage({ params }: { params: { orgId: string; invoiceId: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Invoice Details</h1>
      <InvoiceDetail orgId={params.orgId} invoiceId={params.invoiceId} />
    </div>
  )
}
