"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { MessageSuccessModal } from "./message-success-modal";

interface HelpLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  setMessageSuccessOpen: (value: boolean) => void;
}

export function HelpLineModal({
  isOpen,
  onClose,
  setMessageSuccessOpen,
}: HelpLineModalProps) {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    phone: "",
    email: "",
    message: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, boolean> = {};
    if (!formData.fullName.trim()) newErrors.fullName = true;
    if (!formData.companyName.trim()) newErrors.companyName = true;
    if (!formData.phone.trim()) newErrors.phone = true;
    if (!formData.email.trim()) newErrors.email = true;

    setErrors(newErrors);

    // Stop submission if any field is empty
    if (Object.keys(newErrors).length > 0) return;

    // Success
    setMessageSuccessOpen(true);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: false }); // remove red border when typing
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8"
      // style={{ background: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#101010] rounded-3xl shadow-2xl w-full max-w-[640px] h-auto md:h-[640px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <X className="w-6 h-6" strokeWidth={2.5} />
        </button>

        {/* Content */}
        <div className="p-5 sm:p-8 md:p-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 sm:py-2 py-1.5 rounded-full border border-gray-200 mb-5 sm:mb-6">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "#D19537" }}
            />
            <span className="sm:text-sm text-[12px] font-medium">
              Get Started
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-[20px] sm:text-[28px] md:text-[32px] font-bold leading-tight mb-6 sm:mb-8">
            <span
              className="italic font-serif"
              style={{ color: "#D19537", fontFamily: "Georgia, serif" }}
            >
              Get in touch
            </span>{" "}
            <span className="text-black dark:text-white">with us.</span>
            <br className="hidden sm:block" />
            <span className="text-black dark:text-white">We're here to assist you.</span>
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="sm:space-y-5 space-y-3">
            {/* Full Name + Company Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 dark:text-white mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className={`w-full px-4 py-1 sm:py-2 rounded-lg border ${
                    errors.fullName ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-[#D19537]`}
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 dark:text-white mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Company Name"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className={`w-full px-4 py-1 sm:py-2 rounded-lg border ${
                    errors.companyName ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-[#D19537]`}
                />
              </div>
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 dark:text-white mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter Your Number"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={`w-full px-4 py-1 sm:py-2 rounded-lg border ${
                    errors.phone ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-[#D19537]`}
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 dark:text-white mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`w-full px-4 py-1 sm:py-2 rounded-lg border ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-[#D19537]`}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-[13px] font-medium text-gray-700 dark:text-white">
                Message
              </label>
              <textarea
                placeholder="Start Typing Your Message"
                rows={4}
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className="w-full px-4 py-1 sm:py-3 rounded-lg border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-[#D19537]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full text-white font-semibold py-3 sm:py-4 rounded-full transition-opacity hover:opacity-90 text-[14px] sm:text-[15px]"
              style={{ background: "#D19537" }}
            >
              Leave us a Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}