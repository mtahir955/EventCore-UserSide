"use client";

import { Sidebar } from "../admin/components/sidebar";
import { StatCard } from "../admin/components/stat-card";
import { RecentEventsTable } from "../admin/components/recent-events-table";
import { TicketSoldChart } from "../admin/components/ticket-sold-chart";
import { PaymentChart } from "../admin/components/payment-chart";
import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import LogoutModal from "@/components/modals/LogoutModal";
import useAuthInterceptor from "@/utils/useAuthInterceptor";

export default function DashboardPage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { setTheme } = useTheme();
  const [adminName, setAdminName] = useState("Admin");

  useAuthInterceptor("admin"); // <— activates 401 redirect for this user role

  /* ================================
        💡 ENSURE THEME ON FIRST LOAD
  ================================== */
  useEffect(() => {
    const savedTheme = localStorage.getItem("adminTheme");
    if (savedTheme === "dark") {
      setTheme("dark");
    } else {
      setTheme("light");
    }

    // Load admin name if stored
    const savedUser = localStorage.getItem("adminUser");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setAdminName(parsed.userName || "Admin");
    }
  }, [setTheme]);

  /* ================================
        Click outside to close dropdown
  ================================== */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-secondary dark:bg-[#101010]">
      {/* Sidebar */}
      <Sidebar activePage="Dashboard" />

      {/* ===== Main Content ===== */}
      <main className="flex-1 overflow-auto lg:ml-[250px] dark:bg-[#101010]">
        {/* ===== Header ===== */}
        <header className="hidden lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30 dark:bg-[#101010] dark:border-gray-800">
          <h1 className="text-3xl font-semibold text-foreground dark:text-white">
            Dashboard
          </h1>

          <div className="flex items-center gap-4">
            <Link href="/push-notification">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </Link>

            {/* Profile + Dropdown */}
            <div className="relative flex items-center gap-2" ref={profileRef}>
              <span className="hidden sm:block font-semibold text-black dark:text-white">
                {adminName}
              </span>

              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="bg-black border h-9 w-9 flex justify-center items-center rounded-full hover:opacity-90"
                >
                  <img
                    src="/images/icons/profile-user.png"
                    alt="profile"
                    className="h-4 w-4"
                  />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 dark:border-gray-800 rounded-xl z-50 py-2">
                    <Link href="/tenant-form">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        Create Tenant
                      </button>
                    </Link>

                    <Link href="/host-management">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        Tenant Host
                      </button>
                    </Link>

                    <Link href="/tenant-management">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        Tenant Management
                      </button>
                    </Link>

                    <Link href="/system-settings">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        System Settings
                      </button>
                    </Link>

                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===== Mobile Header spacer ===== */}
        <div className="lg:hidden h-[56px]" />

        {/* ===== Page Content ===== */}
        <div className="p-4 sm:p-6 md:p-8">
          <Link href="/tenant-form">
            <Button className="h-10 mb-3 w-34 bg-[#0077F7] hover:bg-[#0066D6] text-white">
              Create tenant
            </Button>
          </Link>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard
              icon="/icons/calendar-active-icon.png"
              value="720"
              label="Total Events"
              bgColor="bg-blue-100"
            />
            <StatCard
              icon="/icons/ticket-icon.png"
              value="12,00"
              label="Tickets Sold"
              bgColor="bg-yellow-100"
            />
            <StatCard
              icon="/icons/dashboard-icon-1.png"
              value="$67,000"
              label="Revenue"
              bgColor="bg-red-100"
            />
            <StatCard
              icon="/icons/dashboard-icon-2.png"
              value="150"
              label="Active Events"
              bgColor="bg-purple-100"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RecentEventsTable />
            <TicketSoldChart />
          </div>

          {/* Payment Chart */}
          <PaymentChart />
        </div>
      </main>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/sign-in-admin";
        }}
      />
    </div>
  );
}

// "use client";

// import { Sidebar } from "../admin/components/sidebar";
// import { StatCard } from "../admin/components/stat-card";
// import { RecentEventsTable } from "../admin/components/recent-events-table";
// import { TicketSoldChart } from "../admin/components/ticket-sold-chart";
// import { PaymentChart } from "../admin/components/payment-chart";
// import { useState, useRef, useEffect } from "react";
// import { Bell, User, X, LogOut, Moon, Sun } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { useTheme } from "next-themes";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import LogoutModal from "@/components/modals/LogoutModal";

// export default function DashboardPage() {
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);
//   const profileRef = useRef<HTMLDivElement>(null);

//   // Click outside handler
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(e.target as Node)
//       ) {
//         setShowProfileDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const { resolvedTheme, theme, setTheme } = useTheme();
//   const [adminName, setAdminName] = useState("Admin");

