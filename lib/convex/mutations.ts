import { api } from "../../convex/_generated/api"
import { convex } from "./index"
import type { Id } from "../../convex/_generated/dataModel"

// Generic function to create an item
export async function createItem<T>(tableName: string, data: Partial<T>, orgId: string): Promise<Id<any> | null> {
  try {
    // This is a simplified example - in practice, you would call specific mutation functions
    const id = await convex.mutation(api.mutations.createItem, { tableName, data, orgId })
    return id as Id<any>
  } catch (error) {
    console.error(`Error creating ${tableName}:`, error)
    return null
  }
}

// Generic function to update an item
export async function updateItem<T>(tableName: string, id: Id<any>, data: Partial<T>, orgId: string): Promise<boolean> {
  try {
    // This is a simplified example - in practice, you would call specific mutation functions
    await convex.mutation(api.mutations.updateItem, { tableName, id, data, orgId })
    return true
  } catch (error) {
    console.error(`Error updating ${tableName}:`, error)
    return false
  }
}

// Generic function to delete an item
export async function deleteItem(tableName: string, id: Id<any>, orgId: string): Promise<boolean> {
  try {
    // This is a simplified example - in practice, you would call specific mutation functions
    await convex.mutation(api.mutations.deleteItem, { tableName, id, orgId })
    return true
  } catch (error) {
    console.error(`Error deleting ${tableName}:`, error)
    return false
  }
}
