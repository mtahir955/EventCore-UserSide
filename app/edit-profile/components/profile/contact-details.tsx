"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import Autocomplete from "react-google-autocomplete";
import {
  getCountryDataList,
  getEmojiFlag,
  type TCountryCode,
} from "countries-list";
import { formatUsPhoneNumber } from "@/lib/phoneFormat";

interface ContactDetailsData {
  phone?: string;
  phoneCountryCode?: string;
  phoneCountryIso?: TCountryCode;
  phoneNumber?: string;
  city?: string;
  pincode?: string;
  address?: string;
  website?: string;
}

interface ContactDetailsProps {
  existing?: ContactDetailsData;
}

export interface ContactDetailsRef {
  getValues: () => {
    phone: string;
    phoneCountryCode: string;
    phoneCountryIso: TCountryCode;
    phoneNumber: string;
    city: string;
    pincode: string;
    address: string;
    website: string;
  };
}

const countryCodeOptions = getCountryDataList()
  .flatMap((country) =>
    country.phone.map((phone) => ({
      iso2: country.iso2,
      country: country.name,
      code: `+${phone}`,
      flag: getEmojiFlag(country.iso2),
    }))
  )
  .sort((a, b) => a.country.localeCompare(b.country));

function getPhoneParts(existing?: ContactDetailsData) {
  const rawPhone = existing?.phone || "";
  const matchedCode =
    existing?.phoneCountryCode ||
    countryCodeOptions.find((item) => rawPhone.trim().startsWith(item.code))
      ?.code ||
    "+1";
  const matchedCountry =
    (existing?.phoneCountryIso &&
      countryCodeOptions.find(
        (item) =>
          item.iso2 === existing.phoneCountryIso && item.code === matchedCode
      )) ||
    countryCodeOptions.find(
      (item) => item.iso2 === "US" && item.code === matchedCode
    ) ||
    countryCodeOptions.find((item) => item.code === matchedCode);

  const rawNumber =
    existing?.phoneNumber || rawPhone.replace(matchedCode, "").trim();

  return {
    phoneCountryCode: matchedCode,
    phoneCountryIso: matchedCountry?.iso2 || ("US" as TCountryCode),
    phoneNumber:
      matchedCode === "+1" ? formatUsPhoneNumber(rawNumber) : rawNumber,
  };
}

