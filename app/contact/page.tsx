import type { Metadata } from "next"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contact Us - VehicleService",
  description: "Get in touch with our team for sales inquiries, support, or partnership opportunities.",
}

export default function ContactPage() {
  return <ContactPageClient />
}
