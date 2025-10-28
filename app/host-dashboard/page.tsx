"use client";

import { useState } from "react";
import { Sidebar } from "../host-dashboard/components/sidebar";
import { StatCard } from "../host-dashboard/components/stat-card";
import { LineChartCard } from "../host-dashboard/components/charts/line-chart-card";
import { DonutChartCard } from "../host-dashboard/components/charts/donut-chart-card";
import { MyEventsCard } from "../host-dashboard/components/my-events-card";
import { WithdrawModal } from "../host-dashboard/components/withdraw-modal";
import { WithdrawSuccessModal } from "../host-dashboard/components/withdraw-success-modal";
import { Menu } from "lucide-react";
import { SidebarToggle } from "../host-dashboard/components/sidebar-toggle";

type Props = {
  imageSrc: string;
  price: string;
  hostby: string;
  title: string;
  description: string;
  location: string;
  date: string;
  audience: number;
  time: string;
};

const dummyEvents: Props[] = [
  {
    imageSrc: "/images/event-1.png",
    price: "1500",
    hostby: "Ali Khan",
    title: "Lahore Music Fest 2025",
    description:
      "Join us for an unforgettable night of music, food, and lights in Lahore.",
    location: "Lahore Expo Center",
    date: "12/11/2025",
    audience: 5000,
    time: "7:00 PM - 11:00 PM",
  },
  {
    imageSrc: "/images/event-2.png",
    price: "0",
    hostby: "ITU CS Department",
    title: "Tech Conference Pakistan",
    description:
      "A gathering of tech enthusiasts discussing AI, Blockchain, and Web3.",
    location: "Islamabad Convention Hall",
    date: "25/11/2025",
    audience: 1200,
    time: "10:00 AM - 5:00 PM",
  },
];

export default function Page() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen w-full bg-[var(--bg-base)] relative overflow-x-hidden">
      {/* --- Sidebar --- */}
      <Sidebar active="Dashboard" />

      {/* --- Mobile Top Bar --- */}
      {/* <div className="md:hidden fixed top-0 left-0 right-0 z-[60] flex items-center justify-between bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Sidebar active="Dashboard" />
          <h3 className="text-lg font-semibold text-black">Dashboard</h3>
        </div> */}

        {/* Right: Notification + Profile */}
        {/* <div className="flex items-center gap-3">
          <div className="bg-white border h-9 w-9 flex justify-center items-center rounded-full">
            <img
              src="/images/icons/notification-new.png"
              alt="notification"
              className="h-4 w-4"
            />
          </div>
          <div className="bg-black border h-9 w-9 flex justify-center items-center rounded-full">
            <img
              src="/images/icons/profile-user.png"
              alt="profile"
              className="h-4 w-4"
            />
          </div>
        </div>
      </div> */}

      {/* --- Overlay for mobile sidebar --- */}
      {/* {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed top-0 left-0 w-[256px] h-full z-30 bg-white shadow-lg transition-transform duration-300 ease-in-out md:hidden">
            <Sidebar active="Dashboard" />
          </div>
        </>
      )} */}

      {/* --- Dashboard Content --- */}
      <section className="flex-1 md:ml-[256px] bg-[#FAFAFB] min-h-screen transition-all duration-300">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 pt-8 pb-4">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-foreground">
              Dashboard
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-[24px] font-black -tracking-[0.02em]">
                Welcome Host_name
              </p>
              <img
                src="/images/icons/wave.png"
                alt="wave"
                className="h-6 w-6"
              />
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4">
              <div className="bg-white border h-9 w-9 flex justify-center items-center rounded-full">
                <img
                  src="/images/icons/notification-new.png"
                  alt="notification"
                  className="h-4 w-4"
                />
              </div>
              <div className="bg-black border h-9 w-9 flex justify-center items-center rounded-full">
                <img
                  src="/images/icons/profile-user.png"
                  alt="profile"
                  className="h-4 w-4"
                />
              </div>
            </div>
            <button
              className="h-10 rounded-2xl px-5 font-medium text-white"
              style={{ background: "var(--brand, #D19537)" }}
              onClick={() => setWithdrawOpen(true)}
            >
              Withdraw
            </button>
          </div>
        </header>

        {/* Mobile Header */}
        <div className="md:hidden mt-20 px-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              Welcome <span className="font-black">Host_name 👋</span>
            </h2>
            <button
              className="h-9 px-4 rounded-2xl text-sm font-medium text-white"
              style={{ background: "#D19537" }}
              onClick={() => setWithdrawOpen(true)}
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-8 mt-6">
          <StatCard
            icon="/images/icons/1.png"
            label="Total Events"
            value="20+"
            accent="indigo"
          />
          <StatCard
            icon="/images/icons/4.png"
            label="Tickets Sold"
            value="12,00"
            accent="yellow"
          />
          <StatCard
            icon="/images/icons/2.png"
            label="Revenue"
            value="$67,000"
            accent="peach"
          />
          <StatCard
            icon="/images/icons/3.png"
            label="Upcoming Events"
            value="5"
            accent="indigo"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-8 mt-8">
          <div className="lg:col-span-7">
            <LineChartCard />
          </div>
          <div className="lg:col-span-5">
            <DonutChartCard />
          </div>
        </div>

        {/* Events Section */}
        <div className="px-4 md:px-8 mt-10 mb-12">
          <h2 className="text-lg md:text-[18px] font-semibold mb-4">
            Explore More Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {dummyEvents.map((event, index) => (
              <MyEventsCard
                key={index}
                imageSrc={event.imageSrc}
                price={event.price}
                isEditEvent={true}
                hostby={event.hostby}
                title={event.title}
                description={event.description}
                location={event.location}
                date={event.date}
                audience={event.audience}
                time={event.time}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- Modals --- */}
      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onRequest={() => {
          setWithdrawOpen(false);
          setSuccessOpen(true);
        }}
      />
      <WithdrawSuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
    </main>
  );
}
