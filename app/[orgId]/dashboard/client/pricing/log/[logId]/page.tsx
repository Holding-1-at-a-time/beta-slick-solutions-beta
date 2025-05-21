import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { PricingLogDetail } from "@/components/pricing/pricing-log-detail"
import { ConvexClientProvider } from "@/components/ConvexClientProvider"

export default async function PricingLogDetailPage({ params }: { params: { orgId: string; logId: string } }) {
  const user = await currentUser()

  if (!user) {
    return redirect("/sign-in")
  }

  return (
    <ConvexClientProvider>
      <PricingLogDetail orgId={params.orgId} logId={params.logId} />
    </ConvexClientProvider>
  )
}
