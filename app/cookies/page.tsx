import type { Metadata } from "next"
import Header from "@/components/marketing/header"
import Footer from "@/components/marketing/footer"

export const metadata: Metadata = {
  title: "Cookie Policy - VehicleService",
  description: "Learn about how we use cookies and similar technologies on our platform.",
}

export default function CookiePolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-4xl font-bold tracking-tight text-white">Cookie Policy</h1>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300">Last Updated: May 20, 2025</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
              <p className="text-gray-300">
                This Cookie Policy explains how VehicleService ("we," "our," or "us") uses cookies and similar
                technologies to recognize you when you visit our website and use our platform. It explains what these
                technologies are and why we use them, as well as your rights to control our use of them.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. What Are Cookies?</h2>
              <p className="text-gray-300">
                Cookies are small data files that are placed on your computer or mobile device when you visit a website.
                Cookies are widely used by website owners to make their websites work, or to work more efficiently, as
                well as to provide reporting information.
              </p>
              <p className="text-gray-300 mt-4">
                Cookies set by the website owner (in this case, VehicleService) are called "first-party cookies."
                Cookies set by parties other than the website owner are called "third-party cookies." Third-party
                cookies enable third-party features or functionality to be provided on or through the website (e.g.,
                advertising, interactive content, and analytics).
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Types of Cookies We Use</h2>
              <p className="text-gray-300">We use the following types of cookies:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                <li>
                  <strong className="text-white">Essential Cookies:</strong> These cookies are necessary for the website
                  to function and cannot be switched off in our systems. They are usually only set in response to
                  actions made by you which amount to a request for services, such as setting your privacy preferences,
                  logging in, or filling in forms.
                </li>
                <li>
                  <strong className="text-white">Performance Cookies:</strong> These cookies allow us to count visits
                  and traffic sources so we can measure and improve the performance of our site. They help us to know
                  which pages are the most and least popular and see how visitors move around the site.
                </li>
                <li>
                  <strong className="text-white">Functionality Cookies:</strong> These cookies enable the website to
                  provide enhanced functionality and personalization. They may be set by us or by third-party providers
                  whose services we have added to our pages.
                </li>
                <li>
                  <strong className="text-white">Targeting Cookies:</strong> These cookies may be set through our site
                  by our advertising partners. They may be used by those companies to build a profile of your interests
                  and show you relevant advertisements on other sites.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Specific Cookies We Use</h2>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full border border-gray-700">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="px-4 py-2 text-left text-white">Name</th>
                      <th className="px-4 py-2 text-left text-white">Purpose</th>
                      <th className="px-4 py-2 text-left text-white">Duration</th>
                      <th className="px-4 py-2 text-left text-white">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-700">
                      <td className="px-4 py-2 text-gray-300">session_id</td>
                      <td className="px-4 py-2 text-gray-300">Maintains user session</td>
                      <td className="px-4 py-2 text-gray-300">Session</td>
                      <td className="px-4 py-2 text-gray-300">Essential</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="px-4 py-2 text-gray-300">_ga</td>
                      <td className="px-4 py-2 text-gray-300">Google Analytics</td>
                      <td className="px-4 py-2 text-gray-300">2 years</td>
                      <td className="px-4 py-2 text-gray-300">Performance</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="px-4 py-2 text-gray-300">_gid</td>
                      <td className="px-4 py-2 text-gray-300">Google Analytics</td>
                      <td className="px-4 py-2 text-gray-300">24 hours</td>
                      <td className="px-4 py-2 text-gray-300">Performance</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="px-4 py-2 text-gray-300">user_preferences</td>
                      <td className="px-4 py-2 text-gray-300">Stores user preferences</td>
                      <td className="px-4 py-2 text-gray-300">1 year</td>
                      <td className="px-4 py-2 text-gray-300">Functionality</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. How to Control Cookies</h2>
              <p className="text-gray-300">
                You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject
                cookies, you may still use our website though your access to some functionality and areas of our website
                may be restricted.
              </p>
              <p className="text-gray-300 mt-4">
                The specific way to manage cookies varies by browser. Please refer to your browser's help menu for
                instructions.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Other Tracking Technologies</h2>
              <p className="text-gray-300">
                In addition to cookies, we may use other similar technologies like web beacons (sometimes called
                "tracking pixels" or "clear gifs") and local storage. Web beacons are tiny graphics files that contain a
                unique identifier that enable us to recognize when someone has visited our website or opened an email
                that we have sent them.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Updates to This Cookie Policy</h2>
              <p className="text-gray-300">
                We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our
                business practices. Any changes will become effective when we post the revised Cookie Policy on our
                website.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Contact Us</h2>
              <p className="text-gray-300">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
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