const ContactDetails = forwardRef<ContactDetailsRef, ContactDetailsProps>(
  ({ existing }, ref) => {
    const [form, setForm] = useState({
      phoneCountryCode: "+1",
      phoneCountryIso: "US" as TCountryCode,
      phoneNumber: "",
      city: "",
      pincode: "",
      address: "",
      website: "",
    });

    useEffect(() => {
      if (existing) {
        const phoneParts = getPhoneParts(existing);

        setForm({
          phoneCountryCode: phoneParts.phoneCountryCode,
          phoneCountryIso: phoneParts.phoneCountryIso,
          phoneNumber: phoneParts.phoneNumber,
          city: existing.city || existing.town || "",
          pincode:
            existing.pincode || (existing as any).postalCode || (existing as any).zipCode || "",
          address: existing.address || "",
          website: existing.website || "",
        });
      }
    }, [existing]);

    useImperativeHandle(ref, () => ({
      getValues: () => ({
        ...form,
        phone: `${form.phoneCountryCode} ${form.phoneNumber}`.trim(),
      }),
    }));

    return (
      <div className="space-y-6 transition-colors duration-300 text-gray-900 dark:text-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Phone Number:
            </label>
            <div className="flex h-12 items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3">
              <CountryCodeDropdown
                countryCode={form.phoneCountryCode}
                countryIso={form.phoneCountryIso}
                onCountryChange={(country) =>
                  setForm((prev) => ({
                    ...prev,
                    phoneCountryCode: country.code,
                    phoneCountryIso: country.iso2,
                    phoneNumber:
                      country.code === "+1"
                        ? formatUsPhoneNumber(prev.phoneNumber)
                        : prev.phoneNumber,
                  }))
                }
              />

              <input
                placeholder="(125) 559-8852"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    phoneNumber:
                      prev.phoneCountryCode === "+1"
                        ? formatUsPhoneNumber(e.target.value)
                        : e.target.value.replace(/[^\d\s()-]/g, ""),
                  }))
                }
                inputMode="tel"
                maxLength={form.phoneCountryCode === "+1" ? 14 : 20}
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
              value={form.city}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, city: e.target.value }))
              }
              className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
              aria-label="City or town"
            />
          </div>

          {/* Pincode */}
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Postal Code:
            </label>
            <input
              placeholder="Enter pincode"
              value={form.pincode}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, pincode: e.target.value }))
              }
              className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
              aria-label="Pincode"
            />
          </div>
        </div>

        {/* Address */}
        {/* <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Address:
          </label>
          <textarea
            placeholder="Enter address"
            rows={4}
            value={form.address}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, address: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 p-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
            aria-label="Address"
          />
        </div> */}
        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Address:
          </label>

          <Autocomplete
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            options={{
              types: ["address"],
              // componentRestrictions: { country: "us" }, // optional
            }}
            defaultValue={form.address}
            onPlaceSelected={(place) => {
              const formatted = place?.formatted_address || "";

              // ✅ Extract city + postal code (optional)
              const components = place?.address_components || [];
              const get = (type: string) =>
                components.find((c: any) => c.types.includes(type))
                  ?.long_name || "";

              const city =
                get("locality") || get("administrative_area_level_2");
              const pincode = get("postal_code");

              setForm((prev) => ({
                ...prev,
                address: formatted,
                city: city || prev.city,
                pincode: pincode || prev.pincode,
              }));
            }}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                address: (e.target as HTMLInputElement).value,
              }))
            }
            placeholder="Search address..."
            className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
          />

          {/* Optional: show selected full address below (like your old textarea UX) */}
          {form.address ? (
            <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#181818] p-4 text-sm">
              {form.address}
            </div>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Website (Optional):
          </label>
          <input
            placeholder="Enter website URL"
            value={form.website}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, website: e.target.value }))
            }
            className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-[#101010] dark:text-gray-100"
            aria-label="Website"
          />
        </div>
      </div>
    );
  }
);

ContactDetails.displayName = "ContactDetails";

export default ContactDetails;

