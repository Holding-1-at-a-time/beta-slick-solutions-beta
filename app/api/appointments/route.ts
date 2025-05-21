import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { api } from "@/lib/convex"

export async function GET(request: NextRequest) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const orgId = searchParams.get("orgId")

  if (!orgId) {
    return NextResponse.json({ error: "Missing orgId parameter" }, { status: 400 })
  }

  try {
    const appointments = await api.appointments.listAppointments({
      orgId,
      userId,
      page,
      limit,
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}
