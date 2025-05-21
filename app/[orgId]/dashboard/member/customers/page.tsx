import { CustomerList } from "@/components/member/customer-list"

export default function CustomerListPage({
  params,
}: {
  params: { orgId: string }
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customer Directory</h1>
      <CustomerList orgId={params.orgId} />
    </div>
  )
}