function CountryCodeDropdown({
  countryCode,
  countryIso,
  onCountryChange,
}: {
  countryCode: string;
  countryIso: TCountryCode;
  onCountryChange: (country: {
    iso2: TCountryCode;
    country: string;
    code: string;
    flag: string;
  }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectedCountry =
    countryCodeOptions.find(
      (country) => country.iso2 === countryIso && country.code === countryCode
    ) || countryCodeOptions.find((country) => country.code === countryCode);

  const filteredCountryCodes = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return countryCodeOptions;

    return countryCodeOptions.filter((country) => {
      return (
        country.country.toLowerCase().includes(query) ||
        country.code.includes(query) ||
        country.iso2.toLowerCase().includes(query)
      );
    });
  }, [searchTerm]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setSearchTerm("");
        }}
        className="flex h-10 w-[126px] items-center justify-between gap-2 border-r border-gray-300 pr-3 text-sm text-gray-900 outline-none dark:border-gray-700 dark:text-gray-100"
        aria-label="Phone country code"
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span>{selectedCountry?.flag}</span>
          <span>{selectedCountry?.code || countryCode}</span>
        </span>
        <svg
          className="h-3 w-3 shrink-0 text-gray-700 dark:text-gray-300"
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

      {isOpen && (
        <div className="absolute left-0 top-11 z-50 w-72 rounded-lg border border-gray-200 bg-white py-2 shadow-xl dark:border-gray-700 dark:bg-[#1a1a1a]">
          <div className="px-2 pb-2">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search country or code"
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#D19537] dark:border-gray-700 dark:bg-[#101010] dark:text-gray-100"
              autoFocus
            />
          </div>

          <div className="max-h-56 overflow-y-auto">
            {filteredCountryCodes.length > 0 ? (
              filteredCountryCodes.map((country) => (
                <button
                  key={`${country.iso2}-${country.code}`}
                  type="button"
                  onClick={() => {
                    onCountryChange(country);
                    setSearchTerm("");
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-[#2a2a2a]"
                >
                  <span className="w-6 shrink-0">{country.flag}</span>
                  <span className="w-14 shrink-0 font-semibold">
                    {country.code}
                  </span>
                  <span className="min-w-0 truncate">{country.country}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">
                No country found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

//code before integration

// "use client";

// import { useState } from "react";
// import Image from "next/image";

// export default function ContactDetails() {
//   const [selectedCode, setSelectedCode] = useState({
//     flag: "/images/flag-us.png",
//     code: "+1",
//   });

//   const countryCodes = [
//     { flag: "/images/flag-us.png", code: "+1", country: "United States" },
//     { flag: "/images/flag-uk.png", code: "+44", country: "United Kingdom" },
//     { flag: "/images/flag-pk.png", code: "+92", country: "Pakistan" },
//     { flag: "/images/flag-in.png", code: "+91", country: "India" },
//   ];

//   return (
//     <div className="space-y-6 transition-colors duration-300 text-gray-900 dark:text-gray-100">
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
//         {/* Phone Number */}
//         <div className="space-y-2">
//           <label className="text-sm text-gray-700 dark:text-gray-200">
//             Phone Number:
//           </label>
//           <div className="flex h-12 items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3">
//             <div className="relative">
//               <button
//                 type="button"
//                 className="flex items-center gap-1 text-sm text-gray-800 dark:text-gray-100 focus:outline-none"
//                 onClick={() =>
//                   document
//                     .getElementById("country-dropdown")
//                     ?.classList.toggle("hidden")
//                 }
//               >
//                 <Image
//                   src={selectedCode.flag}
//                   width={20}
//                   height={20}
//                   alt="Flag"
//                   className="rounded-sm"
//                 />
//                 <span>{selectedCode.code}</span>
//                 <svg
//                   className="w-3 h-3 ml-1 text-gray-600 dark:text-gray-300"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </button>

//               {/* Dropdown */}
//               <div
//                 id="country-dropdown"
//                 className="hidden absolute left-0 top-8 z-10 w-36 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] shadow-lg"
//               >
//                 {countryCodes.map((item, i) => (
//                   <div
//                     key={i}
//                     className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
//                     onClick={() => {
//                       setSelectedCode({ flag: item.flag, code: item.code });
//                       document
//                         .getElementById("country-dropdown")
//                         ?.classList.add("hidden");
//                     }}
//                   >
//                     <Image
//                       src={item.flag}
//                       width={20}
//                       height={20}
//                       alt={item.country}
//                       className="rounded-sm"
//                     />
//                     <span className="text-sm text-gray-800 dark:text-gray-100">
//                       {item.code}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <input
//               placeholder="125-559-8852"
//               className="h-10 w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none text-sm"
//               aria-label="Phone number"
//             />
//           </div>
//         </div>

//         {/* City */}
//         <div className="space-y-2">
//           <label className="text-sm text-gray-700 dark:text-gray-200">
//             City/Town:
//           </label>
//           <input
//             placeholder="Enter city"
//             className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
//             aria-label="City or town"
//           />
//         </div>

//         {/* Pincode */}
//         <div className="space-y-2">
//           <label className="text-sm text-gray-700 dark:text-gray-200">
//             Pincode:
//           </label>
//           <input
//             placeholder="Enter pincode"
//             className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
//             aria-label="Pincode"
//           />
//         </div>
//       </div>

//       {/* Address */}
//       <div className="space-y-2">
//         <label className="text-sm text-gray-700 dark:text-gray-200">
//           Address:
//         </label>
//         <textarea
//           placeholder="Enter address"
//           rows={4}
//           className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 p-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
//           aria-label="Address"
//         />
//       </div>

//       {/* Website */}
//       <div className="space-y-2">
//         <label className="text-sm text-gray-700 dark:text-gray-200">
//           Website (Optional):
//         </label>
//         <input
//           placeholder="Enter website URL"
//           className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
//           aria-label="Website"
//         />
//       </div>
//     </div>
//   );
// }
