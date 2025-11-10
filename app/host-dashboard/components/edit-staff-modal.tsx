"use client";

import { useState } from "react";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (staff: StaffMember[]) => void;
}

interface StaffMember {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string; // ✅ Single role only
}

export function EditStaffModal({
  isOpen,
  onClose,
  onSave,
}: EditStaffModalProps) {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { fullName: "", email: "", phoneNumber: "", role: "Both" },
  ]);

  if (!isOpen) return null;

  const handleAddMore = () => {
    setStaffMembers([
      ...staffMembers,
      { fullName: "", email: "", phoneNumber: "", role: "Both" },
    ]);
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

  const handleSubmit = () => {
    onSave?.(staffMembers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40">
      <div className="relative rounded-2xl shadow-2xl bg-white dark:bg-[#101010] overflow-hidden sm:w-[600px] w-[320px]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6">
          <h2 className="sm:text-[24px] text-[20px] font-bold text-black dark:text-white">
            Event Details
          </h2>
          <button
            onClick={handleAddMore}
            className="flex items-center gap-3 sm:px-4 px-2 sm:py-2.5 py-3 rounded-lg bg-black text-white text-[12px] sm:text-[14px] font-semibold"
          >
            <img src="/images/icons/plus-icon.png" alt="" className="h-4 w-4" />
            Add More
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          className="px-8 pb-8 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 180px)" }}
        >
          {staffMembers.map((member, index) => (
            <div
              key={index}
              className={index > 0 ? "mt-8 pt-8 border-t border-gray-200" : ""}
            >
              {/* Full Name */}
              <div className="mb-6">
                <label className="block sm:text-[14px] text-[13px] font-medium text-black dark:text-white mb-2">
                  Full Name <span className="text-[#D6111A]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={member.fullName}
                  onChange={(e) =>
                    handleChange(index, "fullName", e.target.value)
                  }
                  className="w-full px-4 sm:py-3 py-2 rounded-lg border border-gray-200 sm:text-[14px] text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D19537]"
                />
              </div>

              {/* Email Address */}
              <div className="mb-6">
                <label className="block sm:text-[14px] text-[13px] font-medium text-black dark:text-white mb-2">
                  Email Address <span className="text-[#D6111A]">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={member.email}
                  onChange={(e) => handleChange(index, "email", e.target.value)}
                  className="w-full px-4 sm:py-3 py-2 rounded-lg border border-gray-200 sm:text-[14px] text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D19537]"
                />
              </div>

              {/* Phone Number */}
              <div className="mb-6">
                <label className="block sm:text-[14px] text-[13px] font-medium text-black dark:text-white mb-2">
                  Phone Number <span className="text-[#D6111A]">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter Phone Number"
                  value={member.phoneNumber}
                  onChange={(e) =>
                    handleChange(index, "phoneNumber", e.target.value)
                  }
                  className="w-full px-4 sm:py-3 py-2 rounded-lg border border-gray-200 sm:text-[14px] text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D19537]"
                />
              </div>

              {/* Assign Role */}
              <div className="mb-6">
                <label className="block sm:text-[14px] text-[13px] font-medium text-black dark:text-white mb-3">
                  Assign Role <span className="text-[#D6111A]">*</span>
                </label>

                <div className="flex flex-wrap items-center gap-8">
                  {["Check Tickets", "Sold Tickets", "Both"].map((role) => (
                    <label
                      key={role}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <input
                        type="radio"
                        name={`role-${index}`}
                        value={role}
                        checked={member.role === role}
                        onChange={(e) =>
                          handleChange(index, "role", e.target.value)
                        }
                        className="sm:w-5 sm:h-5 w-4 h-4 border border-[#D19537] rounded-full appearance-none checked:bg-[#D19537] checked:border-[#D19537] relative"
                        style={{
                          boxShadow: "inset 0 0 0 3px white",
                        }}
                      />
                      <span className="sm:text-[14px] text-[13px] text-black dark:text-white">
                        {role}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Buttons */}
        <div className="px-8 pb-8 flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex-1 sm:py-3.5 py-2 rounded-lg text-[16px] font-semibold hover:cursor-pointer"
            style={{ background: "#F5EDE5", color: "#D19537" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 sm:py-3.5 py-2 rounded-lg text-[16px] font-semibold text-white hover:cursor-pointer"
            style={{ background: "#D19537" }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

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
//   role: string;
// }

// export function EditStaffModal({
//   isOpen,
//   onClose,
//   onSave,
// }: EditStaffModalProps) {
//   const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
//     { fullName: "", email: "", phoneNumber: "", role: "Both" },
//   ]);

//   if (!isOpen) return null;

//   const handleAddMore = () => {
//     setStaffMembers([
//       ...staffMembers,
//       { fullName: "", email: "", phoneNumber: "", role: "Both" },
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
//       <div
//         className="relative rounded-2xl shadow-2xl bg-white dark:bg-[#101010] overflow-hidden sm:w-[600px] w-[320px]"
//         // style={{
//         //   width: 640,
//         //   maxHeight: "90vh",
//         // }}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-8 pt-8 pb-6">
//           <h2 className="sm:text-[24px] text-[20px] font-bold text-black dark:text-white">Event Details</h2>
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
//                 <div className="flex items-center gap-8">
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="radio"
//                       name={`role-${index}`}
//                       value="Ticket Check"
//                       checked={member.role === "Ticket Check"}
//                       onChange={(e) =>
//                         handleChange(index, "role", e.target.value)
//                       }
//                       className="sm:w-5 sm:h-5 w-4 h-4 border border-[#D19537] rounded-full appearance-none checked:bg-[#D19537] checked:border-[#D19537] relative"
//                       style={{
//                         boxShadow: "inset 0 0 0 3px white", // creates the gap between the dot and border
//                       }}
//                     />

//                     <span className="sm:text-[14px] text-[13px] text-black dark:text-white">Check Tickets</span>
//                   </label>
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="radio"
//                       name={`role-${index}`}
//                       value="Ticket Check"
//                       checked={member.role === "Ticket Check"}
//                       onChange={(e) =>
//                         handleChange(index, "role", e.target.value)
//                       }
//                       className="sm:w-5 sm:h-5 w-4 h-4 border border-[#D19537] rounded-full appearance-none checked:bg-[#D19537] checked:border-[#D19537] relative"
//                       style={{
//                         boxShadow: "inset 0 0 0 3px white", // creates the gap between the dot and border
//                       }}
//                     />

//                     <span className="sm:text-[14px] text-[13px] text-black dark:text-white">Sold Tickets</span>
//                   </label>
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="radio"
//                       name={`role-${index}`}
//                       value="Both"
//                       checked={member.role === "Both"}
//                       onChange={(e) =>
//                         handleChange(index, "role", e.target.value)
//                       }
//                       className="sm:w-5 sm:h-5 w-4 h-4 border border-[#D19537] rounded-full appearance-none checked:bg-[#D19537] checked:border-[#D19537] relative"
//                       style={{
//                         boxShadow: "inset 0 0 0 3px white", // creates the gap between the dot and border
//                       }}
//                     />
//                     <span className="sm:text-[14px] text-[13px] text-black dark:text-white">Both</span>
//                   </label>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Footer buttons */}
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
