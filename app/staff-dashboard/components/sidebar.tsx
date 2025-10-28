"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpLineModal } from "../../host-dashboard/components/help-line-modal";
import { MessageSuccessModal } from "../../host-dashboard/components/message-success-modal";
import { Menu, Bell, User } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [messageSuccessOpen, setMessageSuccessOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      icon: "/icons/sidebar/1.png",
      orangeicon: "/icons/sidebar-orange/1.png",
      href: "/staff-dashboard",
    },
    {
      name: "My Events",
      icon: "/icons/sidebar/7.png",
      orangeicon: "/icons/sidebar-orange/2.png",
      href: "/my-events-staff",
    },
    {
      name: "Ticket Check",
      icon: "/icons/sidebar/5.png",
      orangeicon: "/icons/sidebar-orange/4.png",
      href: "/ticket-check-staff",
    },
    {
      name: "Profile & Settings",
      icon: "/icons/sidebar/2.png",
      orangeicon: "/icons/sidebar-orange/5.png",
      href: "/profile-settings-staff",
    },
  ];

  return (
    <>
      {/* ======= MOBILE NAVBAR ======= */}
      <div className="md:hidden fixed top-0 left-0 w-full z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        {/* Left: Hamburger */}
        <button onClick={() => setShowSidebar(!showSidebar)}>
          <Menu className="h-6 w-6 text-gray-800" />
        </button>

        {/* Center: Page Title */}
        <h2 className="text-[18px] font-semibold text-gray-900">
          {navItems.find((i) => pathname === i.href)?.name || "Dashboard"}
        </h2>

        {/* Right: Icons */}
        <div className="flex items-center gap-1">
          <button className="relative rounded-full p-2 hover:bg-gray-100">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/streamline_notification-alarm-2-RLHabfgcsHuMg4zK1SGDZx4PHbCduL.png"
              alt="Notifications"
              width={22}
              height={22}
              className="h-5 w-5"
            />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-park-twotone_user-v4ka4ClrgGwoq3YXmLCKojK3azxf3E.png"
              alt="User"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </button>
        </div>
      </div>

      {/* ======= SIDEBAR ======= */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-[260px] bg-white border-r border-gray-100 p-6 z-50 transform transition-transform duration-300 ease-in-out 
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-[26px] font-bold text-black">Event Core</h1>
          {/* Close button for mobile */}
          <button
            className="md:hidden text-gray-600 text-[22px]"
            onClick={() => setShowSidebar(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setShowSidebar(false)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive ? "bg-[#F5EDE5]" : "hover:bg-gray-50"
                }`}
              >
                <Image
                  src={isActive ? item.orangeicon : item.icon}
                  alt={item.name}
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
                <span
                  className={`font-medium ${
                    isActive ? "text-[#D19537]" : "text-gray-700"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Help & Support */}
          <button
            onClick={() => {
              setShowHelpModal(true);
              setShowSidebar(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-gray-50"
          >
            <svg
              className="h-5 w-5 text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="font-medium text-gray-700">Help & Support</span>
          </button>
        </nav>

        {/* Logout Button
        <div className="absolute left-0 right-0 bottom-6 px-4">
          <button
            className="w-full sm:w-[230px] flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-[14px]"
            style={{ background: "#E8E8E866", color: "var(--foreground)" }}
          >
            <img
              src="/images/icons/logout-icon-dark.png"
              alt="logout"
              className="h-5 w-5"
            />
            Logout
          </button>
        </div> */}
      </aside>

      {/* --- MODALS --- */}
      <HelpLineModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        setMessageSuccessOpen={setMessageSuccessOpen}
      />
      <MessageSuccessModal
        isOpen={messageSuccessOpen}
        onClose={() => setMessageSuccessOpen(false)}
      />

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </>
  );
}
