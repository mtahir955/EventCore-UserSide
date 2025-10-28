"use client";

import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ProfileHeader from "./components/profile/profile-header";
import SectionCard from "./components/profile/section-card";
import BasicInfo from "./components/profile/basic-info";
import ContactDetails from "./components/profile/contact-details";
import PaymentDetails from "./components/profile/payment-details";
import Link from "next/link";

export default function Page() {
  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1425px] min-h-[2070px] bg-background">
        <Header />

        {/* Page content */}
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

            <div className="flex justify-center sm:justify-end pt-2 mb-8">
              <Link href="/edit-profile">
                <button
                  className={cn(
                    "inline-flex items-center justify-center h-12 rounded-xl px-6",
                    "bg-[#0077F7] hover:bg-blue-600 dark:text-white text-primary-foreground font-medium"
                  )}
                  aria-label="Edit Profile"
                >
                  Edit Profile
                </button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
