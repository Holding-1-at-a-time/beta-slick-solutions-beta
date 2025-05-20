import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Header from "@/components/header"

export default async function OrgDashboardPage({
  params,
}: {
  params: { orgId: string }
}) {
  const { userId, orgId } = auth()

  if (!userId || !orgId) {
    redirect("/sign-in")
  }

  // Ensure the user is accessing the correct organization
  if (orgId !== params.orgId) {
    redirect(`/org/${orgId}/dashboard`)
  }

  const user = await currentUser()

  // Since we can't use clerkClient directly, we'll use the user data we have
  // In a real app, you might fetch organization details from your database
  const organizationName =
    user?.organizationMemberships.find((membership) => membership.organization.id === orgId)?.organization.name ||
    "Organization"

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">{organizationName} Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Organization Details</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {organizationName}
              </p>
              <p>
                <span className="font-medium">ID:</span> {orgId}
              </p>
              <p>
                <span className="font-medium">Created:</span> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Your Role</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {user?.firstName} {user?.lastName}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user?.emailAddresses[0].emailAddress}
              </p>
              <p>
                <span className="font-medium">Role:</span>{" "}
                {user?.organizationMemberships.find((m) => m.organization.id === orgId)?.role || "Member"}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Quick Links</h2>
            <div className="space-y-2">
              <a href={`/org/${orgId}/settings`} className="block text-primary hover:underline">
                Organization Settings
              </a>
              <a href={`/org/${orgId}/members`} className="block text-primary hover:underline">
                Manage Members
              </a>
              <a href={`/org/${orgId}/billing`} className="block text-primary hover:underline">
                Billing & Subscription
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
