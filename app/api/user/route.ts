import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const user = await currentUser()

  return NextResponse.json({
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.emailAddresses[0].emailAddress,
    imageUrl: user?.imageUrl,
  })
}
