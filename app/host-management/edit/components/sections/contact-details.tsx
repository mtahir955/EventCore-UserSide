"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { City } from "country-state-city";

const ContactDetailsSection = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    countryCode: "+1",
    city: "",
    pincode: "",
    address: "",
    nationalId: "",
  });

  const usCities = City.getCitiesOfCountry("US") ?? [];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const countries = [
    { code: "+1", name: "United States", flag: "https://flagcdn.com/us.svg" },
    { code: "+44", name: "United Kingdom", flag: "https://flagcdn.com/gb.svg" },
  ];

  const selectedCountry =
    countries.find((c) => c.code === formData.countryCode) || countries[0];

  const handleSelectCountry = (countryCode: string) => {
    setFormData((prev) => ({ ...prev, countryCode }));
    setDropdownOpen(false);
    setErrors((prev) => ({ ...prev, countryCode: false }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  // 🔹 Expose validate() to parent
  // useImperativeHandle(ref, () => ({
  //   validate: () => {
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
  //     return Object.keys(newErrors).length === 0;
  //   },
  //   getData: () => formData
  // }));

  useImperativeHandle(ref, () => ({
    validate: () => {
      const newErrors: Record<string, boolean> = {};

      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = true;
      if (!formData.city) newErrors.city = true;
      if (!formData.pincode.trim()) newErrors.pincode = true;
      if (!formData.address.trim()) newErrors.address = true;

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },

    getData: () => formData,

    setData: (data: any) => {
      const contact = data.contact ?? data;

      setFormData((prev) => ({
        ...prev,
        phoneNumber: contact?.phone ?? "",
        countryCode: contact?.countryCode ?? "+1",
        city: contact?.city ?? "",
        pincode: contact?.postalCode ?? "",
        address: contact?.address ?? "",
        nationalId: contact?.nationalIdNumber ?? "",
      }));
    },
  }));

  // 🔍 Local Save
  const handleSave = () => {
    const requiredFields = [
      "phoneNumber",
      "countryCode",
      "city",
      "pincode",
      "address",
    ];
    const newErrors: Record<string, boolean> = {};
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) newErrors[field] = true;
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
          {/* Custom Dropdown */}
          <div
            className={`relative w-full sm:w-44 ${
              errors.countryCode ? "border border-red-500 rounded-lg" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#101010] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D19537]"
            >
              <div className="flex items-center gap-2">
                <img
                  src={selectedCountry.flag}
                  alt="flag"
                  className="h-4 w-6 object-cover rounded-sm"
                />
                <span>{selectedCountry.code}</span>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelectCountry(country.code)}
                    className={`flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-[#222] transition ${
                      formData.countryCode === country.code
                        ? "bg-gray-100 dark:bg-[#222]"
                        : ""
                    }`}
                  >
                    <img
                      src={country.flag}
                      alt={country.name}
                      className="h-4 w-6 object-cover rounded-sm"
                    />
                    <span className="text-gray-900 dark:text-gray-200">
                      {country.code} {country.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Phone Input */}
          <input
            type="tel"
            name="phoneNumber"
            placeholder="125-559-8852"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537] 
              ${
                errors.phoneNumber
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
          />
        </div>
      </div>

      {/* City & Pincode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* City */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            City / Town <span className="text-red-500">*</span>
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
    ${errors.city ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
    bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
          >
            <option value="">Select City</option>
            {usCities.map((city) => (
              <option key={`${city.name}-${city.stateCode}`} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Pincode */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pincode"
            placeholder="78080"
            value={formData.pincode}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
              ${
                errors.pincode
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
          />
        </div>
      </div>

      {/* Tenant Address */}
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
            ${
              errors.address
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
        />
      </div>

      {/* National ID (Optional) */}
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
