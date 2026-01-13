"use client";

import { useEffect, useState } from "react";
// import axios from "axios";
import toast from "react-hot-toast";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";
import { EditStaffModal } from "./edit-staff-modal";
import { apiClient } from "@/lib/apiClient";

interface StaffMember {
  fullName: string;
  email: string;
  phoneNumber: string;
  permissionName: string;
}

interface StaffInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
}

export function StaffInfoModal({
  isOpen,
  onClose,
  eventId,
}: StaffInfoModalProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);

  // const getToken = () => {
  //   let rawToken =
  //     localStorage.getItem("hostToken") ||
  //     localStorage.getItem("hostUser") ||
  //     localStorage.getItem("token");

  //   try {
  //     const parsed = JSON.parse(rawToken || "{}");
  //     return parsed?.token || parsed;
  //   } catch {
  //     return rawToken;
  //   }
  // };

  // const fetchStaff = async () => {
  //   if (!eventId) return;

  //   try {
  //     setLoading(true);
  //     const token = getToken();

  //     const response = await axios.get(
  //       `${API_BASE_URL}/users/staff/event/${eventId}`,
  //       {
  //         headers: {
  //           "X-Tenant-ID": HOST_Tenant_ID,
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     // ⭐ Backend returns data as an array of staff
  //     const staffList = response.data?.data || [];

  //     setStaff(staffList);
  //   } catch (error: any) {
  //     console.error(error);
  //     toast.error(error?.response?.data?.message || "Failed to load staff");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchStaff = async () => {
    if (!eventId) return;

    try {
      setLoading(true);

      const response = await apiClient.get(`/users/staff/event/${eventId}`);

      // Backend returns data as array
      const staffList = response.data?.data || [];
      setStaff(Array.isArray(staffList) ? staffList : []);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchStaff();
  }, [isOpen]);

  return !isOpen ? null : (
    <>
      <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
        <div className="relative rounded-2xl shadow-2xl bg-[#FBFBF9] dark:bg-[#101010] w-[300px] h-[550px] sm:w-[400px]">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 className="text-[20px] font-bold">Staff Information</h2>
            <button onClick={onClose}>
              <img src="/images/icons/close-button.png" className="h-6 w-6" />
            </button>
          </div>

          <div
            className="px-6 pb-6 space-y-6 overflow-y-auto"
            style={{ maxHeight: 380 }}
          >
            {loading && (
              <p className="text-center py-10 text-gray-500">Loading staff…</p>
            )}

            {!loading && staff.length === 0 && (
              <p className="text-center py-10 text-gray-500">No staff found</p>
            )}

            {!loading &&
              staff.map((person, idx) => (
                <div key={idx}>
                  <h3 className="text-[16px] font-bold mb-3">
                    Person {idx + 1}
                  </h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-[120px_1fr] gap-4 text-[14px]">
                      <span className="text-[#666]">Full Name</span>
                      <span>{person.fullName}</span>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] gap-4 text-[14px]">
                      <span className="text-[#666]">Email</span>
                      <span>{person.email}</span>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] gap-4 text-[14px]">
                      <span className="text-[#666]">Phone Number</span>
                      <span>{person.phoneNumber}</span>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] gap-4 text-[14px]">
                      <span className="text-[#666]">Permission</span>
                      <span>{person.permissionName}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg"
              style={{ background: "#F5EDE5", color: "#D19537" }}
            >
              Go Back
            </button>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 py-3 rounded-lg text-white"
              style={{ background: "#D19537" }}
            >
              Edit Staff
            </button>
          </div>
        </div>
      </div>

      {/* <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      /> */}

      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit" // <⭐ NEW
        eventId={eventId} // <⭐ NEW
        existingStaff={staff} // <⭐ NEW
        onUpdated={fetchStaff} // <⭐ Refresh UI after PUT
      />
    </>
  );
}

//code before integration

// "use client"

// import { useState } from "react"
// import { EditStaffModal } from "./edit-staff-modal"

// interface StaffMember {
//   fullName: string
//   email: string
//   phoneNumber: string
//   role: string
// }

// interface StaffInfoModalProps {
//   isOpen: boolean
//   onClose: () => void
//   staff: StaffMember[]
// }

// export function StaffInfoModal({ isOpen, onClose, staff }: StaffInfoModalProps) {
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false)

//   if (!isOpen) return null

//   return (
//     <>
//       <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
//         <div
//           className="relative rounded-2xl shadow-2xl bg-[#FBFBF9] dark:bg-[#101010] w-[300px] h-[550px] sm:w-[400px]"
//           // style={{
//           //   width: 420,
//           //   height: 509,
//           //   background: "#FBFBF9",
//           // }}
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between px-6 pt-6 pb-4">
//             <h2 className="text-[20px] font-bold">Staff Information</h2>
//             <button onClick={onClose} aria-label="Close" className="h-6 w-6 grid place-items-center">
//               <img src="/images/icons/close-button.png" alt="" className="h-6 w-6" />
//             </button>
//           </div>

//           {/* Content */}
//           <div className="px-6 pb-6 space-y-6" style={{ maxHeight: 380 }}>
//             {staff.map((person, idx) => (
//               <div key={idx}>
//                 <h3 className="text-[16px] font-bold mb-3">Person {idx + 1}</h3>
//                 <div className="space-y-3">
//                   <div className="grid grid-cols-[120px_1fr] gap-4 text-[14px]">
//                     <span className="text-[#666666]">Full Name</span>
//                     <span className="font-medium">{person.fullName}</span>
//                   </div>
//                   <div className="grid grid-cols-[120px_1fr] gap-4 text-[14px]">
//                     <span className="text-[#666666]">Email</span>
//                     <span className="font-medium">{person.email}</span>
//                   </div>
//                   <div className="grid grid-cols-[120px_1fr] gap-4 text-[14px]">
//                     <span className="text-[#666666]">Phone Number</span>
//                     <span className="font-medium">{person.phoneNumber}</span>
//                   </div>
//                   <div className="grid grid-cols-[120px_1fr] gap-4 text-[14px]">
//                     <span className="text-[#666666]">Role</span>
//                     <span className="font-medium">{person.role}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Footer buttons */}
//           <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
//             <button
//               onClick={onClose}
//               className="flex-1 py-3 rounded-lg text-[14px] font-semibold"
//               style={{ background: "#F5EDE5", color: "#D19537" }}
//             >
//               Go Back
//             </button>
//             <button
//               onClick={() => setIsEditModalOpen(true)}
//               className="flex-1 py-3 rounded-lg text-[14px] font-semibold text-white"
//               style={{ background: "#D19537" }}
//             >
//               Edit Staff
//             </button>
//           </div>
//         </div>
//       </div>

//       <EditStaffModal
//         isOpen={isEditModalOpen}
//         onClose={() => setIsEditModalOpen(false)}
//         onSave={(updatedStaff) => {
//           console.log("[v0] Updated staff:", updatedStaff)
//         }}
//       />
//     </>
//   )
// }
