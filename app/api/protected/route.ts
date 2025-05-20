import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  const { userId, orgId, sessionId } = auth()

  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  return NextResponse.json({
    message: "This is a protected API route",
    userId,
    orgId,
    sessionId,
  })
}
