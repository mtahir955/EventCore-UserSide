"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#101010] transition-colors duration-300">
      <Header />

      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-24 py-10 sm:py-14 md:py-16">
          <div className="max-w-4xl mx-auto text-left text-black dark:text-gray-100">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold mb-2 leading-tight">
              Terms of{" "}
              <span className="text-[#89FC00] italic font-serif">Service</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-8 ml-1">
              Last Updated: August 30, 2025
            </p>

            {/* Intro */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-sm sm:text-base">
              Welcome to Event Core. By accessing or using our website, mobile
              application, or services, you agree to comply with and be bound by
              the following Terms of Service. Please read these terms carefully
              before using our platform.
            </p>

            {/* Sections */}
            <Section
              number="1."
              title="Acceptance of Terms"
              content={[
                "By creating an account, purchasing tickets, or using our platform, you confirm that you are at least 18 years old (or have parental/guardian consent) and agree to these Terms of Service and our Privacy Policy.",
              ]}
            />

            <Section
              number="2."
              title="Services Provided"
              content={[
                "Event Core provides an online platform for browsing, booking, purchasing, and managing tickets for various events, including concerts, training sessions, motivational talks, trips, and other gatherings.",
              ]}
            />

            <Section
              number="3."
              title="Ticket Purchase & Pricing"
              listItems={[
                "All ticket prices are displayed in the currency stated on the event page.",
                "Prices may include taxes, service fees, or additional charges.",
                "Tickets are only valid once payment is confirmed.",
              ]}
            />

            <Section
              number="4."
              title="Ticket Transfers"
              listItems={[
                "Tickets may be transferred to another person using the Transfer Ticket feature in your Event Core account.",
                "Once transferred, the ticket ownership changes, and the original holder no longer has access to it.",
                "Event Core is not responsible for tickets transferred outside of our official system.",
              ]}
            />

            <Section
              number="5."
              title="Cancellations & Refunds"
              listItems={[
                "All sales are final unless otherwise stated by the event organizer.",
                "In the event of cancellation, refunds will be processed according to the organizer’s refund policy.",
                "No refunds will be provided for missed events.",
              ]}
            />

            <Section
              number="6."
              title="Event Changes"
              listItems={[
                "Event details, including date, time, and location, may change due to unforeseen circumstances.",
                "We will notify ticket holders of any changes via email or in-app notifications.",
              ]}
            />

            <Section
              number="7."
              title="Code of Conduct"
              intro="When attending events:"
              listItems={[
                "Follow the event’s rules and guidelines.",
                "Respect other attendees and staff.",
                "No disruptive, harmful, or illegal activities are allowed.",
              ]}
            />

            <Section
              number="8."
              title="Intellectual Property"
              listItems={[
                "All content on Event Core, including text, images, logos, and videos, is owned by or licensed to us.",
                "You may not copy, modify, or distribute any content without our permission.",
              ]}
            />

            <Section
              number="9."
              title="Limitation of Liability"
              intro="Event Core is not responsible for:"
              listItems={[
                "The actions or omissions of event organizers.",
                "Loss or damage arising from attending an event.",
                "Issues caused by third-party payment processors.",
              ]}
            />

            <Section
              number="10."
              title="Termination"
              content={[
                "We reserve the right to suspend or terminate your account if you violate these terms or engage in fraudulent activity.",
              ]}
            />

            {/* Contact Section */}
            <div className="mb-10 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 leading-tight">
                11. Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm sm:text-base">
                For any questions about these Terms of Service, please contact
                us at:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">📧</span>
                  <span>Email: support@eventcore.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">📍</span>
                  <span>Address: 123 Event Street, Cityville, Country</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* Section Component */
function Section({
  number,
  title,
  content,
  listItems,
  intro,
}: {
  number: string;
  title: string;
  content?: string[];
  listItems?: string[];
  intro?: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 leading-tight text-black dark:text-white">
        {number} {title}
      </h2>

      {intro && (
        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-3">
          {intro}
        </p>
      )}

      {content?.map((paragraph, idx) => (
        <p
          key={idx}
          className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4 last:mb-0"
        >
          {paragraph}
        </p>
      ))}

      {listItems && (
        <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
          {listItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
