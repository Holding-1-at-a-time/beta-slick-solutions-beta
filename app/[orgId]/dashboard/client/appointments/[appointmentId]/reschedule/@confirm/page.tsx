import { Suspense } from "react"
import { PayDeposit } from "@/components/appointments/pay-deposit"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { getAppointmentDetail } from "@/app/actions/appointments"
import { auth } from "@clerk/nextjs/server"

interface ConfirmPageProps {
  params: {
    orgId: string
    appointmentId: string
  }
}

export default async function ConfirmPage({ params }: ConfirmPageProps) {
  const { userId } = auth()

  if (!userId) {
    return <div>Unauthorized: You must be signed in to view this page.</div>
  }

  const appointment = await getAppointmentDetail(params.orgId, params.appointmentId)

  // Calculate deposit amount (in a real app, this would come from business rules)
  const depositAmount = appointment.invoice ? appointment.invoice.amount * 0.2 : 25

  return (
    <div className="container py-6">
      <Suspense fallback={<LoadingPlaceholder message="Loading payment options..." />}>
        <PayDeposit orgId={params.orgId} appointmentId={params.appointmentId} depositAmount={depositAmount} />
      </Suspense>
    </div>
  )
}
