"use client";

import { Sidebar } from "../admin/components/sidebar";
import { HostManagementTable } from "../admin/components/host-management-table";
import Image from "next/image";
import { useState } from "react";
import { Bell, User } from "lucide-react";
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://eventcore.solution/invite");
  };

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar (responsive handled inside component) */}
      <Sidebar activePage="Host Management" />

      <main className="flex-1 overflow-auto lg:ml-[250px]">
        {/* ===== Desktop Header ===== */}
        <header className="hidden lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30">
          <h1 className="text-3xl font-semibold text-foreground">
            Host Management
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/push-notification">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
            </Link>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
              <User className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Spacer for mobile navbar */}
        <div className="lg:hidden h-[56px]" />

        {/* ===== Content Section ===== */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* ===== Send Invitation Section ===== */}
          <div className="bg-background flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl p-4 mb-6">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                Send Invitation
              </h2>
              <p className="text-sm sm:text-base font-semibold text-muted-foreground mb-3">
                Invite new hosts by sharing your unique link
              </p>
            </div>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <input
                type="text"
                value="https://eventcore.solution/invite"
                readOnly
                className="flex-1 px-4 py-2 sm:py-2.5 bg-secondary border border-border rounded-lg text-xs sm:text-sm text-foreground"
              />
              <button
                onClick={handleCopyLink}
                className="px-6 sm:px-8 py-2 sm:py-2.5 bg-[#D19537] text-white rounded-lg font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
              >
                Copy
              </button>
            </div>
          </div>

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

            {/* Status Filter */}
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
              onClick={handleFilter}
              className="px-8 sm:px-10 md:px-12 py-2.5 sm:py-3 bg-[#D19537] text-white rounded-lg font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              Filter
            </button>
          </div>

          {/* ===== Host Management Table ===== */}
          <div className="overflow-hidden rounded-lg">
            <HostManagementTable
              searchQuery={searchQuery}
              statusFilter={statusFilter}
            />
          </div>
        </div>
      </main>
    </div>
  );
}