import RequireAuth from "@/components/auth/require-auth"
import Header from "@/components/header"

export default function DashboardPage() {
  return (
    <RequireAuth>
      <div>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
          <p>This page is protected and only visible to authenticated users.</p>
        </main>
      </div>
    </RequireAuth>
  )
}
