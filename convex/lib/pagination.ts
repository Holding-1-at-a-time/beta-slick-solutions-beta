import { v } from "convex/values"

export const paginationOptsValidator = v.object({
  limit: v.number(),
  cursor: v.optional(v.string()),
})

export type PaginationOpts = {
  limit: number
  cursor?: string
}
