"use client";

import SectionShell from "./section-shell";
import { useState } from "react";

export default function BasicInformation() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <SectionShell title="Basic Information">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 text-gray-900 dark:text-gray-100">
        {/* First Name */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            First Name:
          </label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
            placeholder="Enter first name"
            className={`h-11 w-full rounded-md border ${
              !form.firstName
                ? "border-gray-300 dark:border-gray-700"
                : "border-gray-300 dark:border-gray-700"
            } bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary transition-colors`}
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Last Name:
          </label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
            placeholder="Enter last name"
            className={`h-11 w-full rounded-md border ${
              !form.lastName
                ? "border-gray-300 dark:border-gray-700"
                : "border-gray-300 dark:border-gray-700"
            } bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary transition-colors`}
          />
        </div>

        {/* Gender (Dropdown) */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Gender:
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className={`h-11 w-full rounded-md border ${
              !form.gender
                ? "border-gray-300 dark:border-gray-700"
                : "border-gray-300 dark:border-gray-700"
            } bg-white dark:bg-[#101010] px-3 text-[15px] text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary transition-colors`}
          >
            <option value="">Select gender</option>
            <option value="Female">Male</option>
            <option value="Male">Female</option>
          </select>
        </div>
      </div>
    </SectionShell>
  );
}
