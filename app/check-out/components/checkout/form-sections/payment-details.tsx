"use client";

import { useState } from "react";
import SectionShell from "./section-shell";

export default function PaymentDetails() {
  const [isDefault, setIsDefault] = useState(false);

  return (
    <SectionShell title="Payment Details">
      <div className="grid grid-cols-1 gap-4 transition-colors duration-300 text-gray-900 dark:text-gray-100">
        {/* Name on Card */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Name on Card:
          </label>
          <input
            placeholder="Enter Name"
            className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>

        {/* Card Number */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Card Number:
          </label>
          <input
            placeholder="0000-0000-0000-0000"
            className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>

        {/* Expiry Date & CVC */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Expire Date:
            </label>
            <input
              placeholder="MM/YY"
              className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              CVC:
            </label>
            <input
              defaultValue="720"
              className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        {/* Toggle Switch */}
        <label className="mt-2 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
          <div
            onClick={() => setIsDefault(!isDefault)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
              isDefault
                ? "bg-[#0077F7]"
                : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-200 shadow transition-transform duration-300 ${
                isDefault ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </div>
          Set as default payment option to use in future.
        </label>
      </div>
    </SectionShell>
  );
}
