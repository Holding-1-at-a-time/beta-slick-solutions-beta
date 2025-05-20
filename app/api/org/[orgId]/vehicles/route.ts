import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { Permission } from "@/lib/permissions"

// Helper function to check if the user has the required permission
function hasPermission(requiredPermission: Permission): boolean {
  const { userId, orgRole, sessionClaims } = auth()

  if (!userId || !orgRole) {
    return false
  }

  // Check if the user has the required permission
  const userPermissions = (sessionClaims?.permissions as string[]) || []
  return userPermissions.includes(requiredPermission)
}

export async function GET(request: Request, { params }: { params: { orgId: string } }) {
  // Check if the user has permission to read vehicles
  if (!hasPermission("org:vehicles:read")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // Process the request
  // In a real app, you would fetch vehicles from your database
  return NextResponse.json({
    vehicles: [
      { id: "1", make: "Toyota", model: "Camry", year: 2020 },
      { id: "2", make: "Honda", model: "Accord", year: 2021 },
    ],
  })
}

export async function POST(request: Request, { params }: { params: { orgId: string } }) {
  // Check if the user has permission to create vehicles
  if (!hasPermission("org:vehicles:write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // Process the request
  // In a real app, you would create a new vehicle in your database
  return NextResponse.json({ success: true, id: "3" }, { status: 201 })
}
