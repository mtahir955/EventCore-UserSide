"use client";

import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { FileText } from "lucide-react";

const OtherPagesDataSection = forwardRef((props, ref) => {
  // ✅ Example static data — replace later with fetched data if needed
  const [privacyPolicies, setPrivacyPolicies] = useState<
    { id: number; title: string; description: string }[]
  >([
    {
      id: 1,
      title: "Data Collection Policy",
      description:
        "We collect limited user data solely to enhance user experience and ensure platform security.",
    },
    {
      id: 2,
      title: "Cookie Usage Policy",
      description:
        "Cookies are used to store user preferences and session information for seamless browsing.",
    },
  ]);

  const [faqs, setFaqs] = useState<
    { id: number; question: string; answer: string }[]
  >([
    {
      id: 1,
      question: "How can I update my account information?",
      answer:
        "You can update your personal details anytime from the Account Settings section under your profile.",
    },
    {
      id: 2,
      question: "Is my payment data secure?",
      answer:
        "Yes, all transactions are encrypted and processed through trusted payment gateways ensuring full security.",
    },
  ]);

  // 🔹 Expose data to parent if needed
  useImperativeHandle(ref, () => ({
    getData: () => ({ privacyPolicies, faqs }),
  }));

  useEffect(() => {
    // Simulate fetch from backend if needed
  }, []);

  return (
    <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-8 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Other Pages Data
        </h3>
      </div>

      {/* 📜 Privacy Policy Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Privacy Policy
        </h4>

        <div className="space-y-3">
          {privacyPolicies.slice(0, 2).map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a]"
            >
              <h5 className="font-semibold text-gray-800 dark:text-white">
                {p.title}
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ❓ FAQ Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          FAQs
        </h4>

        <div className="space-y-3">
          {faqs.slice(0, 2).map((f) => (
            <div
              key={f.id}
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a]"
            >
              <h5 className="font-semibold text-gray-800 dark:text-white">
                Q: {f.question}
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                A: {f.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

OtherPagesDataSection.displayName = "OtherPagesDataSection";
export default OtherPagesDataSection;
