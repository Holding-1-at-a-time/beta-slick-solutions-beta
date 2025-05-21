import { MemberAppointments } from "@/components/member"
import { Card } from "@/components/ui/card"

export default function AppointmentsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Today's Appointments</h1>
      <Card className="p-6">
        <MemberAppointments />
      </Card>
    </div>
  )
}
