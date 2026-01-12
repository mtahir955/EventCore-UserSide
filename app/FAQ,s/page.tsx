"use client";

import type React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useEffect, useState } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";
import { apiClient } from "@/lib/apiClient";

export default function Page() {
  const [faqData, setFaqData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const themeVars: React.CSSProperties = {
    ["--background" as any]: "#FFFFFF",
    ["--foreground" as any]: "#000000",
    ["--primary" as any]: "#0077F7",
    ["--primary-foreground" as any]: "#FFFFFF",
    ["--secondary" as any]: "#F9FAFB",
    ["--secondary-foreground" as any]: "#000000",
    ["--muted-foreground" as any]: "rgba(0,0,0,0.64)",
    ["--border" as any]: "rgba(0,0,0,0.10)",
    ["--ring" as any]: "rgba(0,0,0,0.10)",
  };

  // ⭐ Fetch FAQs from backend
  // useEffect(() => {
  //   axios
  //     .get(`${API_BASE_URL}/tenants/public/about`, {
  //       headers: { "X-Tenant-ID": HOST_Tenant_ID },
  //     })
  //     .then((res) => {
  //       setFaqData(res.data.data?.faqs || []);
  //     })
  //     .catch((err) => {
  //       console.error("FAQ Error:", err);
  //       setFaqData([]);
  //     })
  //     .finally(() => setLoading(false));
  // }, []);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const res = await apiClient.get("/tenants/public/about");
        setFaqData(res.data?.data?.faqs || []);
      } catch (err) {
        console.error("FAQ Error:", err);
        setFaqData([]);
      } finally {
        setLoading(false);
      }
    };

    loadFaqs();
  }, []);

  return (
    <main
      style={themeVars}
      className={cn(
        "mx-auto w-full bg-background text-foreground font-sans antialiased flex flex-col",
        "dark:bg-[#101010] dark:text-gray-100 transition-colors duration-300"
      )}
    >
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="w-full pt-10 sm:pt-12 pb-8 flex flex-col items-center text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-[44px] font-semibold tracking-tight text-gray-900 dark:text-white">
          FAQ's
        </h1>
        <p className="mt-2 text-base sm:text-lg text-[color:var(--muted-foreground)] dark:text-gray-400">
          Got any question? We respond you here.
        </p>
      </section>

      {/* Intro Copy */}
      <section className="px-5 sm:px-10 md:px-[120px] text-left">
        <h2 className="text-2xl sm:text-[28px] leading-tight font-semibold mb-2 text-gray-900 dark:text-white">
          How we can help you?
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-[color:var(--muted-foreground)] dark:text-gray-400 max-w-[860px]">
          Have a question? We may already have the answer for your question.
          Check out our frequently (FAQ) asked question below.
        </p>
      </section>

      {/* FAQ List */}
      <section className="px-5 sm:px-10 md:px-[120px] mt-6 sm:mt-8 md:mt-[20px]">
        <Accordion type="single" collapsible className="w-full">
          {/* Load FAQs from backend */}
          {!loading && faqData?.length > 0 ? (
            faqData.map((faq: any, index: number) => (
              <FAQItem
                key={index}
                id={`faq-${index}`}
                question={faq.question}
                defaultOpen={index === 0}
              >
                {faq.answer}
              </FAQItem>
            ))
          ) : !loading && faqData?.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No FAQs available.
            </p>
          ) : null}
        </Accordion>

        <div className="mt-6 sm:mt-8">
          <Link
            href="/terms-of-services"
            className="inline-flex items-center justify-center h-[42px] sm:h-[44px] rounded-[8px] bg-primary px-5 sm:px-6 text-sm sm:text-base font-medium text-primary-foreground hover:bg-[#0066D6] transition"
          >
            Terms of Service
          </Link>
        </div>
      </section>

      {/* Still Have Question Section */}
      <section className="mt-16 sm:mt-20 md:mt-[80px] bg-secondary dark:bg-[#181818] w-full transition-colors">
        <div className="px-5 sm:px-10 md:px-[120px] py-12 sm:py-[72px] text-left">
          <h3 className="text-2xl sm:text-[28px] font-semibold leading-tight mb-2 text-gray-900 dark:text-white">
            Still have question?
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-[color:var(--muted-foreground)] dark:text-gray-400 max-w-[860px]">
            Contact us using the information below. We’ll respond promptly to
            your inquiries and feedback.
          </p>
          <div className="mt-6 sm:mt-[24px]">
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center h-[42px] sm:h-[44px] rounded-[8px] bg-primary px-5 sm:px-6 text-sm sm:text-base font-medium text-primary-foreground hover:bg-[#0066D6] transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

/* Reusable FAQ Item */
function FAQItem({
  id,
  question,
  children,
  defaultOpen = false,
}: {
  id: string;
  question: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <AccordionItem
      value={id}
      className="border-b border-[color:var(--border)] dark:border-gray-700"
      data-state={defaultOpen ? "open" : undefined}
    >
      <AccordionTrigger className="py-4 sm:py-5 text-left hover:no-underline group">
        <div className="flex w-full items-start justify-between gap-4">
          <span className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
            {question}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4 sm:pb-5">
        <p className="text-sm sm:text-base text-[color:var(--muted-foreground)] dark:text-gray-400 leading-relaxed">
          {children}
        </p>
      </AccordionContent>
    </AccordionItem>
  );
}

// //code before integration

// "use client";

// import type React from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";

// export default function Page() {
//   const themeVars: React.CSSProperties = {
//     ["--background" as any]: "#FFFFFF",
//     ["--foreground" as any]: "#000000",
//     ["--primary" as any]: "#0077F7",
//     ["--primary-foreground" as any]: "#FFFFFF",
//     ["--secondary" as any]: "#F9FAFB",
//     ["--secondary-foreground" as any]: "#000000",
//     ["--muted-foreground" as any]: "rgba(0,0,0,0.64)",
//     ["--border" as any]: "rgba(0,0,0,0.10)",
//     ["--ring" as any]: "rgba(0,0,0,0.10)",
//   };

//   return (
//     <main
//       style={themeVars}
//       className={cn(
//         "mx-auto w-full bg-background text-foreground font-sans antialiased flex flex-col",
//         "dark:bg-[#101010] dark:text-gray-100 transition-colors duration-300"
//       )}
//     >
//       {/* Header */}
//       <Header />

//       {/* Hero Section */}
//       <section className="w-full pt-10 sm:pt-12 pb-8 flex flex-col items-center text-center px-4">
//         <h1 className="text-3xl sm:text-4xl md:text-[44px] font-semibold tracking-tight text-gray-900 dark:text-white">
//           FAQ
//         </h1>
//         <p className="mt-2 text-base sm:text-lg text-[color:var(--muted-foreground)] dark:text-gray-400">
//           Got any question? We respond you here.
//         </p>
//       </section>

//       {/* Intro Copy */}
//       <section className="px-5 sm:px-10 md:px-[120px] text-left">
//         <h2 className="text-2xl sm:text-[28px] leading-tight font-semibold mb-2 text-gray-900 dark:text-white">
//           How we can help you?
//         </h2>
//         <p className="text-sm sm:text-base leading-relaxed text-[color:var(--muted-foreground)] dark:text-gray-400 max-w-[860px]">
//           Have a question? We may already have the answer for your question.
//           Check out our frequently (FAQ) asked question below.
//         </p>
//       </section>

//       {/* FAQ List */}
//       <section className="px-5 sm:px-10 md:px-[120px] mt-6 sm:mt-8 md:mt-[20px]">
//         <Accordion type="single" collapsible className="w-full">
//           <FAQItem
//             id="q1"
//             question="Can I buy tickets for multiple events at once?"
//             defaultOpen
//           >
//             No, currently you can only purchase tickets for one event at a time.
//             You’ll need to complete a separate order for each event.
//           </FAQItem>

//           <FAQItem id="q2" question="Will I receive a digital or physical ticket?">
//             You’ll receive a digital ticket via email. Physical tickets are not issued.
//           </FAQItem>

//           <FAQItem id="q3" question="How do I find my ticket ID after purchase?">
//             Your ticket ID is included in your confirmation email and visible in your
//             profile under “My Tickets.”
//           </FAQItem>

//           <FAQItem id="q4" question="Can I transfer my ticket to someone else?">
//             Yes, ticket transfers are supported prior to event check-in from your
//             profile’s ticket details page.
//           </FAQItem>

//           <FAQItem id="q5" question="What should I do if I lose my ticket or confirmation email?">
//             Use the “Resend Confirmation” option in your profile or contact support to
//             retrieve your ticket.
//           </FAQItem>
//         </Accordion>

//         <div className="mt-6 sm:mt-8">
//           <Link
//             href="/terms-of-services"
//             className="inline-flex items-center justify-center h-[42px] sm:h-[44px] rounded-[8px] bg-primary px-5 sm:px-6 text-sm sm:text-base font-medium text-primary-foreground hover:bg-[#0066D6] transition"
//           >
//             Terms of Service
//           </Link>
//         </div>
//       </section>

//       {/* Still Have Question Section */}
//       <section className="mt-16 sm:mt-20 md:mt-[80px] bg-secondary dark:bg-[#181818] w-full transition-colors">
//         <div className="px-5 sm:px-10 md:px-[120px] py-12 sm:py-[72px] text-left">
//           <h3 className="text-2xl sm:text-[28px] font-semibold leading-tight mb-2 text-gray-900 dark:text-white">
//             Still have question?
//           </h3>
//           <p className="text-sm sm:text-base leading-relaxed text-[color:var(--muted-foreground)] dark:text-gray-400 max-w-[860px]">
//             Contact us using the information below. We’ll respond promptly to your
//             inquiries and feedback.
//           </p>
//           <div className="mt-6 sm:mt-[24px]">
//             <Link
//               href="/contact-us"
//               className="inline-flex items-center justify-center h-[42px] sm:h-[44px] rounded-[8px] bg-primary px-5 sm:px-6 text-sm sm:text-base font-medium text-primary-foreground hover:bg-[#0066D6] transition"
//             >
//               Contact Us
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer />
//     </main>
//   );
// }

// /* Reusable FAQ Item */
// function FAQItem({
//   id,
//   question,
//   children,
//   defaultOpen = false,
// }: {
//   id: string;
//   question: string;
//   children: React.ReactNode;
//   defaultOpen?: boolean;
// }) {
//   return (
//     <AccordionItem
//       value={id}
//       className="border-b border-[color:var(--border)] dark:border-gray-700"
//       data-state={defaultOpen ? "open" : undefined}
//     >
//       <AccordionTrigger className="py-4 sm:py-5 text-left hover:no-underline group">
//         <div className="flex w-full items-start justify-between gap-4">
//           <span className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
//             {question}
//           </span>
//         </div>
//       </AccordionTrigger>
//       <AccordionContent className="pb-4 sm:pb-5">
//         <p className="text-sm sm:text-base text-[color:var(--muted-foreground)] dark:text-gray-400 leading-relaxed">
//           {children}
//         </p>
//       </AccordionContent>
//     </AccordionItem>
//   );
// }
