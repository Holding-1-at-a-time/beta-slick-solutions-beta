import { v } from "convex/values"

export const paginationOptsValidator = {
  page: v.number(),
  limit: v.number(),
}
