import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { InvoiceDetail } from "@/components/invoices/invoice-detail"
import { ConvexClientProvider } from "@/components/ConvexClientProvider"

export default async function InvoiceDetailPage({ params }: { params: { orgId: string; invoiceId: string } }) {
  const user = await currentUser()

  if (!user) {
    return redirect("/sign-in")
  }

  return (
    <ConvexClientProvider>
      <InvoiceDetail orgId={params.orgId} userId={user.id} invoiceId={params.invoiceId} />
    </ConvexClientProvider>
  )
}
