"use client";

import SectionShell from "./section-shell";
import {
  CHECKOUT_FIELD_DEFINITIONS,
  type CheckoutFieldConfig,
} from "@/lib/event-commerce";

type BasicInformationProps = {
  fields: CheckoutFieldConfig[];
  values: Record<string, any>;
  onChange: (field: string, value: string) => void;
};

export default function BasicInformation({
  fields,
  values,
  onChange,
}: BasicInformationProps) {
  const basicFields = fields.filter((field) => field.section === "basic");

  if (basicFields.length === 0) return null;

  return (
    <SectionShell title="Basic Information">
      <div className="grid grid-cols-1 gap-4 text-gray-900 dark:text-gray-100 md:grid-cols-2">
        {basicFields.map((field) => {
          const definition = CHECKOUT_FIELD_DEFINITIONS[field.key];

          if (field.key === "gender") {
            return (
              <div className="space-y-2" key={field.key}>
                <label className="text-sm text-gray-700 dark:text-gray-200">
                  {definition.label}
                  {!field.required ? ":" : " *"}
                </label>
                <select
                  name={field.key}
                  value={values[field.key] || ""}
                  onChange={(event) => onChange(field.key, event.target.value)}
                  required={field.required}
                  className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-[15px] text-gray-900 outline-none transition-colors focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-[#101010] dark:text-gray-100"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            );
          }

          return (
            <div className="space-y-2" key={field.key}>
              <label className="text-sm text-gray-700 dark:text-gray-200">
                {definition.label}
                {!field.required ? ":" : " *"}
              </label>
              <input
                type={field.key === "email" ? "email" : "text"}
                name={field.key}
                value={values[field.key] || ""}
                onChange={(event) => onChange(field.key, event.target.value)}
                required={field.required}
                placeholder={field.placeholder}
                className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-[15px] outline-none transition-colors focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-[#101010]"
              />
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
