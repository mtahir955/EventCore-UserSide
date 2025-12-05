"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  eventId?: string;
  existingStaff?: StaffMember[];
  onUpdated?: () => void;
}

interface StaffMember {
  fullName: string;
  email: string;
  phoneNumber: string;
  permission: string;
}

export function EditStaffModal({
  isOpen,
  onClose,
  mode = "create",
  eventId,
  existingStaff = [],
  onUpdated,
}: EditStaffModalProps) {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { fullName: "", email: "", phoneNumber: "", permission: "Check Tickets" },
  ]);

  // ⭐ STATE FOR PREVIOUS STAFF MINI MODAL
  const [showPreviousStaffModal, setShowPreviousStaffModal] = useState(false);

  // ⭐ API staff list state
  const [previousStaffList, setPreviousStaffList] = useState<StaffMember[]>([]);
  const [loadingPreviousStaff, setLoadingPreviousStaff] = useState(false);

  // ⭐ LOAD EXISTING STAFF WHEN EDITING
  useEffect(() => {
    if (isOpen && mode === "edit" && existingStaff.length > 0) {
      const formatted = existingStaff.map((s: any) => ({
        fullName: s.fullName,
        email: s.email,
        phoneNumber: s.phoneNumber,
        permission: s.permissionName || s.permission || "Check Tickets",
      }));

      setStaffMembers(formatted);
    }

    if (isOpen && mode === "create") {
      setStaffMembers([
        {
          fullName: "",
          email: "",
          phoneNumber: "",
          permission: "Check Tickets",
        },
      ]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddMore = () => {
    setStaffMembers([
      ...staffMembers,
      { fullName: "", email: "", phoneNumber: "", permission: "Check Tickets" },
    ]);
  };

  const handleDelete = (index: number) => {
    if (staffMembers.length === 1) {
      toast.error("At least 1 staff member is required.");
      return;
    }
    setStaffMembers(staffMembers.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof StaffMember,
    value: string
  ) => {
    const updated = [...staffMembers];
    updated[index][field] = value;
    setStaffMembers(updated);
  };

  // ⭐ ADD EXISTING PREVIOUS STAFF INTO FORM
  const handleAddPreviousStaff = (staff: StaffMember) => {
    setStaffMembers([
      ...staffMembers,
      {
        fullName: staff.fullName,
        email: staff.email,
        phoneNumber: staff.phoneNumber,
        permission: staff.permission,
      },
    ]);

    setShowPreviousStaffModal(false);
    toast.success("Staff added from previous list");
  };

  const getToken = () => {
    let rawToken =
      localStorage.getItem("hostToken") ||
      localStorage.getItem("hostUser") ||
      localStorage.getItem("token");

    try {
      const parsed = JSON.parse(rawToken || "{}");
      return parsed?.token || rawToken;
    } catch {
      return rawToken;
    }
  };

  // ⭐ FETCH PREVIOUS STAFF LIST FROM API
  const fetchPreviousStaff = async () => {
    try {
      setLoadingPreviousStaff(true);

      const token = getToken();
      if (!token) {
        toast.error("Missing authentication token");
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/users/staff/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": HOST_Tenant_ID,
        },
      });

      const apiData = res.data?.data?.staff || [];

      const formatted: StaffMember[] = apiData
        .filter((s: any) => s.isActive === true) // Only active staff
        .map((s: any) => ({
          fullName: s.fullName,
          email: s.email,
          phoneNumber: s.phoneNumber,
          permission: s.permission || "Check Tickets",
        }));

      setPreviousStaffList(formatted);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to load previous staff");
    } finally {
      setLoadingPreviousStaff(false);
    }
  };

  // ⭐ OPEN MINI MODAL + TRIGGER API
  const openPreviousStaffModal = () => {
    setShowPreviousStaffModal(true);
    fetchPreviousStaff();
  };

  // ⭐ SUBMIT HANDLER (UNCHANGED)
  const handleSubmit = async () => {
    try {
      for (const staff of staffMembers) {
        if (!staff.fullName || !staff.email || !staff.phoneNumber) {
          toast.error("Please fill all required fields.");
          return;
        }
      }

      const token = getToken();
      if (!token) {
        toast.error("Missing authentication token");
        return;
      }

      const finalEventId =
        mode === "edit"
          ? eventId
          : localStorage.getItem("lastPublishedEventId");

      if (!finalEventId) {
        toast.error("Event ID not found");
        return;
      }

      const finalStaff = staffMembers.map((s) => ({
        eventId: finalEventId,
        fullName: s.fullName,
        email: s.email,
        phoneNumber: s.phoneNumber,
        permission: s.permission,
      }));

      const payload = { staff: finalStaff };

      if (mode === "create") {
        await axios.post(`${API_BASE_URL}/users/staff/bulk`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
          },
        });

        toast.success("Staff added successfully!");
      }

      if (mode === "edit") {
        await axios.put(
          `${API_BASE_URL}/users/staff/bulk/${finalEventId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": HOST_Tenant_ID,
            },
          }
        );

        toast.success("Staff updated successfully!");

        if (onUpdated) onUpdated();
      }

      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to save staff");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40">
      <div className="relative rounded-2xl shadow-2xl bg-white dark:bg-[#101010] overflow-hidden sm:w-[600px] w-[320px]">
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6">
          <h2 className="sm:text-[24px] text-[20px] font-bold text-black dark:text-white">
            {mode === "edit" ? "Edit Event Staff" : "Event Staff"}
          </h2>

          <button
            onClick={handleAddMore}
            className="flex items-center gap-3 sm:px-4 px-2 sm:py-2.5 py-3 rounded-lg bg-black text-white text-[12px] sm:text-[14px] font-semibold"
          >
            <img src="/images/icons/plus-icon.png" className="h-4 w-4" />
            Add More
          </button>

          <button
            onClick={openPreviousStaffModal}
            className="flex items-center gap-3 sm:px-4 px-2 sm:py-2.5 py-3 rounded-lg bg-black text-white text-[12px] sm:text-[14px] font-semibold"
          >
            <img src="/images/icons/plus-icon.png" className="h-4 w-4" />
            Add previous staff
          </button>
        </div>

        {/* CONTENT */}
        <div
          className="px-8 pb-8 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 180px)" }}
        >
          {staffMembers.map((member, index) => (
            <div
              key={index}
              className={
                index > 0
                  ? "mt-8 pt-8 border-t border-gray-200 relative"
                  : "relative"
              }
            >
              {staffMembers.length > 1 && (
                <button
                  onClick={() => handleDelete(index)}
                  className="absolute right-0 top-0 text-red-500 hover:text-red-700 text-sm"
                >
                  ✕ Remove
                </button>
              )}

              {/* FULL NAME */}
              <div className="mb-6 mt-4">
                <label className="block font-medium mb-2">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={member.fullName}
                  onChange={(e) =>
                    handleChange(index, "fullName", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg border"
                />
              </div>

              {/* EMAIL */}
              <div className="mb-6">
                <label className="block font-medium mb-2">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={member.email}
                  onChange={(e) => handleChange(index, "email", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border"
                />
              </div>

              {/* PHONE */}
              <div className="mb-6">
                <label className="block font-medium mb-2">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  value={member.phoneNumber}
                  onChange={(e) =>
                    handleChange(index, "phoneNumber", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg border"
                />
              </div>

              {/* PERMISSION */}
              <div className="mb-6">
                <label className="block font-medium mb-3">
                  Assign Permission <span className="text-red-600">*</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`permission-${index}`}
                    value="Check Tickets"
                    checked={member.permission === "Check Tickets"}
                    onChange={(e) =>
                      handleChange(index, "permission", e.target.value)
                    }
                    className="w-5 h-5"
                  />
                  <span>Check Tickets</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="px-8 pb-8 flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg"
            style={{ background: "#F5EDE5", color: "#D19537" }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-lg text-white"
            style={{ background: "#D19537" }}
          >
            {mode === "edit" ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* ⭐ NEW — PREVIOUS STAFF MINI MODAL */}
      {showPreviousStaffModal && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50">
          <div className="bg-white dark:bg-[#101010] rounded-xl p-6 w-[300px] sm:w-[400px]">
            <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
              Previous Staff List
            </h3>

            <div className="max-h-[300px] overflow-y-auto space-y-4">
              {loadingPreviousStaff ? (
                <p className="text-center text-sm opacity-70">Loading...</p>
              ) : previousStaffList.length === 0 ? (
                <p className="text-center text-sm opacity-70">
                  No staff found.
                </p>
              ) : (
                previousStaffList.map((staff, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{staff.fullName}</p>
                      <p className="text-sm opacity-80">{staff.email}</p>
                    </div>

                    <button
                      onClick={() => handleAddPreviousStaff(staff)}
                      className="px-3 py-1 rounded-lg bg-black text-white text-sm"
                    >
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowPreviousStaffModal(false)}
              className="mt-4 w-full py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// code before adding add previous staff functionality

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// interface EditStaffModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   mode?: "create" | "edit";
//   eventId?: string;
//   existingStaff?: StaffMember[];
//   onUpdated?: () => void;
// }

// interface StaffMember {
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   permission: string;
// }

// export function EditStaffModal({
//   isOpen,
//   onClose,
//   mode = "create",
//   eventId,
//   existingStaff = [],
//   onUpdated,
// }: EditStaffModalProps) {
//   const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
//     { fullName: "", email: "", phoneNumber: "", permission: "Check Tickets" },
//   ]);

//   // ⭐ LOAD EXISTING STAFF WHEN EDITING
//   useEffect(() => {
//     if (isOpen && mode === "edit" && existingStaff.length > 0) {
//       const formatted = existingStaff.map((s) => ({
//         fullName: s.fullName,
//         email: s.email,
//         phoneNumber: s.phoneNumber,
//         permission: s.permissionName || s.permission || "Check Tickets",
//       }));

//       setStaffMembers(formatted);
//     }

//     if (isOpen && mode === "create") {
//       setStaffMembers([
//         {
//           fullName: "",
//           email: "",
//           phoneNumber: "",
//           permission: "Check Tickets",
//         },
//       ]);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   const handleAddMore = () => {
//     setStaffMembers([
//       ...staffMembers,
//       { fullName: "", email: "", phoneNumber: "", permission: "Check Tickets" },
//     ]);
//   };

//   const handleDelete = (index: number) => {
//     if (staffMembers.length === 1) {
//       toast.error("At least 1 staff member is required.");
//       return;
//     }
//     setStaffMembers(staffMembers.filter((_, i) => i !== index));
//   };

//   const handleChange = (
//     index: number,
//     field: keyof StaffMember,
//     value: string
//   ) => {
//     const updated = [...staffMembers];
//     updated[index][field] = value;
//     setStaffMembers(updated);
//   };

//   const getToken = () => {
//     let rawToken =
//       localStorage.getItem("hostToken") ||
//       localStorage.getItem("hostUser") ||
//       localStorage.getItem("token");

//     try {
//       const parsed = JSON.parse(rawToken || "{}");
//       return parsed?.token || rawToken;
//     } catch {
//       return rawToken;
//     }
//   };

//   // ⭐ SUBMIT HANDLER
//   const handleSubmit = async () => {
//     try {
//       for (const staff of staffMembers) {
//         if (!staff.fullName || !staff.email || !staff.phoneNumber) {
//           toast.error("Please fill all required fields.");
//           return;
//         }
//       }

//       const token = getToken();
//       if (!token) {
//         toast.error("Missing authentication token");
//         return;
//       }

//       // EVENT ID HANDLING
//       const finalEventId =
//         mode === "edit"
//           ? eventId
//           : localStorage.getItem("lastPublishedEventId");

//       if (!finalEventId) {
//         toast.error("Event ID not found");
//         return;
//       }

//       const finalStaff = staffMembers.map((s) => ({
//         eventId: finalEventId,
//         fullName: s.fullName,
//         email: s.email,
//         phoneNumber: s.phoneNumber,
//         permission: s.permission,
//       }));

//       const payload = { staff: finalStaff };

//       // ⭐ API MODE LOGIC
//       if (mode === "create") {
//         await axios.post(`${API_BASE_URL}/users/staff/bulk`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-Tenant-ID": HOST_Tenant_ID,
//           },
//         });

//         toast.success("Staff added successfully!");
//       }

//       if (mode === "edit") {
//         await axios.put(
//           `${API_BASE_URL}/users/staff/bulk/${finalEventId}`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "X-Tenant-ID": HOST_Tenant_ID,
//             },
//           }
//         );

//         toast.success("Staff updated successfully!");

//         if (onUpdated) onUpdated(); // refresh parent list
//       }

//       onClose();
//     } catch (error: any) {
//       console.error(error);
//       toast.error(error?.response?.data?.message || "Failed to save staff");
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40">
//       <div className="relative rounded-2xl shadow-2xl bg-white dark:bg-[#101010] overflow-hidden sm:w-[600px] w-[320px]">
//         {/* HEADER */}
//         <div className="flex items-center justify-between px-8 pt-8 pb-6">
//           <h2 className="sm:text-[24px] text-[20px] font-bold text-black dark:text-white">
//             {mode === "edit" ? "Edit Event Staff" : "Event Staff"}
//           </h2>

//           <button
//             onClick={handleAddMore}
//             className="flex items-center gap-3 sm:px-4 px-2 sm:py-2.5 py-3 rounded-lg bg-black text-white text-[12px] sm:text-[14px] font-semibold"
//           >
//             <img src="/images/icons/plus-icon.png" className="h-4 w-4" />
//             Add More
//           </button>

//           <button
//             className="flex items-center gap-3 sm:px-4 px-2 sm:py-2.5 py-3 rounded-lg bg-black text-white text-[12px] sm:text-[14px] font-semibold"
//           >
//             <img src="/images/icons/plus-icon.png" className="h-4 w-4" />
//             Add previous staff
//           </button>
//         </div>

//         {/* CONTENT */}
//         <div
//           className="px-8 pb-8 overflow-y-auto"
//           style={{ maxHeight: "calc(90vh - 180px)" }}
//         >
//           {staffMembers.map((member, index) => (
//             <div
//               key={index}
//               className={
//                 index > 0
//                   ? "mt-8 pt-8 border-t border-gray-200 relative"
//                   : "relative"
//               }
//             >
//               {staffMembers.length > 1 && (
//                 <button
//                   onClick={() => handleDelete(index)}
//                   className="absolute right-0 top-0 text-red-500 hover:text-red-700 text-sm"
//                 >
//                   ✕ Remove
//                 </button>
//               )}

//               {/* FULL NAME */}
//               <div className="mb-6 mt-4">
//                 <label className="block font-medium mb-2">
//                   Full Name <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={member.fullName}
//                   onChange={(e) =>
//                     handleChange(index, "fullName", e.target.value)
//                   }
//                   className="w-full px-4 py-3 rounded-lg border"
//                 />
//               </div>

//               {/* EMAIL */}
//               <div className="mb-6">
//                 <label className="block font-medium mb-2">
//                   Email <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   value={member.email}
//                   onChange={(e) => handleChange(index, "email", e.target.value)}
//                   className="w-full px-4 py-3 rounded-lg border"
//                 />
//               </div>

//               {/* PHONE */}
//               <div className="mb-6">
//                 <label className="block font-medium mb-2">
//                   Phone Number <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="tel"
//                   value={member.phoneNumber}
//                   onChange={(e) =>
//                     handleChange(index, "phoneNumber", e.target.value)
//                   }
//                   className="w-full px-4 py-3 rounded-lg border"
//                 />
//               </div>

//               {/* PERMISSION */}
//               <div className="mb-6">
//                 <label className="block font-medium mb-3">
//                   Assign Permission <span className="text-red-600">*</span>
//                 </label>

//                 <label className="flex items-center gap-3 cursor-pointer">
//                   <input
//                     type="radio"
//                     name={`permission-${index}`}
//                     value="Check Tickets"
//                     checked={member.permission === "Check Tickets"}
//                     onChange={(e) =>
//                       handleChange(index, "permission", e.target.value)
//                     }
//                     className="w-5 h-5"
//                   />
//                   <span>Check Tickets</span>
//                 </label>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* FOOTER */}
//         <div className="px-8 pb-8 flex items-center gap-4">
//           <button
//             onClick={onClose}
//             className="flex-1 py-3 rounded-lg"
//             style={{ background: "#F5EDE5", color: "#D19537" }}
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSubmit}
//             className="flex-1 py-3 rounded-lg text-white"
//             style={{ background: "#D19537" }}
//           >
//             {mode === "edit" ? "Update" : "Add"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// interface EditStaffModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// interface StaffMember {
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   permission: string; // updated
// }

// export function EditStaffModal({ isOpen, onClose }: EditStaffModalProps) {
//   const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
//     { fullName: "", email: "", phoneNumber: "", permission: "Check Tickets" },
//   ]);

//   if (!isOpen) return null;

//   const handleAddMore = () => {
//     setStaffMembers([
//       ...staffMembers,
//       { fullName: "", email: "", phoneNumber: "", permission: "Check Tickets" },
//     ]);
//   };

//   const handleDelete = (index: number) => {
//     if (staffMembers.length === 1) {
//       toast.error("At least 1 staff member is required.");
//       return;
//     }

//     const filtered = staffMembers.filter((_, i) => i !== index);
//     setStaffMembers(filtered);
//   };

//   const handleChange = (
//     index: number,
//     field: keyof StaffMember,
//     value: string
//   ) => {
//     const updated = [...staffMembers];
//     updated[index][field] = value;
//     setStaffMembers(updated);
//   };

//   const handleSubmit = async () => {
//     try {
//       // Validation
//       for (const staff of staffMembers) {
//         if (!staff.fullName || !staff.email || !staff.phoneNumber) {
//           toast.error("Please fill all required fields.");
//           return;
//         }
//       }

//       // Get token
//       let rawToken =
//         localStorage.getItem("hostToken") ||
//         localStorage.getItem("hostUser") ||
//         localStorage.getItem("token");

//       let token: string | null = null;
//       try {
//         const parsed = JSON.parse(rawToken || "{}");
//         token = parsed?.token ?? rawToken;
//       } catch {
//         token = rawToken;
//       }

//       if (!token) {
//         toast.error("Missing authentication token");
//         return;
//       }

//       // ⭐ Get saved eventId
//       const eventId = localStorage.getItem("lastPublishedEventId");
//       if (!eventId) {
//         toast.error("Event ID not found. Please publish event again.");
//         return;
//       }

//       // ⭐ Build final staff array inserting eventId + permission
//       const finalStaff = staffMembers.map((s) => ({
//         eventId,
//         fullName: s.fullName,
//         email: s.email,
//         phoneNumber: s.phoneNumber,
//         permission: s.permission,
//       }));

//       const payload = { staff: finalStaff };

//       // API call
//       await axios.post(`${API_BASE_URL}/users/staff/bulk`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-Tenant-ID": HOST_Tenant_ID,
//           "Content-Type": "application/json",
//         },
//       });

//       toast.success("Staff added successfully!");
//       onClose();
//     } catch (error: any) {
//       console.error(error);
//       toast.error(error?.response?.data?.message || "Failed to add staff");
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40">
//       <div className="relative rounded-2xl shadow-2xl bg-white dark:bg-[#101010] overflow-hidden sm:w-[600px] w-[320px]">
//         {/* Header */}
//         <div className="flex items-center justify-between px-8 pt-8 pb-6">
//           <h2 className="sm:text-[24px] text-[20px] font-bold text-black dark:text-white">
//             Event Staff
//           </h2>
//           <button
//             onClick={handleAddMore}
//             className="flex items-center gap-3 sm:px-4 px-2 sm:py-2.5 py-3 rounded-lg bg-black text-white text-[12px] sm:text-[14px] font-semibold"
//           >
//             <img src="/images/icons/plus-icon.png" alt="" className="h-4 w-4" />
//             Add More
//           </button>
//         </div>

//         {/* Content */}
//         <div
//           className="px-8 pb-8 overflow-y-auto"
//           style={{ maxHeight: "calc(90vh - 180px)" }}
//         >
//           {staffMembers.map((member, index) => (
//             <div
//               key={index}
//               className={
//                 index > 0
//                   ? "mt-8 pt-8 border-t border-gray-200 relative"
//                   : "relative"
//               }
//             >
//               {/* Delete */}
//               {staffMembers.length > 1 && (
//                 <button
//                   onClick={() => handleDelete(index)}
//                   className="absolute right-0 top-0 text-red-500 hover:text-red-700 text-sm"
//                 >
//                   ✕ Remove
//                 </button>
//               )}

//               {/* Full Name */}
//               <div className="mb-6 mt-4">
//                 <label className="block font-medium mb-2">
//                   Full Name <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter Name"
//                   value={member.fullName}
//                   onChange={(e) =>
//                     handleChange(index, "fullName", e.target.value)
//                   }
//                   className="w-full px-4 py-3 rounded-lg border"
//                 />
//               </div>

//               {/* Email */}
//               <div className="mb-6">
//                 <label className="block font-medium mb-2">
//                   Email <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   placeholder="Enter Email"
//                   value={member.email}
//                   onChange={(e) => handleChange(index, "email", e.target.value)}
//                   className="w-full px-4 py-3 rounded-lg border"
//                 />
//               </div>

//               {/* Phone */}
//               <div className="mb-6">
//                 <label className="block font-medium mb-2">
//                   Phone Number <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="tel"
//                   placeholder="Enter Phone Number"
//                   value={member.phoneNumber}
//                   onChange={(e) =>
//                     handleChange(index, "phoneNumber", e.target.value)
//                   }
//                   className="w-full px-4 py-3 rounded-lg border"
//                 />
//               </div>

//               {/* Permission */}
//               <div className="mb-6">
//                 <label className="block font-medium mb-3">
//                   Assign Permission <span className="text-red-600">*</span>
//                 </label>

//                 <label className="flex items-center gap-3 cursor-pointer">
//                   <input
//                     type="radio"
//                     name={`permission-${index}`}
//                     value="Check Tickets"
//                     checked={member.permission === "Check Tickets"}
//                     onChange={(e) =>
//                       handleChange(index, "permission", e.target.value)
//                     }
//                     className="w-5 h-5"
//                   />
//                   <span>Check Tickets</span>
//                 </label>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Footer */}
//         <div className="px-8 pb-8 flex items-center gap-4">
//           <button
//             onClick={onClose}
//             className="flex-1 py-3 rounded-lg"
//             style={{ background: "#F5EDE5", color: "#D19537" }}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="flex-1 py-3 rounded-lg text-white"
//             style={{ background: "#D19537" }}
//           >
//             Add
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

//Code before integration

// "use client";

// import { useState } from "react";

// interface EditStaffModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave?: (staff: StaffMember[]) => void;
// }

// interface StaffMember {
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   role: string; // ✅ Single role only
// }

// export function EditStaffModal({
//   isOpen,
//   onClose,
//   onSave,
// }: EditStaffModalProps) {
//   const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
//     { fullName: "", email: "", phoneNumber: "", role: "Check Tickets" },
//   ]);

//   if (!isOpen) return null;

//   const handleAddMore = () => {
//     setStaffMembers([
//       ...staffMembers,
//       { fullName: "", email: "", phoneNumber: "", role: "Check Tickets" },
//     ]);
//   };

//   const handleChange = (
//     index: number,
//     field: keyof StaffMember,
//     value: string
//   ) => {
//     const updated = [...staffMembers];
//     updated[index][field] = value;
//     setStaffMembers(updated);
//   };

//   const handleSubmit = () => {
//     onSave?.(staffMembers);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40">
//       <div className="relative rounded-2xl shadow-2xl bg-white dark:bg-[#101010] overflow-hidden sm:w-[600px] w-[320px]">
//         {/* Header */}
//         <div className="flex items-center justify-between px-8 pt-8 pb-6">
//           <h2 className="sm:text-[24px] text-[20px] font-bold text-black dark:text-white">
//             Event Details
//           </h2>
//           <button
//             onClick={handleAddMore}
//             className="flex items-center gap-3 sm:px-4 px-2 sm:py-2.5 py-3 rounded-lg bg-black text-white text-[12px] sm:text-[14px] font-semibold"
//           >
//             <img src="/images/icons/plus-icon.png" alt="" className="h-4 w-4" />
//             Add More
//           </button>
//         </div>

//         {/* Scrollable Content */}
//         <div
//           className="px-8 pb-8 overflow-y-auto"
//           style={{ maxHeight: "calc(90vh - 180px)" }}
//         >
//           {staffMembers.map((member, index) => (
//             <div
//               key={index}
//               className={index > 0 ? "mt-8 pt-8 border-t border-gray-200" : ""}
//             >
//               {/* Full Name */}
//               <div className="mb-6">
//                 <label className="block sm:text-[14px] text-[13px] font-medium text-black dark:text-white mb-2">
//                   Full Name <span className="text-[#D6111A]">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter Name"
//                   value={member.fullName}
//                   onChange={(e) =>
//                     handleChange(index, "fullName", e.target.value)
//                   }
//                   className="w-full px-4 sm:py-3 py-2 rounded-lg border border-gray-200 sm:text-[14px] text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D19537]"
//                 />
//               </div>

//               {/* Email Address */}
//               <div className="mb-6">
//                 <label className="block sm:text-[14px] text-[13px] font-medium text-black dark:text-white mb-2">
//                   Email Address <span className="text-[#D6111A]">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   placeholder="Enter Email Address"
//                   value={member.email}
//                   onChange={(e) => handleChange(index, "email", e.target.value)}
//                   className="w-full px-4 sm:py-3 py-2 rounded-lg border border-gray-200 sm:text-[14px] text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D19537]"
//                 />
//               </div>

//               {/* Phone Number */}
//               <div className="mb-6">
//                 <label className="block sm:text-[14px] text-[13px] font-medium text-black dark:text-white mb-2">
//                   Phone Number <span className="text-[#D6111A]">*</span>
//                 </label>
//                 <input
//                   type="tel"
//                   placeholder="Enter Phone Number"
//                   value={member.phoneNumber}
//                   onChange={(e) =>
//                     handleChange(index, "phoneNumber", e.target.value)
//                   }
//                   className="w-full px-4 sm:py-3 py-2 rounded-lg border border-gray-200 sm:text-[14px] text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D19537]"
//                 />
//               </div>

//               {/* Assign Role */}
//               <div className="mb-6">
//                 <label className="block sm:text-[14px] text-[13px] font-medium text-black dark:text-white mb-3">
//                   Assign Role <span className="text-[#D6111A]">*</span>
//                 </label>

//                 <div className="flex flex-wrap items-center gap-8">
//                   {["Check Tickets"].map((role) => (
//                     <label
//                       key={role}
//                       className="flex items-center gap-2 cursor-pointer select-none"
//                     >
//                       <input
//                         type="radio"
//                         name={`role-${index}`}
//                         value={role}
//                         checked={member.role === role}
//                         onChange={(e) =>
//                           handleChange(index, "role", e.target.value)
//                         }
//                         className="sm:w-5 sm:h-5 w-4 h-4 border border-[#D19537] rounded-full appearance-none checked:bg-[#D19537] checked:border-[#D19537] relative"
//                         style={{
//                           boxShadow: "inset 0 0 0 3px white",
//                         }}
//                       />
//                       <span className="sm:text-[14px] text-[13px] text-black dark:text-white">
//                         {role}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Footer Buttons */}
//         <div className="px-8 pb-8 flex items-center gap-4">
//           <button
//             onClick={onClose}
//             className="flex-1 sm:py-3.5 py-2 rounded-lg text-[16px] font-semibold hover:cursor-pointer"
//             style={{ background: "#F5EDE5", color: "#D19537" }}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="flex-1 sm:py-3.5 py-2 rounded-lg text-[16px] font-semibold text-white hover:cursor-pointer"
//             style={{ background: "#D19537" }}
//           >
//             Add
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
