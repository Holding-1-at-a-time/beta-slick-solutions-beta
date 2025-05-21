import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DynamicPricingLogDetail } from "@/components/pricing/dynamic-pricing-log-detail"
import { ConvexClientProvider } from "@/components/ConvexClientProvider"

export default async function PricingLogDetailPage({ params }: { params: { orgId: string; logId: string } }) {
  const user = await currentUser()

  if (!user) {
    return redirect("/sign-in")
  }

  return (
    <ConvexClientProvider>
      <DynamicPricingLogDetail orgId={params.orgId} userId={user.id} logId={params.logId} />
    </ConvexClientProvider>
  )
}
