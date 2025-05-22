import { api } from "../../convex/_generated/api"
import { convex } from "./index"

// Helper function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const user = await convex.query(api.queries.getUserProfile)
    return !!user
  } catch (error) {
    return false
  }
}

// Helper function to get the current user's organization ID
export async function getCurrentOrgId(): Promise<string | null> {
  try {
    const user = await convex.query(api.queries.getUserProfile)
    return user?.orgId || null
  } catch (error) {
    return null
  }
}

// Helper function to check if user has a specific permission
export function hasPermission(permissions: string[], requiredPermission: string): boolean {
  if (!permissions || !Array.isArray(permissions)) return false
  return permissions.includes(requiredPermission)
}
