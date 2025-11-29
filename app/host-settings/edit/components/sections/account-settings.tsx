"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOST_Tenant_ID } from "@/config/hostTenantId";
import { API_BASE_URL } from "../../../../../config/apiConfig"; // ADD THIS IMPORT
import { toast } from "react-hot-toast";
import axios from "axios";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";

export default function AccountSettingsSection() {
  // Separate state for account status and theme
  const [formData, setFormData] = useState({
    accountStatus: "active", // Active / Inactive
    termsAndConditions: "",
  });

  const [formTheme, setFormTheme] = useState({
    themeStatus: "light", // Light / Dark
  });

  // Handle text/textarea input for formData
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle theme change
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormTheme({ themeStatus: value });
    // Optional: trigger your theme logic here (if using next-themes)
    // theme.setTheme(value === "light" ? "light" : "dark");
  };
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const handlePasswordSubmit = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const token = localStorage.getItem("hostToken");

      if (!token) {
        toast.error("No admin token found. Please log in again.", {
          style: {
            background: "#101010",
            color: "#fff",
            border: "1px solid #D19537",
          },
        });
        return;
      }

      await axios.put(
        `${API_BASE_URL}/auth/change-password`,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-tenant-id": HOST_Tenant_ID,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Password updated successfully!", {
        style: {
          background: "#101010",
          color: "#fff",
          border: "1px solid #D19537",
        },
      });

      setShowChangePasswordModal(false);
    } catch (error: any) {
      console.error("Password update error:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to update password. Please try again.";

      toast.error(message, {
        style: {
          background: "#101010",
          color: "#fff",
          border: "1px solid red",
        },
      });
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings2 size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </h3>
      </div>
      {/* Change Password Button */}
      <button
        onClick={() => setShowChangePasswordModal(true)}
        className="px-4 py-2 bg-[#D19537] text-white rounded-lg hover:bg-[#c2872f]"
      >
        Change Password
      </button>
      {/* Choose Theme */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Choose Theme
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
      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-2 rounded-lg transition">
          Save
        </Button>
      </div>
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
}
