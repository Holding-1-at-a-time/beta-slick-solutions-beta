import { ConvexHttpClient } from "convex/browser"
import { api } from "../convex/_generated/api"

// Create a Convex client for use on the server
export const createServerClient = () => {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined")
  }

  const client = new ConvexHttpClient(convexUrl)

  return {
    query: async <T extends keyof typeof api.query>(name: T, args?: Parameters<(typeof api.query)[T]>[0]) => {
      return client.query(api.query[name], args)
    },
    mutation: async <T extends keyof typeof api.mutation>(name: T, args?: Parameters<(typeof api.mutation)[T]>[0]) => {
      return client.mutation(api.mutation[name], args)
    },
  }
}

// Export a function to get the Convex URL
export const getConvexUrl = () => process.env.NEXT_PUBLIC_CONVEX_URL || ""
