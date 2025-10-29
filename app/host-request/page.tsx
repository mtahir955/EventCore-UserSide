"use client";

import { Sidebar } from "../admin/components/sidebar";
import { HostRequestTable } from "../admin/components/host-request-table";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Bell, User, X, LogOut } from "lucide-react";
import Link from "next/link";

export default function HostManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("all");

  const handleFilter = () => {
    setSearchQuery(appliedSearch);
    setStatusFilter(appliedStatus);
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Click outside handler
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
      {/* Sidebar */}
      <Sidebar activePage="Host Request" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:ml-[250px]">
        {/* ===== Header ===== */}
        <header className="hidden lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30">
          <h1 className="text-3xl font-semibold text-foreground">
            Host Request
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/push-notification">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
            </Link>
            {/* Profile icon + dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                }}
                className="bg-black border h-9 w-9 flex justify-center items-center rounded-full hover:opacity-90"
              >
                <img
                  src="/images/icons/profile-user.png"
                  alt="profile"
                  className="h-4 w-4"
                />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border border-gray-200 rounded-xl z-50 py-2">
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Header Placeholder */}
        <div className="lg:hidden h-[56px]" />

        {/* ===== Content ===== */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* ===== Search and Filter Section ===== */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap md:flex-nowrap gap-3 sm:gap-4 mb-6">
            {/* Search Input */}
            <div className="flex-1 relative min-w-[180px]">
              <input
                type="text"
                placeholder="Search Name Or ID"
                value={appliedSearch}
                onChange={(e) => {
                  const value = e.target.value;
                  setAppliedSearch(value);
                  if (value === "") setSearchQuery("");
                }}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground"
              />
              <Image
                src="/icons/search-icon.png"
                alt="Search"
                width={18}
                height={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-90"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative min-w-[140px] sm:min-w-[160px]">
              <select
                value={appliedStatus}
                onChange={(e) => setAppliedStatus(e.target.value)}
                className="appearance-none w-full px-4 sm:px-6 py-2.5 sm:py-3 pr-10 bg-background border border-border rounded-lg text-sm text-foreground cursor-pointer hover:border-primary transition-colors"
              >
                <option value="all">Status</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
              <Image
                src="/icons/chevron-down.png"
                alt="Dropdown"
                width={14}
                height={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>

            {/* Filter Button */}
            <button
              className="px-8 sm:px-10 md:px-12 py-2.5 sm:py-3 bg-[#D19537] text-white rounded-lg font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
              onClick={handleFilter}
            >
              Filter
            </button>
          </div>

          {/* ===== Host Request Table ===== */}
          <div className="overflow-hidden rounded-lg">
            <HostRequestTable
              searchQuery={searchQuery}
              statusFilter={statusFilter}
            />
          </div>
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div
            className="relative flex w-[90%] flex-col items-center justify-center bg-white p-8 shadow-xl sm:w-[500px]"
            style={{ height: "auto", borderRadius: "16px" }}
          >
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
            >
              <X className="size-4" />
            </button>
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-gray-300">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#D19537]">
                <LogOut className="size-6 text-white" />
              </div>
            </div>
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
              Are you sure you want to log out?
            </h2>
            <p className="mb-8 text-center text-gray-600">
              {"You'll be signed out from your account."}
            </p>
            <div className="flex w-full flex-col gap-4 sm:flex-row">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="h-14 w-full bg-gray-100 font-medium text-[#D19537] transition-colors hover:bg-gray-200 sm:w-[212px]"
                style={{ borderRadius: "50px" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Logging out...");
                  setShowLogoutModal(false);
                }}
                className="h-14 w-full bg-[#D19537] font-medium text-white transition-colors hover:bg-[#e99714] sm:w-[212px]"
                style={{ borderRadius: "50px" }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
