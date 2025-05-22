import { ConvexHttpClient } from "convex/browser"
import { api } from "../convex/_generated/api"

// Create a Convex client for use in the browser
export const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "")

// Export a db object that can be used to query and mutate data
export const db = {
  query: <T extends keyof typeof api.query>(name: T, args?: Parameters<(typeof api.query)[T]>[0]) => {
    return convexClient.query(api.query[name], args)
  },
  mutation: <T extends keyof typeof api.mutation>(name: T, args?: Parameters<(typeof api.mutation)[T]>[0]) => {
    return convexClient.mutation(api.mutation[name], args)
  },
}

// Export the Convex client for direct use;

// Export a function to get the Convex URL
export const getConvexUrl = () => process.env.NEXT_PUBLIC_CONVEX_URL || ""
