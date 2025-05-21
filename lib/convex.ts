import { ConvexClient } from "convex/browser"
import { ConvexReactClient } from "convex/react"
import { api } from "@/convex/_generated/api"

// Create a client for browser environments
export const convexClient = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Create a client for React components
export const reactClient = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Export the API for type safety
export { api }

// For server actions, use the fetch API directly with the Convex URL
// Example usage:
// async function serverAction() {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/query/myFunction`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ arg1: 'value1' }),
//   });
//   return response.json();
// }
