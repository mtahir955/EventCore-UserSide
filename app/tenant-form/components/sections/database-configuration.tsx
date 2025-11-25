"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";

const DatabaseConfigurationSection = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    dbName: "",
    dbUsername: "",
    dbPassword: "",
    dbSmtp: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // 🧩 Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  // 🔹 Expose validate() to parent
  // useImperativeHandle(ref, () => ({
  //   validate: () => {
  //     const requiredFields = ["dbName", "dbUsername"];
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

      // Required fields trimmed
      if (!formData.dbName.trim()) newErrors.dbName = true;
      if (!formData.dbUsername.trim()) newErrors.dbUsername = true;

      setErrors(newErrors);

      return Object.keys(newErrors).length === 0;
    },

    getData: () => ({
      dbName: formData.dbName.trim(),
      dbUsername: formData.dbUsername.trim(),
      dbPassword: formData.dbPassword?.trim() || "",
      dbSmtp: formData.dbSmtp?.trim() || "",
    }),
  }));

  // 🧠 Local validation before saving
  const handleSave = () => {
    const requiredFields = ["dbName", "dbUsername"];
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
    <div className="bg-white dark:bg-[#101010] rounded-lg border border-border dark:border-gray-700 p-6 space-y-5 transition-all">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Database size={24} className="text-foreground dark:text-white" />
        <h3 className="text-xl font-bold text-foreground dark:text-white">
          Database Configuration
        </h3>
      </div>

      {/* Database Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground dark:text-gray-300">
          Database Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="dbName"
          placeholder="Enter database name"
          value={formData.dbName}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
            ${
              errors.dbName
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } bg-background dark:bg-[#101010] text-foreground dark:text-white`}
        />
      </div>

      {/* Database Username */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground dark:text-gray-300">
          Database Username <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="dbUsername"
          placeholder="Enter DB username"
          value={formData.dbUsername}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
            ${
              errors.dbUsername
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } bg-background dark:bg-[#101010] text-foreground dark:text-white`}
        />
      </div>

      {/* Database Password (Optional) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground dark:text-gray-300">
          Database Password (optional)
        </label>
        <input
          type="password"
          name="dbPassword"
          placeholder="Enter DB password"
          value={formData.dbPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-background dark:bg-[#101010] text-foreground dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]"
        />
      </div>

      {/* Database SMTP (Optional) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground dark:text-gray-300">
          Database SMTP (optional)
        </label>
        <input
          type="text"
          name="dbSmtp"
          placeholder="Enter DB SMTP"
          value={formData.dbSmtp}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-background dark:bg-[#101010] text-foreground dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]"
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

DatabaseConfigurationSection.displayName = "DatabaseConfigurationSection";
export default DatabaseConfigurationSection;
