"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth, useOrganization } from "@clerk/nextjs"
import Header from "@/components/header"

export default function TestTenantIsolationPage() {
  const { userId } = useAuth()
  const { organization } = useOrganization()
  const [testMessage, setTestMessage] = useState("")

  // Create a test record mutation
  const createTestRecord = useMutation(api.mutations.createTestRecord)

  // Query test records for the current tenant
  const testRecords = useQuery(api.queries.listTestRecords)

  const handleCreateTest = async () => {
    if (!testMessage) return

    try {
      await createTestRecord({ message: testMessage })
      setTestMessage("")
    } catch (error) {
      console.error("Error creating test record:", error)
    }
  }

  if (!userId || !organization) {
    return <div>Please sign in and select an organization to test tenant isolation.</div>
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Test Tenant Isolation</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            <strong>Current Organization:</strong> {organization.name} (ID: {organization.id})
          </p>
          <p className="text-blue-800 mt-2">
            <strong>Current User:</strong> {userId}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Test Record</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter a test message"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
            />
            <button
              onClick={handleCreateTest}
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Create
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Test Records (This Organization Only)</h2>

          {testRecords === undefined ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : testRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No test records found for this organization.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {testRecords.map((record) => (
                <li key={record._id} className="py-3">
                  <p className="font-medium">{record.message}</p>
                  <p className="text-sm text-gray-500">Created: {new Date(record.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
