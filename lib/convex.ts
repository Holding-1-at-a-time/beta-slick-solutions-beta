import { ConvexClient } from "convex/browser"
import { ConvexReactClient } from "convex/react"
import { api } from "@/convex/_generated/api"

// Create a client for browser environments
export const convexClient = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Create a client for React components
export const reactClient = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Export the API for type safety
export { api }

// Export db for backward compatibility
// This is a wrapper around the convexClient that maintains the same API
export const db = {
  query: async (path: string, args: any) => {
    const [namespace, method] = path.split(":")
    return convexClient.query(`${namespace}:${method}`, args)
  },
  mutation: async (path: string, args: any) => {
    const [namespace, method] = path.split(":")
    return convexClient.mutation(`${namespace}:${method}`, args)
  },
  action: async (path: string, args: any) => {
    const [namespace, method] = path.split(":")
    return convexClient.action(`${namespace}:${method}`, args)
  },
}
