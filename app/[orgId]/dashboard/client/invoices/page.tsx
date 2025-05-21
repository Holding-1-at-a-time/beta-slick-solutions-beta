import { InvoiceList } from "@/components/invoices"

export default function InvoicesPage({ params }: { params: { orgId: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Invoices</h1>
      <InvoiceList orgId={params.orgId} />
    </div>
  )
}
