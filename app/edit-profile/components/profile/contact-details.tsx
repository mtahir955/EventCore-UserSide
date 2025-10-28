"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContactDetails() {
  const [selectedCode, setSelectedCode] = useState({
    flag: "/images/flag-us.png",
    code: "+1",
  });

  const countryCodes = [
    { flag: "/images/flag-us.png", code: "+1", country: "United States" },
    { flag: "/images/flag-uk.png", code: "+44", country: "United Kingdom" },
    { flag: "/images/flag-pk.png", code: "+92", country: "Pakistan" },
    { flag: "/images/flag-in.png", code: "+91", country: "India" },
  ];

  return (
    <div className="space-y-6 transition-colors duration-300 text-gray-900 dark:text-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Phone Number */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Phone Number:
          </label>
          <div className="flex h-12 items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3">
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1 text-sm text-gray-800 dark:text-gray-100 focus:outline-none"
                onClick={() =>
                  document
                    .getElementById("country-dropdown")
                    ?.classList.toggle("hidden")
                }
              >
                <Image
                  src={selectedCode.flag}
                  width={20}
                  height={20}
                  alt="Flag"
                  className="rounded-sm"
                />
                <span>{selectedCode.code}</span>
                <svg
                  className="w-3 h-3 ml-1 text-gray-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              <div
                id="country-dropdown"
                className="hidden absolute left-0 top-8 z-10 w-36 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] shadow-lg"
              >
                {countryCodes.map((item, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
                    onClick={() => {
                      setSelectedCode({ flag: item.flag, code: item.code });
                      document
                        .getElementById("country-dropdown")
                        ?.classList.add("hidden");
                    }}
                  >
                    <Image
                      src={item.flag}
                      width={20}
                      height={20}
                      alt={item.country}
                      className="rounded-sm"
                    />
                    <span className="text-sm text-gray-800 dark:text-gray-100">
                      {item.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <input
              placeholder="125-559-8852"
              className="h-10 w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none text-sm"
              aria-label="Phone number"
            />
          </div>
        </div>

        {/* City */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            City/Town:
          </label>
          <input
            placeholder="Enter city"
            className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
            aria-label="City or town"
          />
        </div>

        {/* Pincode */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Pincode:
          </label>
          <input
            placeholder="Enter pincode"
            className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
            aria-label="Pincode"
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
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 p-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
          aria-label="Address"
        />
      </div>

      {/* Website */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          Website (Optional):
        </label>
        <input
          placeholder="Enter website URL"
          className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
          aria-label="Website"
        />
      </div>
    </div>
  );
}
