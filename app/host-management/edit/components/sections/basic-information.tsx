"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const BasicInformationSection = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    logo: "",
    banner: "",

    serviceFeeType: null, // percentage | flat
    serviceFeeValue: "", // numeric input
    defaultFeeHandling: {
      passToBuyer: true,
      absorbByTenant: true,
    },

    /* Payment Plan → Credit Expiry */
    creditExpiryEnabled: false,
    creditExpiryValue: "",
    creditExpiryUnit: "days", // days | months

    /* Credit System Rules */
    minOrderEligibilityEnabled: false,
    minOrderValue: "",

    maxInstallmentsEnabled: false,
    maxInstallments: "",

    /* ⭐ New Feature Toggles */
    serviceFee: false,
    allowTransfers: false,
    creditAdjust: false,
    paymentPlans: false,
    showLoginHelp: false,
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useImperativeHandle(ref, () => ({
    validate: () => {
      const requiredFields = [
        "logo",
        "banner",
      ];
      const newErrors: Record<string, boolean> = {};

      requiredFields.forEach((key) => {
        if (!formData[key as keyof typeof formData]) {
          newErrors[key] = true;
        }
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },

    getData: () => formData,
  }));

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData((prev) => {
      // Payment plans OFF → reset expiry
      if (name === "paymentPlans" && !checked) {
        return {
          ...prev,
          paymentPlans: false,
          creditExpiryEnabled: false,
          creditExpiryValue: "",
          creditExpiryUnit: "days",
        };
      }

      // Credit system OFF → reset credit rules
      if (name === "creditAdjust" && !checked) {
        return {
          ...prev,
          creditAdjust: false,
          minOrderEligibilityEnabled: false,
          minOrderValue: "",
          maxInstallmentsEnabled: false,
          maxInstallments: "",
        };
      }

      return { ...prev, [name]: checked };
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          logo: event.target?.result as string,
        }));
        setErrors((prev) => ({ ...prev, logo: false }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => setFormData((prev) => ({ ...prev, logo: "" }));

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          banner: event.target?.result as string,
        }));
        setErrors((prev) => ({ ...prev, banner: false }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBanner = () =>
    setFormData((prev) => ({ ...prev, banner: "" }));

  const handleSave = () => {
    const newErrors: Record<string, boolean> = {};
    const requiredFields = [
      "logo",
      "banner",
    ];

    requiredFields.forEach((key) => {
      if (!formData[key as keyof typeof formData]) newErrors[key] = true;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("✅ Basic Information update successfully", formData);
    } else {
      console.log("⚠️ Please fill all required fields");
    }
  };

  return (
    <div className="w-full max-w-[100%] mt-14 sm:mt-0 bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileUp size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Basic Information
        </h3>
      </div>
      {/* Logo Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Logo (152 × 48px) <span className="text-red-500">*</span>
        </label>

        {formData.logo ? (
          <div
            className={`relative w-32 h-32 rounded-lg overflow-hidden border ${
              errors.logo
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
          >
            <img
              src={formData.logo}
              alt="Logo Preview"
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-black transition"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            className={`relative w-full sm:w-1/2 lg:w-1/3 ${
              errors.logo ? "border-red-500 border rounded-lg" : ""
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222] cursor-pointer transition">
              <FileUp
                size={18}
                className="text-gray-600 dark:text-gray-300 mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Upload logo
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Banner Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Banner (1425 × 500px) <span className="text-red-500">*</span>
        </label>

        {formData.banner ? (
          <div
            className={`relative w-full sm:w-3/4 lg:w-2/3 h-40 rounded-lg overflow-hidden border ${
              errors.banner
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
          >
            <img
              src={formData.banner}
              alt="Banner Preview"
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={handleRemoveBanner}
              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black transition"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            className={`relative w-full sm:w-3/4 lg:w-2/3 ${
              errors.banner ? "border-red-500 border rounded-lg" : ""
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222] cursor-pointer transition">
              <FileUp
                size={18}
                className="text-gray-600 dark:text-gray-300 mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Upload banner
              </span>
            </div>
          </div>
        )}
      </div>
      {/* ⭐ NEW FEATURES SECTION — after subdomain */}
      <div className="space-y-3 pt-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Features
        </h4>

        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <label className="flex gap-3 items-center cursor-pointer group">
            <input
              type="checkbox"
              name="serviceFee"
              checked={formData.serviceFee}
              onChange={handleCheckbox}
              className="h-4 w-5 rounded-md border border-gray-400 dark:border-gray-600 
        checked:bg-[#D19537] checked:border-[#D19537] 
        accent-[#D19537] transition-all"
            />
            <span className="group-hover:text-[#D19537] transition">
              Service Fee Handling
            </span>
          </label>

          {/* 🔽 Service Fee Options */}
          {formData.serviceFee && (
            <div className="ml-7 mt-3 space-y-4">
              {/* Fee Type */}
              <div className="flex gap-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.serviceFeeType === "percentage"}
                    onChange={() =>
                      setFormData((p) => ({
                        ...p,
                        serviceFeeType: "percentage",
                        serviceFeeValue: "",
                      }))
                    }
                    className="accent-[#D19537]"
                  />
                  Percentage
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.serviceFeeType === "flat"}
                    onChange={() =>
                      setFormData((p) => ({
                        ...p,
                        serviceFeeType: "flat",
                        serviceFeeValue: "",
                      }))
                    }
                    className="accent-[#D19537]"
                  />
                  Flat Amount
                </label>
              </div>

              {/* Fee Value */}
              {formData.serviceFeeType && (
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={formData.serviceFeeValue}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        serviceFeeValue: e.target.value,
                      }))
                    }
                    placeholder="Enter value"
                    className="w-full pr-10 px-4 py-2 border rounded-lg focus:ring-[#D19537]"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    {formData.serviceFeeType === "percentage" ? "%" : "$"}
                  </span>
                </div>
              )}

              {/* Default Fee Handling */}
              <div className="space-y-2 text-sm pt-2">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  Default Fee Handling
                </p>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.defaultFeeHandling.passToBuyer}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        defaultFeeHandling: {
                          ...p.defaultFeeHandling,
                          passToBuyer: e.target.checked,
                        },
                      }))
                    }
                    className="accent-[#D19537]"
                  />
                  Pass fee to buyer
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.defaultFeeHandling.absorbByTenant}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        defaultFeeHandling: {
                          ...p.defaultFeeHandling,
                          absorbByTenant: e.target.checked,
                        },
                      }))
                    }
                    className="accent-[#D19537]"
                  />
                  Absorb fee by tenant
                </label>
              </div>
            </div>
          )}

          <label className="flex gap-3 items-center cursor-pointer group">
            <input
              type="checkbox"
              name="allowTransfers"
              checked={formData.allowTransfers}
              onChange={handleCheckbox}
              className="h-4 w-5 rounded-md border border-gray-400 dark:border-gray-600 
        checked:bg-[#D19537] checked:border-[#D19537] 
        accent-[#D19537] transition-all"
            />
            <span className="group-hover:text-[#D19537] transition">
              Allow ticket transfers
            </span>
          </label>

          <label className="flex gap-3 items-center cursor-pointer group">
            <input
              type="checkbox"
              name="creditAdjust"
              checked={formData.creditAdjust}
              onChange={handleCheckbox}
              className="h-4 w-5 rounded-md border border-gray-400 dark:border-gray-600 
        checked:bg-[#D19537] checked:border-[#D19537] 
        accent-[#D19537] transition-all"
            />
            <span className="group-hover:text-[#D19537] transition">
              Enable credit system
            </span>
          </label>

          {/* 🔽 Credit System Rules */}
          {formData.creditAdjust && (
            <div className="ml-7 mt-3 space-y-4">
              {/* Min Order Eligibility */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.minOrderEligibilityEnabled}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      minOrderEligibilityEnabled: e.target.checked,
                      minOrderValue: e.target.checked ? p.minOrderValue : "",
                    }))
                  }
                  className="accent-[#D19537]"
                />
                <span>Min order value for eligibility</span>
              </label>

              {formData.minOrderEligibilityEnabled && (
                <div className="max-w-xs">
                  <input
                    type="number"
                    min={0}
                    placeholder="Enter minimum order amount"
                    value={formData.minOrderValue}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        minOrderValue: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-[#D19537]
          bg-white dark:bg-[#101010]
          border-gray-300 dark:border-gray-700"
                  />
                </div>
              )}

              {/* Max Installments */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.maxInstallmentsEnabled}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      maxInstallmentsEnabled: e.target.checked,
                      maxInstallments: e.target.checked
                        ? p.maxInstallments
                        : "",
                    }))
                  }
                  className="accent-[#D19537]"
                />
                <span>Max number of installments</span>
              </label>

              {formData.maxInstallmentsEnabled && (
                <div className="max-w-xs space-y-1">
                  <input
                    type="number"
                    min={1}
                    max={4}
                    placeholder="e.g. 3"
                    value={formData.maxInstallments}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value <= 4) {
                        setFormData((p) => ({
                          ...p,
                          maxInstallments: e.target.value,
                        }));
                      }
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-[#D19537]
          bg-white dark:bg-[#101010]
          border-gray-300 dark:border-gray-700"
                  />
                  <p className="text-xs text-gray-500">
                    Maximum number of installments are 4
                  </p>
                </div>
              )}
            </div>
          )}

          <label className="flex gap-3 items-center cursor-pointer group">
            <input
              type="checkbox"
              name="paymentPlans"
              checked={formData.paymentPlans}
              onChange={handleCheckbox}
              className="h-4 w-5 rounded-md border border-gray-400 dark:border-gray-600 
        checked:bg-[#D19537] checked:border-[#D19537] 
        accent-[#D19537] transition-all"
            />
            <span className="group-hover:text-[#D19537] transition">
              Allow Payment Plan Options for Tickets
            </span>
          </label>

          {/* 🔽 Payment Plan Settings */}
          {formData.paymentPlans && (
            <div className="ml-7 mt-3 space-y-4">
              {/* Credit Expiry Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.creditExpiryEnabled}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      creditExpiryEnabled: e.target.checked,
                      creditExpiryValue: e.target.checked
                        ? p.creditExpiryValue
                        : "",
                    }))
                  }
                  className="accent-[#D19537]"
                />
                <span>Enable credit expiry</span>
              </label>

              {/* Expiry Fields */}
              {formData.creditExpiryEnabled && (
                <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                  {/* Duration */}
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 90"
                    value={formData.creditExpiryValue}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        creditExpiryValue: e.target.value,
                      }))
                    }
                    className="w-full sm:w-1/2 px-4 py-2 border rounded-lg focus:ring-[#D19537]
          bg-white dark:bg-[#101010]
          border-gray-300 dark:border-gray-700"
                  />

                  {/* Unit */}
                  <select
                    value={formData.creditExpiryUnit}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        creditExpiryUnit: e.target.value,
                      }))
                    }
                    className="w-full sm:w-1/2 px-4 py-2 border rounded-lg
          bg-white dark:bg-[#101010]
          border-gray-300 dark:border-gray-700"
                  >
                    <option value="days">Days</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <label className="flex gap-3 items-center cursor-pointer group">
            <input
              type="checkbox"
              name="showLoginHelp"
              checked={formData.showLoginHelp}
              onChange={handleCheckbox}
              className="h-4 w-5 rounded-md border border-gray-400 dark:border-gray-600 
        checked:bg-[#D19537] checked:border-[#D19537] 
        accent-[#D19537] transition-all"
            />
            <span className="group-hover:text-[#D19537] transition">
              Show Help Center / Login Help Links
            </span>
          </label>
        </div>
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

BasicInformationSection.displayName = "BasicInformationSection";
export default BasicInformationSection;
