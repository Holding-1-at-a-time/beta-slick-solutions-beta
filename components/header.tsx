"use client"

import Link from "next/link"
import { SignedIn, SignedOut, UserButton, OrganizationSwitcher } from "@clerk/nextjs"
import { useOrganization } from "@clerk/nextjs"

export default function Header() {
  const { organization, isLoaded } = useOrganization()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold">
            SaaS Platform
          </Link>

          <SignedIn>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/dashboard" className="transition-colors hover:text-primary">
                Dashboard
              </Link>
              {organization && (
                <Link href={`/org/${organization.id}/settings`} className="transition-colors hover:text-primary">
                  Organization Settings
                </Link>
              )}
            </nav>
          </SignedIn>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <OrganizationSwitcher
              hidePersonal
              appearance={{
                elements: {
                  rootBox: "relative",
                  organizationSwitcherTrigger:
                    "flex justify-between items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none",
                },
              }}
            />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
