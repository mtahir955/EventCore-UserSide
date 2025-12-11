"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const BasicInformationSection = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    logo: "",
    banner: "",

    /* ⭐ Features (Editable) */
    passServiceFee: false,
    absorbFee: false,
    allowTransfers: false,
    manualCreditAdjust: false,
    paymentPlans: false,
    showLoginHelp: false,
    creditExpiration: false,
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  /* ---------------------------------------------
     EXPOSE TO PARENT (validate + getData)
  ---------------------------------------------- */
  useImperativeHandle(ref, () => ({
    validate: () => {
      const requiredFields = ["logo", "banner"];
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

  /* ---------------------------------------------
     INPUT HANDLERS
  ---------------------------------------------- */

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        logo: event.target?.result as string,
      }));
      setErrors((prev) => ({ ...prev, logo: false }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => setFormData((prev) => ({ ...prev, logo: "" }));

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        banner: event.target?.result as string,
      }));
      setErrors((prev) => ({ ...prev, banner: false }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBanner = () =>
    setFormData((prev) => ({ ...prev, banner: "" }));

  const handleSave = () => {
    const newErrors: Record<string, boolean> = {};
    const requiredFields = ["logo", "banner"];

    requiredFields.forEach((key) => {
      if (!formData[key as keyof typeof formData]) newErrors[key] = true;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("✅ Saved Successfully", formData);
    } else {
      console.log("⚠️ Missing Required Fields");
    }
  };

  /* ---------------------------------------------
     UI STARTS
  ---------------------------------------------- */
  return (
    <div className="w-full max-w-[100%] mt-14 sm:mt-0 bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileUp size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Basic Information
        </h3>
      </div>

      {/* ---------------- LOGO UPLOAD ---------------- */}
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

      {/* ---------------- BANNER UPLOAD ---------------- */}
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

      {/* ---------------- FEATURES ---------------- */}
      <div className="space-y-3 pt-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Features
        </h4>

        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          {[
            ["passServiceFee", "Pass service fee to customer"],
            ["absorbFee", "Absorb fee from earnings"],
            ["allowTransfers", "Allow ticket transfers"],
            ["manualCreditAdjust", "Enable manual credit adjustments"],
            ["paymentPlans", "Allow Payment Plan Options for Tickets"],
            ["showLoginHelp", "Show Help Center / Login Help Links"],
            ["creditExpiration", "Enable credit expiration"],
          ].map(([name, label]) => (
            <label
              key={name}
              className="flex gap-3 items-center cursor-pointer group"
            >
              <input
                type="checkbox"
                name={name}
                checked={formData[name]}
                onChange={handleCheckbox}
                className="h-4 w-5 rounded-md border border-gray-400 dark:border-gray-600 
                  checked:bg-[#D19537] checked:border-[#D19537] 
                  accent-[#D19537] transition-all"
              />
              <span className="group-hover:text-[#D19537] transition">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* ---------------- SAVE BUTTON ---------------- */}
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
