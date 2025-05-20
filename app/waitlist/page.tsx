"use client"

import { Waitlist } from "@clerk/nextjs"
import Header from "@/components/header"

export default function WaitlistPage() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md">
          <h1 className="mb-6 text-3xl font-bold text-center">Join Our Waitlist</h1>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <Waitlist />
          </div>
        </div>
      </main>
    </div>
  )
}
