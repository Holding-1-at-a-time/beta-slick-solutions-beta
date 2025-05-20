import type { Metadata } from "next"
import Header from "@/components/marketing/header"
import Footer from "@/components/marketing/footer"

export const metadata: Metadata = {
  title: "Terms of Service - VehicleService",
  description: "Read our terms of service and user agreement for using the VehicleService platform.",
}

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-4xl font-bold tracking-tight text-white">Terms of Service</h1>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300">Last Updated: May 20, 2025</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300">
                By accessing or using the VehicleService platform ("Service"), you agree to be bound by these Terms of
                Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Description of Service</h2>
              <p className="text-gray-300">
                VehicleService is a cloud-based vehicle service management platform that provides tools for appointment
                scheduling, vehicle management, digital invoicing, and customer communication.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Account Registration</h2>
              <p className="text-gray-300">
                To use certain features of the Service, you must register for an account. You agree to provide accurate,
                current, and complete information during the registration process and to update such information to keep
                it accurate, current, and complete.
              </p>
              <p className="text-gray-300 mt-4">
                You are responsible for safeguarding your account credentials and for all activities that occur under
                your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Subscription and Payments</h2>
              <p className="text-gray-300">
                Some features of the Service require a subscription. You agree to pay all fees associated with your
                subscription plan. All payments are non-refundable except as expressly provided in these Terms.
              </p>
              <p className="text-gray-300 mt-4">
                We may change subscription fees at any time, but will provide you with advance notice before any changes
                take effect. If you do not agree to the fee changes, you may cancel your subscription before the changes
                take effect.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. User Content</h2>
              <p className="text-gray-300">
                You retain ownership of any content you submit to the Service ("User Content"). By submitting User
                Content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, modify, and display
                your User Content in connection with providing and improving the Service.
              </p>
              <p className="text-gray-300 mt-4">
                You represent and warrant that you have all rights necessary to grant us the license above and that your
                User Content does not violate any laws or infringe any third-party rights.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Prohibited Conduct</h2>
              <p className="text-gray-300">You agree not to:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                <li>Use the Service for any illegal purpose</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe the rights of others</li>
                <li>Attempt to gain unauthorized access to the Service or its systems</li>
                <li>Interfere with the proper functioning of the Service</li>
                <li>Engage in automated use of the system</li>
                <li>Transmit any viruses, malware, or other harmful code</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-300">
                The Service and its original content, features, and functionality are owned by VehicleService and are
                protected by international copyright, trademark, patent, trade secret, and other intellectual property
                laws.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Termination</h2>
              <p className="text-gray-300">
                We may terminate or suspend your account and access to the Service at our sole discretion, without
                notice or liability, for any reason, including if you breach these Terms.
              </p>
              <p className="text-gray-300 mt-4">
                You may terminate your account at any time by contacting us. Upon termination, your right to use the
                Service will immediately cease.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Disclaimer of Warranties</h2>
              <p className="text-gray-300">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
                IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                PURPOSE, AND NON-INFRINGEMENT.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-300">
                IN NO EVENT SHALL VEHICLESERVICE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN
                CONNECTION WITH YOUR ACCESS TO, USE OF, OR INABILITY TO USE THE SERVICE.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Governing Law</h2>
              <p className="text-gray-300">
                These Terms shall be governed by and construed in accordance with the laws of the State of California,
                without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-300">
                We reserve the right to modify these Terms at any time. We will provide notice of significant changes by
                posting the updated Terms on this page and updating the "Last Updated" date.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">13. Contact Us</h2>
              <p className="text-gray-300">If you have any questions about these Terms, please contact us at:</p>
              <p className="text-gray-300 mt-2">
                Email: legal@vehicleservice.com
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
