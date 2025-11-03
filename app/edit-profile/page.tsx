"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ProfileHeader from "./components/profile/profile-header";
import SectionCard from "./components/profile/section-card";
import BasicInfo from "./components/profile/basic-info";
import ContactDetails from "./components/profile/contact-details";
import PaymentDetails from "./components/profile/payment-details";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function Page() {
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    // ✅ Show confirmation toast
    setShowToast(true);

    // Hide after 3 seconds
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <main className="bg-background text-foreground relative">
      <div className="mx-auto w-full max-w-[1425px] min-h-screen bg-background">
        <Header />

        <div className="px-4 sm:px-8 md:px-10">
          <ProfileHeader />

          <div className="mt-8 sm:mt-12 space-y-8 sm:space-y-10">
            <SectionCard title="Basic Information">
              <BasicInfo />
            </SectionCard>

            <SectionCard title="Contact Details">
              <ContactDetails />
            </SectionCard>

            <SectionCard title="Payment Details">
              <PaymentDetails />
            </SectionCard>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 pt-2 mb-10">
              <Link href="/view-profile">
                <button
                  className={cn(
                    "inline-flex items-center justify-center h-12 rounded-xl px-8",
                    "bg-black hover:bg-gray-700 text-white font-medium w-full sm:w-auto"
                  )}
                  aria-label="Discard Changes"
                >
                  Discard
                </button>
              </Link>

              <button
                onClick={handleSave}
                className={cn(
                  "inline-flex items-center justify-center h-12 rounded-xl px-8",
                  "bg-[#0077F7] hover:bg-blue-600 text-white font-medium w-full sm:w-auto"
                )}
                aria-label="Save Profile"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* ✅ Bottom-right Toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fadeIn z-[9999]">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            Changes saved successfully!
          </span>
        </div>
      )}
    </main>
  );
}
