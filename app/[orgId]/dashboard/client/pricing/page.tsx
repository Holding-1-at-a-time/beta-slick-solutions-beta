import { PricingSettings } from "@/components/pricing"

export default function PricingPage({ params }: { params: { orgId: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pricing Settings</h1>
      <PricingSettings orgId={params.orgId} />
    </div>
  )
}
