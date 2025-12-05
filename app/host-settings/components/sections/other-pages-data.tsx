"use client";

import { FileText } from "lucide-react";

export default function OtherPagesDataSection({ tenant }: any) {
  const about = tenant.aboutPage || {};
  const faqs = tenant.faqs || [];
  const privacy = tenant.privacyPolicies || [];
  const terms = tenant.termsAndConditions || [];

  return (
    <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <FileText size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold">Other Pages Data</h3>
      </div>

      {/* ABOUT PAGE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label>About Title</label>
          <div className="px-4 py-2 bg-gray-100 dark:bg-[#181818] border rounded-lg">
            {about.title || "N/A"}
          </div>
        </div>

        <div className="space-y-2">
          <label>Subtitle</label>
          <div className="px-4 py-2 bg-gray-100 dark:bg-[#181818] border rounded-lg">
            {about.subtitle || "N/A"}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label>Main Headline</label>
        <div className="px-4 py-2 bg-gray-100 dark:bg-[#181818] border rounded-lg">
          {about.mainHeadline || "N/A"}
        </div>
      </div>

      <div className="space-y-2">
        <label>About Description</label>
        <div className="px-4 py-2 bg-gray-100 leading-relaxed dark:bg-[#181818] border rounded-lg whitespace-pre-line">
          {about.description || "N/A"}
        </div>
      </div>

      {/* PRIVACY POLICIES */}
      <div className="space-y-2">
        <label>Privacy Policies</label>
        {privacy.length > 0 ? (
          <div className="space-y-3">
            {privacy.map((p: any, i: number) => (
              <div
                key={i}
                className="p-3 bg-gray-100 dark:bg-[#181818] border rounded-lg"
              >
                <strong>{p.title}</strong>
                <p className="text-sm mt-1">{p.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-gray-100 dark:bg-[#181818] border rounded-lg">
            N/A
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="space-y-2">
        <label>FAQs</label>
        {faqs.length > 0 ? (
          <div className="space-y-3">
            {faqs.map((f: any, i: number) => (
              <div
                key={i}
                className="p-3 bg-gray-100 dark:bg-[#181818] border rounded-lg"
              >
                <strong>Q: {f.question}</strong>
                <p className="text-sm mt-1">A: {f.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-gray-100 dark:bg-[#181818] border rounded-lg">
            N/A
          </div>
        )}
      </div>

      {/* TERMS & CONDITIONS */}
      <div className="space-y-2">
        <label>Terms & Conditions</label>

        {terms.length > 0 ? (
          <div className="space-y-3">
            {terms.map((t: any, i: number) => (
              <div
                key={i}
                className="p-3 bg-gray-100 dark:bg-[#181818] border rounded-lg"
              >
                <strong>{t.title}</strong>
                <p className="text-sm mt-1">{t.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-2 bg-gray-100 dark:bg-[#181818] border rounded-lg">
            N/A
          </div>
        )}
      </div>
    </div>
  );
}

// "use client";

// import { forwardRef, useImperativeHandle, useState } from "react";
// import { FileText } from "lucide-react";

// const OtherPagesDataSection = forwardRef((props, ref) => {
//   // Static display-only data
//   const [privacyPolicies] = useState([
//     {
//       id: 1,
//       title: "Data Collection Policy",
//       description:
//         "We collect limited user data solely to enhance user experience and ensure platform security.",
//     },
//     {
//       id: 2,
//       title: "Cookie Usage Policy",
//       description:
//         "Cookies are used to store user preferences and session information for seamless browsing.",
//     },
//   ]);

//   const [faqs] = useState([
//     {
//       id: 1,
//       question: "How can I update my account information?",
//       answer:
//         "You can update your personal details anytime from the Account Settings section under your profile.",
//     },
//     {
//       id: 2,
//       question: "Is my payment data secure?",
//       answer:
//         "Yes, all transactions are encrypted and processed through trusted payment gateways ensuring full security.",
//     },
//   ]);

//   const [formData] = useState({
//     description:
//       "Our platform is designed to simplify the entire event lifecycle — from registration to ticketing, attendee tracking, payments, and beyond. With years of experience in event technology, we focus on stability, speed, and security, ensuring your events run flawlessly.",
//     aboutTitle: "About Our Platform",
//     aboutSubtitle: "Building the future of event experiences",
//     mainHeadline:
//       "We are committed to empowering event creators with the tools they need to bring unforgettable experiences to life.",
//     termsAndConditions: `• Users must provide accurate information during registration.
// • Refund policies depend on the hosting organizer.
// • Fraud, misuse, or illegal activity may result in account suspension.
// • Users agree not to exploit system vulnerabilities.
// • All payments are processed through secure payment gateways.
// • The platform may update terms without prior notice.`,
//   });

//   useImperativeHandle(ref, () => ({
//     getData: () => ({ formData, privacyPolicies, faqs }),
//   }));

//   return (
//     <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-8 shadow-sm transition-all">
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <FileText size={24} className="text-gray-700 dark:text-white" />
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//           Other Pages Data
//         </h3>
//       </div>

//       {/* About Page */}
//       <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//         About Page
//       </h4>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         {/* About Title */}
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             About Title
//           </label>
//           <div
//             className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700
//             bg-gray-100 dark:bg-[#181818] rounded-lg text-gray-900
//             dark:text-gray-300 cursor-not-allowed select-none"
//           >
//             {formData.aboutTitle}
//           </div>
//         </div>

//         {/* About Subtitle */}
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             About Subtitle
//           </label>
//           <div
//             className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700
//             bg-gray-100 dark:bg-[#181818] rounded-lg text-gray-900
//             dark:text-gray-300 cursor-not-allowed select-none"
//           >
//             {formData.aboutSubtitle}
//           </div>
//         </div>
//       </div>

//       {/* Main Headline */}
//       <div className="space-y-2">
//         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//           Main Headline
//         </label>
//         <div
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700
//           bg-gray-100 dark:bg-[#181818] rounded-lg text-gray-900
//           dark:text-gray-300 cursor-not-allowed select-none"
//         >
//           {formData.mainHeadline}
//         </div>
//       </div>

//       {/* About Description */}
//       <div className="space-y-2">
//         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//           About Description
//         </label>
//         <div
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700
//           bg-gray-100 dark:bg-[#181818] rounded-lg text-gray-900 whitespace-pre-line
//           dark:text-gray-300 cursor-not-allowed select-none"
//         >
//           {formData.description}
//         </div>
//       </div>

//       {/* Privacy Policy */}
//       <div className="space-y-4">
//         <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//           Privacy Policy
//         </h4>

//         {privacyPolicies.map((p) => (
//           <div
//             key={p.id}
//             className="p-3 rounded-lg border border-gray-300 dark:border-gray-700
//             bg-gray-50 dark:bg-[#1a1a1a]"
//           >
//             <h5 className="font-semibold text-gray-800 dark:text-white">
//               {p.title}
//             </h5>
//             <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
//               {p.description}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* FAQ Section */}
//       <div className="space-y-4">
//         <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//           FAQs
//         </h4>

//         {faqs.map((f) => (
//           <div
//             key={f.id}
//             className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a]"
//           >
//             <h5 className="font-semibold text-gray-800 dark:text-white">
//               Q: {f.question}
//             </h5>
//             <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
//               A: {f.answer}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Terms & Conditions */}
//       <div className="space-y-2">
//         <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//           Terms & Conditions
//         </h4>

//         <div
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700
//           bg-gray-100 dark:bg-[#181818] rounded-lg text-gray-900 whitespace-pre-line
//           dark:text-gray-300 cursor-not-allowed select-none"
//         >
//           {formData.termsAndConditions}
//         </div>
//       </div>
//     </div>
//   );
// });

// OtherPagesDataSection.displayName = "OtherPagesDataSection";
// export default OtherPagesDataSection;
