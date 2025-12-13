"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/app/admin/components/sidebar";
import { TenantEventsTable } from "../../admin/components/TenantEventsTable";
import { EventRevenueModal } from "../../admin/components/EventRevenueModal";
import Link from "next/link";
import { Bell } from "lucide-react";
import LogoutModal from "@/components/modals/LogoutModal";
import { useRouter } from "next/navigation";

export default function TenantDetailsPage() {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const router = useRouter();

  const profileRef = useRef<HTMLDivElement>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  // Load admin name safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("adminUser");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setAdminName(parsed.userName || "Admin");
      }
    }
  }, []);

  // Close profile dropdown on outside click
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
    <div className="flex min-h-screen bg-secondary">
      <Sidebar activePage="Tenant Host" />

      <main className="flex-1 overflow-auto lg:ml-[250px] dark:bg-[#101010]">
        {/* Desktop Header */}
        <header className="hidden lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30">
          <h1 className="text-3xl font-semibold text-foreground">
            Tenant Events
          </h1>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Link href="/push-notification">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
            </Link>

            {/* Profile */}
            <div className="relative flex items-center gap-2" ref={profileRef}>
              <span className="hidden sm:block font-semibold text-black dark:text-white">
                {adminName}
              </span>

              <button
                onClick={() => setShowProfileDropdown((prev) => !prev)}
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
                    <button className="dropdown-btn">Create Tenant</button>
                  </Link>
                  <Link href="/host-management">
                    <button className="dropdown-btn">Tenant Host</button>
                  </Link>
                  <Link href="/tenant-management">
                    <button className="dropdown-btn">Tenant Management</button>
                  </Link>
                  <Link href="/system-settings">
                    <button className="dropdown-btn">System Settings</button>
                  </Link>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="dropdown-btn"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile spacer */}
        <div className="lg:hidden h-[56px]" />

        {/* Back Button */}
        <div className="px-4 sm:px-6 md:px-8 pt-4">
          <button
            onClick={() => router.back()}
            className="
      inline-flex items-center gap-2
      px-4 py-2
      rounded-lg
      border border-border
      text-sm font-medium
      text-foreground
      hover:bg-secondary
      transition
    "
          >
            ← Back
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Events Table */}
          <TenantEventsTable onRowClick={(event) => setSelectedEvent(event)} />
        </div>

        {/* Revenue Modal */}
        <EventRevenueModal
          isOpen={!!selectedEvent}
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
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
