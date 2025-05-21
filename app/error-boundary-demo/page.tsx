import { ErrorBoundaryDemo } from "@/components/error-boundary-demo"

export const metadata = {
  title: "Error Boundary Demo",
  description: "Demonstration of React Error Boundaries",
}

export default function ErrorBoundaryDemoPage() {
  return (
    <div className="container py-10">
      <ErrorBoundaryDemo />
    </div>
  )
}
