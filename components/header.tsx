"use client"

import Link from "next/link"
import { SignedIn, SignedOut, UserButton, OrganizationSwitcher } from "@clerk/nextjs"
import { useOrganization } from "@clerk/nextjs"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const { organization, isLoaded } = useOrganization()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isMobile } = useMobile()

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-30">
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
            {!isMobile && (
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
            )}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
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

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-200 bg-white overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3 space-y-3">
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="block py-2 text-base font-medium text-gray-900 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {organization && (
                  <Link
                    href={`/org/${organization.id}/settings`}
                    className="block py-2 text-base font-medium text-gray-900 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Organization Settings
                  </Link>
                )}
                <div className="py-2">
                  <OrganizationSwitcher
                    hidePersonal
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        organizationSwitcherTrigger:
                          "w-full flex justify-between items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
