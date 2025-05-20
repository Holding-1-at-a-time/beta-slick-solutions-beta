import VehicleForm from "@/components/vehicle-form"
import ProtectRoute from "@/components/auth/protect-route"
import Header from "@/components/header"

export default function NewVehiclePage() {
  return (
    <ProtectRoute requireAuth={true} requireOrganization={true} requiredPermission="org:vehicles:write">
      <div>
        <Header />
        <main className="container mx-auto max-w-md px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold">Add a New Vehicle</h1>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <VehicleForm />
          </div>
        </main>
      </div>
    </ProtectRoute>
  )
}
