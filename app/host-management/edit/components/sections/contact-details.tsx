"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { City } from "country-state-city";
import { countries as countriesList } from "countries-list";

// shadcn/ui
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

type Errors = Record<string, boolean>;

type CountryMeta = {
  iso2: string;
  name: string;
  callingCode: string; // +92
  flag: string;
};

type LocationOption = {
  key: string; // city-country unique
  label: string; // "City, Country"
  city: string; // "City"
  countryIso2: string;
  countryName: string;
  callingCode: string;
  flag: string;
};

const ContactDetailsSection = forwardRef((props: any, ref: any) => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    countryCode: "+1", // ✅ keep same field name for your backend payload
    countryIso2: "US",
    city: "", // ✅ will store FULL "City, Country"
    pincode: "",
    address: "",
    nationalId: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  // Location dropdown state
  const [openLocation, setOpenLocation] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<LocationOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Cache cities per country (performance)
  const cityCacheRef = useRef<Map<string, string[]>>(new Map());

  // Countries list (one-time)
  const allCountries: CountryMeta[] = useMemo(() => {
    const entries = Object.entries(countriesList) as Array<
      [string, { name: string; phone: string | string[] }]
    >;

    return entries
      .map(([iso2, c]) => {
        const phone = Array.isArray(c.phone) ? c.phone[0] : c.phone;
        const callingCode = phone ? `+${phone}` : "";
        const flag = `https://flagcdn.com/${iso2.toLowerCase()}.svg`;
        return { iso2, name: c.name, callingCode, flag };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // ✅ derive selected country for flag UI
  const selectedCountryMeta = useMemo(() => {
    // prefer countryIso2 if set
    const byIso = allCountries.find((c) => c.iso2 === formData.countryIso2);
    if (byIso) return byIso;

    // fallback try to match countryCode (+92) if iso not known
    const byCode = allCountries.find(
      (c) => c.callingCode === formData.countryCode,
    );
    return (
      byCode || {
        iso2: "US",
        name: "United States",
        callingCode: "+1",
        flag: "https://flagcdn.com/us.svg",
      }
    );
  }, [allCountries, formData.countryIso2, formData.countryCode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  // 🔎 Search worldwide City/Country (on-demand, not heavy)
  useEffect(() => {
    let cancelled = false;

    const q = locationQuery.trim().toLowerCase();
    if (q.length < 2) {
      setLocationResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const t = setTimeout(() => {
      if (cancelled) return;

      const results: LocationOption[] = [];
      const LIMIT = 200;

      for (const country of allCountries) {
        if (results.length >= LIMIT) break;

        // get cached cities for country
        let cities = cityCacheRef.current.get(country.iso2);
        if (!cities) {
          const raw = City.getCitiesOfCountry(country.iso2) ?? [];
          cities = Array.from(new Set(raw.map((c) => c.name))).sort((a, b) =>
            a.localeCompare(b),
          );
          cityCacheRef.current.set(country.iso2, cities);
        }

        // if country name matches query, show small sample
        if (country.name.toLowerCase().includes(q)) {
          for (const city of cities.slice(0, 20)) {
            if (results.length >= LIMIT) break;
            results.push({
              key: `${city}-${country.iso2}`,
              label: `${city}, ${country.name}`,
              city,
              countryIso2: country.iso2,
              countryName: country.name,
              callingCode: country.callingCode,
              flag: country.flag,
            });
          }
        }

        // city matches
        const matched = cities
          .filter((c) => c.toLowerCase().includes(q))
          .slice(0, 20);
        for (const city of matched) {
          if (results.length >= LIMIT) break;
          results.push({
            key: `${city}-${country.iso2}`,
            label: `${city}, ${country.name}`,
            city,
            countryIso2: country.iso2,
            countryName: country.name,
            callingCode: country.callingCode,
            flag: country.flag,
          });
        }
      }

      // unique
      const uniq = Array.from(new Map(results.map((r) => [r.key, r])).values());

      if (!cancelled) {
        setLocationResults(uniq);
        setIsSearching(false);
      }
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [locationQuery, allCountries]);

  // ✅ on select: save FULL "City, Country" into formData.city (so payload saves full too)
  const handleSelectLocation = (opt: LocationOption) => {
    setFormData((prev) => ({
      ...prev,
      countryIso2: opt.countryIso2,
      countryCode: opt.callingCode || prev.countryCode,
      city: opt.label, // ✅ FULL label
    }));

    setErrors((prev) => ({ ...prev, city: false, countryCode: false }));
    setOpenLocation(false);
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      const newErrors: Errors = {};

      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = true;
      if (!formData.countryCode) newErrors.countryCode = true;
      if (!formData.city) newErrors.city = true;
      if (!formData.pincode.trim()) newErrors.pincode = true;
      if (!formData.address.trim()) newErrors.address = true;

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },

    getData: () => formData,

    // ✅ Edit mode: populate saved data
    setData: (data: any) => {
      const contact = data.contact ?? data;

      const savedCity = contact?.city ?? ""; // could be "10 de Abril, Mexico" OR just "10 de Abril"
      const savedCountryCode =
        contact?.countryCode ?? contact?.phoneCountryCode ?? "+1";

      // If city is already "City, Country" try to derive ISO2 (optional)
      // We match by country name at end (best-effort, safe)
      let derivedIso2 = "";
      if (typeof savedCity === "string" && savedCity.includes(",")) {
        const countryName = savedCity
          .split(",")
          .slice(1)
          .join(",")
          .trim()
          .toLowerCase();
        const match = allCountries.find(
          (c) => c.name.toLowerCase() === countryName,
        );
        derivedIso2 = match?.iso2 || "";
      }

      setFormData((prev) => ({
        ...prev,
        phoneNumber: contact?.phone ?? contact?.contactPhone ?? "",
        countryCode: savedCountryCode,
        countryIso2: derivedIso2 || prev.countryIso2, // keep previous if not derived
        city: savedCity,
        pincode: contact?.postalCode ?? contact?.pincode ?? "",
        address: contact?.address ?? "",
        nationalId: contact?.nationalIdNumber ?? contact?.nationalId ?? "",
      }));
    },
  }));

  const handleSave = () => {
    const requiredFields = [
      "phoneNumber",
      "countryCode",
      "city",
      "pincode",
      "address",
    ];
    const newErrors: Errors = {};
    requiredFields.forEach((field) => {
      if (!(formData as any)[field]) newErrors[field] = true;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("✅ All required fields filled:", formData);
    } else {
      console.log("⚠️ Please fill all required fields");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 md:p-8 space-y-6 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MapPin size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Contact Details
        </h3>
      </div>

      {/* Phone Number */}
      <div className="space-y-2 relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Phone Number <span className="text-red-500">*</span>
        </label>

        <div className="flex flex-col sm:flex-row gap-3 relative">
          {/* Country Code display (auto updates by location selection) */}
          <div
            className={`w-full sm:w-44 border rounded-lg px-3 py-2 flex items-center gap-2 bg-white dark:bg-[#101010]
              ${errors.countryCode ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
          >
            <img
              src={selectedCountryMeta.flag}
              alt="flag"
              className="h-4 w-6 object-cover rounded-sm"
            />
            <span className="text-gray-900 dark:text-white">
              {formData.countryCode}
            </span>
          </div>

          {/* Phone Input */}
          <input
            type="tel"
            name="phoneNumber"
            placeholder="125-559-8852"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
              ${errors.phoneNumber ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
              bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
          />
        </div>
      </div>

      {/* City/Country + Pincode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ✅ ONE dropdown: City, Country */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            City / Country <span className="text-red-500">*</span>
          </label>

          <Popover open={openLocation} onOpenChange={setOpenLocation}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`w-full px-4 py-2 border rounded-lg flex items-center justify-between
                  focus:outline-none focus:ring-2 focus:ring-[#D19537]
                  ${errors.city ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
                  bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
              >
                <span
                  className={`text-left ${formData.city ? "" : "text-gray-400"}`}
                >
                  {formData.city ? formData.city : "Search city or country..."}
                </span>
                <ChevronDown size={16} className="opacity-70" />
              </button>
            </PopoverTrigger>

            <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
              <Command>
                <CommandInput
                  placeholder="Type: lahore / pakistan / london..."
                  value={locationQuery}
                  onValueChange={setLocationQuery}
                />

                <CommandEmpty>
                  {isSearching
                    ? "Searching..."
                    : "No results found (type 2+ letters)."}
                </CommandEmpty>

                <CommandGroup className="max-h-64 overflow-y-auto">
                  {locationResults.map((opt) => (
                    <CommandItem
                      key={opt.key}
                      value={opt.label}
                      onSelect={() => handleSelectLocation(opt)}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={opt.flag}
                        alt="flag"
                        className="h-4 w-6 object-cover rounded-sm"
                      />
                      <span>{opt.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Pincode */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pincode"
            placeholder="78080"
            value={formData.pincode}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
              ${errors.pincode ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
              bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tenant Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          placeholder="Enter complete address"
          value={formData.address}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
            ${errors.address ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
            bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
        />
      </div>

      {/* National ID */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          National ID Number (optional)
        </label>
        <input
          type="text"
          name="nationalId"
          placeholder="Enter CNIC / National ID"
          value={formData.nationalId}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-2 rounded-lg transition"
        >
          Save
        </Button>
      </div>
    </div>
  );
});

ContactDetailsSection.displayName = "ContactDetailsSection";
export default ContactDetailsSection;

// "use client";

// import { forwardRef, useImperativeHandle, useState } from "react";
// import { MapPin, ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { City } from "country-state-city";

// const ContactDetailsSection = forwardRef((props, ref) => {
//   const [formData, setFormData] = useState({
//     phoneNumber: "",
//     countryCode: "+1",
//     city: "",
//     pincode: "",
//     address: "",
//     nationalId: "",
//   });

//   const usCities = City.getCitiesOfCountry("US") ?? [];

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [errors, setErrors] = useState<Record<string, boolean>>({});

//   const countries = [
//     { code: "+1", name: "United States", flag: "https://flagcdn.com/us.svg" },
//     { code: "+44", name: "United Kingdom", flag: "https://flagcdn.com/gb.svg" },
//   ];

//   const selectedCountry =
//     countries.find((c) => c.code === formData.countryCode) || countries[0];

//   const handleSelectCountry = (countryCode: string) => {
//     setFormData((prev) => ({ ...prev, countryCode }));
//     setDropdownOpen(false);
//     setErrors((prev) => ({ ...prev, countryCode: false }));
//   };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: false }));
//   };

//   // 🔹 Expose validate() to parent
//   // useImperativeHandle(ref, () => ({
//   //   validate: () => {
//   //     const requiredFields = [
//   //       "phoneNumber",
//   //       "countryCode",
//   //       "city",
//   //       "pincode",
//   //       "address",
//   //     ];
//   //     const newErrors: Record<string, boolean> = {};
//   //     requiredFields.forEach((field) => {
//   //       if (!formData[field as keyof typeof formData]) newErrors[field] = true;
//   //     });
//   //     setErrors(newErrors);
//   //     return Object.keys(newErrors).length === 0;
//   //   },
//   //   getData: () => formData
//   // }));

//   useImperativeHandle(ref, () => ({
//     validate: () => {
//       const newErrors: Record<string, boolean> = {};

//       if (!formData.phoneNumber.trim()) newErrors.phoneNumber = true;
//       if (!formData.city) newErrors.city = true;
//       if (!formData.pincode.trim()) newErrors.pincode = true;
//       if (!formData.address.trim()) newErrors.address = true;

//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//     },

//     getData: () => formData,

//     setData: (data: any) => {
//       const contact = data.contact ?? data;

//       setFormData((prev) => ({
//         ...prev,
//         phoneNumber: contact?.phone ?? "",
//         countryCode: contact?.countryCode ?? "+1",
//         city: contact?.city ?? "",
//         pincode: contact?.postalCode ?? "",
//         address: contact?.address ?? "",
//         nationalId: contact?.nationalIdNumber ?? "",
//       }));
//     },
//   }));

//   // 🔍 Local Save
//   const handleSave = () => {
//     const requiredFields = [
//       "phoneNumber",
//       "countryCode",
//       "city",
//       "pincode",
//       "address",
//     ];
//     const newErrors: Record<string, boolean> = {};
//     requiredFields.forEach((field) => {
//       if (!formData[field as keyof typeof formData]) newErrors[field] = true;
//     });
//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       console.log("✅ All required fields filled:", formData);
//     } else {
//       console.log("⚠️ Please fill all required fields");
//     }
//   };

//   return (
//     <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 md:p-8 space-y-6 shadow-sm transition-all">
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <MapPin size={24} className="text-gray-700 dark:text-white" />
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//           Contact Details
//         </h3>
//       </div>

//       {/* Phone Number */}
//       <div className="space-y-2 relative">
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//           Phone Number <span className="text-red-500">*</span>
//         </label>

//         <div className="flex flex-col sm:flex-row gap-3 relative">
//           {/* Custom Dropdown */}
//           <div
//             className={`relative w-full sm:w-44 ${
//               errors.countryCode ? "border border-red-500 rounded-lg" : ""
//             }`}
//           >
//             <button
//               type="button"
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//               className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#101010] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D19537]"
//             >
//               <div className="flex items-center gap-2">
//                 <img
//                   src={selectedCountry.flag}
//                   alt="flag"
//                   className="h-4 w-6 object-cover rounded-sm"
//                 />
//                 <span>{selectedCountry.code}</span>
//               </div>
//               <ChevronDown
//                 size={16}
//                 className={`transition-transform ${
//                   dropdownOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {dropdownOpen && (
//               <div className="absolute z-50 mt-1 w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
//                 {countries.map((country) => (
//                   <button
//                     key={country.code}
//                     type="button"
//                     onClick={() => handleSelectCountry(country.code)}
//                     className={`flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-[#222] transition ${
//                       formData.countryCode === country.code
//                         ? "bg-gray-100 dark:bg-[#222]"
//                         : ""
//                     }`}
//                   >
//                     <img
//                       src={country.flag}
//                       alt={country.name}
//                       className="h-4 w-6 object-cover rounded-sm"
//                     />
//                     <span className="text-gray-900 dark:text-gray-200">
//                       {country.code} {country.name}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Phone Input */}
//           <input
//             type="tel"
//             name="phoneNumber"
//             placeholder="125-559-8852"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             className={`w-full flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
//               ${
//                 errors.phoneNumber
//                   ? "border-red-500"
//                   : "border-gray-300 dark:border-gray-700"
//               } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
//           />
//         </div>
//       </div>

//       {/* City & Pincode */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {/* City */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//             City / Town <span className="text-red-500">*</span>
//           </label>
//           <select
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
//     ${errors.city ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
//     bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
//           >
//             <option value="">Select City</option>
//             {usCities.map((city) => (
//               <option key={`${city.name}-${city.stateCode}`} value={city.name}>
//                 {city.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Pincode */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//             Postal Code <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             name="pincode"
//             placeholder="78080"
//             value={formData.pincode}
//             onChange={handleChange}
//             className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
//               ${
//                 errors.pincode
//                   ? "border-red-500"
//                   : "border-gray-300 dark:border-gray-700"
//               } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
//           />
//         </div>
//       </div>

//       {/* Tenant Address */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//           Tenant Address <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="text"
//           name="address"
//           placeholder="Enter complete address"
//           value={formData.address}
//           onChange={handleChange}
//           className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
//             ${
//               errors.address
//                 ? "border-red-500"
//                 : "border-gray-300 dark:border-gray-700"
//             } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
//         />
//       </div>

//       {/* National ID (Optional) */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//           National ID Number (optional)
//         </label>
//         <input
//           type="text"
//           name="nationalId"
//           placeholder="Enter CNIC / National ID"
//           value={formData.nationalId}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]"
//         />
//       </div>

//       {/* Save Button */}
//       <div className="flex justify-end">
//         <Button
//           onClick={handleSave}
//           className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-2 rounded-lg transition"
//         >
//           Save
//         </Button>
//       </div>
//     </div>
//   );
// });

// ContactDetailsSection.displayName = "ContactDetailsSection";
// export default ContactDetailsSection;
