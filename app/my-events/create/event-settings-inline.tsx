"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient"; // adjust import path if needed

/* ================= TYPES ================= */

interface TenantFeatures {
  serviceFee?: {
    enabled: boolean;
    type: string;
    value: number;
    defaultHandling?: {
      passToBuyer: boolean;
      absorbByTenant: boolean;
    };
  };
  creditSystem?: { enabled: boolean };
  paymentPlans?: { enabled: boolean };
  allowTransfers?: { enabled: boolean };
  showLoginHelp?: boolean;
}

/* ================= COMPONENT ================= */

export default function EventSettingsPageInline({
  setActivePage,
}: {
  setActivePage: (page: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"general" | "payments">("general");

  /* ===== FEATURES (READ ONLY) ===== */
  const [features, setFeatures] = useState<TenantFeatures | null>(null);
  const [loading, setLoading] = useState(true);

  /* ===== PAYMENT SETTINGS (EVENT LEVEL) ===== */
  const [passFee, setPassFee] = useState(false);
  const [absorbFee, setAbsorbFee] = useState(false);

  const serviceFeeEnabled = features?.serviceFee?.enabled === true;

  /* ================= FETCH FEATURES ================= */

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);

        // ✅ apiClient will attach Authorization + X-Tenant-ID automatically
        const res = await apiClient.get(`/tenants/my/features`);

        setFeatures(res.data?.data?.features || {});
      } catch (err) {
        console.error("Failed to load tenant features", err);
        setFeatures({});
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  /* ===== SAFETY: RESET OPTIONS IF SERVICE FEE DISABLED ===== */
  useEffect(() => {
    if (!serviceFeeEnabled) {
      setPassFee(false);
      setAbsorbFee(false);
    }
  }, [serviceFeeEnabled]);

  /* ================= NAVIGATION ================= */

  const handleGoBack = () => setActivePage("create");

  const handleSaveAndContinue = () => {
    try {
      const existing = JSON.parse(localStorage.getItem("eventDraft") || "{}");

      const updated = {
        ...existing,
        eventSettings: {
          serviceFee: {
            enabled: serviceFeeEnabled,
            handling: passFee
              ? "PASS_TO_BUYER"
              : absorbFee
              ? "ABSORB_TO_HOST"
              : null,
          },
        },
      };

      localStorage.setItem("eventDraft", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save event payment settings", err);
    }

    setActivePage("set-ticketingdetailsT");
  };

  if (loading) {
    return (
      <div className="p-8 text-sm text-gray-500">
        Loading feature permissions…
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 pb-12">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[26px] font-semibold">Event Settings</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Configure rules, permissions, and payment preferences for your event.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b pb-3 mb-6 dark:border-gray-700">
        {(["general", "payments"] as const).map((tab) => (
          <button
            key={tab}
            className={`pb-2 font-medium text-sm ${
              activeTab === tab
                ? "border-b-2 border-black dark:border-white"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ================= GENERAL TAB (READ ONLY) ================= */}
      {activeTab === "general" && (
        <div className="space-y-5">
          <FeatureRow
            label="Service fee enabled"
            enabled={features?.serviceFee?.enabled}
          />

          {/* {features?.serviceFee?.enabled &&
            features?.serviceFee?.defaultHandling && (
              <div className="ml-8 mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {features.serviceFee.defaultHandling.passToBuyer && (
                  <p>• Pass service fee to buyer</p>
                )}
                {features.serviceFee.defaultHandling.absorbByTenant && (
                  <p>• Absorb service fee by host</p>
                )}
              </div>
            )} */}

          <FeatureRow
            label="Allow Credit"
            enabled={features?.creditSystem?.enabled}
          />

          <FeatureRow
            label="Payment plans"
            enabled={features?.paymentPlans?.enabled}
          />

          <FeatureRow
            label="Ticket transfers"
            enabled={features?.allowTransfers?.enabled}
          />

          {/* <FeatureRow label="Login help" enabled={features?.showLoginHelp} /> */}
        </div>
      )}

      {/* ================= PAYMENTS TAB ================= */}
      {activeTab === "payments" && (
        <div className="space-y-5">
          {!serviceFeeEnabled ? (
            <p className="text-sm text-gray-500">
              Service fee option is not enabled for your account.
            </p>
          ) : (
            <>
              <SettingToggle
                label="Pass service fee to buyer"
                checked={passFee}
                onToggle={() => {
                  setPassFee(!passFee);
                  if (!passFee) setAbsorbFee(false);
                }}
              />

              <SettingToggle
                label="Absorb service fee from earnings"
                checked={absorbFee}
                onToggle={() => {
                  setAbsorbFee(!absorbFee);
                  if (!absorbFee) setPassFee(false);
                }}
              />

              <p className="text-xs text-gray-500 ml-1">
                Choose how the service fee is handled for this event.
              </p>
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end gap-4 pt-10">
        <button
          onClick={handleGoBack}
          className="h-11 px-6 rounded-xl bg-[#FFF5E6] text-[#D19537] font-semibold"
        >
          Go Back
        </button>

        <button
          onClick={handleSaveAndContinue}
          className="h-11 px-6 rounded-xl bg-[#D19537] text-white font-semibold"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}

/* ================= UI HELPERS ================= */

function FeatureRow({ label, enabled }: { label: string; enabled?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`h-5 w-5 rounded-md border flex items-center justify-center
          ${
            enabled
              ? "bg-[#D19537] border-[#D19537]"
              : "border-gray-400 dark:border-gray-600"
          }
        `}
      >
        {enabled && (
          <svg width="14" height="14" viewBox="0 0 20 20">
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

      <span className="text-[15px] text-gray-800 dark:text-gray-200">
        {label}
      </span>
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
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={onToggle}
        className={`h-5 w-5 rounded-md border flex items-center justify-center
          ${
            checked
              ? "bg-[#D19537] border-[#D19537]"
              : "border-gray-400 dark:border-gray-600 bg-white dark:bg-[#181818]"
          }
        `}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 20 20">
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

      <span className="text-[15px] text-gray-800 dark:text-gray-200">
        {label}
      </span>
    </label>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { API_BASE_URL } from "@/config/apiConfig";
// // import { HOST_Tenant_ID } from "@/config/hostTenantId";

// /* ================= TYPES ================= */

// interface TenantFeatures {
//   serviceFee?: {
//     enabled: boolean;
//     type: string;
//     value: number;
//     defaultHandling?: {
//       passToBuyer: boolean;
//       absorbByTenant: boolean;
//     };
//   };
//   creditSystem?: { enabled: boolean };
//   paymentPlans?: { enabled: boolean };
//   allowTransfers?: { enabled: boolean };
//   showLoginHelp?: boolean;
// }

// /* ================= COMPONENT ================= */

// export default function EventSettingsPageInline({
//   setActivePage,
// }: {
//   setActivePage: (page: string) => void;
// }) {
//   const [activeTab, setActiveTab] = useState<"general" | "payments">("general");

//   /* ===== FEATURES (READ ONLY) ===== */
//   const [features, setFeatures] = useState<TenantFeatures | null>(null);
//   const [loading, setLoading] = useState(true);

//   /* ===== PAYMENT SETTINGS (EVENT LEVEL) ===== */
//   const [passFee, setPassFee] = useState(false);
//   const [absorbFee, setAbsorbFee] = useState(false);

//   const serviceFeeEnabled = features?.serviceFee?.enabled === true;

//   /* ================= FETCH FEATURES ================= */

//   useEffect(() => {
//     const fetchFeatures = async () => {
//       try {
//         const token = localStorage.getItem("hostToken");
//         if (!token) return;

//         const res = await axios.get(`${API_BASE_URL}/tenants/my/features`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "x-tenant-id": HOST_Tenant_ID,
//           },
//         });

//         setFeatures(res.data?.data?.features || {});
//       } catch (err) {
//         console.error("Failed to load tenant features", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeatures();
//   }, []);

//   /* ===== SAFETY: RESET OPTIONS IF SERVICE FEE DISABLED ===== */
//   useEffect(() => {
//     if (!serviceFeeEnabled) {
//       setPassFee(false);
//       setAbsorbFee(false);
//     }
//   }, [serviceFeeEnabled]);

//   /* ================= NAVIGATION ================= */

//   const handleGoBack = () => setActivePage("create");

//   const handleSaveAndContinue = () => {
//     try {
//       const existing = JSON.parse(localStorage.getItem("eventDraft") || "{}");

//       const updated = {
//         ...existing,
//         eventSettings: {
//           serviceFee: {
//             enabled: serviceFeeEnabled,
//             handling: passFee
//               ? "PASS_TO_BUYER"
//               : absorbFee
//               ? "ABSORB_TO_HOST"
//               : null,
//           },
//         },
//       };

//       localStorage.setItem("eventDraft", JSON.stringify(updated));
//     } catch (err) {
//       console.error("Failed to save event payment settings", err);
//     }

//     setActivePage("set-ticketingdetailsT");
//   };

//   if (loading) {
//     return (
//       <div className="p-8 text-sm text-gray-500">
//         Loading feature permissions…
//       </div>
//     );
//   }

//   return (
//     <div className="px-4 sm:px-6 md:px-8 pb-12">
//       {/* Header */}
//       <div className="mb-8">
//         <h2 className="text-[26px] font-semibold">Event Settings</h2>
//         <p className="text-gray-600 dark:text-gray-300 text-sm">
//           Configure rules, permissions, and payment preferences for your event.
//         </p>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-6 border-b pb-3 mb-6 dark:border-gray-700">
//         {["general", "payments"].map((tab) => (
//           <button
//             key={tab}
//             className={`pb-2 font-medium text-sm ${
//               activeTab === tab
//                 ? "border-b-2 border-black dark:border-white"
//                 : "text-gray-500"
//             }`}
//             onClick={() => setActiveTab(tab as any)}
//           >
//             {tab.toUpperCase()}
//           </button>
//         ))}
//       </div>

//       {/* ================= GENERAL TAB (READ ONLY) ================= */}
//       {activeTab === "general" && (
//         <div className="space-y-5">
//           <FeatureRow
//             label="Service fee enabled"
//             enabled={features?.serviceFee?.enabled}
//           />

//           {features?.serviceFee?.enabled &&
//             features?.serviceFee?.defaultHandling && (
//               <div className="ml-8 mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
//                 {features.serviceFee.defaultHandling.passToBuyer && (
//                   <p>• Pass service fee to buyer</p>
//                 )}
//                 {features.serviceFee.defaultHandling.absorbByTenant && (
//                   <p>• Absorb service fee by host</p>
//                 )}
//               </div>
//             )}

//           <FeatureRow
//             label="Credit system"
//             enabled={features?.creditSystem?.enabled}
//           />

//           <FeatureRow
//             label="Payment plans"
//             enabled={features?.paymentPlans?.enabled}
//           />

//           <FeatureRow
//             label="Ticket transfers"
//             enabled={features?.allowTransfers?.enabled}
//           />

//           <FeatureRow label="Login help" enabled={features?.showLoginHelp} />
//         </div>
//       )}

//       {/* ================= PAYMENTS TAB ================= */}
//       {activeTab === "payments" && (
//         <div className="space-y-5">
//           {!serviceFeeEnabled ? (
//             <p className="text-sm text-gray-500">
//               Service fee option is not enabled for your account.
//             </p>
//           ) : (
//             <>
//               <SettingToggle
//                 label="Pass service fee to buyer"
//                 checked={passFee}
//                 onToggle={() => {
//                   setPassFee(!passFee);
//                   if (!passFee) setAbsorbFee(false);
//                 }}
//               />

//               <SettingToggle
//                 label="Absorb service fee from earnings"
//                 checked={absorbFee}
//                 onToggle={() => {
//                   setAbsorbFee(!absorbFee);
//                   if (!absorbFee) setPassFee(false);
//                 }}
//               />

//               <p className="text-xs text-gray-500 ml-1">
//                 Choose how the service fee is handled for this event.
//               </p>
//             </>
//           )}
//         </div>
//       )}

//       {/* Footer */}
//       <div className="flex justify-end gap-4 pt-10">
//         <button
//           onClick={handleGoBack}
//           className="h-11 px-6 rounded-xl bg-[#FFF5E6] text-[#D19537] font-semibold"
//         >
//           Go Back
//         </button>

//         <button
//           onClick={handleSaveAndContinue}
//           className="h-11 px-6 rounded-xl bg-[#D19537] text-white font-semibold"
//         >
//           Save & Continue
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ================= UI HELPERS ================= */

// function FeatureRow({ label, enabled }: { label: string; enabled?: boolean }) {
//   return (
//     <div className="flex items-center gap-3">
//       <div
//         className={`h-5 w-5 rounded-md border flex items-center justify-center
//           ${
//             enabled
//               ? "bg-[#D19537] border-[#D19537]"
//               : "border-gray-400 dark:border-gray-600"
//           }
//         `}
//       >
//         {enabled && (
//           <svg width="14" height="14" viewBox="0 0 20 20">
//             <path
//               d="M5 10L8.5 13.5L15 7"
//               stroke="white"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         )}
//       </div>

//       <span className="text-[15px] text-gray-800 dark:text-gray-200">
//         {label}
//       </span>
//     </div>
//   );
// }

// function SettingToggle({
//   label,
//   checked,
//   onToggle,
// }: {
//   label: string;
//   checked: boolean;
//   onToggle: () => void;
// }) {
//   return (
//     <label className="flex items-center gap-3 cursor-pointer select-none">
//       <div
//         onClick={onToggle}
//         className={`h-5 w-5 rounded-md border flex items-center justify-center
//           ${
//             checked
//               ? "bg-[#D19537] border-[#D19537]"
//               : "border-gray-400 dark:border-gray-600 bg-white dark:bg-[#181818]"
//           }
//         `}
//       >
//         {checked && (
//           <svg width="14" height="14" viewBox="0 0 20 20">
//             <path
//               d="M5 10L8.5 13.5L15 7"
//               stroke="white"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         )}
//       </div>

//       <span className="text-[15px] text-gray-800 dark:text-gray-200">
//         {label}
//       </span>
//     </label>
//   );
// }

// "use client";

// import { useState } from "react";

// export default function EventSettingsPageInline({
//   setActivePage,
// }: {
//   setActivePage: (page: string) => void;
// }) {
//   // Tabs
//   const [activeTab, setActiveTab] = useState<"general" | "payments">("general");

//   // General tab checkboxes
//   const [passServiceFee, setPassServiceFee] = useState(false);
//   const [allowCredits, setAllowCredits] = useState(false);
//   const [allowTransfer, setAllowTransfer] = useState(false);

//   // Advanced
//   const [autoApprove, setAutoApprove] = useState(false);
//   const [limitPerUser, setLimitPerUser] = useState(false);

//   // Payments
//   const [passFee, setPassFee] = useState(false);
//   const [absorbFee, setAbsorbFee] = useState(false);
//   const [payOverTime, setPayOverTime] = useState(false);

//   // Pay over time plans
//   const [installmentPlan, setInstallmentPlan] = useState<number | null>(null);

//   // Refund rules (only when ticket transfer is allowed)
//   const [refundDeadline, setRefundDeadline] = useState<string>("");
//   const [refundPercentage, setRefundPercentage] = useState<string>("");

//   // BACK BUTTON → go to Create Event page
//   const handleGoBack = () => setActivePage("create");

//   // SAVE BUTTON → go to Trainers step
//   const handleSaveAndContinue = () => {
//     const settings = {
//       passServiceFee,
//       allowCredits,

//       ticketTransfer: {
//         enabled: allowTransfer,
//         refundDeadline: allowTransfer ? refundDeadline : null,
//         refundPercentage: allowTransfer ? Number(refundPercentage) : null,
//       },

//       autoApprove,
//       limitPerUser,
//       passFee,
//       absorbFee,
//     };

//     try {
//       const existing = JSON.parse(localStorage.getItem("eventDraft") || "{}");

//       const updated = {
//         ...existing,
//         eventSettings: settings,
//       };

//       localStorage.setItem("eventDraft", JSON.stringify(updated));
//     } catch (e) {
//       console.error("Failed to save event settings", e);
//     }

//     setActivePage("set-ticketingdetailsT"); // 🔥 Move to next step
//   };

//   return (
//     <div className="px-4 sm:px-6 md:px-8 pb-12">
//       {/* Inline Header */}
//       <div className="mb-8">
//         <h2 className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold">
//           Event Settings
//         </h2>
//         <p className="text-gray-600 dark:text-gray-300 text-[14px]">
//           Configure rules, permissions, and payment preferences for your event.
//         </p>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-6 border-b pb-3 mb-6 dark:border-gray-700">
//         {["general", "payments"].map((tab) => (
//           <button
//             key={tab}
//             className={`pb-2 font-medium text-[15px] tracking-wide ${
//               activeTab === tab
//                 ? "border-b-2 border-black dark:border-white text-black dark:text-white"
//                 : "text-gray-600 dark:text-gray-400"
//             }`}
//             onClick={() => setActiveTab(tab as any)}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* TAB CONTENT */}
//       <div className="space-y-5">
//         {activeTab === "general" && (
//           <>
//             <SettingToggle
//               label=" Service fee handling"
//               checked={passServiceFee}
//               onToggle={() => setPassServiceFee(!passServiceFee)}
//             />
//             <SettingToggle
//               label="Allow credits to be used for this event"
//               checked={allowCredits}
//               onToggle={() => setAllowCredits(!allowCredits)}
//             />
//             <SettingToggle
//               label="Allow ticket transfer"
//               checked={allowTransfer}
//               onToggle={() => {
//                 const next = !allowTransfer;
//                 setAllowTransfer(next);

//                 if (!next) {
//                   setRefundDeadline("");
//                   setRefundPercentage("");
//                 }
//               }}
//             />

//             {allowTransfer && (
//               <div className="ml-8 mt-4 space-y-4 max-w-md">
//                 {/* Refund Deadline */}
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Refund deadline
//                   </label>
//                   <input
//                     type="date"
//                     value={refundDeadline}
//                     onChange={(e) => setRefundDeadline(e.target.value)}
//                     className="w-full px-4 py-2 border rounded-lg
//           bg-white dark:bg-[#101010]
//           border-gray-300 dark:border-gray-700
//           focus:ring-[#D19537]"
//                   />
//                 </div>

//                 {/* Refund Percentage */}
//                 <div className="space-y-1">
//                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Refund amount (%)
//                   </label>

//                   <div className="relative">
//                     <input
//                       type="number"
//                       min={0}
//                       max={100}
//                       placeholder="e.g. 20"
//                       value={refundPercentage}
//                       onChange={(e) => {
//                         const value = Number(e.target.value);
//                         if (value >= 0 && value <= 100) {
//                           setRefundPercentage(e.target.value);
//                         }
//                       }}
//                       className="w-full pr-10 px-4 py-2 border rounded-lg
//             bg-white dark:bg-[#101010]
//             border-gray-300 dark:border-gray-700
//             focus:ring-[#D19537]"
//                     />

//                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
//                       %
//                     </span>
//                   </div>

//                   <p className="text-xs text-gray-500">
//                     Percentage of ticket price refunded if transferred
//                   </p>
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {/* {activeTab === "advanced" && (
//           <>
//             <SettingToggle
//               label="abcd"
//               checked={autoApprove}
//               onToggle={() => setAutoApprove(!autoApprove)}
//             />
//             <SettingToggle
//               label="xyz"
//               checked={limitPerUser}
//               onToggle={() => setLimitPerUser(!limitPerUser)}
//             />
//           </>
//         )} */}

//         {activeTab === "payments" && (
//           <>
//             <SettingToggle
//               label="Pass fee to buyer"
//               checked={passFee}
//               onToggle={() => setPassFee(!passFee)}
//             />
//             <SettingToggle
//               label="Absorb fee from earnings"
//               checked={absorbFee}
//               onToggle={() => setAbsorbFee(!absorbFee)}
//             />
//             <SettingToggle
//               label="Pay over time"
//               checked={payOverTime}
//               onToggle={() => {
//                 const next = !payOverTime;
//                 setPayOverTime(next);

//                 if (!next) {
//                   setInstallmentPlan(null); // reset plans when disabled
//                 }
//               }}
//             />
//             {/* 🔽 Pay Over Time Plans */}
//             {payOverTime && (
//               <div className="ml-8 mt-3 space-y-3">
//                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Choose plan:
//                 </p>

//                 {[2, 3, 4].map((count) => (
//                   <label
//                     key={count}
//                     className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 dark:text-gray-300"
//                   >
//                     <input
//                       type="radio"
//                       name="installmentPlan"
//                       checked={installmentPlan === count}
//                       onChange={() => setInstallmentPlan(count)}
//                       className="accent-[#D19537]"
//                     />
//                     <span>{count} Installments</span>
//                   </label>
//                 ))}

//                 <p className="text-xs text-gray-500">
//                   Buyers will pay the ticket price in selected installments.
//                 </p>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* 🔥 BUTTONS (Back + Save & Continue) */}
//       <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-10">
//         <button
//           onClick={handleGoBack}
//           className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#FFF5E6] text-[#D19537]"
//         >
//           Go Back
//         </button>

//         <button
//           onClick={handleSaveAndContinue}
//           className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#D19537] text-white"
//         >
//           Save & Continue
//         </button>
//       </div>
//     </div>
//   );
// }

// function SettingToggle({
//   label,
//   checked,
//   onToggle,
// }: {
//   label: string;
//   checked: boolean;
//   onToggle: () => void;
// }) {
//   return (
//     <label className="flex items-center gap-3 cursor-pointer select-none group">
//       <div
//         onClick={onToggle}
//         className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all
//         ${
//           checked
//             ? "bg-[#D19537] border-[#D19537]"
//             : "border-gray-400 dark:border-gray-600 bg-white dark:bg-[#181818]"
//         }
//         group-hover:border-[#D19537]
//       `}
//       >
//         {checked && (
//           <svg
//             className="text-white"
//             width="16"
//             height="16"
//             viewBox="0 0 20 20"
//             fill="none"
//           >
//             <path
//               d="M5 10L8.5 13.5L15 7"
//               stroke="white"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         )}
//       </div>

//       <span className="text-[16px] text-gray-800 dark:text-gray-200">
//         {label}
//       </span>
//     </label>
//   );
// }
