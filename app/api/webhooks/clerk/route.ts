import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

// Initialize the Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)

export async function POST(req: Request) {
  // Get the webhook signature from the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, return 400
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers")
    return new Response("Missing svix headers", { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET as string)

  let evt: WebhookEvent

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error verifying webhook", { status: 400 })
  }

  // Get the event type and data
  const eventType = evt.type
  const data = evt.data

  console.log(`Processing webhook event: ${eventType}`)

  try {
    // Process the event based on its type
    switch (eventType) {
      // User events
      case "user.created":
        await handleUserCreated(data)
        break
      case "user.updated":
        await handleUserUpdated(data)
        break
      case "user.deleted":
        await handleUserDeleted(data)
        break

      // Organization events
      case "organization.created":
        await handleOrganizationCreated(data)
        break
      case "organization.updated":
        await handleOrganizationUpdated(data)
        break
      case "organization.deleted":
        await handleOrganizationDeleted(data)
        break

      // Organization membership events
      case "organizationMembership.created":
        await handleOrganizationMembershipCreated(data)
        break
      case "organizationMembership.updated":
        await handleOrganizationMembershipUpdated(data)
        break
      case "organizationMembership.deleted":
        await handleOrganizationMembershipDeleted(data)
        break

      // Organization invitation events
      case "organizationInvitation.created":
        await handleOrganizationInvitationCreated(data)
        break
      case "organizationInvitation.accepted":
        await handleOrganizationInvitationAccepted(data)
        break
      case "organizationInvitation.revoked":
        await handleOrganizationInvitationRevoked(data)
        break

      // Organization domain events
      case "organizationDomain.created":
        await handleOrganizationDomainCreated(data)
        break
      case "organizationDomain.updated":
        await handleOrganizationDomainUpdated(data)
        break
      case "organizationDomain.deleted":
        await handleOrganizationDomainDeleted(data)
        break

      // Role and permission events
      case "role.created":
        await handleRoleCreated(data)
        break
      case "role.updated":
        await handleRoleUpdated(data)
        break
      case "role.deleted":
        await handleRoleDeleted(data)
        break
      case "permission.created":
        await handlePermissionCreated(data)
        break
      case "permission.updated":
        await handlePermissionUpdated(data)
        break
      case "permission.deleted":
        await handlePermissionDeleted(data)
        break

      // Session events
      case "session.created":
        await handleSessionCreated(data)
        break
      case "session.ended":
        await handleSessionEnded(data)
        break
      case "session.removed":
        await handleSessionRemoved(data)
        break
      case "session.revoked":
        await handleSessionRevoked(data)
        break
      case "session.pending":
        await handleSessionPending(data)
        break

      // Email and SMS events
      case "email.created":
        await handleEmailCreated(data)
        break
      case "sms.created":
        await handleSmsCreated(data)
        break

      // Waitlist events
      case "waitlistEntry.created":
        await handleWaitlistEntryCreated(data)
        break
      case "waitlistEntry.updated":
        await handleWaitlistEntryUpdated(data)
        break

      default:
        console.log(`Unhandled webhook event type: ${eventType}`)
    }

    return new Response("Webhook processed successfully", { status: 200 })
  } catch (error) {
    console.error(`Error processing webhook event ${eventType}:`, error)
    return new Response(`Error processing webhook: ${(error as Error).message}`, { status: 500 })
  }
}

// ===== User Event Handlers =====

async function handleUserCreated(data: any) {
  console.log("Processing user.created event")

  try {
    await convex.mutation(api.users.syncUserFromClerk, {
      clerkId: data.id,
      email: data.email_addresses?.[0]?.email_address,
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      imageUrl: data.image_url,
      username: data.username,
      lastSignInAt: data.last_sign_in_at ? new Date(data.last_sign_in_at).getTime() : null,
      createdAt: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
    })

    console.log(`User created: ${data.id}`)
  } catch (error) {
    console.error("Error syncing user creation:", error)
    throw error
  }
}

async function handleUserUpdated(data: any) {
  console.log("Processing user.updated event")

  try {
    await convex.mutation(api.users.syncUserFromClerk, {
      clerkId: data.id,
      email: data.email_addresses?.[0]?.email_address,
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      imageUrl: data.image_url,
      username: data.username,
      lastSignInAt: data.last_sign_in_at ? new Date(data.last_sign_in_at).getTime() : null,
      updatedAt: Date.now(),
    })

    console.log(`User updated: ${data.id}`)
  } catch (error) {
    console.error("Error syncing user update:", error)
    throw error
  }
}

