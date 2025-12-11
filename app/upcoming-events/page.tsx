"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import PageTitle from "../upcoming-events/components/page-title";
import CalendarView from "../upcoming-events/components/calendar-view";
import Tabs from "../upcoming-events/components/tabs";
import EventsGrid from "../upcoming-events/components/events-grid";
import Explore from "../upcoming-events/components/explore";

import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

// 🔥 TOKEN HELPER
function getAuthToken() {
  let raw =
    localStorage.getItem("buyerToken") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("hostToken");

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed?.token) return parsed.token;
    return raw;
  } catch {
    return raw;
  }
}

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "previous">(
    "upcoming"
  );

  const [calendarEvents, setCalendarEvents] = useState<any>({});
  const [eventsGrid, setEventsGrid] = useState<any>({
    upcoming: [],
    previous: [],
  });

  const [loading, setLoading] = useState(true);

  const [selectedRange, setSelectedRange] = useState<{
    checkIn: number | null;
    checkOut: number | null;
  }>({ checkIn: null, checkOut: null });

  // -----------------------------------------------------
  // 🔥 FETCH USER EVENTS (/users/events/mine)
  // -----------------------------------------------------
  const fetchEvents = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await axios.get(`${API_BASE_URL}/users/events/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant-id": HOST_Tenant_ID,
        },
      });

      const data = res.data?.data;

      setCalendarEvents(data.calendarEvents || {});
      setEventsGrid(data.eventsGrid || {});
    } catch (err: any) {
      console.error("❌ Error fetching events:", err.response);

      if (err.response?.status === 401) {
        localStorage.removeItem("buyerToken");
        localStorage.removeItem("userToken");
      }
    }
  };

  // -----------------------------------------------------
  // 🔥 FETCH PINNED REMINDERS (/users/calendar)
  // -----------------------------------------------------
  const fetchPinnedCalendar = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await axios.get(`${API_BASE_URL}/users/calendar`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant-id": HOST_Tenant_ID,
        },
      });

      const entries = res.data?.data?.entries || [];
      const formatted: any = {};

      entries.forEach((entry: any) => {
        if (!entry.reminderDate) return;

        const dateObj = new Date(entry.reminderDate);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();

        if (!formatted[year]) formatted[year] = {};
        if (!formatted[year][month]) formatted[year][month] = [];

        formatted[year][month].push({
          id: entry.id,
          title: entry.event?.title || "Pinned Event",
          date: day,
          location: entry.event?.location || "",
          type: "pinned",
        });
      });

      // ⭐ MERGE without overwriting existing event data
      setCalendarEvents((prev: any) => {
        const updated = { ...prev };

        Object.keys(formatted).forEach((year) => {
          if (!updated[year]) updated[year] = {};

          Object.keys(formatted[year]).forEach((month) => {
            if (!updated[year][month]) updated[year][month] = [];

            updated[year][month] = [
              ...updated[year][month], // existing "you", "purchased", etc.
              ...formatted[year][month], // appended pinned entries
            ];
          });
        });

        return updated;
      });
    } catch (err) {
      console.log("❌ Error loading pinned calendar:", err);
    }
  };

  // -----------------------------------------------------
  // 🔥 LOAD EVENTS + PINNED TOGETHER (NO MONTH API)
  // -----------------------------------------------------
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);

      await fetchEvents(); // purchased + joined events
      await fetchPinnedCalendar(); // pinned reminders

      setLoading(false);
    };

    loadAll();
  }, []);

  // -----------------------------------------------------
  // 🔥 LOADING UI
  // -----------------------------------------------------
  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 dark:text-gray-300">
        Loading your events...
      </p>
    );

  // -----------------------------------------------------
  // 🔥 PAGE UI (UNCHANGED)
  // -----------------------------------------------------
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Header />

      <div className="mx-auto w-full max-w-[1340px] px-4 sm:px-6 md:px-8">
        <PageTitle />

        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "upcoming" && (
          <>
            <CalendarView
              calendarEvents={calendarEvents}
              onDateRangeSelect={setSelectedRange}
            />

            <EventsGrid
              activeTab={activeTab}
              selectedRange={selectedRange}
              eventsGrid={eventsGrid}
            />
          </>
        )}

        {activeTab === "previous" && (
          <EventsGrid
            activeTab={activeTab}
            selectedRange={selectedRange}
            eventsGrid={eventsGrid}
          />
        )}

        <Explore />
      </div>

      <Footer />
    </main>
  );
}

//code before integration

// "use client";

// import { useState } from "react";
// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
// import PageTitle from "../upcoming-events/components/page-title";
// import CalendarView from "../upcoming-events/components/calendar-view";
// import Tabs from "../upcoming-events/components/tabs";
// import EventsGrid from "../upcoming-events/components/events-grid";
// import Explore from "../upcoming-events/components/explore";

// export default function CalendarPage() {
//   // Track which tab is active
//   const [activeTab, setActiveTab] = useState<"upcoming" | "previous">(
//     "upcoming"
//   );

//   return (
//     <main className="bg-background text-foreground min-h-screen">
//       {/* Header */}
//       <Header />

//       {/* Main Content Container */}
//       <div className="mx-auto w-full max-w-[1340px] px-4 sm:px-6 md:px-8">
//         {/* Page Title */}
//         <PageTitle />

//         {/* Tabs */}
//         <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
//         {/* Conditional Sections */}
//         {activeTab === "upcoming" && (
//           <>
//             <CalendarView />
//             <EventsGrid activeTab={activeTab} />
//           </>
//         )}

//         {activeTab === "previous" && (
//           <>
//             <EventsGrid activeTab={activeTab} />
//           </>
//         )}

//         {/* Explore More Events - Always Visible */}
//         <Explore />
//       </div>

//       {/* Footer */}
//       <Footer />
//     </main>
//   );
// }
