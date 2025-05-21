import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { InvoiceList } from "@/components/invoices/invoice-list"
import { ConvexClientProvider } from "@/components/ConvexClientProvider"

export default async function InvoicesPage({ params }: { params: { orgId: string } }) {
  const user = await currentUser()

  if (!user) {
    return redirect("/sign-in")
  }

  return (
    <ConvexClientProvider>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <InvoiceList orgId={params.orgId} userId={user.id} />
      </div>
    </ConvexClientProvider>
  )
}
