"use client";

import { Sidebar } from "../admin/components/sidebar";
import { StatCard } from "../admin/components/stat-card";
import { RecentEventsTable } from "../admin/components/recent-events-table";
import { TicketSoldChart } from "../admin/components/ticket-sold-chart";
import { PaymentChart } from "../admin/components/payment-chart";
import { useState } from "react";
import { Bell, User } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar (responsive handled inside component) */}
      <Sidebar activePage="Dashboard" />

      {/* ===== Main Content ===== */}
      <main className="flex-1 overflow-auto lg:ml-[250px]">
        {/* ===== Header ===== */}
        <header className="hidden lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30">
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>

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
        {/* ===== Mobile Header (matches navbar in Sidebar) ===== */}
        <div className="lg:hidden h-[56px]" /> {/* spacer for mobile navbar */}
        {/* ===== Page Content ===== */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* ===== Stats Section ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard
              icon="/icons/calendar-icon.png"
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

          {/* ===== Charts & Tables ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RecentEventsTable />
            <TicketSoldChart />
          </div>

          {/* ===== Payment Chart ===== */}
          <PaymentChart />
        </div>
      </main>
    </div>
  );
}