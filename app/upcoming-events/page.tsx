"use client";

import { useState, useEffect } from "react";
// import axios from "axios";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import PageTitle from "../upcoming-events/components/page-title";
import CalendarView from "../upcoming-events/components/calendar-view";
import Tabs from "../upcoming-events/components/tabs";
import EventsGrid from "../upcoming-events/components/events-grid";
import Explore from "../upcoming-events/components/explore";

// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";
import { apiClient } from "@/lib/apiClient";
import { normalizeEvent } from "@/lib/event-publishing";

// 🔥 TOKEN HELPER
// function getAuthToken() {
//   let raw =
//     localStorage.getItem("buyerToken") ||
//     localStorage.getItem("userToken") ||
//     localStorage.getItem("hostToken");

//   if (!raw) return null;

//   try {
//     const parsed = JSON.parse(raw);
//     if (parsed?.token) return parsed.token;
//     return raw;
//   } catch {
//     return raw;
//   }
// }

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
  const buildTicketCalendarData = (payload: any) => {
    const ownedTickets = payload?.ownedTickets || [];
    const transferredTickets = payload?.transferredTickets || [];
    const uniqueEvents = new Map<string, any>();

    [...ownedTickets, ...transferredTickets].forEach((entry: any) => {
      const normalizedEvent = normalizeEvent(entry?.event || entry);
      const eventKey = normalizedEvent.id || normalizedEvent.slug;
      const eventDate =
        normalizedEvent.startAt ||
        (normalizedEvent.startDate
          ? new Date(`${normalizedEvent.startDate}T12:00:00`)
          : null);

      if (
        !eventKey ||
        uniqueEvents.has(eventKey) ||
        !eventDate ||
        Number.isNaN(eventDate.getTime())
      ) {
        return;
      }

      uniqueEvents.set(eventKey, {
        id: eventKey,
        slug: normalizedEvent.slug,
        title: normalizedEvent.title,
        type:
          normalizedEvent.mode === "hybrid"
            ? "hybrid"
            : normalizedEvent.mode === "virtual"
            ? "virtual"
            : "in-person",
        date: eventDate.getDate(),
        location:
          normalizedEvent.mode === "virtual"
            ? "Online"
            : normalizedEvent.locationLabel,
        description:
          normalizedEvent.shortDescription || normalizedEvent.description,
        time: normalizedEvent.startTime,
        purchased: true,
        cta: "View Ticket",
        startsAt: eventDate.toISOString(),
      });
    });

    const now = new Date();
    const nextCalendarEvents: Record<string, Record<string, any[]>> = {};
    const nextEventsGrid = {
      upcoming: [] as any[],
      previous: [] as any[],
    };

    uniqueEvents.forEach((event) => {
      const eventDate = new Date(event.startsAt);
      const year = String(eventDate.getFullYear());
      const month = String(eventDate.getMonth() + 1);

      if (!nextCalendarEvents[year]) nextCalendarEvents[year] = {};
      if (!nextCalendarEvents[year][month]) nextCalendarEvents[year][month] = [];

      nextCalendarEvents[year][month].push({
        id: event.id,
        title: event.title,
        type: event.type,
        date: event.date,
        location: event.location,
      });

      if (eventDate >= now) {
        nextEventsGrid.upcoming.push(event);
      } else {
        nextEventsGrid.previous.push(event);
      }
    });

    return {
      calendarEvents: nextCalendarEvents,
      eventsGrid: nextEventsGrid,
    };
  };

  const fetchEvents = async () => {
    try {
      // const token = getAuthToken();
      // if (!token) return;

      // const res = await axios.get(`${API_BASE_URL}/users/events/mine`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "x-tenant-id": HOST_Tenant_ID,
      //   },
      // });

      const res = await apiClient.get("/users/tickets/mine");

      const data = buildTicketCalendarData(res.data?.data || {});

      setCalendarEvents(data.calendarEvents);
      setEventsGrid(data.eventsGrid);
    } catch (err: any) {
      console.error("❌ Error fetching events:", err.response);

      if (err.response?.status === 401) {
        localStorage.removeItem("buyerToken");
        localStorage.removeItem("userToken");
      }

      setCalendarEvents({});
      setEventsGrid({ upcoming: [], previous: [] });
    }
  };

  // -----------------------------------------------------
  // 🔥 FETCH PINNED REMINDERS (/users/calendar)
  // -----------------------------------------------------
  const fetchPinnedCalendar = async () => {
    try {
      // const token = getAuthToken();
      // if (!token) return;

      // const res = await axios.get(`${API_BASE_URL}/users/calendar`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "x-tenant-id": HOST_Tenant_ID,
      //   },
      // });

      const res = await apiClient.get("/users/calendar");

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