//   return (
//     <div className="flex min-h-screen bg-secondary">
//       {/* Sidebar (responsive handled inside component) */}
//       <Sidebar activePage="Dashboard" />

//       {/* ===== Main Content ===== */}
//       <main className="flex-1 overflow-auto lg:ml-[250px] dark:bg-[#101010]">
//         {/* ===== Header ===== */}
//         <header className="hidden lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30">
//           <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>

//           <div className="flex items-center gap-4">
//             {/* Light/Dark toggle */}
//             {/* <Button
//               onClick={() =>
//                 setTheme(resolvedTheme === "light" ? "dark" : "light")
//               }
//               variant="ghost"
//               size="sm"
//               className="hidden lg:flex text-gray-600 dark:text-gray-300 gap-2 hover:text-[#0077F7]"
//             >
//               {theme === "light" ? (
//                 <>
//                   <Moon className="h-4 w-4" /> Dark Mode
//                 </>
//               ) : (
//                 <>
//                   <Sun className="h-4 w-4" /> Light Mode
//                 </>
//               )}
//             </Button> */}

//             {/* Mobile toggle */}
//             {/* <button
//               onClick={() =>
//                 setTheme(resolvedTheme === "light" ? "dark" : "light")
//               }
//               className="lg:hidden p-1 text-gray-700 dark:text-gray-300 hover:text-[#0077F7] flex-shrink-0"
//             >
//               {theme === "light" ? (
//                 <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
//               ) : (
//                 <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
//               )}
//             </button> */}
//             <Link href="/push-notification">
//               <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
//                 <Bell className="h-5 w-5 text-gray-600" />
//               </button>
//             </Link>
//             {/* Profile Name + Icon + Dropdown */}
//             <div className="relative flex items-center gap-2" ref={profileRef}>
//               {/* Admin Name */}
//               <span className="hidden sm:block font-semibold text-black dark:text-white">
//                 {adminName}
//               </span>

//               {/* Profile Icon Wrapper for relative dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => setShowProfileDropdown(!showProfileDropdown)}
//                   className="bg-black border h-9 w-9 flex justify-center items-center rounded-full hover:opacity-90"
//                 >
//                   <img
//                     src="/images/icons/profile-user.png"
//                     alt="profile"
//                     className="h-4 w-4"
//                   />
//                 </button>

//                 {/* Dropdown — Positioned relative to icon */}
//                 {showProfileDropdown && (
//                   <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 dark:border-gray-800 rounded-xl z-50 py-2">
//                     <Link href="/tenant-form">
//                       <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
//                         Create Tenant
//                       </button>
//                     </Link>

//                     <Link href="/host-management">
//                       <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
//                         Tenant Host
//                       </button>
//                     </Link>

//                     <Link href="/tenant-management">
//                       <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
//                         Tenant Management
//                       </button>
//                     </Link>

//                     <Link href="/system-settings">
//                       <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
//                         System Settings
//                       </button>
//                     </Link>

//                     <button
//                       onClick={() => setShowLogoutModal(true)}
//                       className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>
//         {/* ===== Mobile Header (matches navbar in Sidebar) ===== */}
//         <div className="lg:hidden h-[56px]" /> {/* spacer for mobile navbar */}
//         {/* ===== Page Content ===== */}
//         <div className="p-4 sm:p-6 md:p-8">
//           <Link href="/tenant-form">
//             <Button className="h-10 mb-3 w-34 bg-[#0077F7] hover:bg-[#0066D6] text-white">
//               Create tenant
//             </Button>
//           </Link>

//           {/* ===== Stats Section ===== */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
//             <StatCard
//               icon="/icons/calendar-active-icon.png"
//               value="720"
//               label="Total Events"
//               bgColor="bg-blue-100"
//             />
//             <StatCard
//               icon="/icons/ticket-icon.png"
//               value="12,00"
//               label="Tickets Sold"
//               bgColor="bg-yellow-100"
//             />
//             <StatCard
//               icon="/icons/dashboard-icon-1.png"
//               value="$67,000"
//               label="Revenue"
//               bgColor="bg-red-100"
//             />
//             <StatCard
//               icon="/icons/dashboard-icon-2.png"
//               value="150"
//               label="Active Events"
//               bgColor="bg-purple-100"
//             />
//           </div>

//           {/* ===== Charts & Tables ===== */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//             <RecentEventsTable />
//             <TicketSoldChart />
//           </div>

//           {/* ===== Payment Chart ===== */}
//           <PaymentChart />
//         </div>
//       </main>

//       {/* Logout Modal */}
//       <LogoutModal
//         isOpen={showLogoutModal}
//         onClose={() => setShowLogoutModal(false)}
//         onLogout={() => {
//           localStorage.clear();
//           window.location.href = "/sign-in-admin";
//         }}
//       />
//     </div>
//   );
// }
