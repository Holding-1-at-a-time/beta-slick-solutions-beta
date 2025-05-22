import { api } from "../../convex/_generated/api"
import { convex } from "./index"
import type { Id } from "../../convex/_generated/dataModel"

// Generic function to fetch a single item by ID
export async function fetchById<T>(tableName: string, id: Id<any>, orgId: string): Promise<T | null> {
  try {
    // This is a simplified example - in practice, you would call specific query functions
    const result = await convex.query(api.queries.getById, { tableName, id, orgId })
    return result as T
  } catch (error) {
    console.error(`Error fetching ${tableName} by ID:`, error)
    return null
  }
}

// Generic function to fetch a list of items
export async function fetchList<T>(tableName: string, orgId: string, filters?: Record<string, any>): Promise<T[]> {
  try {
    // This is a simplified example - in practice, you would call specific query functions
    const result = await convex.query(api.queries.getList, { tableName, orgId, filters })
    return result as T[]
  } catch (error) {
    console.error(`Error fetching ${tableName} list:`, error)
    return []
  }
}
