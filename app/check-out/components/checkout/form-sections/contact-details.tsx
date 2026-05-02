"use client";

import Image from "next/image";
import SectionShell from "./section-shell";
import {
  CHECKOUT_FIELD_DEFINITIONS,
  type CheckoutFieldConfig,
} from "@/lib/event-commerce";

const countryOptions = [
  {
    code: "+1",
    label: "United States",
    flag: "/images/flag-us.png",
  },
  {
    code: "+1",
    label: "Canada",
    flag: "/images/flag-us.png",
  },
  {
    code: "+52",
    label: "Mexico",
    flag: "/images/flag-us.png",
  },
];

type ContactDetailsProps = {
  fields: CheckoutFieldConfig[];
  values: Record<string, any>;
  onChange: (field: string, value: string) => void;
};

export default function ContactDetails({
  fields,
  values,
  onChange,
}: ContactDetailsProps) {
  const contactFields = fields.filter((field) => field.section === "contact");
  const selectedCountry =
    countryOptions.find((country) => country.code === values.phoneCountryCode) ||
    countryOptions[0];

  if (contactFields.length === 0) return null;

  return (
    <SectionShell title="Contact Details">
      <div className="grid grid-cols-1 gap-4 text-gray-900 dark:text-gray-100">
        {contactFields.map((field) => {
          const definition = CHECKOUT_FIELD_DEFINITIONS[field.key];

          if (field.key === "phone") {
            return (
              <div className="space-y-2" key={field.key}>
                <label className="text-sm text-gray-700 dark:text-gray-200">
                  {definition.label}
                  {!field.required ? ":" : " *"}
                </label>

                <div className="relative flex h-11 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 dark:border-gray-700 dark:bg-[#101010]">
                  <Image
                    src={selectedCountry?.flag || "/images/flag-us.png"}
                    alt="Flag"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />

                  <select
                    value={values.phoneCountryCode || selectedCountry?.code || "+1"}
                    onChange={(event) =>
                      onChange("phoneCountryCode", event.target.value)
                    }
                    className="cursor-pointer bg-transparent text-sm text-gray-700 outline-none dark:text-gray-300"
                  >
                    {countryOptions.map((country) => (
                      <option key={country.code + country.label} value={country.code}>
                        {country.label} ({country.code})
                      </option>
                    ))}
                  </select>

                  <input
                    name={field.key}
                    value={values[field.key] || ""}
                    onChange={(event) => onChange(field.key, event.target.value)}
                    required={field.required}
                    placeholder={field.placeholder}
                    className="w-full bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-500 dark:text-gray-100 dark:placeholder:text-gray-400"
                  />
                </div>
              </div>
            );
          }

          if (field.key === "address") {
            return (
              <div className="space-y-2" key={field.key}>
                <label className="text-sm text-gray-700 dark:text-gray-200">
                  {definition.label}
                  {!field.required ? ":" : " *"}
                </label>
                <textarea
                  name={field.key}
                  value={values[field.key] || ""}
                  onChange={(event) => onChange(field.key, event.target.value)}
                  required={field.required}
                  placeholder={field.placeholder}
                  rows={4}
                  className="w-full resize-none rounded-md border border-gray-300 bg-white p-3 text-[15px] outline-none transition-colors focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-[#101010]"
                />
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
