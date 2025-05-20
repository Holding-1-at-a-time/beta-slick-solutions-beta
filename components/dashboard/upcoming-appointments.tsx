import { Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Appointment {
  id: string
  vehicleName: string
  serviceName: string
  date: string
  time: string
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[]
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-muted-foreground">No upcoming appointments</p>
          <Button className="mt-4" variant="outline">
            Schedule Service
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="py-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{appointment.vehicleName}</p>
                  <p className="text-sm text-muted-foreground">{appointment.serviceName}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline">
                  Reschedule
                </Button>
                <Button size="sm" variant="outline">
                  Cancel
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
