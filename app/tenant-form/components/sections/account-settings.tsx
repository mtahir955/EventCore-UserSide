"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const AccountSettingsSection = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    accountStatus: "", // Active / Inactive
    termsAndConditions: "",
  });

  const [formTheme, setFormTheme] = useState({
    themeStatus: "", // Light / Dark
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // 🔹 Expose validate() to parent
  useImperativeHandle(ref, () => ({
    validate: () => {
      const newErrors: Record<string, boolean> = {};
      if (!formData.accountStatus) newErrors.accountStatus = true;
      if (!formTheme.themeStatus) newErrors.themeStatus = true;
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
  }));

  // Handle text / textarea input for formData
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  // Handle theme change
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormTheme({ themeStatus: value });
    setErrors((prev) => ({ ...prev, themeStatus: false }));
  };

  // Local validation for Save button
  const handleSave = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.accountStatus) newErrors.accountStatus = true;
    if (!formTheme.themeStatus) newErrors.themeStatus = true;
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("✅ All required fields filled:", {
        ...formData,
        ...formTheme,
      });
    } else {
      console.log("⚠️ Please fill all required fields");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings2 size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </h3>
      </div>

      {/* Account Status */}
      <div
        className={`space-y-2 rounded-lg p-3 ${
          errors.accountStatus ? "border border-red-500" : ""
        }`}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Account Status <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="accountStatus"
              value="active"
              checked={formData.accountStatus === "active"}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded text-sm font-medium">
              Active
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="accountStatus"
              value="inactive"
              checked={formData.accountStatus === "inactive"}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium">
              Inactive
            </span>
          </label>
        </div>
      </div>

      {/* Choose Theme */}
      <div
        className={`space-y-2 rounded-lg p-3 ${
          errors.themeStatus ? "border border-red-500" : ""
        }`}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Choose Theme <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="themeStatus"
              value="light"
              checked={formTheme.themeStatus === "light"}
              onChange={handleThemeChange}
              className="w-4 h-4"
            />
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded text-sm font-medium">
              Light
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="themeStatus"
              value="dark"
              checked={formTheme.themeStatus === "dark"}
              onChange={handleThemeChange}
              className="w-4 h-4"
            />
            <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium">
              Dark
            </span>
          </label>
        </div>
      </div>

      {/* Terms & Conditions (Optional) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Terms & Conditions (optional)
        </label>
        <textarea
          name="termsAndConditions"
          placeholder="Enter or link terms & conditions"
          value={formData.termsAndConditions}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537] resize-none"
        />
      </div>

      {/* Debug info */}
      <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] text-sm text-gray-700 dark:text-gray-300">
        <p>
          <strong>Status:</strong> {formData.accountStatus || "Not selected"}
        </p>
        <p>
          <strong>Theme:</strong> {formTheme.themeStatus || "Not selected"}
        </p>
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

AccountSettingsSection.displayName = "AccountSettingsSection";
export default AccountSettingsSection;

