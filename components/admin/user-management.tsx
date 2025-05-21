"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { AddUser } from "./add-user"
import { EditUser } from "./edit-user"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function UserManagement() {
  const [queryError, setQueryError] = useState<Error | null>(null)
  const users =
    useQuery(query("listUsers"), {
      onError: (error) => {
        console.error("Failed to fetch users:", error)
        setQueryError(error)
      },
    }) || []

  const isLoading = users === undefined && !queryError

  const handleRetry = () => {
    setQueryError(null)
    // This will trigger a refetch of the query
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (queryError) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        <ErrorAlert title="Failed to load users" error={queryError} />
        <Button onClick={handleRetry} className="mt-2">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>

      <div className="mb-6">
        <AddUser
          onError={(error) => {
            console.error("Error adding user:", error)
          }}
        />
      </div>

      {users.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No users found. Add your first user above.</p>
        </div>
      ) : (
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
                  <EditUser
                    user={user}
                    onError={(error) => {
                      console.error(`Error updating user ${user.id}:`, error)
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
