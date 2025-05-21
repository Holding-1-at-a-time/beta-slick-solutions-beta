import type { Metadata } from "next"
import Header from "@/components/marketing/header"
import Footer from "@/components/marketing/footer"

export const metadata: Metadata = {
  title: "Privacy Policy - VehicleService",
  description: "Learn about how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-4xl font-bold tracking-tight text-white">Privacy Policy</h1>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300">Last Updated: May 20, 2025</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
              <p className="text-gray-300">
                VehicleService ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use our vehicle service
                management platform.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Information We Collect</h2>
              <p className="text-gray-300">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                <li>
                  <strong className="text-white">Account Information:</strong> When you register for an account, we
                  collect your name, email address, password, and business information.
                </li>
                <li>
                  <strong className="text-white">Profile Information:</strong> Information you provide in your user
                  profile, such as contact information and profile picture.
                </li>
                <li>
                  <strong className="text-white">Business Data:</strong> Information about your business, including
                  vehicle records, customer information, appointment details, and invoices.
                </li>
                <li>
                  <strong className="text-white">Payment Information:</strong> If you make purchases through our
                  platform, we collect payment information, though full payment details are processed by our payment
                  processors.
                </li>
                <li>
                  <strong className="text-white">Communications:</strong> When you communicate with us or use our
                  messaging features, we collect the content of those communications.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-300">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send administrative messages, updates, and security alerts</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Provide customer service and technical support</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Personalize and improve your experience</li>
                <li>Develop new products and services</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-300">We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                <li>
                  <strong className="text-white">With Service Providers:</strong> We share information with third-party
                  vendors who provide services on our behalf.
                </li>
                <li>
                  <strong className="text-white">For Legal Reasons:</strong> We may disclose information if required by
                  law or in response to valid legal requests.
                </li>
                <li>
                  <strong className="text-white">Business Transfers:</strong> If we are involved in a merger,
                  acquisition, or sale of assets, your information may be transferred as part of that transaction.
                </li>
                <li>
                  <strong className="text-white">With Your Consent:</strong> We may share information with your consent
                  or at your direction.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Data Security</h2>
              <p className="text-gray-300">
                We implement appropriate technical and organizational measures to protect your information against
                unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Access controls and authentication requirements</li>
                <li>Employee training on data security practices</li>
                <li>Multi-tenant architecture with strict data isolation</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Your Rights and Choices</h2>
              <p className="text-gray-300">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                <li>Accessing and updating your information</li>
                <li>Requesting deletion of your information</li>
                <li>Objecting to certain processing activities</li>
                <li>Data portability</li>
                <li>Withdrawing consent</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. International Data Transfers</h2>
              <p className="text-gray-300">
                We may transfer your information to countries other than your country of residence. When we do so, we
                implement appropriate safeguards to ensure your information receives adequate protection.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Changes to This Privacy Policy</h2>
              <p className="text-gray-300">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the "Last Updated" date.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Contact Us</h2>
              <p className="text-gray-300">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-300 mt-2">
                Email: privacy@vehicleservice.com
                <br />
                Address: 123 Innovation Drive, San Francisco, CA 94103
                <br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
