import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        redirectUrl="/dashboard"
        appearance={{
          elements: {
            card: "shadow-lg border border-gray-200",
            formButtonPrimary: "bg-primary hover:bg-primary/90",
          },
        }}
      />
    </div>
  )
}
