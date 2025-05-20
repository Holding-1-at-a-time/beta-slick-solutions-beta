"use client"

import { useUser } from "@clerk/nextjs"
import Header from "@/components/header"
import SessionManager from "@/components/session-manager"

export default function SecuritySettingsPage() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Security Settings</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Account Security</h2>

            <div className="space-y-4">
              <div>
                <p className="font-medium">Email Addresses</p>
                <ul className="mt-2 space-y-2">
                  {user?.emailAddresses.map((email) => (
                    <li key={email.id} className="flex items-center gap-2 text-sm">
                      {email.emailAddress}
                      {email.id === user.primaryEmailAddressId && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          Primary
                        </span>
                      )}
                      {email.verification.status === "verified" ? (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                          Verified
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                          Unverified
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <div className="mt-2 flex items-center gap-2">
                  {user?.twoFactorEnabled ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      Enabled
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                      Disabled
                    </span>
                  )}
                </div>
              </div>

              <div>
                <a href="/user/profile" className="text-primary hover:underline">
                  Manage security settings in your profile
                </a>
              </div>
            </div>
          </div>

          <SessionManager />
        </div>
      </main>
    </div>
  )
}
