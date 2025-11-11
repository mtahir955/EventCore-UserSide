"use client";

import { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactDetailsSection() {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    countryCode: "+1",
    city: "California",
    pincode: "",
    address: "",
    nationalId: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const countries = [
    { code: "+1", name: "United States", flag: "https://flagcdn.com/us.svg" },
    { code: "+44", name: "United Kingdom", flag: "https://flagcdn.com/gb.svg" },
    // { code: "+91", name: "India", flag: "https://flagcdn.com/in.svg" },
    // { code: "+92", name: "Pakistan", flag: "https://flagcdn.com/pk.svg" },
  ];

  const selectedCountry =
    countries.find((c) => c.code === formData.countryCode) || countries[0];

  const handleSelectCountry = (countryCode: string) => {
    setFormData((prev) => ({ ...prev, countryCode }));
    setDropdownOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          Phone Number
        </label>

        <div className="flex flex-col sm:flex-row gap-3 relative">
          {/* Custom Dropdown */}
          <div className="relative w-full sm:w-44">
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

            {/* Dropdown List */}
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
            className="w-full flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]"
          />
        </div>
      </div>

      {/* City & Pincode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            City / Town
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]"
          >
            <option value="California">California</option>
            <option value="New York">New York</option>
            <option value="Texas">Texas</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pincode
          </label>
          <input
            type="text"
            name="pincode"
            placeholder="78080"
            value={formData.pincode}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]"
          />
        </div>
      </div>

      {/* Tenant Address */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tenant Address
        </label>
        <input
          type="text"
          name="address"
          placeholder="Enter complete address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]"
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
        <Button className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-2 rounded-lg transition">
          Save
        </Button>
      </div>
    </div>
  );
}
