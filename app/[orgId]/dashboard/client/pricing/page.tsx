import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { PricingSettings } from "@/components/pricing/pricing-settings"
import { PricingLogList } from "@/components/pricing/pricing-log-list"
import { ConvexClientProvider } from "@/components/ConvexClientProvider"

export default async function PricingPage({ params }: { params: { orgId: string } }) {
  const user = await currentUser()

  if (!user) {
    return redirect("/sign-in")
  }

  return (
    <ConvexClientProvider>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Pricing Settings</h1>
        <PricingSettings orgId={params.orgId} />
        <h2 className="text-xl font-semibold mt-8">Pricing History</h2>
        <PricingLogList orgId={params.orgId} />
      </div>
    </ConvexClientProvider>
  )
}
