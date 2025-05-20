import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
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
