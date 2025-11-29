"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { FileUp } from "lucide-react";
import { ForwardedRef } from "react";

interface SectionProps {}

const BasicInformationSection = forwardRef(function BasicInformationSection(
  _,
  ref: ForwardedRef<any>
) {
  const [formData, setFormData] = useState({
    tenantName: "",
    description: "",
  });

  const handleChange = (e: any) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  useImperativeHandle(ref, () => ({
    getData: () => ({
      tenantName: formData.tenantName,
      description: formData.description,
    }),
  }));

  return (
    <div className="w-full bg-white dark:bg-[#101010] border rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <FileUp size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold">Basic Information</h3>
      </div>

      <div className="space-y-2">
        <label>Tenant Name</label>
        <input
          type="text"
          name="tenantName"
          value={formData.tenantName}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border dark:bg-[#101010]"
        />
      </div>

      <div className="space-y-2">
        <label>Description</label>
        <textarea
          name="description"
          rows={2}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border dark:bg-[#101010]"
        />
      </div>
    </div>
  );
});

BasicInformationSection.displayName = "BasicInformationSection";
export default BasicInformationSection;

// "use client";

// import { useState } from "react";
// import { FileUp, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// export default function BasicInformationSection() {
//   const [formData, setFormData] = useState({
//     tenantName: "",
//     email: "",
//     description: "",
//   });

//   // 🧩 Handle text and textarea inputs
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // 🖼️ Handle Logo Upload
//   const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setFormData((prev) => ({
//           ...prev,
//           logo: event.target?.result as string,
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveLogo = () => {
//     setFormData((prev) => ({ ...prev, logo: "" }));
//   };

//   // 🖼️ Handle Banner Upload
//   const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setFormData((prev) => ({
//           ...prev,
//           banner: event.target?.result as string,
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveBanner = () => {
//     setFormData((prev) => ({ ...prev, banner: "" }));
//   };
//   const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

//   const handlePasswordSubmit = async (data: {
//     currentPassword: string;
//     newPassword: string;
//     confirmPassword: string;
//   }) => {
//     try {
//       const token = localStorage.getItem("hostToken");

//       if (!token) {
//         toast.error("No admin token found. Please log in again.", {
//           style: {
//             background: "#101010",
//             color: "#fff",
//             border: "1px solid #D19537",
//           },
//         });
//         return;
//       }

//       await axios.put(
//         `${API_BASE_URL}/auth/change-password`,
//         {
//           currentPassword: data.currentPassword,
//           newPassword: data.newPassword,
//           confirmPassword: data.confirmPassword,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "x-tenant-id": HOST_Tenant_ID,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success("Password updated successfully!", {
//         style: {
//           background: "#101010",
//           color: "#fff",
//           border: "1px solid #D19537",
//         },
//       });

//       setShowChangePasswordModal(false);
//     } catch (error: any) {
//       console.error("Password update error:", error);

//       const message =
//         error?.response?.data?.message ||
//         "Failed to update password. Please try again.";

//       toast.error(message, {
//         style: {
//           background: "#101010",
//           color: "#fff",
//           border: "1px solid red",
//         },
//       });
//     }
//   };

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
//           name="tenantName"
//           placeholder="Enter tenant name"
//           value={formData.tenantName}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]"
//         />
//       </div>

//       {/* Email */}
//       {/* <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//           Email:
//         </label>
//         <input
//           type="email"
//           name="email"
//           placeholder="example@email.com"
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]"
//         />
//       </div> */}
//       {/* Change Password Button */}
//       <button
//         onClick={() => setShowChangePasswordModal(true)}
//         className="px-4 py-2 bg-[#D19537] text-white rounded-lg hover:bg-[#c2872f]"
//       >
//         Change Password
//       </button>
//       {/* Save Button */}
//       <div className="flex justify-end">
//         <Button className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-2 rounded-lg transition">
//           Save
//         </Button>
//       </div>
//       <ChangePasswordModal
//         isOpen={showChangePasswordModal}
//         onClose={() => setShowChangePasswordModal(false)}
//         onSubmit={handlePasswordSubmit}
//       />
//     </div>
//   );
// }