async function handleUserDeleted(data: any) {
  console.log("Processing user.deleted event")

  try {
    await convex.mutation(api.users.markUserDeleted, {
      clerkId: data.id,
    })

    console.log(`User deleted: ${data.id}`)
  } catch (error) {
    console.error("Error handling user deletion:", error)
    throw error
  }
}

// ===== Organization Event Handlers =====

async function handleOrganizationCreated(data: any) {
  console.log("Processing organization.created event")

  try {
    await convex.mutation(api.tenants.syncTenantFromClerk, {
      clerkOrgId: data.id,
      name: data.name,
      slug: data.slug,
      imageUrl: data.image_url,
      createdBy: data.created_by,
      createdAt: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
    })

    console.log(`Organization created: ${data.id}`)
  } catch (error) {
    console.error("Error syncing organization creation:", error)
    throw error
  }
}

async function handleOrganizationUpdated(data: any) {
  console.log("Processing organization.updated event")

  try {
    await convex.mutation(api.tenants.updateTenantFromClerk, {
      clerkOrgId: data.id,
      name: data.name,
      slug: data.slug,
      imageUrl: data.image_url,
      updatedAt: Date.now(),
    })

    console.log(`Organization updated: ${data.id}`)
  } catch (error) {
    console.error("Error syncing organization update:", error)
    throw error
  }
}

async function handleOrganizationDeleted(data: any) {
  console.log("Processing organization.deleted event")

  try {
    await convex.mutation(api.tenants.markTenantDeleted, {
      clerkOrgId: data.id,
    })

    console.log(`Organization deleted: ${data.id}`)
  } catch (error) {
    console.error("Error handling organization deletion:", error)
    throw error
  }
}

// ===== Organization Membership Event Handlers =====

async function handleOrganizationMembershipCreated(data: any) {
  console.log("Processing organizationMembership.created event")

  try {
    await convex.mutation(api.users.syncOrganizationMembership, {
      clerkOrgId: data.organization.id,
      clerkUserId: data.public_user_data.user_id,
      role: data.role,
    })

    console.log(`Organization membership created: ${data.id}`)
  } catch (error) {
    console.error("Error syncing organization membership creation:", error)
    throw error
  }
}

async function handleOrganizationMembershipUpdated(data: any) {
  console.log("Processing organizationMembership.updated event")

  try {
    await convex.mutation(api.users.syncOrganizationMembership, {
      clerkOrgId: data.organization.id,
      clerkUserId: data.public_user_data.user_id,
      role: data.role,
    })

    console.log(`Organization membership updated: ${data.id}`)
  } catch (error) {
    console.error("Error syncing organization membership update:", error)
    throw error
  }
}

async function handleOrganizationMembershipDeleted(data: any) {
  console.log("Processing organizationMembership.deleted event")

  try {
    await convex.mutation(api.users.removeOrganizationMembership, {
      clerkOrgId: data.organization.id,
      clerkUserId: data.public_user_data.user_id,
    })

    console.log(`Organization membership deleted: ${data.id}`)
  } catch (error) {
    console.error("Error handling organization membership deletion:", error)
    throw error
  }
}

// ===== Organization Invitation Event Handlers =====

async function handleOrganizationInvitationCreated(data: any) {
  console.log("Processing organizationInvitation.created event")

  try {
    await convex.mutation(api.invitations.createInvitation, {
      clerkInvitationId: data.id,
      clerkOrgId: data.organization.id,
      email: data.email_address,
      role: data.role,
      status: "pending",
      createdAt: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
    })

    console.log(`Organization invitation created: ${data.id}`)
  } catch (error) {
    console.error("Error syncing organization invitation creation:", error)
    throw error
  }
}

async function handleOrganizationInvitationAccepted(data: any) {
  console.log("Processing organizationInvitation.accepted event")

  try {
    await convex.mutation(api.invitations.updateInvitationStatus, {
      clerkInvitationId: data.id,
      status: "accepted",
      acceptedBy: data.public_user_data?.user_id,
      updatedAt: Date.now(),
    })

    console.log(`Organization invitation accepted: ${data.id}`)
  } catch (error) {
    console.error("Error handling organization invitation acceptance:", error)
    throw error
  }
}

