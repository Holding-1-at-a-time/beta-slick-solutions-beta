import { SentryExample } from "@/components/sentry-example"

export const metadata = {
  title: "Sentry Example",
  description: "Example of Sentry integration for error monitoring and performance tracking",
}

export default function SentryExamplePage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Sentry Integration Example</h1>
      <div className="max-w-3xl mx-auto">
        <p className="text-gray-600 mb-8 text-center">
          This page demonstrates how to use Sentry for error monitoring and performance tracking.
        </p>
        <SentryExample />
      </div>
    </div>
  )
}
