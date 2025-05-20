"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import Header from "@/components/header"

export default function CreateOrganizationPage() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { createOrganization } = useClerk()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const organization = await createOrganization({ name })
      router.push(`/org/${organization.id}/dashboard`)
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to create organization")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md">
          <h1 className="mb-6 text-3xl font-bold">Create Organization</h1>

          {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Organization Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Organization"}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
