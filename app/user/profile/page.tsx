"use client"

import { UserProfile } from "@clerk/nextjs"
import Header from "@/components/header"

export default function UserProfilePage() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Your Profile</h1>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "border-0 shadow-none p-0",
                navbar: "hidden",
                pageScrollBox: "p-0",
              },
            }}
          />
        </div>
      </main>
    </div>
  )
}
