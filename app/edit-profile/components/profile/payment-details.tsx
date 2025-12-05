"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

interface PaymentDetailsData {
  nameOnCard?: string;
  cardNumber?: string;
  expireDate?: string;
  cvc?: string;
  isDefault?: boolean;
}

interface PaymentDetailsProps {
  existing?: PaymentDetailsData;
}

export interface PaymentDetailsRef {
  getValues: () => {
    nameOnCard: string;
    cardNumber: string;
    expireDate: string;
    cvc: string;
    isDefault: boolean;
  };
}

const PaymentDetails = forwardRef<PaymentDetailsRef, PaymentDetailsProps>(
  ({ existing }, ref) => {
    const [form, setForm] = useState({
      nameOnCard: "",
      cardNumber: "",
      expireDate: "",
      cvc: "",
      isDefault: true,
    });

    useEffect(() => {
      if (existing) {
        setForm({
          nameOnCard: existing.nameOnCard || "",
          cardNumber: existing.cardNumber || "",
          expireDate: existing.expireDate || "",
          cvc: existing.cvc || "",
          isDefault:
            typeof existing.isDefault === "boolean" ? existing.isDefault : true,
        });
      }
    }, [existing]);

    useImperativeHandle(ref, () => ({
      getValues: () => form,
    }));

    const handleToggleDefault = () => {
      setForm((prev) => ({ ...prev, isDefault: !prev.isDefault }));
    };

    return (
      <div className="space-y-6 transition-colors duration-300 text-gray-900 dark:text-gray-100">
        {/* Name on Card */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Name On Card:
          </label>
          <input
            placeholder="Enter name"
            value={form.nameOnCard}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, nameOnCard: e.target.value }))
            }
            className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>

        {/* Card Number */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Card Number:
          </label>
          <input
            placeholder="0000-0000-0000-0000"
            value={form.cardNumber}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, cardNumber: e.target.value }))
            }
            className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>

        {/* Expiry + CVC */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Expire Date:
            </label>
            <input
              placeholder="MM/YY"
              value={form.expireDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, expireDate: e.target.value }))
              }
              className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              CVC:
            </label>
            <input
              placeholder="###"
              value={form.cvc}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, cvc: e.target.value }))
              }
              className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        {/* Toggle for Default Payment */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleDefault}
            aria-pressed={form.isDefault}
            className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-300 ${
              form.isDefault ? "bg-[#F97316]" : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            <span className="sr-only">Use as default payment</span>
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-200 shadow transition-transform duration-300 ${
                form.isDefault ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>

          <span className="text-sm text-gray-700 dark:text-gray-300">
            Set as default payment option to use in future.
          </span>
        </div>
      </div>
    );
  }
);

PaymentDetails.displayName = "PaymentDetails";

export default PaymentDetails;

//code before integration

// "use client";
// import { useState } from "react";

// export default function PaymentDetails() {
//   const [isDefault, setIsDefault] = useState(true);

//   const handleToggle = () => setIsDefault((prev) => !prev);

//   return (
//     <div className="space-y-6 transition-colors duration-300 text-gray-900 dark:text-gray-100">
//       {/* Name on Card */}
//       <div className="space-y-2">
//         <label className="text-sm text-gray-700 dark:text-gray-200">
//           Name On Card:
//         </label>
//         <input
//           placeholder="Enter name"
//           className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
//         />
//       </div>

//       {/* Card Number */}
//       <div className="space-y-2">
//         <label className="text-sm text-gray-700 dark:text-gray-200">
//           Card Number:
//         </label>
//         <input
//           placeholder="0000-0000-0000-0000"
//           className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
//         />
//       </div>

//       {/* Expiry + CVC */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//         <div className="space-y-2">
//           <label className="text-sm text-gray-700 dark:text-gray-200">
//             Expire Date:
//           </label>
//           <input
//             placeholder="MM/YY"
//             className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
//           />
//         </div>

//         <div className="space-y-2">
//           <label className="text-sm text-gray-700 dark:text-gray-200">CVC:</label>
//           <input
//             defaultValue="720"
//             className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
//           />
//         </div>
//       </div>

//       {/* Toggle for Default Payment */}
//       <div className="flex items-center gap-3">
//         <button
//           type="button"
//           onClick={handleToggle}
//           aria-pressed={isDefault}
//           className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-300 ${
//             isDefault
//               ? "bg-[#F97316]"
//               : "bg-gray-300 dark:bg-gray-700"
//           }`}
//         >
//           <span className="sr-only">Use as default payment</span>
//           <span
//             className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-200 shadow transition-transform duration-300 ${
//               isDefault ? "translate-x-5" : "translate-x-1"
//             }`}
//           />
//         </button>

//         <span className="text-sm text-gray-700 dark:text-gray-300">
//           Set as default payment option to use in future.
//         </span>
//       </div>
//     </div>
//   );
// }
