"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings2 size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </h3>
      </div>
      {/* Account Status */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Account Status
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
      {/* Terms & Conditions */}
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
      {/* Optional Debug Display (for dev preview) */}
      <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] text-sm text-gray-700 dark:text-gray-300">
        <p>
          <strong>Status:</strong> {formData.accountStatus}
        </p>
        <p>
          <strong>Theme:</strong> {formTheme.themeStatus}
        </p>
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

// "use client";

// import type React from "react";

// import { useState } from "react";
// import { Settings2 } from "lucide-react";

// export default function AccountSettingsSection() {
//   const [formData, setFormData] = useState({
//     status: "active",
//     termsAndConditions: "",
//   });

//   const [formTheme, setFormTheme] = useState({
//     status: "active",
//     termsAndConditions: "",
//   });

//   const handleChangeTheme = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormTheme((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className="bg-white rounded-lg border border-border p-6 space-y-5">
//       <div className="flex items-center gap-3">
//         <Settings2 size={24} className="text-foreground" />
//         <h3 className="text-xl font-bold text-foreground">Account Settings</h3>
//       </div>

//       {/* Status */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-foreground">
//           Status:
//         </label>
//         <div className="flex items-center gap-6">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="radio"
//               name="status"
//               value="active"
//               checked={formData.status === "active"}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, status: e.target.value }))
//               }
//               className="w-4 h-4"
//             />
//             <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded text-sm font-medium">
//               Active
//             </span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="radio"
//               name="status"
//               value="inactive"
//               checked={formData.status === "inactive"}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, status: e.target.value }))
//               }
//               className="w-4 h-4"
//             />
//             <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium">
//               Inactive
//             </span>
//           </label>
//         </div>
//       </div>

//       <label className="block text-sm font-medium text-foreground">
//         Choose Theme
//       </label>
//       <div className="flex items-center gap-6">
//         <label className="flex items-center gap-2 cursor-pointer">
//           <input
//             type="radio"
//             name="status"
//             value="active"
//             checked={formTheme.status === "active"}
//             onChange={(e) =>
//               setFormTheme((prev) => ({ ...prev, status: e.target.value }))
//             }
//             className="w-4 h-4"
//           />
//           <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded text-sm font-medium">
//             Light
//           </span>
//         </label>
//         <label className="flex items-center gap-2 cursor-pointer">
//           <input
//             type="radio"
//             name="status"
//             value="inactive"
//             checked={formTheme.status === "inactive"}
//             onChange={(e) =>
//               setFormTheme((prev) => ({ ...prev, status: e.target.value }))
//             }
//             className="w-4 h-4"
//           />
//           <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium">
//             Dark
//           </span>
//         </label>
//       </div>

//       {/* Terms & Conditions */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-foreground">
//           Terms & Conditions (optional):
//         </label>
//         <textarea
//           name="termsAndConditions"
//           placeholder="Enter or link terms & conditions"
//           value={formData.termsAndConditions}
//           onChange={handleChange}
//           rows={3}
//           className="w-full px-4 py-2 border border-input bg-background text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
//         />
//       </div>
//     </div>
//   );
// }
