"use client";

import { Sidebar } from "../admin/components/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PaymentWithdrawalTable } from "../admin/components/payment-withdrawal-table";
import { Bell, User } from "lucide-react";

interface WithdrawalRequest {
  id: string;
  name: string;
  avatar: string;
  email: string;
  category: string;
  address: string;
  amount: number;
}

const withdrawalRequests: WithdrawalRequest[] = [
  {
    id: "1",
    name: "Daniel Carter",
    avatar: "/icons/user-avatar-placeholder.png",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    amount: 1220,
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    avatar: "/icons/user-avatar-placeholder.png",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    amount: 1220,
  },
  {
    id: "3",
    name: "Emily Carter",
    avatar: "/icons/user-avatar-placeholder.png",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    amount: 1220,
  },
  {
    id: "4",
    name: "Nathan Blake",
    avatar: "/icons/user-avatar-placeholder.png",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    amount: 1220,
  },
  {
    id: "5",
    name: "Taylor Morgan",
    avatar: "/icons/user-avatar-placeholder.png",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    amount: 1220,
  },
];

export default function PaymentWithdrawalPage() {
  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar */}
      <Sidebar activePage="Payment Withdrawal" />

      {/* Main Section */}
      <main className="flex-1 overflow-auto lg:ml-[250px]">
        {/* ===== Header ===== */}
        <header className="hidden lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30">
          <h1 className="text-3xl font-semibold text-foreground">
            Payment Withdrawal
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

        {/* Mobile Header Spacer */}
        <div className="lg:hidden h-[56px]" />

        {/* ===== Page Content ===== */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* ===== Stats Cards ===== */}
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-4 
              gap-4 
              md:gap-6 
              mb-8
            "
          >
            {/* Total Events Card */}
            <div className="flex items-center gap-4 rounded-lg bg-background p-4 sm:p-5 md:p-6 shadow-sm">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg bg-blue-50">
                <Image
                  alt="Total Events"
                  src="/icons/calendar-active-icon.png"
                  width={28}
                  height={28}
                  className="h-6 w-6 sm:h-7 sm:w-7"
                />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  720
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Total Events
                </p>
              </div>
            </div>

            {/* Tickets Sold Card */}
            <div className="flex items-center gap-4 rounded-lg bg-background p-4 sm:p-5 md:p-6 shadow-sm">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg bg-orange-50">
                <Image
                  src="/icons/ticket-icon.png"
                  alt="Tickets Sold"
                  width={28}
                  height={28}
                  className="h-6 w-6 sm:h-7 sm:w-7"
                />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  12,00
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Tickets Sold
                </p>
              </div>
            </div>

            {/* Revenue Card */}
            <div className="flex items-center gap-4 rounded-lg bg-background p-4 sm:p-5 md:p-6 shadow-sm">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg bg-pink-50">
                <Image
                  src="/icons/revenue-icon.png"
                  alt="Revenue"
                  width={28}
                  height={28}
                  className="h-6 w-6 sm:h-7 sm:w-7"
                />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  $67,000
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Revenue
                </p>
              </div>
            </div>

            {/* Active Events Card */}
            <div className="flex items-center gap-4 rounded-lg bg-background p-4 sm:p-5 md:p-6 shadow-sm">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg bg-blue-50">
                <Image
                  src="/icons/calendar-check-icon.png"
                  alt="Active Events"
                  width={28}
                  height={28}
                  className="h-6 w-6 sm:h-7 sm:w-7"
                />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  150
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Active Events
                </p>
              </div>
            </div>
          </div>

          {/* ===== Payment Withdrawal Table ===== */}
          <div className="overflow-x-auto rounded-lg border border-border bg-background">
            <PaymentWithdrawalTable />
          </div>
        </div>
      </main>
    </div>
  );
}