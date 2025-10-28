"use client";

import { useState } from "react";
import Image from "next/image";
import Sidebar from "./sidebar";
import Header from "./header";

export default function ProfileSettings() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-white font-sans">
      {/* Sidebar */}
      <div className=" md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#FAFAFB]">
        {/* Header */}
        <div className="hidden sm:block">
          <Header title="Profile & Settings" />
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b bg-white">
          <h1 className="text-lg font-semibold text-gray-900">
            Profile & Settings
          </h1>
          <Image
            src="/images/user-icon.png"
            alt="User"
            width={28}
            height={28}
            className="rounded-full"
          />
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Basic Information */}
          <div className="mb-6 rounded-xl bg-white p-4 sm:p-6 md:p-8 shadow-sm">
            <h3 className="mb-6 text-lg sm:text-xl font-bold text-black">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  First Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  className="w-full rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Last Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  className="w-full rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Gender
                </label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                  <Image
                    src="/images/chevron-down.png"
                    alt="Dropdown"
                    width={16}
                    height={16}
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Email:
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="mb-6 rounded-xl bg-white p-4 sm:p-6 md:p-8 shadow-sm">
            <h3 className="mb-6 text-lg sm:text-xl font-bold text-black">
              Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Phone Number:
                </label>
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  <div className="relative w-24">
                    <button className="flex w-full items-center justify-between rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-3 py-3 text-sm">
                      <Image
                        src="/images/us-flag.png"
                        alt="US"
                        width={20}
                        height={20}
                        className="h-5 w-5 rounded-full"
                      />
                      <Image
                        src="/images/chevron-down.png"
                        alt="Dropdown"
                        width={12}
                        height={12}
                        className="h-3 w-3"
                      />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="+1"
                    className="w-20 rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
                  />
                  <input
                    type="text"
                    placeholder="125-559-8852"
                    className="flex-1 rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  City/Town:
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  className="w-full rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Pincode:
                </label>
                <input
                  type="text"
                  placeholder="Enter pincode"
                  className="w-full rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-black">
                Address:
              </label>
              <textarea
                placeholder="Enter address"
                rows={4}
                className="w-full resize-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
              />
            </div>
          </div>

          {/* General Settings */}
          <div className="rounded-xl bg-white p-4 sm:p-6 md:p-8 shadow-sm">
            <h3 className="mb-6 text-lg sm:text-xl font-bold text-black">
              General Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  System Language
                </label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                  <Image
                    src="/images/chevron-down.png"
                    alt="Dropdown"
                    width={16}
                    height={16}
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Currency
                </label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                  <Image
                    src="/images/chevron-down.png"
                    alt="Dropdown"
                    width={16}
                    height={16}
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Time Zone
                </label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
                    <option>CET- Central European Time</option>
                    <option>EST- Eastern Standard Time</option>
                    <option>PST- Pacific Standard Time</option>
                  </select>
                  <Image
                    src="/images/chevron-down.png"
                    alt="Dropdown"
                    width={16}
                    height={16}
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Date and Time Format
                </label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                  <Image
                    src="/images/chevron-down.png"
                    alt="Dropdown"
                    width={16}
                    height={16}
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Default theme for Users
                </label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
                    <option>Light Theme</option>
                    <option>Dark Theme</option>
                    <option>Auto</option>
                  </select>
                  <Image
                    src="/images/chevron-down.png"
                    alt="Dropdown"
                    width={16}
                    height={16}
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Notifications
                </label>
                <div className="flex items-center justify-between rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3">
                  <span className="text-sm text-gray-900">
                    Allow system notifications
                  </span>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      notifications ? "bg-[#D19537]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                        notifications ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// "use client"

// import { useState } from "react"
// import Image from "next/image"
// import Sidebar from "./sidebar"
// import Header from "./header"

// export default function ProfileSettings() {
//   const [notifications, setNotifications] = useState(true)

//   return (
//     <div className="flex min-h-screen w-[1420px] bg-white font-sans">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <main className="flex-1 overflow-auto bg-[#FAFAFB]">
//         {/* Header */}
//         <Header title="Profile & Settings" />

//         <div className="p-8">
//           {/* Basic Information */}
//           <div className="mb-6 rounded-xl bg-white p-8 shadow-sm">
//             <h3 className="mb-6 text-xl font-bold text-black">Basic Information</h3>

//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-black">First Name:</label>
//                 <input
//                   type="text"
//                   placeholder="Enter first name"
//                   className="w-full rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-black">Last Name:</label>
//                 <input
//                   type="text"
//                   placeholder="Enter last name"
//                   className="w-full rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-black">Gender</label>
//                 <div className="relative">
//                   <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
//                     <option>Female</option>
//                     <option>Male</option>
//                     <option>Other</option>
//                   </select>
//                   <Image
//                     src="/images/chevron-down.png"
//                     alt="Dropdown"
//                     width={16}
//                     height={16}
//                     className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-black">Email:</label>
//                 <input
//                   type="email"
//                   placeholder="Enter email"
//                   className="w-full rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Contact Details */}
//           <div className="mb-6 rounded-xl bg-white p-8 shadow-sm">
//             <h3 className="mb-6 text-xl font-bold text-black">Contact Details</h3>

