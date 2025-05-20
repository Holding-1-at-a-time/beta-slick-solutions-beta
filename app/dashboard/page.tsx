import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Header from "@/components/header"

export default async function DashboardPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await currentUser()

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Welcome, {user?.firstName}!</h2>
          <p className="text-gray-600">
            This is your personal dashboard. You can manage your account and access your organizations from here.
          </p>
        </div>
      </main>
    </div>
  )
}
