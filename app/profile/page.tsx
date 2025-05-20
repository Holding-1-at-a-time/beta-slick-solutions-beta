"use client"

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuthInfo } from "@/hooks/use-auth-info"
import Header from "@/components/header"

export default function ProfilePage() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AuthLoading>
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-lg font-medium">Loading authentication...</p>
            </div>
          </div>
        </AuthLoading>

        <Authenticated>
          <ProfileContent />
        </Authenticated>

        <Unauthenticated>
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>
            <p className="text-lg mb-8">Please sign in to view your profile</p>
          </div>
        </Unauthenticated>
      </main>
    </div>
  )
}

function ProfileContent() {
  const { authInfo } = useAuthInfo()
  const userProfile = useQuery(api.queries.getUserProfile)

  if (!authInfo || userProfile === undefined) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {userProfile?.firstName} {userProfile?.lastName}
            </p>
            <p>
              <strong>Email:</strong> {userProfile?.email}
            </p>
            <p>
              <strong>User Type:</strong> {authInfo.userType}
            </p>
            <p>
              <strong>User ID:</strong> {authInfo.userId}
            </p>
            {authInfo.defaultVehicleId && (
              <p>
                <strong>Default Vehicle ID:</strong> {authInfo.defaultVehicleId}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Organization Information</h2>
          <div className="space-y-2">
            <p>
              <strong>Organization ID:</strong> {authInfo.orgId}
            </p>
            <p>
              <strong>Role:</strong> {authInfo.orgRole}
            </p>
            <p>
              <strong>Permissions:</strong>
            </p>
            <ul className="list-disc pl-5">
              {authInfo.orgPermissions.map((permission, index) => (
                <li key={index}>{permission}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
