"use client"

import { Waitlist } from "@clerk/nextjs"
import Header from "@/components/header"

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold text-gray-900">Join Our Waitlist</h1>
            <p className="text-gray-600">
              Be among the first to experience our revolutionary vehicle service management platform. Sign up below to
              secure early access and exclusive benefits.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <Waitlist />
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              By joining our waitlist, you'll receive updates about our launch and be eligible for special early-adopter
              pricing.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
