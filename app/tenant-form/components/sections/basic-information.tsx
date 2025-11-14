"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// ✅ Wrap in forwardRef so parent can trigger validation
const BasicInformationSection = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    tenantName: "",
    email: "",
    description: "",
    subdomain: "",
    logo: "",
    banner: "",
    aboutTitle: "",
    aboutSubtitle: "",
    mainHeadline: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // 🔹 Expose validate() to parent via ref
  useImperativeHandle(ref, () => ({
    validate: () => {
      const requiredFields = [
        "tenantName",
        "email",
        "subdomain",
        "logo",
        "banner",
        "aboutTitle",
        "aboutSubtitle",
        "mainHeadline",
      ];

      const newErrors: Record<string, boolean> = {};
      requiredFields.forEach((key) => {
        if (!formData[key as keyof typeof formData]) newErrors[key] = true;
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
  }));

  // 🧩 Handle text & textarea inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  // 🖼️ Handle Logo Upload
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

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logo: "" }));
  };

  // 🖼️ Handle Banner Upload
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

  const handleRemoveBanner = () => {
    setFormData((prev) => ({ ...prev, banner: "" }));
  };

  // 🧠 Local Save (for that section only)
  const handleSave = () => {
    const newErrors: Record<string, boolean> = {};
    const requiredFields = [
      "tenantName",
      "email",
      "subdomain",
      "logo",
      "banner",
    ];
    requiredFields.forEach((key) => {
      if (!formData[key as keyof typeof formData]) newErrors[key] = true;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("✅ Basic Information saved successfully", formData);
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

      {/* Tenant Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tenant Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="tenantName"
          placeholder="Enter tenant name"
          value={formData.tenantName}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
            ${
              errors.tenantName
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
            ${
              errors.email
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
        />
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Logo <span className="text-red-500">*</span>
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

      {/* About Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          About Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="aboutTitle"
          placeholder="Enter main about title"
          value={formData.aboutTitle}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
      ${
        errors.aboutTitle
          ? "border-red-500"
          : "border-gray-300 dark:border-gray-700"
      } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
        />
      </div>

      {/* About Subtitle */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          About Subtitle <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="aboutSubtitle"
          placeholder="Enter a short subtitle"
          value={formData.aboutSubtitle}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
      ${
        errors.aboutSubtitle
          ? "border-red-500"
          : "border-gray-300 dark:border-gray-700"
      } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
        />
      </div>

      {/* Main Headline */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Main Headline <span className="text-red-500">*</span>
        </label>
        <textarea
          name="mainHeadline"
          placeholder="Write your about page headline"
          value={formData.mainHeadline}
          onChange={handleChange}
          rows={2}
          className={`w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#D19537]
      ${
        errors.mainHeadline
          ? "border-red-500"
          : "border-gray-300 dark:border-gray-700"
      } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          placeholder="Write a short description about the tenant"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#D19537]
            ${
              errors.description
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
        />
      </div>

      {/* Subdomain */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Subdomain <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="subdomain"
          placeholder="tenanthome.yourdomain.com"
          value={formData.subdomain}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
            ${
              errors.subdomain
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
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

BasicInformationSection.displayName = "BasicInformationSection";
export default BasicInformationSection;
