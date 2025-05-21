// Helper function for server-side Convex calls
export async function serverConvex<T>(functionPath: string, args: Record<string, any> = {}): Promise<T> {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined")
  }

  const [namespace, functionName] = functionPath.split(":")

  const response = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/${namespace}/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  })

  if (!response.ok) {
    throw new Error(`Convex API error: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

// Example usage:
// import { serverConvex } from "@/lib/server-convex"
// import { api } from "@/convex/_generated/api"
//
// async function getUser(userId: string) {
//   return serverConvex(api.users.getUser.path, { userId })
// }
