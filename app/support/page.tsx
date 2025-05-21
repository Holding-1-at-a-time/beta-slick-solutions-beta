import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/marketing/header"
import Footer from "@/components/marketing/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FileText, LifeBuoy, MessageCircle, Phone, Video } from "lucide-react"

export const metadata: Metadata = {
  title: "Support - VehicleService",
  description: "Get help with the VehicleService platform through our knowledge base, tutorials, and support channels.",
}

export default function SupportPage() {
  const popularArticles = [
    {
      title: "Getting Started with VehicleService",
      description: "Learn the basics of setting up your account and navigating the platform.",
      url: "/support/articles/getting-started",
    },
    {
      title: "Setting Up Your First Vehicle",
      description: "Step-by-step guide to adding and managing vehicles in the system.",
      url: "/support/articles/adding-vehicles",
    },
    {
      title: "Managing Appointments",
      description: "Learn how to schedule, reschedule, and cancel appointments.",
      url: "/support/articles/managing-appointments",
    },
    {
      title: "Creating and Sending Invoices",
      description: "Complete guide to creating, customizing, and sending invoices to customers.",
      url: "/support/articles/invoicing",
    },
    {
      title: "User Roles and Permissions",
      description: "Understanding different user roles and how to manage permissions.",
      url: "/support/articles/user-roles",
    },
    {
      title: "Integrating with Third-Party Services",
      description: "Connect VehicleService with your existing tools and services.",
      url: "/support/articles/integrations",
    },
  ]

  const commonQuestions = [
    {
      question: "How do I reset my password?",
      answer:
        "To reset your password, click on the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password.",
    },
    {
      question: "Can I import my existing customer data?",
      answer:
        "Yes, VehicleService supports importing customer data from CSV files and several popular automotive management systems. Go to Settings > Data Import to access the import tools. For large or complex imports, contact our support team for assistance.",
    },
    {
      question: "How do I add team members to my account?",
      answer:
        "To add team members, go to Settings > Team Members and click 'Add Team Member'. Enter their email address and select their role. They will receive an invitation email with instructions to create their account.",
    },
    {
      question: "How does the AI scheduling system work?",
      answer:
        "Our AI scheduling system analyzes your business patterns, staff availability, and service durations to optimize appointment scheduling. It automatically suggests the best time slots for new appointments and can adjust schedules when changes occur. You can configure the AI settings in Settings > Scheduling.",
    },
    {
      question: "Can customers book appointments online?",
      answer:
        "Yes, VehicleService includes a customer portal where your clients can book appointments, view their vehicle history, and access invoices. You can customize the booking options and available time slots in Settings > Customer Portal.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">Support Center</h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              Find answers to your questions and get help with the VehicleService platform.
            </p>
          </div>

          <Tabs defaultValue="help" className="mx-auto max-w-5xl">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900">
              <TabsTrigger value="help">Help Center</TabsTrigger>
              <TabsTrigger value="contact">Contact Support</TabsTrigger>
              <TabsTrigger value="training">Training & Tutorials</TabsTrigger>
            </TabsList>

            <TabsContent value="help" className="mt-6">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-white">Popular Articles</h2>
                  <div className="space-y-4">
                    {popularArticles.map((article, index) => (
                      <Card key={index} className="border-gray-800 bg-gray-900/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white">
                            <Link href={article.url} className="hover:text-primary">
                              {article.title}
                            </Link>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-gray-300">{article.description}</CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button asChild variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
                      <Link href="/support/articles">Browse All Articles</Link>
                    </Button>
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 text-2xl font-bold text-white">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {commonQuestions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border border-gray-800 rounded-lg bg-gray-900/50 px-6"
                      >
                        <AccordionTrigger className="text-lg font-medium text-white py-4">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 pb-4">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <div className="mt-6 text-center">
                    <Button asChild variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
                      <Link href="/faq">View All FAQs</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <div className="grid gap-8 md:grid-cols-2">
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/20 p-2">
                        <MessageCircle className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-white">Live Chat</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-300">
                      Chat with our support team in real-time for immediate assistance with your questions.
                    </p>
                    <p className="mb-6 text-sm text-gray-400">
                      Available Monday-Friday, 9am-6pm EST
                      <br />
                      Average response time: &lt;2 minutes
                    </p>
                    <Button className="w-full bg-primary hover:bg-primary/90">Start Chat</Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/20 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-white">Submit a Ticket</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-300">
                      Create a support ticket for complex issues or if you need assistance outside of business hours.
                    </p>
                    <p className="mb-6 text-sm text-gray-400">
                      24/7 ticket submission
                      <br />
                      Response time: Within 24 hours
                    </p>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link href="/contact">Submit Ticket</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/20 p-2">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-white">Phone Support</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-300">
                      Speak directly with our support team for urgent issues or when you prefer voice communication.
                    </p>
                    <p className="mb-6 text-sm text-gray-400">
                      Available Monday-Friday, 9am-6pm EST
                      <br />
                      +1 (555) 123-4567
                    </p>
                    <Button className="w-full bg-primary hover:bg-primary/90">Call Support</Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/20 p-2">
                        <LifeBuoy className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-white">Premium Support</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-300">
                      Professional and Enterprise customers receive priority support with dedicated account managers.
                    </p>
                    <p className="mb-6 text-sm text-gray-400">
                      Available 24/7 for urgent issues
                      <br />
                      Response time: &lt;1 hour
                    </p>
                    <Button className="w-full bg-primary hover:bg-primary/90">Access Premium Support</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="training" className="mt-6">
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/20 p-2">
                        <Video className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-white">Video Tutorials</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-300">
                      Watch step-by-step video tutorials covering all aspects of the VehicleService platform.
                    </p>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link href="/support/tutorials">View Tutorials</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/20 p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-primary"
                        >
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                      </div>
                      <CardTitle className="text-white">Webinars</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-300">
                      Join our live webinars to learn about new features and best practices from our experts.
                    </p>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link href="/support/webinars">Upcoming Webinars</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/20 p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-primary"
                        >
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                        </svg>
                      </div>
                      <CardTitle className="text-white">Documentation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-300">
                      Access comprehensive documentation covering all features and functionality of the platform.
                    </p>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link href="/support/docs">View Documentation</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/20 p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-primary"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      </div>
                      <CardTitle className="text-white">Onboarding</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-300">
                      Schedule a personalized onboarding session with our customer success team to get started quickly.
                    </p>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link href="/support/onboarding">Schedule Onboarding</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/20 p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-primary"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </div>
                      <CardTitle className="text-white">User Community</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-300">
                      Connect with other VehicleService users to share tips, ask questions, and learn best practices.
                    </p>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link href="/support/community">Join Community</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/20 p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-primary"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                      </div>
                      <CardTitle className="text-white">API Documentation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-300">
                      Explore our API documentation to integrate VehicleService with your existing systems.
                    </p>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link href="/support/api">View API Docs</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
