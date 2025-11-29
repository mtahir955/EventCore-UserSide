"use client";

import { Settings2 } from "lucide-react";

export default function AccountSettingsSection({ host }: any) {
  const themeStatus = host.theme === "light" ? "Light Theme" : "Dark Theme";

  return (
    <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Settings2 size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </h3>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Theme</label>
        <div className="px-4 py-2 bg-gray-100 dark:bg-[#181818] border rounded-lg">
          {themeStatus}
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { Settings2 } from "lucide-react";

// export default function AccountSettingsSection() {
//   // Fixed theme (could come from backend in real scenario)
//   const themeStatus = "light"; // or "dark"

//   return (
//     <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 shadow-sm">
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <Settings2 size={24} className="text-gray-700 dark:text-white" />
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//           Account Settings
//         </h3>
//       </div>

//       {/* Show Theme Only (Non-Editable) */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//           Theme
//         </label>

//         <div
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700
//           bg-gray-100 dark:bg-[#181818] text-gray-900 dark:text-gray-300
//           rounded-lg select-none cursor-not-allowed"
//         >
//           {themeStatus === "light" ? "Light Theme" : "Dark Theme"}
//         </div>
//       </div>
//     </div>
//   );
// }
