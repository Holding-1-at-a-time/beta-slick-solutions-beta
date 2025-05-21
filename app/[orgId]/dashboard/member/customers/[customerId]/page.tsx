import { CustomerDetail } from "@/components/member"
import type { Id } from "@/convex/_generated/dataModel"

export default function CustomerDetailPage({
  params,
}: {
  params: { customerId: string }
}) {
  return (
    <div className="p-6">
      <CustomerDetail customerId={params.customerId as Id<"users">} />
    </div>
  )
}
