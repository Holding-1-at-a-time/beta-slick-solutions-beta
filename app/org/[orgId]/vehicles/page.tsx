import { getServerPermissions } from "@/lib/server-permissions"
import { redirect } from "next/navigation"
import PermissionGuard from "@/components/auth/permission-guard"
import Header from "@/components/header"

export default function VehiclesPage() {
  // Server-side permission check
  const { can } = getServerPermissions()

  if (!can("org:vehicles:read")) {
    redirect("/")
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Vehicles</h1>

        {/* Client-side permission check for UI elements */}
        <PermissionGuard permission="org:vehicles:write">
          <a
            href="/org/[orgId]/vehicles/new"
            className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Add New Vehicle
          </a>
        </PermissionGuard>

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p>Vehicle list goes here...</p>
        </div>
      </main>
    </div>
  )
}
