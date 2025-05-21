import { FinalizeInvoice } from "@/components/member/finalize-invoice"

export default function FinalizeInvoicePage({
  params,
}: {
  params: { orgId: string; appointmentId: string }
}) {
  return <FinalizeInvoice orgId={params.orgId} appointmentId={params.appointmentId} />
}
