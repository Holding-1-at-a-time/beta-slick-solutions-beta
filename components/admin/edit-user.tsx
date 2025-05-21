"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "convex/react"
import { mutation } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useClerk } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useParams } from "next/navigation"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export function EditUser({ user }: { user: User }) {
  const params = useParams()
  const orgId = params.orgId as string
  const { client: clerkClient } = useClerk()
  const [isOpen, setIsOpen] = useState(false)
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [role, setRole] = useState(user.role as "org:admin" | "org:member" | "org:client")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const queryClient = useQueryClient()
  const updateUserRecord = useMutation(mutation("updateUser"))

  const handleSave = async () => {
    setIsSubmitting(true)

    try {
      // 1. Update user via Clerk
      await clerkClient.users.updateUser(user.id, {
        firstName,
        lastName,
      })

      // 2. Update role if changed
      if (role !== user.role) {
        const memberships = await clerkClient.organizations.getOrganizationMembershipList({
          organizationId: orgId,
          userId: user.id,
        })

        const membership = memberships.data[0]
        if (membership) {
          await clerkClient.organizations.updateOrganizationMembership({
            organizationId: orgId,
            userId: user.id,
            role: role,
          })
        }
      }

      // 3. Update in Convex
      await updateUserRecord(user.id, { firstName, lastName, role })

      // 4. Close dialog and invalidate queries
      setIsOpen(false)
      queryClient.invalidateQueries(["listUsers"])
    } catch (error) {
      console.error("Failed to update user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">First Name</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Last Name</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Role</label>
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
