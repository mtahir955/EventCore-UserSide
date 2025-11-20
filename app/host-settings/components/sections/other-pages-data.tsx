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

  // Handle text/textarea input for formData
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    tenantName: "",
    email: "",
    description:
      "Our platform is designed to simplify the entire event lifecycle — from registration to ticketing, attendee tracking, payments, and beyond. With years of experience in event technology, we focus on stability, speed, and security, ensuring your events run flawlessly.",
    subdomain: "",
    logo: "",
    banner: "",
    aboutTitle: "About Our Platform",
    aboutSubtitle: "Building the future of event experiences",
    mainHeadline:
      "We are committed to empowering event creators with the tools they need to bring unforgettable experiences to life.",
    termsAndConditions: `• Users must provide accurate information during registration.
• Refund policies depend on the hosting organizer.
• Fraud, misuse, or illegal activity may result in account suspension.
• Users agree not to exploit system vulnerabilities.
• All payments are processed through secure payment gateways.
• The platform may update terms without prior notice.`,
  });

  // return values to parent when saving
  useImperativeHandle(ref, () => ({
    getData: () => ({
      formData,
    }),
  }));

  return (
    <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-8 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Other Pages Data
        </h3>
      </div>
      {/* About Page */}
      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        About Page
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* About Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            About Title 
          </label>
          <input
            type="text"
            name="aboutTitle"
            value={formData.aboutTitle}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010] 
            text-gray-900 dark:text-white 
            ${
              errors.aboutTitle
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } 
            focus:ring-2 focus:ring-[#D19537]`}
          />
        </div>

        {/* About Subtitle */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            About Subtitle 
          </label>
          <input
            type="text"
            name="aboutSubtitle"
            value={formData.aboutSubtitle}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010] 
            text-gray-900 dark:text-white 
            ${
              errors.aboutSubtitle
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } 
            focus:ring-2 focus:ring-[#D19537]`}
          />
        </div>
      </div>

      {/* Main Headline */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Main Headline 
        </label>

        <textarea
          name="mainHeadline"
          value={formData.mainHeadline}
          onChange={handleChange}
          rows={2}
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010] 
          text-gray-900 dark:text-white 
          ${
            errors.mainHeadline
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-700"
          } 
          focus:ring-2 focus:ring-[#D19537]`}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          About Description 
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010] 
          text-gray-900 dark:text-white 
          ${
            errors.description
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-700"
          } 
          focus:ring-2 focus:ring-[#D19537]`}
        />
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
      {/* Terms & Conditions (Optional) */}
      {/* Terms & Conditions */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Terms & Conditions
        </h4>

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Terms & Conditions
        </label>

        <textarea
          name="termsAndConditions"
          value={formData.termsAndConditions}
          onChange={handleChange}
          rows={7}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 
          bg-white dark:bg-[#101010] text-gray-900 dark:text-white 
          rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537] resize-none"
        />
      </div>
    </div>
  );
});

OtherPagesDataSection.displayName = "OtherPagesDataSection";
export default OtherPagesDataSection;
