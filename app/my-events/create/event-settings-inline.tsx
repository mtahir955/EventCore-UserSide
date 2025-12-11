"use client";

import { useState } from "react";

export default function EventSettingsPageInline({
  setActivePage,
}: {
  setActivePage: (page: string) => void;
}) {
  // Tabs
  const [activeTab, setActiveTab] = useState<
    "general" | "advanced" | "payments"
  >("general");

  // General tab checkboxes
  const [passServiceFee, setPassServiceFee] = useState(false);
  const [allowCredits, setAllowCredits] = useState(false);
  const [allowTransfer, setAllowTransfer] = useState(false);

  // Advanced
  const [autoApprove, setAutoApprove] = useState(false);
  const [limitPerUser, setLimitPerUser] = useState(false);

  // Payments
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [refundAllowed, setRefundAllowed] = useState(false);

  // BACK BUTTON → go to Create Event page
  const handleGoBack = () => setActivePage("create");

  // SAVE BUTTON → go to Trainers step
  const handleSaveAndContinue = () => {
    const settings = {
      passServiceFee,
      allowCredits,
      allowTransfer,
      autoApprove,
      limitPerUser,
      stripeEnabled,
      refundAllowed,
    };

    try {
      const existing = JSON.parse(localStorage.getItem("eventDraft") || "{}");

      const updated = {
        ...existing,
        eventSettings: settings,
      };

      localStorage.setItem("eventDraft", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save event settings", e);
    }

    setActivePage("set-ticketingdetailsT"); // 🔥 Move to next step
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 pb-12">
      {/* Inline Header */}
      <div className="mb-8">
        <h2 className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold">
          Event Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-[14px]">
          Configure rules, permissions, and payment preferences for your event.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b pb-3 mb-6 dark:border-gray-700">
        {["general", "advanced", "payments"].map((tab) => (
          <button
            key={tab}
            className={`pb-2 font-medium text-[15px] tracking-wide ${
              activeTab === tab
                ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="space-y-5">
        {activeTab === "general" && (
          <>
            <SettingToggle
              label="Pass service fee to customer"
              checked={passServiceFee}
              onToggle={() => setPassServiceFee(!passServiceFee)}
            />
            <SettingToggle
              label="Allow credits to be used for this event"
              checked={allowCredits}
              onToggle={() => setAllowCredits(!allowCredits)}
            />
            <SettingToggle
              label="Allow ticket transfer between users"
              checked={allowTransfer}
              onToggle={() => setAllowTransfer(!allowTransfer)}
            />
          </>
        )}

        {activeTab === "advanced" && (
          <>
            <SettingToggle
              label="abcd"
              checked={autoApprove}
              onToggle={() => setAutoApprove(!autoApprove)}
            />
            <SettingToggle
              label="xyz"
              checked={limitPerUser}
              onToggle={() => setLimitPerUser(!limitPerUser)}
            />
          </>
        )}

        {activeTab === "payments" && (
          <>
            <SettingToggle
              label="abcd"
              checked={stripeEnabled}
              onToggle={() => setStripeEnabled(!stripeEnabled)}
            />
            <SettingToggle
              label="xyz"
              checked={refundAllowed}
              onToggle={() => setRefundAllowed(!refundAllowed)}
            />
          </>
        )}
      </div>

      {/* 🔥 BUTTONS (Back + Save & Continue) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-10">
        <button
          onClick={handleGoBack}
          className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#FFF5E6] text-[#D19537]"
        >
          Go Back
        </button>

        <button
          onClick={handleSaveAndContinue}
          className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#D19537] text-white"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}

function SettingToggle({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none group">
      <div
        onClick={onToggle}
        className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all
        ${
          checked
            ? "bg-[#D19537] border-[#D19537]"
            : "border-gray-400 dark:border-gray-600 bg-white dark:bg-[#181818]"
        }
        group-hover:border-[#D19537]
      `}
      >
        {checked && (
          <svg
            className="text-white"
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5 10L8.5 13.5L15 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <span className="text-[16px] text-gray-800 dark:text-gray-200">
        {label}
      </span>
    </label>
  );
}
