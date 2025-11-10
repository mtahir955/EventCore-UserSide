"use client";

import { useState } from "react";
import { FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BasicInformationSection() {
  const [formData, setFormData] = useState({
    tenantName: "",
    email: "",
    description: "",
    subdomain: "",
    logo: "",
    banner: "",
  });

  // 🧩 Handle text and textarea inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🖼️ Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          logo: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logo: "" }));
  };

  // 🖼️ Handle Banner Upload
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          banner: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBanner = () => {
    setFormData((prev) => ({ ...prev, banner: "" }));
  };

  return (
    <div className="w-full max-w-[100%] mt-14 sm:mt-0 bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileUp size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Basic Information
        </h3>
      </div>

      {/* Tenant Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tenant Name:
        </label>
        <input
          type="text"
          name="tenantName"
          placeholder="Enter tenant name"
          value={formData.tenantName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email:
        </label>
        <input
          type="email"
          name="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]"
        />
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Logo:
        </label>

        {formData.logo ? (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
            <img
              src={formData.logo}
              alt="Logo Preview"
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-black transition"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="relative w-full sm:w-1/2 lg:w-1/3">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222] cursor-pointer transition">
              <FileUp
                size={18}
                className="text-gray-600 dark:text-gray-300 mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Upload logo
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Banner Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Banner (1425 × 500px):
        </label>

        {formData.banner ? (
          <div className="relative w-full sm:w-3/4 lg:w-2/3 h-40 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
            <img
              src={formData.banner}
              alt="Banner Preview"
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={handleRemoveBanner}
              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black transition"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="relative w-full sm:w-3/4 lg:w-2/3">
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222] cursor-pointer transition">
              <FileUp
                size={18}
                className="text-gray-600 dark:text-gray-300 mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Upload banner
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description:
        </label>
        <textarea
          name="description"
          placeholder="Write a short description about the tenant"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537] resize-none"
        />
      </div>

      {/* Subdomain */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Subdomain:
        </label>
        <input
          type="text"
          name="subdomain"
          placeholder="tenanthome.yourdomain.com"
          value={formData.subdomain}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-2 rounded-lg transition">
          Save
        </Button>
      </div>
    </div>
  );
}

// "use client"

// import type React from "react"

// import { useState } from "react"
// import { FileUp } from "lucide-react"

// export default function BasicInformationSection() {
//   const [formData, setFormData] = useState({
//     tenantName: "",
//     email: "",
//     description: "",
//     subdomain: "",
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   return (
//     <div className="bg-white rounded-lg border border-border p-6 space-y-5">
//       <div className="flex items-center gap-3">
//         <FileUp size={24} className="text-foreground" />
//         <h3 className="text-xl font-bold text-foreground">Basic Information</h3>
//       </div>

//       {/* Tenant Name */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-foreground">Tenant Name:</label>
//         <input
//           type="text"
//           name="tenantName"
//           placeholder="Enter tenant name"
//           value={formData.tenantName}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border border-input bg-background text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
//         />
//       </div>

//       {/* Email */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-foreground">Email:</label>
//         <input
//           type="email"
//           name="email"
//           placeholder="example@email.com"
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border border-input bg-background text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
//         />
//       </div>

//       {/* Logo Upload */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-foreground">Logo:</label>
//         <div className="flex items-center gap-3">
//           <button className="px-4 py-2 bg-background border border-input text-foreground rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
//             <FileUp size={16} />
//             Upload file
//           </button>
//         </div>
//       </div>

//       {/* Description */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-foreground">Description:</label>
//         <textarea
//           name="description"
//           placeholder="Write a short description about the tenant"
//           value={formData.description}
//           onChange={handleChange}
//           rows={3}
//           className="w-full px-4 py-2 border border-input bg-background text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
//         />
//       </div>

//       {/* Subdomain */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-foreground">Subdomain:</label>
//         <input
//           type="text"
//           name="subdomain"
//           placeholder="tenanthome.yourdomain.com"
//           value={formData.subdomain}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border border-input bg-background text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
//         />
//       </div>
//     </div>
//   )
// }
