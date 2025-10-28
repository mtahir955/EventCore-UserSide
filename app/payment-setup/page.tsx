"use client";

import PaymentSuccessModal from "../host-dashboard/components/payment-success-modal";
import { Sidebar } from "../host-dashboard/components/sidebar";
import { Switch } from "@/components/ui/switch";
import WithdrawSuccessModal from "../host-dashboard/components/withdraw-success-modal";
import { useState } from "react";
import { Menu } from "lucide-react"; // for hamburger icon

export default function PaymentSetupPage() {
  const [isDefaultPayment, setIsDefaultPayment] = useState(true);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar state

  return (
    <div className="relative w-full min-h-screen bg-[#FAFAFB] flex flex-col lg:flex-row">
      {/* Sidebar for large screens */}
      <div className="">
        <Sidebar active="Payment Setup" />
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Scrim */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Sidebar Drawer */}
          <div className="relative w-[260px] h-full bg-white shadow-lg z-50">
            <Sidebar active="Payment Setup" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full lg:ml-[256px] min-h-screen mt-20 sm:mt-0 pb-20">
        {/* Header */}
        <header className="hidden md:flex items-center justify-between px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 bg-[#FAFAFB]">
          <div className="flex items-center gap-4">
            {/* Hamburger icon on tablet (hidden on lg) */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu className="w-6 h-6 text-gray-800" />
            </button>

            <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-foreground">
              Payment Setup
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-white border h-9 w-9 flex justify-center items-center rounded-full">
              <img
                src="/images/icons/notification-new.png"
                alt="notification"
                className="h-4 w-4"
              />
            </div>
            <div className="bg-black border h-9 w-9 flex justify-center items-center rounded-full">
              <img
                src="/images/icons/profile-user.png"
                alt="profile"
                className="h-4 w-4"
              />
            </div>
          </div>
        </header>

        {/* Contact Details */}
        <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
          <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm">
            <h2 className="text-[20px] sm:text-[22px] md:text-[24px] font-semibold mb-6">
              Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {/* Phone */}
              <div>
                <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                  Phone Number:
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-3 bg-[#FAFAFB] rounded-lg border border-[#EFEFEF] w-full sm:w-auto">
                    <img
                      src="/images/icons/us-flag.png"
                      alt="US"
                      className="h-4 w-4 rounded-full"
                    />
                    <span className="text-[14px]">+1</span>
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      className="ml-1"
                    >
                      <path
                        d="M1 1L5 5L9 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    defaultValue="125-559-8852"
                    className="flex-1 w-full px-4 py-3 bg-[#FAFAFB] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                  City/Town:
                </label>
                <input
                  type="text"
                  defaultValue="California"
                  className="w-full px-4 py-3 bg-[#FAFAFB] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                  Pincode:
                </label>
                <input
                  type="text"
                  defaultValue="78080"
                  className="w-full px-4 py-3 bg-[#FAFAFB] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                Address:
              </label>
              <input
                type="text"
                defaultValue="245 Event Street, Downtown Cityview, NY 10016, USA"
                className="w-full px-4 py-3 bg-[#FAFAFB] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                Website [Optional]:
              </label>
              <input
                type="text"
                defaultValue="https://viagoevents.com/"
                className="w-full px-4 py-3 bg-[#FAFAFB] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
              />
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
          <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm">
            <h2 className="text-[20px] sm:text-[22px] md:text-[24px] font-semibold mb-6">
              Payment Details
            </h2>

            <div className="mb-6">
              <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                Name On Card:
              </label>
              <input
                type="text"
                defaultValue="Jasmine Marina"
                className="w-full px-4 py-3 bg-[#FAFAFB] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                Card Number:
              </label>
              <input
                type="text"
                defaultValue="1253-5594-8845-2777"
                className="w-full px-4 py-3 bg-[#FAFAFB] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                  Expire Date:
                </label>
                <input
                  type="text"
                  defaultValue="04/29"
                  className="w-full px-4 py-3 bg-[#FAFAFB] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
                />
              </div>

              <div>
                <label className="block text-[13px] sm:text-[14px] font-medium mb-2 text-foreground">
                  CVC:
                </label>
                <input
                  type="text"
                  defaultValue="720"
                  className="w-full px-4 py-3 bg-[#FAFAFB] rounded-lg border border-[#EFEFEF] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537]"
                />
              </div>
            </div>

            <div className="flex items-start sm:items-center gap-3 mb-8">
              <Switch
                checked={isDefaultPayment}
                onCheckedChange={setIsDefaultPayment}
              />
              <span className="text-[13px] sm:text-[14px] text-gray-600 leading-snug">
                Set as default payment option to use in future.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end mt-5">
            <button
              className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl text-white font-medium text-[14px] hover:opacity-90 transition-opacity"
              style={{ background: "#D19537" }}
              onClick={() => setSuccessOpen(true)}
            >
              Save Changes
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <PaymentSuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
      <WithdrawSuccessModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
      />
    </div>
  );
}
