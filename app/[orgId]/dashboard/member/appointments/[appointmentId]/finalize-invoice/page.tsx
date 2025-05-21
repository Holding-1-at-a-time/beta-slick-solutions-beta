import FinalizeInvoice from "@/components/member/finalize-invoice"
import type { Id } from "@/convex/_generated/dataModel"

export default function FinalizeInvoicePage({
  params,
}: {
  params: { appointmentId: string }
}) {
  return (
    <div className="p-6">
      <FinalizeInvoice appointmentId={params.appointmentId as Id<"appointments">} />
    </div>
  )
}
