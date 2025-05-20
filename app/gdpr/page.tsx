import type { Metadata } from "next"
import Header from "@/components/marketing/header"
import Footer from "@/components/marketing/footer"

export const metadata: Metadata = {
  title: "GDPR Compliance - VehicleService",
  description: "Learn about our GDPR compliance and how we protect the data of EU citizens.",
}

export default function GDPRPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-4xl font-bold tracking-tight text-white">GDPR Compliance</h1>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300">Last Updated: May 20, 2025</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
              <p className="text-gray-300">
                At VehicleService, we are committed to protecting the privacy and rights of individuals in accordance
                with the General Data Protection Regulation (GDPR). This page outlines our approach to GDPR compliance
                and provides information about how we process personal data of individuals in the European Union (EU).
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Data Controller and Data Processor</h2>
              <p className="text-gray-300">VehicleService acts as both a data controller and a data processor:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                <li>
                  <strong className="text-white">As a Data Controller:</strong> We collect and process personal data of
                  our direct customers and website visitors.
                </li>
                <li>
                  <strong className="text-white">As a Data Processor:</strong> We process personal data on behalf of our
                  customers (the data controllers) who use our platform to manage their vehicle service businesses.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Legal Basis for Processing</h2>
              <p className="text-gray-300">
                We process personal data only when we have a legal basis to do so. The legal bases we rely on include:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                <li>
                  <strong className="text-white">Consent:</strong> When you have given clear consent for us to process
                  your personal data for a specific purpose.
                </li>
                <li>
                  <strong className="text-white">Contract:</strong> When processing is necessary for the performance of
                  a contract with you or to take steps at your request before entering into a contract.
                </li>
                <li>
                  <strong className="text-white">Legal Obligation:</strong> When processing is necessary for compliance
                  with a legal obligation to which we are subject.
                </li>
                <li>
                  <strong className="text-white">Legitimate Interests:</strong> When processing is necessary for our
                  legitimate interests or the legitimate interests of a third party, except where such interests are
                  overridden by your interests or fundamental rights and freedoms.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Your Rights Under GDPR</h2>
              <p className="text-gray-300">
                If you are an EU resident, you have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                <li>
                  <strong className="text-white">Right to Access:</strong> You have the right to request a copy of the
                  personal data we hold about you.
                </li>
                <li>
                  <strong className="text-white">Right to Rectification:</strong> You have the right to request that we
                  correct any inaccurate or incomplete personal data we hold about you.
                </li>
                <li>
                  <strong className="text-white">Right to Erasure:</strong> You have the right to request that we delete
                  your personal data in certain circumstances.
                </li>
                <li>
                  <strong className="text-white">Right to Restrict Processing:</strong> You have the right to request
                  that we restrict the processing of your personal data in certain circumstances.
                </li>
                <li>
                  <strong className="text-white">Right to Data Portability:</strong> You have the right to request that
                  we transfer your personal data to another service provider in a structured, commonly used, and
                  machine-readable format.
                </li>
                <li>
                  <strong className="text-white">Right to Object:</strong> You have the right to object to the
                  processing of your personal data in certain circumstances, including for direct marketing purposes.
                </li>
                <li>
                  <strong className="text-white">Right Not to Be Subject to Automated Decision-Making:</strong> You have
                  the right not to be subject to a decision based solely on automated processing, including profiling,
                  which produces legal effects concerning you or similarly significantly affects you.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. How to Exercise Your Rights</h2>
              <p className="text-gray-300">
                To exercise any of your rights under the GDPR, please contact our Data Protection Officer at
                dpo@vehicleservice.com. We will respond to your request within 30 days. We may ask for additional
                information to verify your identity before processing your request.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Data Protection Officer</h2>
              <p className="text-gray-300">
                We have appointed a Data Protection Officer (DPO) who is responsible for overseeing questions in
                relation to this GDPR policy and our privacy practices. If you have any questions about this policy or
                our privacy practices, please contact our DPO at:
              </p>
              <p className="text-gray-300 mt-2">
                Email: dpo@vehicleservice.com
                <br />
                Address: 123 Innovation Drive, San Francisco, CA 94103
                <br />
                Phone: +1 (555) 123-4567
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. International Data Transfers</h2>
              <p className="text-gray-300">
                We may transfer your personal data to countries outside the European Economic Area (EEA). When we do so,
                we ensure that appropriate safeguards are in place to protect your data, such as:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
                <li>Standard Contractual Clauses approved by the European Commission</li>
                <li>Binding Corporate Rules</li>
                <li>Adequacy decisions by the European Commission</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Data Breach Notification</h2>
              <p className="text-gray-300">
                In the event of a personal data breach that is likely to result in a risk to the rights and freedoms of
                individuals, we will notify the relevant supervisory authority without undue delay and, where feasible,
                within 72 hours after becoming aware of the breach. We will also notify the affected individuals without
                undue delay when the breach is likely to result in a high risk to their rights and freedoms.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Data Protection Impact Assessments</h2>
              <p className="text-gray-300">
                We conduct Data Protection Impact Assessments (DPIAs) for processing operations that are likely to
                result in a high risk to the rights and freedoms of individuals. These assessments help us identify and
                minimize data protection risks.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Records of Processing Activities</h2>
              <p className="text-gray-300">
                We maintain records of our processing activities as required by Article 30 of the GDPR. These records
                include information about the purposes of processing, categories of data subjects and personal data,
                recipients of personal data, transfers to third countries, retention periods, and security measures.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Changes to This GDPR Policy</h2>
              <p className="text-gray-300">
                We may update this GDPR policy from time to time. We will notify you of any changes by posting the new
                policy on this page and updating the "Last Updated" date.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
