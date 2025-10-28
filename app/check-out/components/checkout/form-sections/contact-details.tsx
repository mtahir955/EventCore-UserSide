"use client";

import Image from "next/image";
import SectionShell from "./section-shell";

export default function ContactDetails() {
  return (
    <SectionShell title="Contact Details">
      <div className="grid grid-cols-1 gap-4 transition-colors duration-300 text-gray-900 dark:text-gray-100">
        {/* Phone number with flag */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Phone Number:
          </label>
          <div className="flex h-11 items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 transition-colors">
            <Image
              src="/images/flag-us.png"
              alt="US Flag"
              width={20}
              height={20}
              className="rounded-full"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">+1</span>
            <input
              placeholder="125-559-8852"
              className="w-full bg-transparent text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none"
            />
          </div>
        </div>

        {/* City + Pincode */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              City/Town:
            </label>
            <input
              placeholder="Enter city"
              className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Pincode:
            </label>
            <input
              placeholder="Enter pincode"
              className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Address:
          </label>
          <textarea
            placeholder="Enter address"
            rows={4}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] p-3 text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>

        {/* Website */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Website (Optional):
          </label>
          <input
            placeholder="Enter website url"
            className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>
      </div>
    </SectionShell>
  );
}
