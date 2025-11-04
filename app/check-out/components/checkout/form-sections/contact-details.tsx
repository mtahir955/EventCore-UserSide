"use client";

import Image from "next/image";
import SectionShell from "./section-shell";
import { useState } from "react";

export default function ContactDetails() {
  const [form, setForm] = useState({
    phone: "",
    city: "",
    pincode: "",
    address: "",
    website: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <SectionShell title="Contact Details">
      <div className="grid grid-cols-1 gap-4 text-gray-900 dark:text-gray-100">
        {/* Phone number */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Phone Number:
          </label>
          <div
            className={`flex h-11 items-center gap-2 rounded-md border 
              ${
                !form.phone
                  ? "border-gray-300 dark:border-gray-700"
                  : "border-gray-300 dark:border-gray-700"
              } 
              bg-white dark:bg-[#101010] px-3`}
          >
            <Image
              src="/images/flag-us.png"
              alt="US Flag"
              width={20}
              height={20}
              className="rounded-full"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">+1</span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="125-559-8852"
              className="w-full bg-transparent text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none"
            />
          </div>
        </div>

        {/* City + Pincode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              City/Town:
            </label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              placeholder="Enter city"
              className={`h-11 w-full rounded-md border ${
                !form.city
                  ? "border-gray-300 dark:border-gray-700"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary transition-colors`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Pincode:
            </label>
            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              required
              placeholder="Enter pincode"
              className={`h-11 w-full rounded-md border ${
                !form.pincode
                  ? "border-gray-300 dark:border-gray-700"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary transition-colors`}
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Address:
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            placeholder="Enter address"
            rows={4}
            className={`w-full rounded-md border ${
              !form.address
                ? "border-gray-300 dark:border-gray-700"
                : "border-gray-300 dark:border-gray-700"
            } bg-white dark:bg-[#101010] p-3 text-[15px] outline-none focus:ring-2 focus:ring-primary transition-colors resize-none`}
          />
        </div>

        {/* Website */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Website (Optional):
          </label>
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="Enter website url"
            className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>
      </div>
    </SectionShell>
  );
}

