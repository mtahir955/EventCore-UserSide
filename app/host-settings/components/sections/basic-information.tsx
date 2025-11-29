"use client";

import { FileUp } from "lucide-react";

export default function BasicInformationSection({ host }: any) {
  return (
    <div className="w-full max-w-[100%] mt-14 sm:mt-0 bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <FileUp size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Basic Information
        </h3>
      </div>

      {/* Host Full Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Full Name:
        </label>
        <input
          type="text"
          value={host.fullName}
          readOnly
          className="w-full px-4 py-2 bg-gray-100 dark:bg-[#181818] border border-gray-300 dark:border-gray-700 rounded-lg"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Email:
        </label>
        <input
          type="text"
          value={host.email}
          readOnly
          className="w-full px-4 py-2 bg-gray-100 dark:bg-[#181818] border border-gray-300 dark:border-gray-700 rounded-lg"
        />
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { FileUp } from "lucide-react";

// export default function BasicInformationSection() {
//   const [formData] = useState({
//     tenantName: "John",
//     email: "john@gmail.com",
//     description: "Motivational coach",
//   });

//   return (
//     <div className="w-full max-w-[100%] mt-14 sm:mt-0 bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 shadow-sm transition-all">
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <FileUp size={24} className="text-gray-700 dark:text-white" />
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//           Basic Information
//         </h3>
//       </div>

//       {/* Tenant Name */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//           Tenant Name:
//         </label>

//         <input
//           type="text"
//           value={formData.tenantName}
//           readOnly
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700
//           bg-gray-100 dark:bg-[#181818] text-gray-900 dark:text-gray-300
//           rounded-lg select-none cursor-not-allowed"
//         />
//       </div>

//       {/* Email */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//           Email:
//         </label>

//         <input
//           type="text"
//           value={formData.email}
//           readOnly
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700
//           bg-gray-100 dark:bg-[#181818] text-gray-900 dark:text-gray-300
//           rounded-lg select-none cursor-not-allowed"
//         />
//       </div>

//       {/* Description */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//           Description:
//         </label>

//         <textarea
//           value={formData.description}
//           readOnly
//           rows={3}
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700
//           bg-gray-100 dark:bg-[#181818] text-gray-900 dark:text-gray-300
//           rounded-lg resize-none select-none cursor-not-allowed"
//         />
//       </div>
//     </div>
//   );
// }
