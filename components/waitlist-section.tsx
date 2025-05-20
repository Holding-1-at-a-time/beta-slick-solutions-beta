"use client"

import { Waitlist } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function WaitlistSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Get Early Access</CardTitle>
              <CardDescription className="text-center">
                Join our waitlist to be the first to experience our platform when we launch.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Waitlist />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
