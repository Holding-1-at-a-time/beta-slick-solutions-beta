"use client"

import { useOrganizationList, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Header from "@/components/header"

export default function OrganizationSelectionPage() {
  const { organizationList, isLoaded } = useOrganizationList()
  const { user } = useUser()
  const router = useRouter()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  const handleCreateOrg = () => {
    router.push("/org/create")
  }

  const handleSelectOrg = (orgId: string) => {
    router.push(`/org/${orgId}/dashboard`)
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Select Organization</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {organizationList.items.map((org) => (
            <div
              key={org.id}
              className="flex cursor-pointer flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              onClick={() => handleSelectOrg(org.id)}
            >
              <div className="mb-4 flex items-center gap-3">
                {org.imageUrl ? (
                  <img
                    src={org.imageUrl || "/placeholder.svg"}
                    alt={org.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-lg font-bold text-primary">
                    {org.name.charAt(0)}
                  </div>
                )}
                <h2 className="text-lg font-semibold">{org.name}</h2>
              </div>
              <p className="text-sm text-gray-500">
                {org.membersCount} member{org.membersCount !== 1 ? "s" : ""}
              </p>
            </div>
          ))}

          <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-all hover:border-primary/50 hover:bg-gray-100"
            onClick={handleCreateOrg}
          >
            <div className="mb-2 rounded-full bg-primary/10 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold">Create Organization</h2>
            <p className="mt-1 text-sm text-gray-500">Start a new organization for your team</p>
          </div>
        </div>
      </main>
    </div>
  )
}
