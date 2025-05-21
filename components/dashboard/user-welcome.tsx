import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserWelcomeProps {
  firstName: string
  lastName: string
  imageUrl: string
}

export function UserWelcome({ firstName, lastName, imageUrl }: UserWelcomeProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`
  const fullName = `${firstName} ${lastName}`

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={imageUrl || "/placeholder.svg"} alt={fullName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {firstName}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your vehicles today.</p>
      </div>
    </div>
  )
}
