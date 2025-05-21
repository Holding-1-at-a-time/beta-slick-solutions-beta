import { DynamicPricingLogDetail } from "@/components/pricing"

export default function PricingLogDetailPage({ params }: { params: { orgId: string; logId: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pricing Change Details</h1>
      <DynamicPricingLogDetail orgId={params.orgId} logId={params.logId} />
    </div>
  )
}
