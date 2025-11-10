"use client";

import type React from "react";

import { useState } from "react";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DatabaseConfigurationSection() {
  const [formData, setFormData] = useState({
    dbName: "",
    dbUsername: "",
    dbPassword: "",
    dbSmtp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white dark:bg-[#101010] rounded-lg border border-border dark:border-gray-700 p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Database size={24} className="text-foreground" />
        <h3 className="text-xl font-bold text-foreground">
          Database Configuration
        </h3>
      </div>
      {/* Database Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Database Name:
        </label>
        <input
          type="text"
          name="dbName"
          placeholder="Enter database name"
          value={formData.dbName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-input bg-background text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      {/* Database Username */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Database Username:
        </label>
        <input
          type="text"
          name="dbUsername"
          placeholder="Enter DB username"
          value={formData.dbUsername}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-input bg-background text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      {/* Database Password */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Database Password (optional):
        </label>
        <input
          type="password"
          name="dbPassword"
          placeholder="Enter DB password"
          value={formData.dbPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-input bg-background text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      {/* Database IP & Port */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Database SMTP (optional):
        </label>
        <input
          type="text"
          name="dbIpPort"
          placeholder="Enter DB SMTP"
          value={formData.dbSmtp}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-input bg-background text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-2 rounded-lg transition">
          Save
        </Button>
      </div>{" "}
    </div>
  );
}
