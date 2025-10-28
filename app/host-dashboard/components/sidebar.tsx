"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { HelpLineModal } from "./help-line-modal";
import { MessageSuccessModal } from "./message-success-modal";
import { Menu, X, Sun, Moon } from "lucide-react";

type NavItem = {
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
};

export function Sidebar({ active = "Dashboard" }: { active?: string }) {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [messageSuccessOpen, setMessageSuccessOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const items: NavItem[] = [
    {
      label: "Dashboard",
      icon: "/images/icons/dashboard-icon.png",
      href: "/host-dashboard",
    },
    { label: "My Events", icon: "/images/icons/10.png", href: "/my-events" },
    {
      label: "Payment Setup",
      icon: "/images/icons/11.png",
      href: "/payment-setup",
    },
    {
      label: "Completed Events",
      icon: "/images/icons/12.png",
      href: "/completed-events",
    },
    {
      label: "Transfer Requests",
      icon: "/images/icons/14.png",
      href: "/transfer-requests",
    },
    {
      label: "Help Line",
      icon: "/images/icons/13.png",
      onClick: () => setShowHelpModal(true),
    },
  ];

  return (
    <>
      {/* --- Unified Mobile Navbar --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b flex items-center justify-between px-4 py-3">
        {/* Left: Hamburger */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-foreground focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Center: Active Page Title */}
        <h1 className="text-[16px] font-semibold text-center truncate">
          {active}
        </h1>

        {/* Right: Notification + Profile Icons */}
        <div className="flex items-center gap-3">
          <div className="bg-white border h-8 w-8 flex justify-center items-center rounded-full p-1 shadow-sm">
            <img
              src="/images/icons/notification-new.png"
              alt="notification"
              className="rounded-full h-4 w-4"
            />
          </div>
          <div className="bg-black border h-8 w-8 flex justify-center items-center rounded-full p-1">
            <img
              src="/images/icons/profile-user.png"
              alt="profile"
              className="rounded-full h-4 w-4"
            />
          </div>
        </div>
      </div>

      {/* --- Sidebar (Desktop fixed + Mobile slide-in) --- */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full border-r bg-card z-40 transform transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        style={{ width: 256 }}
        aria-label="Sidebar"
      >
        {/* Brand (Desktop only) */}
        <div className="px-6 mt-10 mb-6 hidden md:flex items-center justify-between">
          <div className="text-3xl font-bold tracking-tight text-foreground">
            Event Core
          </div>
        </div>

        {/* Nav Items */}
        <nav className="px-4 mt-20 md:mt-2">
          <ul className="flex flex-col gap-2">
            {items.map((item) => {
              const isActive = item.label === active;
              const Element = item.href ? "a" : "button";

              return (
                <li key={item.label}>
                  <Element
                    {...(item.href
                      ? { href: item.href }
                      : { onClick: item.onClick, type: "button" })}
                    className={cn(
                      "flex items-center gap-3 px-4 py-4 text-[14px] font-medium w-full text-left"
                    )}
                    style={{
                      background: isActive
                        ? "var(--brand-soft)"
                        : "transparent",
                      color: "var(--sidebar-fg, var(--foreground))",
                      borderLeft: isActive ? "4px solid #D19537" : "none",
                    }}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e: React.MouseEvent) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                      setIsSidebarOpen(false); // auto-close on mobile
                    }}
                  >
                    <img
                      src={
                        isActive
                          ? `/images/icons/orange-sidebar-icons/${item.icon
                              .split("/")
                              .pop()}`
                          : item.icon || "/placeholder.svg"
                      }
                      alt=""
                      className="h-5 w-5"
                    />
                    {item.label}
                  </Element>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* --- Bottom Section (Logout + Theme Toggle) --- */}
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

          {/* Light/Dark Toggle Row */}
          <div className="flex justify-center items-center gap-3 mt-2">
            {/* Light Mode */}
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

            {/* Dark Mode */}
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

      {/* --- Overlay (for mobile) --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- Modals --- */}
      <HelpLineModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        setMessageSuccessOpen={setMessageSuccessOpen}
      />
      <MessageSuccessModal
        isOpen={messageSuccessOpen}
        onClose={() => setMessageSuccessOpen(false)}
      />
    </>
  );
}

// "use client";

// import { cn } from "@/lib/utils";
// import { useState } from "react";
// import { HelpLineModal } from "./help-line-modal";
// import { MessageSuccessModal } from "./message-success-modal";
// import { Menu, X } from "lucide-react";

// type NavItem = {
//   label: string;
//   icon: string;
//   href?: string;
//   onClick?: () => void;
// };

// export function Sidebar({ active = "Dashboard" }: { active?: string }) {
//   const [showHelpModal, setShowHelpModal] = useState(false);
//   const [messageSuccessOpen, setMessageSuccessOpen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const items: NavItem[] = [
//     {
//       label: "Dashboard",
//       icon: "/images/icons/dashboard-icon.png",
//       href: "/host-dashboard",
//     },
//     { label: "My Events", icon: "/images/icons/10.png", href: "/my-events" },
//     {
//       label: "Payment Setup",
//       icon: "/images/icons/11.png",
//       href: "/payment-setup",
//     },
//     {
//       label: "Completed Events",
//       icon: "/images/icons/12.png",
//       href: "/completed-events",
//     },
//     {
//       label: "Transfer Requests",
//       icon: "/images/icons/14.png",
//       href: "/transfer-requests",
//     },
//     {
//       label: "Help Line",
//       icon: "/images/icons/13.png",
//       onClick: () => setShowHelpModal(true),
//     },
//   ];

//   return (
//     <>
//       {/* --- Unified Mobile Navbar --- */}
//       <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b flex items-center justify-between px-4 py-3">
//         {/* Left: Hamburger */}
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="text-foreground focus:outline-none"
//           aria-label="Toggle sidebar"
//         >
//           {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
//         </button>

//         {/* Center: Active Page Title */}
//         <h1 className="text-[16px] font-semibold text-center truncate">
//           {active}
//         </h1>

//         {/* Right: Notification + Profile Icons */}
//         <div className="flex items-center gap-3">
//           {/* Notification */}
//           <div className="bg-white border h-8 w-8 flex justify-center items-center rounded-full p-1 shadow-sm">
//             <img
//               src="/images/icons/notification-new.png"
//               alt="notification"
//               className="rounded-full h-4 w-4"
//             />
//           </div>

//           {/* Profile */}
//           <div className="bg-black border h-8 w-8 flex justify-center items-center rounded-full p-1">
//             <img
//               src="/images/icons/profile-user.png"
//               alt="profile"
//               className="rounded-full h-4 w-4"
//             />
//           </div>
//         </div>
//       </div>

//       {/* --- Sidebar (Desktop fixed + Mobile slide-in) --- */}
//       <aside
//         className={cn(
//           "fixed top-0 left-0 h-full border-r bg-card z-40 transform transition-transform duration-300 ease-in-out",
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//         )}
//         style={{ width: 256 }}
//         aria-label="Sidebar"
//       >
//         {/* Brand (Desktop only, hidden on mobile) */}
//         <div className="px-6 mt-10 mb-6 hidden md:flex items-center justify-between">
//           <div className="text-3xl font-bold tracking-tight text-foreground">
//             Event Core
//           </div>
//         </div>

//         {/* Nav Items */}
//         <nav className="px-4 mt-20 md:mt-2">
//           <ul className="flex flex-col gap-2">
//             {items.map((item) => {
//               const isActive = item.label === active;
//               const Element = item.href ? "a" : "button";

//               return (
//                 <li key={item.label}>
//                   <Element
//                     {...(item.href
//                       ? { href: item.href }
//                       : { onClick: item.onClick, type: "button" })}
//                     className={cn(
//                       "flex items-center gap-3 px-4 py-4 text-[14px] font-medium w-full text-left"
//                     )}
//                     style={{
//                       background: isActive
//                         ? "var(--brand-soft)"
//                         : "transparent",
//                       color: "var(--sidebar-fg, var(--foreground))",
//                       borderLeft: isActive ? "4px solid #D19537" : "none",
//                     }}
//                     aria-current={isActive ? "page" : undefined}
//                     onClick={(e: React.MouseEvent) => {
//                       if (item.onClick) {
//                         e.preventDefault();
//                         item.onClick();
//                       }
//                       setIsSidebarOpen(false); // auto-close on mobile
//                     }}
//                   >
//                     <img
//                       src={
//                         isActive
//                           ? `/images/icons/orange-sidebar-icons/${item.icon
//                               .split("/")
//                               .pop()}`
//                           : item.icon || "/placeholder.svg"
//                       }
//                       alt=""
//                       className="h-5 w-5"
//                     />
//                     {item.label}
//                   </Element>
//                 </li>
//               );
//             })}
//           </ul>
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

//       {/* --- Overlay (for mobile) --- */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-30 md:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* --- Modals --- */}
//       <HelpLineModal
//         isOpen={showHelpModal}
//         onClose={() => setShowHelpModal(false)}
//         setMessageSuccessOpen={setMessageSuccessOpen}
//       />
//       <MessageSuccessModal
//         isOpen={messageSuccessOpen}
//         onClose={() => setMessageSuccessOpen(false)}
//       />
//     </>
//   );
// }
