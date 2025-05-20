"use client"

import Link from "next/link"
import { SignedIn, SignedOut, GoogleOneTap } from "@clerk/nextjs"
import Header from "@/components/header"
import ClerkLoadingState from "@/components/clerk-loading-state"

export default function HomePage() {
  return (
    <ClerkLoadingState>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4 py-16 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Welcome to Our SaaS Platform
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            A complete solution for managing your organization and teams with powerful authentication and organization
            features.
          </p>

          <SignedOut>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/sign-up"
                className="rounded-md bg-primary px-6 py-3 text-lg font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Get Started
              </Link>
              <Link
                href="/sign-in"
                className="rounded-md border border-gray-300 bg-white px-6 py-3 text-lg font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Sign In
              </Link>
            </div>

            <GoogleOneTap />
          </SignedOut>

          <SignedIn>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="rounded-md bg-primary px-6 py-3 text-lg font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/org-selection"
                className="rounded-md border border-gray-300 bg-white px-6 py-3 text-lg font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                My Organizations
              </Link>
            </div>
          </SignedIn>
        </main>

        <footer className="border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </footer>
      </div>
    </ClerkLoadingState>
  )
}
