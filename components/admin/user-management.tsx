"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { AddUser } from "./add-user"
import { EditUser } from "./edit-user"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function UserManagement() {
  const users = useQuery(query("listUsers")) || []
  const isLoading = !users

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>

      <div className="mb-6">
        <AddUser />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <EditUser user={user} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
