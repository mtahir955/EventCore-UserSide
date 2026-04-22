"use client";

import SectionShell from "./section-shell";
import { useEffect, useRef, useState } from "react";

type BasicInformationProps = {
  profile?: {
    basicInfo?: Record<string, any>;
  } | null;
};

function splitFullName(fullName?: string) {
  const parts = (fullName || "").trim().split(" ").filter(Boolean);

  return {
    firstName: parts[0] || "",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : "",
  };
}

function getPrefillValues(profile?: BasicInformationProps["profile"]) {
  const basicInfo = profile?.basicInfo || {};
  const fallbackName = splitFullName(
    basicInfo.fullName || basicInfo.name || basicInfo.userName
  );

  return {
    firstName: basicInfo.firstName || fallbackName.firstName || "",
    lastName: basicInfo.lastName || fallbackName.lastName || "",
    gender: basicInfo.gender || "",
    email: basicInfo.email || basicInfo.username || "",
  };
}

export default function BasicInformation({ profile }: BasicInformationProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
  });
  const touchedFieldsRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!profile) return;

    const prefill = getPrefillValues(profile);
    const hasPrefill = Object.values(prefill).some(Boolean);

    if (hasPrefill) {
      setForm((prev) => ({
        ...prev,
        firstName: touchedFieldsRef.current.firstName
          ? prev.firstName
          : prefill.firstName,
        lastName: touchedFieldsRef.current.lastName
          ? prev.lastName
          : prefill.lastName,
        gender: touchedFieldsRef.current.gender ? prev.gender : prefill.gender,
        email: touchedFieldsRef.current.email ? prev.email : prefill.email,
      }));
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    touchedFieldsRef.current[name] = true;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <SectionShell title="Basic Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900 dark:text-gray-100">
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

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Enter email address"
            className={`h-11 w-full rounded-md border ${
              !form.email
                ? "border-gray-300 dark:border-gray-700"
                : "border-gray-300 dark:border-gray-700"
            } bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary transition-colors`}
          />
        </div>

        {/* Gender */}
        {/* <div className="space-y-2">
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
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div> */}
      </div>
    </SectionShell>
  );
}
