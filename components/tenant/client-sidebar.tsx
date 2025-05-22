"use client"
import Link from "next/link"
import { useRouter } from "next/router"
import { useOrganization } from "@clerk/nextjs"

export function ClientSidebar() {
  const router = useRouter()
  const { organization } = useOrganization()
  const orgId = organization?.id || ""

  const navItems = [
    { name: "Dashboard", href: `/${orgId}/dashboard/client` },
    { name: "Vehicles", href: `/${orgId}/dashboard/client/vehicles` },
    { name: "Appointments", href: `/${orgId}/dashboard/client/appointments` },
    { name: "Invoices", href: `/${orgId}/dashboard/client/invoices` },
    { name: "Notifications", href: `/${orgId}/dashboard/client/notifications` },
    { name: "Settings", href: `/${orgId}/dashboard/client/settings` },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold">Client Portal</h2>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>
                <a
                  className={`block px-4 py-2 text-sm ${
                    router.pathname.startsWith(item.href)
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {item.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Vehicle Service</p>
      </div>
    </div>
  )
}

export default ClientSidebar
