import { CustomerDetail } from "@/components/member/customer-detail"

export default function CustomerDetailPage({
  params,
}: {
  params: { orgId: string; customerId: string }
}) {
  return <CustomerDetail orgId={params.orgId} customerId={params.customerId} />
}
