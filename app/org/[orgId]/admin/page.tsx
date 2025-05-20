import ProtectRoute from "@/components/auth/protect-route"
import Header from "@/components/header"

export default function AdminPage() {
  return (
    <ProtectRoute requireAuth={true} requireOrganization={true} requiredRole="admin">
      <div>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
          <p>This page is protected and only visible to organization admins.</p>
        </main>
      </div>
    </ProtectRoute>
  )
}
