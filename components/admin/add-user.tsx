"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "convex/react"
import { mutation } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useClerk } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { ErrorAlert } from "@/components/ui/error-alert"
import { useToast } from "@/components/ui/use-toast"

interface AddUserProps {
  onError?: (error: Error) => void
}

export function AddUser({ onError }: AddUserProps) {
  const { toast } = useToast()
  const params = useParams()
  const orgId = params.orgId as string
  const { client: clerkClient } = useClerk()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"org:admin" | "org:member" | "org:client">("org:client")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const queryClient = useQueryClient()
  const createUserRecord = useMutation(mutation("createUser"))

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // 1. Create invitation via Clerk
      const invitation = await clerkClient.organizations.createOrganizationInvitation({
        organizationId: orgId,
        emailAddress: email,
        role: role,
        redirectUrl: `${window.location.origin}/${orgId}/dashboard`,
      })

      // 2. Create user record in Convex
      await createUserRecord(invitation.id, role)

      // 3. Reset form and invalidate queries
      setEmail("")
      queryClient.invalidateQueries(["listUsers"])

      // 4. Show success toast
      toast({
        title: "User invited successfully",
        description: `An invitation has been sent to ${email}`,
      })
    } catch (error) {
      console.error("Failed to invite user:", error)
      setError(error instanceof Error ? error : new Error("Failed to invite user"))
      if (onError) onError(error instanceof Error ? error : new Error("Failed to invite user"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleInvite} className="flex flex-wrap gap-3 items-end">
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="w-40">
          <Select value={role} onValueChange={(value) => setRole(value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="org:admin">Admin</SelectItem>
              <SelectItem value="org:member">Member</SelectItem>
              <SelectItem value="org:client">Client</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Inviting..." : "Invite User"}
        </Button>
      </form>

      {error && <ErrorAlert title="Failed to invite user" error={error} />}
    </div>
  )
}
