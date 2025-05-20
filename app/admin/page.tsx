"use client"

import { Protect } from "@clerk/nextjs"
import Header from "@/components/header"

export default function AdminPage() {
  return (
    <Protect
      permission="org:admin"
      fallback={
        <div>
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
              <h1 className="text-xl font-bold text-red-700">Access Denied</h1>
              <p className="mt-2 text-red-600">You need admin permissions to access this page.</p>
            </div>
          </main>
        </div>
      }
    >
      <div>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Admin Controls</h2>
            <p className="text-gray-600">This page is only accessible to organization administrators.</p>
          </div>
        </main>
      </div>
    </Protect>
  )
}
