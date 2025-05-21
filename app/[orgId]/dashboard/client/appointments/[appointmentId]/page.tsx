import { Suspense } from "react"
import { AppointmentDetail } from "@/components/appointments/appointment-detail"
import { RescheduleButton } from "@/components/appointments/reschedule-button"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { getAppointmentDetail } from "@/app/actions/appointments"
import { auth } from "@clerk/nextjs/server"

interface AppointmentDetailPageProps {
  params: {
    orgId: string
    appointmentId: string
  }
}

export default async function AppointmentDetailPage({ params }: AppointmentDetailPageProps) {
  const { userId } = auth()

  if (!userId) {
    return <div>Unauthorized: You must be signed in to view this page.</div>
  }

  const appointment = await getAppointmentDetail(params.orgId, params.appointmentId)

  // Only allow rescheduling if the appointment is not completed or cancelled
  const canReschedule = !["completed", "cancelled"].includes(appointment.status)

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointment Details</h1>
        {canReschedule && <RescheduleButton appointmentId={params.appointmentId} />}
      </div>

      <Suspense fallback={<LoadingPlaceholder message="Loading appointment details..." />}>
        <AppointmentDetail appointment={appointment} />
      </Suspense>
    </div>
  )
}
