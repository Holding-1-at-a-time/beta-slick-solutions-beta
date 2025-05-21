"use server"

import { auth } from "@clerk/nextjs/server"

export async function fetchGoogleCalendar({ orgId }: { orgId: string }) {
  const { orgId: authOrgId } = auth()
  if (!authOrgId || authOrgId !== orgId) {
    throw new Error("Unauthorized: Must be signed in with the correct organization")
  }

  try {
    // Mock Google Calendar API call
    // In a real implementation, this would call the Google Calendar API
    return {
      busy: [
        {
          start: new Date(Date.now() + 7200000).toISOString(),
          end: new Date(Date.now() + 10800000).toISOString(),
        },
        {
          start: new Date(Date.now() + 14400000).toISOString(),
          end: new Date(Date.now() + 18000000).toISOString(),
        },
      ],
      available: [
        {
          start: new Date(Date.now() + 3600000).toISOString(),
          end: new Date(Date.now() + 7200000).toISOString(),
        },
        {
          start: new Date(Date.now() + 10800000).toISOString(),
          end: new Date(Date.now() + 14400000).toISOString(),
        },
        {
          start: new Date(Date.now() + 18000000).toISOString(),
          end: new Date(Date.now() + 21600000).toISOString(),
        },
      ],
    }
  } catch (error) {
    console.error("Error in fetchGoogleCalendar:", error)
    throw new Error("Failed to fetch calendar data")
  }
}
