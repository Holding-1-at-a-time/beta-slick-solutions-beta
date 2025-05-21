import { Car, Calendar, Receipt } from "lucide-react"

interface DashboardStatsProps {
  vehicleCount: number
  appointmentCount: number
  invoiceCount: number
}

export function DashboardStats({ vehicleCount, appointmentCount, invoiceCount }: DashboardStatsProps) {
  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Vehicles</h2>
        </div>
        <p className="mt-2 text-3xl font-bold">{vehicleCount}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Appointments</h2>
        </div>
        <p className="mt-2 text-3xl font-bold">{appointmentCount}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Invoices</h2>
        </div>
        <p className="mt-2 text-3xl font-bold">{invoiceCount}</p>
      </div>
    </>
  )
}
