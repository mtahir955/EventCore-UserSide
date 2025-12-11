"use client";

import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Settings2 } from "lucide-react";
import { useTheme } from "next-themes";
import { setThemeGlobal } from "@/utils/themeManager";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../../../../../config/apiConfig"; // ADD THIS IMPORT
import { HOST_Tenant_ID } from "@/config/hostTenantId";

const AccountSettingsSection = forwardRef(({ host }: any, ref) => {
  const { setTheme } = useTheme();

  const [theme, setThemeLocal] = useState(host.theme || "light");
  const [isCreditEnabled, setIsCreditEnabled] = useState(true);

  // ⭐ APPLY THEME INSTANTLY WHEN DROPDOWN CHANGES
  useEffect(() => {
    setTheme(theme); // next-themes
    setThemeGlobal(theme); // your global theme manager
    localStorage.setItem("hostTheme", theme);
  }, [theme]);

  // ⭐ SEND BACK CORRECT DATA
  useImperativeHandle(ref, () => ({
    getData: () => ({
      theme: theme,
    }),
  }));

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const handlePasswordSubmit = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const token = localStorage.getItem("hostToken");

      if (!token) {
        toast.error("No host token found. Please log in again.", {
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
    <div className="bg-white dark:bg-[#101010] rounded-2xl border p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings2 size={24} />
        <h3 className="text-xl font-bold">Account Settings</h3>
      </div>

      {/* Change Password Button */}
      <button
        onClick={() => setShowChangePasswordModal(true)}
        className="px-4 py-2 bg-[#D19537] text-white rounded-lg hover:bg-[#e2a64c]"
      >
        Change Password
      </button>

      {/* 🔥 CREDIT APPLICATION WITH ENABLE/DISABLE BUTTON */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">Credit Application</h4>

        <div className="border rounded-xl bg-white dark:bg-[#181818] px-4 py-5 text-gray-900 dark:text-gray-100 leading-relaxed">
          Credit application is currently{" "}
          <span className="font-semibold">
            {isCreditEnabled ? "enabled" : "disabled"}
          </span>
        </div>

        <button
          onClick={() => setIsCreditEnabled(!isCreditEnabled)}
          className="px-4 py-2 border rounded-lg bg-[#D19537] text-white hover:bg-[#e2a64c] transition"
        >
          {isCreditEnabled ? "Disable" : "Enable"}
        </button>
      </div>

      {/* THEME SELECTOR */}
      <div className="space-y-2">
        <label>Theme</label>

        <select
          value={theme}
          onChange={(e) => setThemeLocal(e.target.value)}
          className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-[#181818]"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
});

export default AccountSettingsSection;

// "use client";

// import { forwardRef, useImperativeHandle, useState } from "react";
// import { Settings2 } from "lucide-react";

// const AccountSettingsSection = forwardRef(({ host }: any, ref) => {
//   const [theme, setTheme] = useState(host.theme || "light");

//   useImperativeHandle(ref, () => ({
//     getData: () => ({
//       theme: theme,
//     }),
//   }));

//   return (
//     <div className="bg-white dark:bg-[#101010] rounded-2xl border p-6 space-y-6">
//       <div className="flex items-center gap-3">
//         <Settings2 size={24} />
//         <h3 className="text-xl font-bold">Account Settings</h3>
//       </div>

//       <div className="space-y-2">
//         <label>Theme</label>
//         <select
//           value={theme}
//           onChange={(e) => setTheme(e.target.value)}
//           className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-[#181818]"
//         >
//           <option value="light">Light</option>
//           <option value="dark">Dark</option>
//         </select>
//       </div>
//     </div>
//   );
// });

// export default AccountSettingsSection;