//             <div className="grid grid-cols-3 gap-6">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-black">Phone Number:</label>
//                 <div className="flex gap-2">
//                   <div className="relative w-24">
//                     <button className="flex w-full items-center gap-2 rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-3 py-3 text-sm">
//                       <Image
//                         src="/images/us-flag.png"
//                         alt="US"
//                         width={20}
//                         height={20}
//                         className="h-5 w-5 rounded-full"
//                       />
//                       <Image src="/images/chevron-down.png" alt="Dropdown" width={12} height={12} className="h-3 w-3" />
//                     </button>
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="+1"
//                     className="w-20 rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//                   />
//                   <input
//                     type="text"
//                     placeholder="125-559-8852"
//                     className="flex-1 rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-black">City/Town:</label>
//                 <input
//                   type="text"
//                   placeholder="Enter city"
//                   className="w-full rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-black">Pincode:</label>
//                 <input
//                   type="text"
//                   placeholder="Enter pincode"
//                   className="w-full rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//                 />
//               </div>
//             </div>

//             <div className="mt-6">
//               <label className="mb-2 block text-sm font-medium text-black">Address:</label>
//               <textarea
//                 placeholder="Enter address"
//                 rows={4}
//                 className="w-full resize-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//               />
//             </div>
//           </div>

//           {/* General Settings */}
//           <div className="rounded-xl bg-white p-8 shadow-sm">
//             <h3 className="mb-6 text-xl font-bold text-black">General Settings</h3>

//             <div className="grid grid-cols-2 gap-6">
// <div>
//   <label className="mb-2 block text-sm font-medium text-black">System Language</label>
//   <div className="relative">
//     <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
//       <option>English</option>
//       <option>Spanish</option>
//       <option>French</option>
//     </select>
//     <Image
//       src="/images/chevron-down.png"
//       alt="Dropdown"
//       width={16}
//       height={16}
//       className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
//     />
//   </div>
// </div>

// <div>
//   <label className="mb-2 block text-sm font-medium text-black">Currency</label>
//   <div className="relative">
//     <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
//       <option>USD ($)</option>
//       <option>EUR (€)</option>
//       <option>GBP (£)</option>
//     </select>
//     <Image
//       src="/images/chevron-down.png"
//       alt="Dropdown"
//       width={16}
//       height={16}
//       className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
//     />
//   </div>
// </div>

// <div>
//   <label className="mb-2 block text-sm font-medium text-black">Time Zone</label>
//   <div className="relative">
//     <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
//       <option>CET- Central European Time</option>
//       <option>EST- Eastern Standard Time</option>
//       <option>PST- Pacific Standard Time</option>
//     </select>
//     <Image
//       src="/images/chevron-down.png"
//       alt="Dropdown"
//       width={16}
//       height={16}
//       className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
//     />
//   </div>
// </div>

// <div>
//   <label className="mb-2 block text-sm font-medium text-black">Date and Time Format</label>
//   <div className="relative">
//     <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
//       <option>DD/MM/YYYY</option>
//       <option>MM/DD/YYYY</option>
//       <option>YYYY-MM-DD</option>
//     </select>
//     <Image
//       src="/images/chevron-down.png"
//       alt="Dropdown"
//       width={16}
//       height={16}
//       className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
//     />
//   </div>
// </div>

// <div>
//   <label className="mb-2 block text-sm font-medium text-black">Default theme for Users</label>
//   <div className="relative">
//     <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
//       <option>Light Theme</option>
//       <option>Dark Theme</option>
//       <option>Auto</option>
//     </select>
//     <Image
//       src="/images/chevron-down.png"
//       alt="Dropdown"
//       width={16}
//       height={16}
//       className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
//     />
//   </div>
// </div>

// <div>
//   <label className="mb-2 block text-sm font-medium text-black">Notifications</label>
//   <div className="flex items-center justify-between rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] px-4 py-3">
//     <span className="text-sm text-gray-900">Allow system notifications</span>
//     <button
//       onClick={() => setNotifications(!notifications)}
//       className={`relative h-6 w-11 rounded-full transition-colors ${
//         notifications ? "bg-[#D19537]" : "bg-gray-300"
//       }`}
//     >
//       <span
//         className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
//           notifications ? "left-[22px]" : "left-0.5"
//         }`}
//       />
//     </button>
//   </div>
// </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }
