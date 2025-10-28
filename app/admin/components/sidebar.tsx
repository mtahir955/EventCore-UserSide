"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, Bell, User, Sun, Moon } from "lucide-react";

interface SidebarProps {
  className?: string;
  activePage?: string;
}

const menuItems = [
  {
    name: "Dashboard",
    icon: "/icons/sidebar/1.png",
    orangeicon: "/icons/sidebar-orange/1.png",
    href: "/admin",
  },
  {
    name: "User Management",
    icon: "/icons/sidebar/3.png",
    orangeicon: "/icons/sidebar-orange/7.png",
    href: "/user-management",
  },
  {
    name: "Host Management",
    icon: "/icons/sidebar/4.png",
    orangeicon: "/icons/sidebar-orange/2.png",
    href: "/host-management",
  },
  {
    name: "Host Request",
    icon: "/icons/sidebar/5.png",
    orangeicon: "/icons/sidebar-orange/3.png",
    href: "/host-request",
  },
  {
    name: "Payment Withdrawal",
    icon: "/icons/sidebar/7.png",
    orangeicon: "/icons/sidebar-orange/6.png",
    href: "/payment-withdrawal",
  },
  {
    name: "Push Notification Center",
    icon: "/icons/sidebar/6.png",
    orangeicon: "/icons/sidebar-orange/4.png",
    href: "/push-notification",
  },
  {
    name: "System Settings",
    icon: "/icons/sidebar/2.png",
    orangeicon: "/icons/sidebar-orange/5.png",
    href: "/system-settings",
  },
];

export function Sidebar({ className, activePage = "Dashboard" }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <>
      {/* ===== Mobile Navbar ===== */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-background border-b border-border px-4 py-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-muted focus:outline-none"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        <h2 className="text-base font-semibold text-foreground truncate">
          {activePage}
        </h2>

        <div className="flex items-center gap-4">
          <Link href="/push-notification">
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
              <Bell className="h-4 w-4 text-gray-600" />
            </button>
          </Link>
          <button className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
            <User className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ===== Sidebar ===== */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-background border-r border-border flex flex-col transition-transform duration-200 ease-in-out z-50",
          "lg:translate-x-0 lg:w-[250px]",
          isOpen ? "translate-x-0 w-[250px]" : "-translate-x-full w-[250px]",
          className
        )}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h1 className="sm:text-3xl text-2xl font-bold text-foreground">
            Event Core
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-muted"
          >
            ✕
          </button>
        </div>

        {/* Nav Menu */}
        <nav className="flex-1 px-3 overflow-y-auto mt-2">
          {menuItems.map((item, index) => {
            const isActive = item.name === activePage;
            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-4 mb-1 transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground font-medium border-l-4 border-[#D19537]"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <Image
                  src={isActive ? item.orangeicon : item.icon}
                  alt={item.name}
                  width={20}
                  height={20}
                />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ===== Bottom Section (Logout + Theme Toggle Row) ===== */}
        <div className="absolute left-0 right-0 bottom-6 px-4 space-y-3">
          {/* Logout Button */}
          <button
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-[14px]"
            style={{ background: "#E8E8E866", color: "var(--foreground)" }}
          >
            <img
              src="/images/icons/logout-icon-dark.png"
              alt="logout"
              className="h-5 w-5"
            />
            Logout
          </button>

          {/* Light/Dark Buttons Row */}
          <div className="flex justify-center items-center gap-3 mt-2">
            {/* Light Button */}
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-all duration-150",
                theme === "light"
                  ? "bg-[#D19537] text-white border-[#D19537]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              )}
            >
              <Sun size={16} />
              Light
            </button>

            {/* Dark Button */}
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-all duration-150",
                theme === "dark"
                  ? "bg-[#D19537] text-white border-[#D19537]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              )}
            >
              <Moon size={16} />
              Dark
            </button>
          </div>
        </div>
      </aside>

      {/* ===== Overlay for mobile ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import { useState } from "react";
// import { Menu, Bell, User } from "lucide-react";

// interface SidebarProps {
//   className?: string;
//   activePage?: string;
// }

// const menuItems = [
//   {
//     name: "Dashboard",
//     icon: "/icons/sidebar/1.png",
//     orangeicon: "/icons/sidebar-orange/1.png",
//     href: "/admin",
//   },
//   {
//     name: "User Management",
//     icon: "/icons/sidebar/3.png",
//     orangeicon: "/icons/sidebar-orange/7.png",
//     href: "/user-management",
//   },
//   {
//     name: "Host Management",
//     icon: "/icons/sidebar/4.png",
//     orangeicon: "/icons/sidebar-orange/2.png",
//     href: "/host-management",
//   },
//   {
//     name: "Host Request",
//     icon: "/icons/sidebar/5.png",
//     orangeicon: "/icons/sidebar-orange/3.png",
//     href: "/host-request",
//   },
//   {
//     name: "Payment Withdrawal",
//     icon: "/icons/sidebar/7.png",
//     orangeicon: "/icons/sidebar-orange/6.png",
//     href: "/payment-withdrawal",
//   },
//   {
//     name: "Push Notification Center",
//     icon: "/icons/sidebar/6.png",
//     orangeicon: "/icons/sidebar-orange/4.png",
//     href: "/push-notification",
//   },
//   {
//     name: "System Settings",
//     icon: "/icons/sidebar/2.png",
//     orangeicon: "/icons/sidebar-orange/5.png",
//     href: "/system-settings",
//   },
// ];

// export function Sidebar({ className, activePage = "Dashboard" }: SidebarProps) {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       {/* ===== Mobile Navbar ===== */}
//       <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-background border-b border-border px-4 py-3">
//         {/* Hamburger icon */}
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="p-2 rounded-md hover:bg-muted focus:outline-none"
//         >
//           <Menu className="w-6 h-6 text-foreground" />
//         </button>

//         {/* Center title */}
//         <h2 className="text-base font-semibold text-foreground truncate">
//           {activePage}
//         </h2>

//         {/* Notification + Profile */}
//         <div className="flex items-center gap-4">
//           <Link href="/push-notification">
//             <button className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
//               <Bell className="h-4 w-4 text-gray-600" />
//             </button>
//           </Link>
//           <button className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
//             <User className="h-4 w-4" />
//           </button>
//         </div>
//       </header>

//       {/* ===== Sidebar ===== */}
//       <aside
//         className={cn(
//           "fixed top-0 left-0 h-screen bg-background border-r border-border flex flex-col transition-transform duration-200 ease-in-out z-50",
//           // Desktop (same as original)
//           "lg:translate-x-0 lg:w-[250px]",
//           // Mobile (toggle visibility)
//           isOpen ? "translate-x-0 w-[250px]" : "-translate-x-full w-[250px]",
//           className
//         )}
//       >
//         {/* Logo/Header */}
//         <div className="p-6 border-b border-border flex items-center justify-between">
//           <h1 className="sm:text-4xl text-2xl font-bold text-foreground">
//             Event Core
//           </h1>

//           {/* Close button (only visible on mobile) */}
//           <button
//             onClick={() => setIsOpen(false)}
//             className="lg:hidden p-2 rounded-md hover:bg-muted"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Nav Menu */}
//         <nav className="flex-1 px-3 overflow-y-auto mt-2">
//           {menuItems.map((item, index) => {
//             const isActive = item.name === activePage;
//             return (
//               <Link
//                 key={index}
//                 href={item.href}
//                 onClick={() => setIsOpen(false)}
//                 className={cn(
//                   "w-full flex items-center gap-3 px-4 py-4 mb-1 transition-colors",
//                   isActive
//                     ? "bg-accent text-accent-foreground font-medium border-l-4 border-[#D19537]"
//                     : "text-foreground hover:bg-secondary"
//                 )}
//               >
//                 <Image
//                   src={isActive ? item.orangeicon : item.icon}
//                   alt={item.name}
//                   width={20}
//                   height={20}
//                 />
//                 <span className="text-sm">{item.name}</span>
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Logout Button */}
//         <div className="absolute left-0 right-0 bottom-6 px-4">
//           <button
//             className="w-full flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-[14px]"
//             style={{ background: "#E8E8E866", color: "var(--foreground)" }}
//           >
//             <img
//               src="/images/icons/logout-icon-dark.png"
//               alt="logout"
//               className="h-5 w-5"
//             />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* ===== Overlay for mobile ===== */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/30 z-40 lg:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//     </>
//   );
// }