async function handleOrganizationInvitationRevoked(data: any) {
  console.log("Processing organizationInvitation.revoked event")

  try {
    await convex.mutation(api.invitations.updateInvitationStatus, {
      clerkInvitationId: data.id,
      status: "revoked",
      updatedAt: Date.now(),
    })

    console.log(`Organization invitation revoked: ${data.id}`)
  } catch (error) {
    console.error("Error handling organization invitation revocation:", error)
    throw error
  }
}

// ===== Organization Domain Event Handlers =====

async function handleOrganizationDomainCreated(data: any) {
  console.log("Processing organizationDomain.created event")

  try {
    await convex.mutation(api.domains.createDomain, {
      clerkDomainId: data.id,
      clerkOrgId: data.organization.id,
      name: data.name,
      status: data.verification_status,
      createdAt: Date.now(),
    })

    console.log(`Organization domain created: ${data.id}`)
  } catch (error) {
    console.error("Error syncing organization domain creation:", error)
    throw error
  }
}

async function handleOrganizationDomainUpdated(data: any) {
  console.log("Processing organizationDomain.updated event")

  try {
    await convex.mutation(api.domains.updateDomain, {
      clerkDomainId: data.id,
      status: data.verification_status,
      updatedAt: Date.now(),
    })

    console.log(`Organization domain updated: ${data.id}`)
  } catch (error) {
    console.error("Error syncing organization domain update:", error)
    throw error
  }
}

async function handleOrganizationDomainDeleted(data: any) {
  console.log("Processing organizationDomain.deleted event")

  try {
    await convex.mutation(api.domains.markDomainDeleted, {
      clerkDomainId: data.id,
    })

    console.log(`Organization domain deleted: ${data.id}`)
  } catch (error) {
    console.error("Error handling organization domain deletion:", error)
    throw error
  }
}

// ===== Role Event Handlers =====

async function handleRoleCreated(data: any) {
  console.log("Processing role.created event")

  try {
    await convex.mutation(api.roles.syncRoleFromClerk, {
      clerkRoleId: data.id,
      clerkOrgId: data.organization?.id,
      name: data.name,
      key: data.key,
      description: data.description,
      permissions: data.permissions || [],
      createdAt: Date.now(),
    })

    console.log(`Role created: ${data.id}`)
  } catch (error) {
    console.error("Error syncing role creation:", error)
    throw error
  }
}

async function handleRoleUpdated(data: any) {
  console.log("Processing role.updated event")

  try {
    await convex.mutation(api.roles.syncRoleFromClerk, {
      clerkRoleId: data.id,
      clerkOrgId: data.organization?.id,
      name: data.name,
      key: data.key,
      description: data.description,
      permissions: data.permissions || [],
      updatedAt: Date.now(),
    })

    console.log(`Role updated: ${data.id}`)
  } catch (error) {
    console.error("Error syncing role update:", error)
    throw error
  }
}

async function handleRoleDeleted(data: any) {
  console.log("Processing role.deleted event")

  try {
    await convex.mutation(api.roles.markRoleDeleted, {
      clerkRoleId: data.id,
    })

    console.log(`Role deleted: ${data.id}`)
  } catch (error) {
    console.error("Error handling role deletion:", error)
    throw error
  }
}

// ===== Permission Event Handlers =====

async function handlePermissionCreated(data: any) {
  console.log("Processing permission.created event")

  try {
    await convex.mutation(api.permissions.syncPermissionFromClerk, {
      clerkPermissionId: data.id,
      clerkOrgId: data.organization?.id,
      name: data.name,
      key: data.key,
      description: data.description,
      type: data.type,
      createdAt: Date.now(),
    })

    console.log(`Permission created: ${data.id}`)
  } catch (error) {
    console.error("Error syncing permission creation:", error)
    throw error
  }
}

async function handlePermissionUpdated(data: any) {
  console.log("Processing permission.updated event")

  try {
    await convex.mutation(api.permissions.syncPermissionFromClerk, {
      clerkPermissionId: data.id,
      clerkOrgId: data.organization?.id,
      name: data.name,
      key: data.key,
      description: data.description,
      type: data.type,
      updatedAt: Date.now(),
    })

    console.log(`Permission updated: ${data.id}`)
  } catch (error) {
    console.error("Error syncing permission update:", error)
    throw error
  }
}

async function handlePermissionDeleted(data: any) {
  console.log("Processing permission.deleted event")

  try {
    await convex.mutation(api.permissions.markPermissionDeleted, {
      clerkPermissionId: data.id,
    })

    console.log(`Permission deleted: ${data.id}`)
  } catch (error) {
    console.error("Error handling permission deletion:", error)
    throw error
  }
}

// ===== Session Event Handlers =====

