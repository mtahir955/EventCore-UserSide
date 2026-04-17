"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";

interface BasicInfoData {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  birthday?: string;
  dateOfBirth?: string;
  gender?: string;
  email?: string;
  accountType?: string;
  ambassadorId?: string;
}

interface BasicInfoProps {
  existing?: BasicInfoData;
}

export interface BasicInfoRef {
  getValues: () => {
    firstName: string;
    lastName: string;
    birthday: string;
    gender: string;
    email: string;
    accountType: string;
    ambassadorId: string;
  };
}

const BasicInfo = forwardRef<BasicInfoRef, BasicInfoProps>(
  ({ existing }, ref) => {
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
      firstName: "",
      lastName: "",
      birthday: "",
      gender: "",
      email: "",
      accountType: "",
      ambassadorId: "",
    });

    useEffect(() => {
      if (existing) {
        const fullNameParts = (existing.fullName || "").trim().split(" ");
        const accountType = (existing.accountType || "").toLowerCase();

        setForm({
          firstName: existing.firstName || fullNameParts[0] || "",
          lastName:
            existing.lastName ||
            (fullNameParts.length > 1 ? fullNameParts.slice(1).join(" ") : ""),
          birthday: existing.birthday || existing.dateOfBirth || "",
          gender: existing.gender || "",
          email: existing.email || "",
          accountType:
            accountType === "ambassador" || accountType === "guest"
              ? accountType
              : "",
          ambassadorId: existing.ambassadorId || "",
        });
      }
    }, [existing]);

    useImperativeHandle(ref, () => ({
      getValues: () => form,
    }));

    return (
      <>
        {/* MAIN FORM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              First Name:
            </label>
            <input
              placeholder="Enter first name"
              value={form.firstName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, firstName: e.target.value }))
              }
              className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 px-4 outline-none text-sm"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Last Name:
            </label>
            <input
              placeholder="Enter last name"
              value={form.lastName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 px-4 outline-none text-sm"
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Gender:
            </label>
            <select
              value={form.gender}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, gender: e.target.value }))
              }
              className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-4 dark:text-gray-100"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Birthday:
            </label>
            <input
              type="date"
              value={form.birthday}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, birthday: e.target.value }))
              }
              className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 px-4 outline-none text-sm"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Email:
            </label>
            <input
              placeholder="Enter email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 px-4 outline-none text-sm"
            />
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Account Type:
            </label>
            <div className="h-12 w-full flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#181818] text-gray-900 dark:text-gray-100 px-4 text-sm capitalize">
              {form.accountType || "Not selected"}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Account type can only be changed by the tenant.
            </p>
          </div>

          {/* Ambassador ID */}
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Ambassador ID Number:
            </label>
            <input
              placeholder="Enter Ambassador ID Number"
              value={form.ambassadorId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, ambassadorId: e.target.value }))
              }
              className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 px-4 outline-none text-sm"
            />
          </div>

          {/* CHANGE PASSWORD BUTTON */}
          <div className="col-span-1 sm:col-span-2 mt-4">
            <button
              onClick={() => setShowModal(true)}
              className="h-12 w-full sm:w-[200px] bg-[#0077F7] hover:bg-blue-600 text-white text-sm rounded-full transition"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* MODAL */}
        <ChangePasswordModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={(formData: {
            currentPassword: string;
            newPassword: string;
            confirmPassword: string;
          }) => {
            console.log("Password updated:", formData);
            setShowModal(false);
          }}
        />
      </>
    );
  }
);

BasicInfo.displayName = "BasicInfo";

export default BasicInfo;

//code before integration

// "use client";

// import { useState } from "react";
// import ChangePasswordModal from "@/components/modals/ChangePasswordModal";

// export default function BasicInfo() {
//   const [showModal, setShowModal] = useState(false);

//   return (
//     <>
//       {/* MAIN FORM */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//         {/* First Name */}
//         <div className="space-y-2">
//           <label className="text-sm text-gray-700 dark:text-gray-200">
//             First Name:
//           </label>
//           <input
//             placeholder="Enter first name"
//             className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 px-4 outline-none text-sm"
//           />
//         </div>

//         {/* Last Name */}
//         <div className="space-y-2">
//           <label className="text-sm text-gray-700 dark:text-gray-200">
//             Last Name:
//           </label>
//           <input
//             placeholder="Enter last name"
//             className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 px-4 outline-none text-sm"
//           />
//         </div>

//         {/* Gender */}
//         <div className="space-y-2">
//           <label className="text-sm text-gray-700 dark:text-gray-200">
//             Gender:
//           </label>
//           <select className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-4 dark:text-gray-100">
//             <option value="">Select Gender</option>
//             <option>Male</option>
//             <option>Female</option>
//           </select>
//         </div>

//         {/* Email */}
//         <div className="space-y-2">
//           <label className="text-sm text-gray-700 dark:text-gray-200">
//             Email:
//           </label>
//           <input
//             placeholder="Enter email"
//             className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 px-4 outline-none text-sm"
//           />
//         </div>

//         {/* CHANGE PASSWORD BUTTON */}
//         <div className="col-span-1 sm:col-span-2 mt-4">
//           <button
//             onClick={() => setShowModal(true)}
//             className="h-12 w-full sm:w-[200px] bg-[#0077F7] hover:bg-blue-600 text-white text-sm rounded-full transition"
//           >
//             Change Password
//           </button>
//         </div>
//       </div>

//       {/* MODAL */}
//       <ChangePasswordModal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         onSubmit={(formData: {
//           currentPassword: string;
//           newPassword: string;
//           confirmPassword: string;
//         }) => {
//           console.log("Password updated:", formData);
//           setShowModal(false);
//         }}
//       />
//     </>
//   );
// }
