"use client";

import SectionShell from "./section-shell";

export default function BasicInformation() {
  return (
    <SectionShell title="Basic Information">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 transition-colors duration-300 text-gray-900 dark:text-gray-100">
        {/* First Name */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            First Name:
          </label>
          <input
            placeholder="Enter first name"
            className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-primary transition-colors"
            required
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Last Name:
          </label>
          <input
            placeholder="Enter last name"
            className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Gender
          </label>
          <input
            defaultValue="Female"
            className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>
      </div>
    </SectionShell>
  );
}
