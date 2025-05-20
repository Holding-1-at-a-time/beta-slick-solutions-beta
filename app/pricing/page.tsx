"use client"

import { PricingTable } from "@clerk/nextjs"
import Header from "@/components/header"

export default function PricingPage() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-center">Pricing Plans</h1>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <PricingTable />
        </div>
      </main>
    </div>
  )
}
