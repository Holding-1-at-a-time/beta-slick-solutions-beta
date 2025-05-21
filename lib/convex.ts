import { ConvexClient } from "convex/browser"
import { ConvexHttpClient } from "convex/http"
import { api } from "@/convex/_generated/api"

// Create a client for browser environments
export const convexClient = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Create a client for server environments (for server actions)
export const db = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Export the API for type safety
export { api }