async function handleSessionCreated(data: any) {
  console.log("Processing session.created event")

  try {
    await convex.mutation(api.sessions.trackSession, {
      clerkSessionId: data.id,
      clerkUserId: data.user_id,
      status: "active",
      lastActiveAt: Date.now(),
      createdAt: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
      deviceInfo: {
        userAgent: data.user_agent,
        ipAddress: data.client_ip,
        browser: data.browser,
        os: data.os,
        deviceType: data.device_type,
      },
    })

    console.log(`Session created: ${data.id}`)
  } catch (error) {
    console.error("Error tracking session creation:", error)
    throw error
  }
}

async function handleSessionEnded(data: any) {
  console.log("Processing session.ended event")

  try {
    await convex.mutation(api.sessions.updateSessionStatus, {
      clerkSessionId: data.id,
      status: "ended",
      lastActiveAt: Date.now(),
    })

    console.log(`Session ended: ${data.id}`)
  } catch (error) {
    console.error("Error handling session end:", error)
    throw error
  }
}

async function handleSessionRemoved(data: any) {
  console.log("Processing session.removed event")

  try {
    await convex.mutation(api.sessions.updateSessionStatus, {
      clerkSessionId: data.id,
      status: "removed",
      lastActiveAt: Date.now(),
    })

    console.log(`Session removed: ${data.id}`)
  } catch (error) {
    console.error("Error handling session removal:", error)
    throw error
  }
}

async function handleSessionRevoked(data: any) {
  console.log("Processing session.revoked event")

  try {
    await convex.mutation(api.sessions.updateSessionStatus, {
      clerkSessionId: data.id,
      status: "revoked",
      lastActiveAt: Date.now(),
    })

    console.log(`Session revoked: ${data.id}`)
  } catch (error) {
    console.error("Error handling session revocation:", error)
    throw error
  }
}

async function handleSessionPending(data: any) {
  console.log("Processing session.pending event")

  try {
    await convex.mutation(api.sessions.trackSession, {
      clerkSessionId: data.id,
      clerkUserId: data.user_id,
      status: "pending",
      lastActiveAt: Date.now(),
      createdAt: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
      deviceInfo: {
        userAgent: data.user_agent,
        ipAddress: data.client_ip,
        browser: data.browser,
        os: data.os,
        deviceType: data.device_type,
      },
    })

    console.log(`Session pending: ${data.id}`)
  } catch (error) {
    console.error("Error tracking pending session:", error)
    throw error
  }
}

// ===== Email and SMS Event Handlers =====

async function handleEmailCreated(data: any) {
  console.log("Processing email.created event")

  try {
    await convex.mutation(api.communications.trackEmail, {
      clerkEmailId: data.id,
      clerkUserId: data.user_id,
      emailAddress: data.email_address,
      subject: data.subject,
      status: data.status,
      emailType: data.email_type,
      createdAt: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
    })

    console.log(`Email created: ${data.id}`)
  } catch (error) {
    console.error("Error tracking email creation:", error)
    throw error
  }
}

async function handleSmsCreated(data: any) {
  console.log("Processing sms.created event")

  try {
    await convex.mutation(api.communications.trackSms, {
      clerkSmsId: data.id,
      clerkUserId: data.user_id,
      phoneNumber: data.phone_number,
      message: data.message,
      status: data.status,
      smsType: data.sms_type,
      createdAt: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
    })

    console.log(`SMS created: ${data.id}`)
  } catch (error) {
    console.error("Error tracking SMS creation:", error)
    throw error
  }
}

// ===== Waitlist Event Handlers =====

async function handleWaitlistEntryCreated(data: any) {
  console.log("Processing waitlistEntry.created event")

  try {
    await convex.mutation(api.waitlist.createWaitlistEntry, {
      clerkWaitlistId: data.id,
      email: data.email,
      name: data.name,
      createdAt: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
    })

    console.log(`Waitlist entry created: ${data.id}`)
  } catch (error) {
    console.error("Error syncing waitlist entry creation:", error)
    throw error
  }
}

async function handleWaitlistEntryUpdated(data: any) {
  console.log("Processing waitlistEntry.updated event")

  try {
    await convex.mutation(api.waitlist.updateWaitlistEntry, {
      clerkWaitlistId: data.id,
      status: data.status,
      updatedAt: Date.now(),
    })

    console.log(`Waitlist entry updated: ${data.id}`)
  } catch (error) {
    console.error("Error syncing waitlist entry update:", error)
    throw error
  }
}
