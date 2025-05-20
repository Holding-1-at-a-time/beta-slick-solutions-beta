import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Import directly from the Convex HTTP client
import { ConvexHttpClient } from "convex/browser"

// Initialize the Convex client for server-side operations
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: Request) {
  // Get the webhook signature from the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there's no signature, return an error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Missing svix headers", { status: 400 })
  }

  // Get the webhook body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "")

  let evt: WebhookEvent

  // Verify the webhook signature
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new NextResponse("Error verifying webhook", { status: 400 })
  }

  // Handle the webhook event
  const eventType = evt.type

  if (eventType === "user.created") {
    // A new user was created in Clerk
    await convex.mutation("mutations:createUser", {
      clerkId: evt.data.id,
      email: evt.data.email_addresses[0]?.email_address || "",
      firstName: evt.data.first_name || "",
      lastName: evt.data.last_name || "",
      imageUrl: evt.data.image_url,
      role: "org:client", // Default role for new users
    })
  } else if (eventType === "user.updated") {
    // A user was updated in Clerk
    await convex.mutation("mutations:updateUser", {
      clerkId: evt.data.id,
      email: evt.data.email_addresses[0]?.email_address,
      firstName: evt.data.first_name,
      lastName: evt.data.last_name,
      imageUrl: evt.data.image_url,
    })
  } else if (eventType === "user.deleted") {
    // A user was deleted in Clerk
    await convex.mutation("mutations:markUserDeleted", {
      clerkId: evt.data.id,
    })
  } else if (eventType === "organization.created") {
    // A new organization was created in Clerk
    await convex.mutation("mutations:createTenant", {
      clerkOrgId: evt.data.id,
      name: evt.data.name,
      slug: evt.data.slug,
      imageUrl: evt.data.image_url,
    })
  } else if (eventType === "organizationMembership.created") {
    // A user was added to an organization
    await convex.mutation("mutations:addUserToTenant", {
      clerkUserId: evt.data.public_user_data.user_id,
      clerkOrgId: evt.data.organization.id,
      role: evt.data.role,
    })
  }

  return NextResponse.json({ success: true })
}

export const runtime = "nodejs"
