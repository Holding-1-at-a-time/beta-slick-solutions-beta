"use client"

import { useState } from "react"
import { useSession, useSessionList, useClerk } from "@clerk/nextjs"

export default function SessionManager() {
  const { session } = useSession()
  const { sessions } = useSessionList()
  const { signOut } = useClerk()
  const [loading, setLoading] = useState(false)

  const handleSignOutAll = async () => {
    setLoading(true)
    try {
      await signOut({ signOutAll: true })
    } catch (error) {
      console.error("Error signing out all sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOutSession = async (sessionId: string) => {
    setLoading(true)
    try {
      await signOut({ sessionId })
    } catch (error) {
      console.error("Error signing out session:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return null
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Active Sessions</h2>

      <div className="mb-4">
        <p className="text-sm text-gray-500">
          You are currently signed in on {sessions.length} device{sessions.length !== 1 ? "s" : ""}.
        </p>
      </div>

      <ul className="mb-4 divide-y divide-gray-200">
        {sessions.map((s) => (
          <li key={s.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">
                {s.deviceType || "Unknown device"}
                {s.id === session.id && <span className="ml-2 text-xs text-green-600">(Current)</span>}
              </p>
              <p className="text-sm text-gray-500">Last active: {new Date(s.lastActiveAt).toLocaleString()}</p>
            </div>

            {s.id !== session.id && (
              <button
                onClick={() => handleSignOutSession(s.id)}
                disabled={loading}
                className="rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
              >
                Sign Out
              </button>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={handleSignOutAll}
        disabled={loading}
        className="w-full rounded-md border border-red-300 bg-white px-4 py-2 text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? "Signing out..." : "Sign Out All Devices"}
      </button>
    </div>
  )
}
