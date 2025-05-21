"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { AddUser } from "./add-user"
import { EditUser } from "./edit-user"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import * as Sentry from "@sentry/nextjs"

export function UserManagement() {
  const [error, setError] = useState<Error | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  const users = useQuery(query("listUsers"), {
    onError: (err) => {
      Sentry.captureException(err, {
        extra: {
          component: "UserManagement",
          action: "listUsers query",
        },
      })
      setError(err)
    },
  })

  const isLoading = users === undefined && !error

  const handleRetry = () => {
    setIsRetrying(true)
    setError(null)
    // Force a refetch by invalidating the query cache
    setTimeout(() => {
      setIsRetrying(false)
    }, 1000)
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load users: {error.message}
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={handleRetry} disabled={isRetrying}>
                {isRetrying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                  </>
                )}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading || isRetrying) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="mb-6">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="border rounded-md">
          <div className="p-4 border-b">
            <div className="flex">
              <Skeleton className="h-6 w-24 mr-8" />
              <Skeleton className="h-6 w-32 mr-8" />
              <Skeleton className="h-6 w-16 mr-8" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border-b">
              <div className="flex">
                <Skeleton className="h-6 w-32 mr-8" />
                <Skeleton className="h-6 w-40 mr-8" />
                <Skeleton className="h-6 w-20 mr-8" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>

      <div className="mb-6">
        <AddUser
          onError={(err) => {
            Sentry.captureException(err, {
              extra: {
                component: "UserManagement",
                action: "AddUser",
              },
            })
          }}
        />
      </div>

      {users && users.length === 0 ? (
        <Alert>
          <AlertTitle>No users found</AlertTitle>
          <AlertDescription>
            No users have been added to this tenant yet. Use the "Add User" button to create your first user.
          </AlertDescription>
        </Alert>
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
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <EditUser
                    user={user}
                    onError={(err) => {
                      Sentry.captureException(err, {
                        extra: {
                          component: "UserManagement",
                          action: "EditUser",
                          userId: user.id,
                        },
                      })
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
