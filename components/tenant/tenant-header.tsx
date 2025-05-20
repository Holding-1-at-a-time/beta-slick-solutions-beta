"use client"

import type { Organization } from "@clerk/nextjs/server"
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface TenantHeaderProps {
  organization: Organization
}

export default function TenantHeader({ organization }: TenantHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href={`/${organization.id}/dashboard`} className="flex items-center gap-2">
            {organization.imageUrl ? (
              <img
                src={organization.imageUrl || "/placeholder.svg"}
                alt={organization.name || "Organization"}
                className="h-8 w-8 rounded-md"
              />
            ) : (
              <div
                className={cn("flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground")}
              >
                {organization.name?.charAt(0) || "O"}
              </div>
            )}
            <span className="text-xl font-bold">{organization.name}</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
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
        </div>
      </div>
    </header>
  )
}
