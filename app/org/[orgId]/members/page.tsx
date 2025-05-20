"use client"

import type React from "react"

import { useState } from "react"
import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import Header from "@/components/header"

export default function OrgMembersPage() {
  const { organization, isLoaded } = useOrganization()
  const { setActive } = useOrganizationList()
  const [inviteEmail, setInviteEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  if (!isLoaded || !organization) {
    return <div>Loading...</div>
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await organization.inviteMember({ emailAddress: inviteEmail, role: "org:member" })
      setSuccess(`Invitation sent to ${inviteEmail}`)
      setInviteEmail("")
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to send invitation")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      await organization.removeMember(memberId)
      // Refresh the page to show updated member list
      window.location.reload()
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to remove member")
    }
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Manage Members</h1>

        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Invite New Member</h2>

          {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          {success && <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">{success}</div>}

          <form onSubmit={handleInvite} className="flex gap-4">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Invite"}
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <h2 className="border-b border-gray-200 p-6 text-xl font-semibold">Members</h2>

          <ul className="divide-y divide-gray-200">
            {organization.memberships.data.map((membership) => (
              <li key={membership.id} className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  {membership.publicUserData?.imageUrl ? (
                    <img
                      src={membership.publicUserData.imageUrl || "/placeholder.svg"}
                      alt={membership.publicUserData.firstName || ""}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                      {membership.publicUserData?.firstName?.charAt(0) || "?"}
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium">
                      {membership.publicUserData?.firstName} {membership.publicUserData?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{membership.publicUserData?.identifier}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    {membership.role}
                  </span>

                  {membership.role !== "admin" && (
                    <button
                      onClick={() => handleRemoveMember(membership.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
