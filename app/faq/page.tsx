import type { Metadata } from "next"
import Header from "@/components/marketing/header"
import Footer from "@/components/marketing/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Frequently Asked Questions - VehicleService",
  description: "Find answers to common questions about our vehicle service management platform.",
}

export default function FAQPage() {
  const faqs = [
    {
      question: "What is VehicleService?",
      answer:
        "VehicleService is a comprehensive SaaS platform designed specifically for automotive service businesses. It helps streamline operations with features like intelligent scheduling, vehicle management, digital invoicing, and customer communication tools.",
    },
    {
      question: "How does the pricing work?",
      answer:
        "We offer three main pricing tiers: Starter ($49/month), Professional ($99/month), and Enterprise (custom pricing). Each tier includes different features and capacity limits. All plans come with a 14-day free trial with no credit card required.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. When upgrading, the new features will be available immediately. When downgrading, the changes will take effect at the start of your next billing cycle.",
    },
    {
      question: "Is there a limit to how many vehicles I can manage?",
      answer:
        "The Starter plan allows up to 50 vehicle records. The Professional and Enterprise plans offer unlimited vehicle records.",
    },
    {
      question: "How does the AI scheduling work?",
      answer:
        "Our AI scheduling system analyzes your business patterns, staff availability, service duration, and customer preferences to optimize appointment scheduling. It helps reduce wait times, maximize staff utilization, and improve customer satisfaction.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we take security very seriously. We use industry-standard encryption, multi-tenant architecture with strict data isolation, regular security audits, and comply with relevant data protection regulations including GDPR.",
    },
    {
      question: "Can I import data from my existing system?",
      answer:
        "Yes, we offer data migration services to help you transition from your existing system. We support imports from most common automotive service management software and can work with custom formats as well.",
    },
    {
      question: "Do you offer training and support?",
      answer:
        "All plans include access to our knowledge base and email support. Professional and Enterprise plans include priority support and training sessions. Enterprise customers also receive a dedicated account manager.",
    },
    {
      question: "Can I customize the platform for my business?",
      answer:
        "Yes, VehicleService offers various customization options. You can customize service types, invoice templates, notification messages, and more. Enterprise customers have access to additional white-labeling options.",
    },
    {
      question: "What integrations do you offer?",
      answer:
        "We integrate with popular payment processors, accounting software, CRM systems, and parts inventory management solutions. Our API also allows for custom integrations with other business systems.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-4xl font-bold tracking-tight text-white">Frequently Asked Questions</h1>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-gray-800 rounded-lg bg-gray-900/50 px-6"
                >
                  <AccordionTrigger className="text-lg font-medium text-white py-4">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-300 pb-4">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 text-center">
              <p className="text-gray-300">
                Still have questions?{" "}
                <a href="/contact" className="text-primary hover:underline">
                  Contact our support team
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
