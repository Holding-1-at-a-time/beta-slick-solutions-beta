import { Suspense } from "react"
import { AppointmentConfirmed } from "@/components/appointments/appointment-confirmed"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { getAppointmentConfirmed } from "@/app/actions/appointments"
import { auth } from "@clerk/nextjs/server"

interface ThankYouPageProps {
  params: {
    orgId: string
    appointmentId: string
  }
}

export default async function ThankYouPage({ params }: ThankYouPageProps) {
  const { userId } = auth()

  if (!userId) {
    return <div>Unauthorized: You must be signed in to view this page.</div>
  }

  const appointment = await getAppointmentConfirmed(params.orgId, params.appointmentId)

  return (
    <div className="container py-6 max-w-md mx-auto">
      <Suspense fallback={<LoadingPlaceholder message="Loading confirmation details..." />}>
        <AppointmentConfirmed appointment={appointment} />
      </Suspense>
    </div>
  )
}
