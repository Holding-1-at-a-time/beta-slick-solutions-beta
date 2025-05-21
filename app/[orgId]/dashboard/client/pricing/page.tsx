import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { PricingSettings } from "@/components/pricing/pricing-settings"
import { PricingLogsList } from "@/components/pricing/pricing-logs-list"
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
        <PricingSettings orgId={params.orgId} userId={user.id} />
        <h2 className="text-xl font-semibold mt-8">Pricing History</h2>
        <PricingLogsList orgId={params.orgId} userId={user.id} />
      </div>
    </ConvexClientProvider>
  )
}
