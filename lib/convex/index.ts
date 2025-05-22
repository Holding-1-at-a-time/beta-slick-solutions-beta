import { ConvexReactClient } from "convex/react"
import { api } from "../../convex/_generated/api"

// Create a client instance for the browser
export const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)

// Export the API for convenience
export { api }

// Helper function to check if a value is a Convex ID
export function isConvexId(value: any): boolean {
  return value && typeof value === "object" && "tableName" in value && "id" in value
}

// Helper function to format Convex IDs for display or logging
export function formatConvexId(id: any): string {
  if (!isConvexId(id)) return String(id)
  return `${id.tableName}:${id.id}`
}

// Helper function to create a query key for React Query
export function createQueryKey(functionName: string, args: any) {
  return [functionName, args]
}

// Helper function to handle Convex errors
export function handleConvexError(error: any): string {
  if (typeof error === "object" && error !== null) {
    if ("message" in error) return error.message
    if ("error" in error) return error.error
  }
  return String(error)
}
