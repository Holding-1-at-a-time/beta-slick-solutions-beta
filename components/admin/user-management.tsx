"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { AddUser } from "./add-user"
import { EditUser } from "./edit-user"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function UserManagement() {
  const { toast } = useToast()
  const [retryCount, setRetryCount] = useState(0)

  const {
    results: users,
    isLoading,
    isError,
    error,
  } = useQuery(query("listUsers")) || {
    results: [],
    isLoading: true,
    isError: false,
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    toast({
      title: "Retrying",
      description: "Attempting to fetch users again...",
    })
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load users: {error?.message || "Unknown error"}
          <div className="mt-4">
            <Button onClick={handleRetry} size="sm" variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>

      <div className="mb-6">
        <AddUser
          onError={(message) => {
            toast({
              variant: "destructive",
              title: "Error adding user",
              description: message,
            })
          }}
        />
      </div>

      {users && users.length > 0 ? (
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
                    onError={(message) => {
                      toast({
                        variant: "destructive",
                        title: "Error updating user",
                        description: message,
                      })
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center p-6 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}
    </div>
  )
}
