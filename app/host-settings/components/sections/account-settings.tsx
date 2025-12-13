"use client";

import { Settings2 } from "lucide-react";

export default function AccountSettingsSection({ host }: any) {
  const themeStatus = host.theme === "light" ? "Light Theme" : "Dark Theme";

  return (
    <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings2 size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </h3>
      </div>

      {/* ⭐ STATIC CREDIT APPLICATION BOX (LIKE SCREENSHOT) */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Credit Application
        </h4>

        <div className="border rounded-xl bg-white dark:bg-[#181818] px-4 py-5 text-gray-900 dark:text-gray-100 text-[16px] leading-relaxed">
          Credit application is currently <span className="font-semibold"> enabled </span>
        </div>
      </div>

      {/* ⭐ THEME SECTION BELOW IT */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          Theme
        </label>

        <div className="px-4 py-3 bg-gray-100 dark:bg-[#181818] border rounded-lg text-gray-900 dark:text-gray-200">
          {themeStatus}
        </div>
      </div>
    </div>
  );
}
