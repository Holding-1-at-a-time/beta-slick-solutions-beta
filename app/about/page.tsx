import type { Metadata } from "next"
import Image from "next/image"
import Header from "@/components/marketing/header"
import Footer from "@/components/marketing/footer"

export const metadata: Metadata = {
  title: "About Us - VehicleService",
  description:
    "Learn about our mission to transform the automotive service industry with innovative technology solutions.",
}

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Co-Founder",
      image: "/professional-ceo-portrait.png",
      bio: "Former automotive service center owner with 15 years of industry experience. Alex founded VehicleService to solve the operational challenges he experienced firsthand.",
    },
    {
      name: "Sarah Chen",
      role: "CTO & Co-Founder",
      image: "/professional-cto-portrait-woman.png",
      bio: "Software engineer with expertise in AI and machine learning. Sarah leads our technology development, focusing on creating intuitive solutions for complex industry problems.",
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Customer Success",
      image: "/customer-success-manager.png",
      bio: "With over a decade in customer success roles, Marcus ensures our clients get maximum value from our platform through training, support, and strategic guidance.",
    },
    {
      name: "Priya Patel",
      role: "Product Director",
      image: "/placeholder-9corb.png",
      bio: "Automotive industry veteran who translates real-world service center needs into product features that drive efficiency and customer satisfaction.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
            <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"></div>
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                Transforming Vehicle Service Management
              </h1>
              <p className="mb-8 text-xl text-gray-300">
                We're on a mission to revolutionize how automotive businesses operate, making them more efficient,
                profitable, and customer-focused.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-24 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white">Our Story</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    VehicleService was founded in 2018 by Alex Johnson and Sarah Chen, who recognized the need for
                    better technology solutions in the automotive service industry.
                  </p>
                  <p>
                    As a former service center owner, Alex experienced firsthand the operational challenges of managing
                    appointments, tracking vehicle histories, and maintaining customer relationships using outdated
                    software.
                  </p>
                  <p>
                    Partnering with Sarah, a software engineer specializing in AI, they set out to build a platform that
                    would address these pain points and bring modern technology to an industry that had been overlooked
                    by innovation.
                  </p>
                  <p>
                    Today, VehicleService powers thousands of automotive businesses worldwide, from small independent
                    shops to large multi-location service centers, helping them deliver exceptional service while
                    operating more efficiently.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square w-full rounded-2xl overflow-hidden">
                  <Image
                    src="/placeholder-kpus5.png"
                    alt="The VehicleService team in our headquarters"
                    width={600}
                    height={600}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-3xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-3xl font-bold tracking-tight text-white text-center">Our Core Values</h2>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Innovation</h3>
                <p className="text-gray-300">
                  We constantly push the boundaries of what's possible, bringing cutting-edge technology to an industry
                  that needs it.
                </p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Customer Partnership</h3>
                <p className="text-gray-300">
                  We see ourselves as partners in our customers' success, not just a software provider. Their growth is
                  our growth.
                </p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Trust & Security</h3>
                <p className="text-gray-300">
                  We handle sensitive business and customer data with the utmost care, maintaining the highest standards
                  of security and privacy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-3xl font-bold tracking-tight text-white text-center">Meet Our Leadership Team</h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
                  <div className="aspect-[3/4] w-full">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-1 text-xl font-bold text-white">{member.name}</h3>
                    <p className="mb-4 text-primary">{member.role}</p>
                    <p className="text-gray-300">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
