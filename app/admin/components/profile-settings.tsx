"use client";

import { useState } from "react";
import Image from "next/image";
import { Sidebar } from "../../admin/components/sidebar";
import Header from "../../admin/components/header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function ProfileSettings() {
  const [notifications, setNotifications] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
    address: "",
    language: "",
    currency: "",
    timezone: "",
    dateFormat: "",
    theme: "",
  });

  const generateEmail = () => {
    const random = Math.floor(Math.random() * 10000);
    return `user${random}@eventcore.com`;
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(
      { length: 8 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    const emptyFields = Object.entries(formData).filter(
      ([key, value]) => !value || value.trim() === ""
    );

    if (emptyFields.length > 0) {
      alert("⚠️ Please fill all required fields before creating.");
      return;
    }

    setShowPopup(true);
  };

  const generatedEmail = generateEmail();
  const generatedPassword = generatePassword();

  return (
    <div className="flex flex-col md:flex-row min-h-screen sm:w-[1170] bg-white dark:bg-[#101010] font-sans md:ml-[250px]">
      <Sidebar activePage="Profile & Settings" />

      <main className="flex-1 overflow-auto bg-[#FAFAFB] dark:bg-[#101010]">
        {/* Header */}
        <div className="hidden sm:block">
          <Header title="Profile & Settings" />
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b bg-white dark:bg-[#191919]">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
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

        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          {/* BASIC INFO */}
          <section className="rounded-xl bg-white dark:bg-[#191919] p-6 shadow-sm">
            <h3 className="mb-6 text-lg sm:text-xl font-bold text-black dark:text-white">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                name="firstName"
                formData={formData}
                onChange={handleInputChange}
              />
              <InputField
                label="Last Name"
                name="lastName"
                formData={formData}
                onChange={handleInputChange}
              />
              <SelectField
                label="Gender"
                name="gender"
                options={["Female", "Male", "Other"]}
                formData={formData}
                onChange={handleInputChange}
              />
              <InputField
                label="Email"
                type="email"
                name="email"
                formData={formData}
                onChange={handleInputChange}
              />
            </div>
          </section>

          {/* CONTACT DETAILS */}
          <section className="rounded-xl bg-white dark:bg-[#191919] p-6 shadow-sm">
            <h3 className="mb-6 text-lg sm:text-xl font-bold text-black dark:text-white">
              Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField
                label="Phone Number"
                name="phone"
                formData={formData}
                onChange={handleInputChange}
              />
              <InputField
                label="City/Town"
                name="city"
                formData={formData}
                onChange={handleInputChange}
              />
              <InputField
                label="Pincode"
                name="pincode"
                formData={formData}
                onChange={handleInputChange}
              />
            </div>
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Address:
              </label>
              <textarea
                name="address"
                placeholder="Enter address"
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                className="w-full resize-none rounded-lg border border-[#E8E8E8] dark:border-gray-700 bg-[#FAFAFB] dark:bg-[#101010] px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#D19537] focus:ring-[#D19537]"
              />
            </div>
          </section>

          {/* GENERAL SETTINGS */}
          <section className="rounded-xl bg-white dark:bg-[#191919] p-6 shadow-sm">
            <h3 className="mb-6 text-lg sm:text-xl font-bold text-black dark:text-white">
              General Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SelectField
                label="System Language"
                name="language"
                options={["English"]}
                formData={formData}
                onChange={handleInputChange}
              />
              <SelectField
                label="Currency"
                name="currency"
                options={["USD ($)", "EUR (€)", "GBP (£)"]}
                formData={formData}
                onChange={handleInputChange}
              />
              <SelectField
                label="Time Zone"
                name="timezone"
                options={["CET", "EST", "PST"]}
                formData={formData}
                onChange={handleInputChange}
              />
              <SelectField
                label="Date Format"
                name="dateFormat"
                options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
                formData={formData}
                onChange={handleInputChange}
              />
              <SelectField
                label="Default Theme"
                name="theme"
                options={["Light Theme", "Dark Theme", "Auto"]}
                formData={formData}
                onChange={handleInputChange}
              />
            </div>
          </section>

          {/* CREATE BUTTON */}
          <Button
            className="mt-4 w-32 h-10 bg-[#D19537] hover:bg-[#b8862b] text-white font-semibold"
            onClick={handleCreate}
          >
            Create
          </Button>
        </div>
      </main>

      {/* POPUP MODAL */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="max-w-[400px] rounded-xl bg-white dark:bg-[#181818] p-6 text-center shadow-xl">
          <DialogTitle className="text-xl font-semibold text-black dark:text-white mb-3">
            Account Created Successfully 🎉
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            Here are your new credentials for <strong>Event Core</strong>:
          </p>
          <div className="space-y-2 text-sm text-left bg-gray-50 dark:bg-[#222222] p-4 rounded-lg">
            <p>
              <strong>Company:</strong> Event Core
            </p>
            <p>
              <strong>Email:</strong> {generatedEmail}
            </p>
            <p>
              <strong>Password:</strong> {generatedPassword}
            </p>
            <p>
              <strong>Link:</strong>{" "}
              <a
                href="https://eventcore.com/login"
                target="_blank"
                className="text-[#0077F7] underline"
              >
                https://eventcore.com/login
              </a>
            </p>
          </div>
          <Button
            onClick={() => setShowPopup(false)}
            className="mt-5 w-full bg-[#D19537] text-white hover:bg-[#b8862b]"
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- Reusable Input/Select Components ---------- */
function InputField({ label, name, type = "text", formData, onChange }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-black dark:text-white">
        {label}:
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full rounded-lg border border-[#E8E8E8] dark:border-gray-700 bg-[#FAFAFB] dark:bg-[#101010] px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#D19537] focus:ring-[#D19537]"
      />
    </div>
  );
}

function SelectField({ label, name, options, formData, onChange }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={onChange}
        className="w-full appearance-none rounded-lg border border-[#E8E8E8] dark:border-gray-700 bg-[#FAFAFB] dark:bg-[#101010] px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-[#D19537] focus:ring-[#D19537]"
      >
        <option value="">Select {label}</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Sidebar } from "../../admin/components/sidebar";
// import Header from "../../admin/components/header";
// import { Button } from "@/components/ui/button";

// export default function ProfileSettings() {
//   const [notifications, setNotifications] = useState(true);

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen w-full sm:w-[1170px] bg-white font-sans md:ml-[250px]">
//       {/* Sidebar */}
//       <div className=" md:block">
//         <Sidebar activePage="Profile & Settings" />
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 overflow-auto bg-[#FAFAFB] dark:bg-[#101010]">
//         {/* Header */}
//         <div className="hidden sm:block">
//           <Header title="Profile & Settings" />
//         </div>

//         {/* Mobile Header */}
//         <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b bg-white">
//           <h1 className="text-lg font-semibold text-gray-900">
//             Profile & Settings
//           </h1>
//           <Image
//             src="/images/user-icon.png"
//             alt="User"
//             width={28}
//             height={28}
//             className="rounded-full"
//           />
//         </div>

//         <div className="p-4 sm:p-6 md:p-8">
//           {/* Basic Information */}
//           <div className="mb-6 rounded-xl bg-white dark:bg-[#191919] p-4 sm:p-6 md:p-8 shadow-sm">
//             <h3 className="mb-6 text-lg sm:text-xl font-bold text-black dark:text-white">
//               Basic Information
//             </h3>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-black dark:text-white">
//                   First Name:
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter first name"
//                   className="w-full rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] dark:bg-[#101010] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-black dark:text-white">
//                   Last Name:
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter last name"
//                   className="w-full rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] dark:bg-[#101010] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-black dark:text-white">
//                   Gender
//                 </label>
//                 <div className="relative">
//                   <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] dark:bg-[#101010] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
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
//                 <label className="mb-2 block text-sm font-medium text-black dark:text-white">
//                   Email:
//                 </label>
//                 <input
//                   type="email"
//                   placeholder="Enter email"
//                   className="w-full rounded-lg border border-[#E8E8E8] dark:bg-[#101010] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Contact Details */}
//           <div className="mb-6 rounded-xl bg-white dark:bg-[#191919] p-4 sm:p-6 md:p-8 shadow-sm">
//             <h3 className="mb-6 text-lg sm:text-xl font-bold text-black dark:text-white">
//               Contact Details
//             </h3>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//               {/* Phone */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-black dark:text-white">
//                   Phone Number:
//                 </label>
//                 <div className="flex flex-wrap sm:flex-nowrap gap-2">
//                   <div className="relative w-24">
//                     <button className="flex w-full items-center justify-between rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] dark:bg-[#101010] px-3 py-3 text-sm">
//                       <Image
//                         src="/images/us-flag.png"
//                         alt="US"
//                         width={20}
//                         height={20}
//                         className="h-5 w-5 rounded-full"
//                       />
//                       <Image
//                         src="/images/chevron-down.png"
//                         alt="Dropdown"
//                         width={12}
//                         height={12}
//                         className="h-3 w-3"
//                       />
//                     </button>
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="+1"
//                     className="w-20 rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] dark:bg-[#101010] px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//                   />
//                   <input
//                     type="text"
//                     placeholder="125-559-8852"
//                     className="flex-1 rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] dark:bg-[#101010] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//                   />
//                 </div>
//               </div>

//               {/* City */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-black dark:text-white">
//                   City/Town:
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter city"
//                   className="w-full rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] dark:bg-[#101010] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//                 />
//               </div>

//               {/* Pincode */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-black dark:text-white">
//                   Pincode:
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter pincode"
//                   className="w-full rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] dark:bg-[#101010] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//                 />
//               </div>
//             </div>

//             <div className="mt-6">
//               <label className="mb-2 block text-sm font-medium text-black dark:text-white">
//                 Address:
//               </label>
//               <textarea
//                 placeholder="Enter address"
//                 rows={4}
//                 className="w-full resize-none rounded-lg border border-[#E8E8E8] dark:bg-[#101010] bg-[#FAFAFB] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]"
//               />
//             </div>
//           </div>

//           {/* General Settings */}
//           <div className="rounded-xl bg-white dark:bg-[#191919] p-4 sm:p-6 md:p-8 shadow-sm">
//             <h3 className="mb-6 text-lg sm:text-xl font-bold text-black dark:text-white">
//               General Settings
//             </h3>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-black dark:text-white">
//                   System Language
//                 </label>
//                 <div className="relative">
//                   <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] dark:bg-[#101010] px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
//                     <option>English</option>
//                     {/* <option>Spanish</option>
//                     <option>French</option> */}
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
//                 <label className="mb-2 block text-sm font-medium text-black dark:text-white">
//                   Currency
//                 </label>
//                 <div className="relative">
//                   <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] dark:bg-[#101010] px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
//                     <option>USD ($)</option>
//                     {/* <option>EUR (€)</option>
//                     <option>GBP (£)</option> */}
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
//                 <label className="mb-2 block text-sm font-medium text-black dark:text-white">
//                   Time Zone
//                 </label>
//                 <div className="relative">
//                   <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] dark:bg-[#101010] px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
//                     <option>CET- Central European Time</option>
//                     <option>EST- Eastern Standard Time</option>
//                     <option>PST- Pacific Standard Time</option>
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
//                 <label className="mb-2 block text-sm font-medium text-black dark:text-white">
//                   Date and Time Format
//                 </label>
//                 <div className="relative">
//                   <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] dark:bg-[#101010] px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
//                     <option>DD/MM/YYYY</option>
//                     <option>MM/DD/YYYY</option>
//                     <option>YYYY-MM-DD</option>
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
//                 <label className="mb-2 block text-sm font-medium text-black dark:text-white">
//                   Default theme for Users
//                 </label>
//                 <div className="relative">
//                   <select className="w-full appearance-none rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] dark:bg-[#101010] px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-[#D19537] focus:outline-none focus:ring-1 focus:ring-[#D19537]">
//                     <option>Light Theme</option>
//                     <option>Dark Theme</option>
//                     <option>Auto</option>
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
//                 <label className="mb-2 block text-sm font-medium text-black dark:text-white">
//                   Notifications
//                 </label>
//                 <div
//                   onClick={() => setNotifications(!notifications)}
//                   className="flex items-center justify-between rounded-lg border border-[#E8E8E8] bg-[#FAFAFB] dark:bg-[#101010] px-4 py-3 cursor-pointer select-none transition-colors"
//                 >
//                   <span className="text-sm text-gray-900 dark:text-white">
//                     Allow system notifications
//                   </span>

//                   <div
//                     className={`relative h-6 w-11 rounded-full transition-colors ${
//                       notifications ? "bg-[#D19537]" : "bg-gray-300"
//                     }`}
//                   >
//                     <span
//                       className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
//                         notifications ? "left-[22px]" : "left-0.5"
//                       }`}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <Button className="mt-4 w-26 h-10 bg-[#D19537]">Create</Button>
//         </div>
//       </main>
//     </div>
//   );
// }
