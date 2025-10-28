"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import PageTitle from "../upcoming-events/components/page-title";
import CalendarView from "../upcoming-events/components/calendar-view";
import Tabs from "../upcoming-events/components/tabs";
import EventsGrid from "../upcoming-events/components/events-grid";
import Explore from "../upcoming-events/components/explore";

export default function CalendarPage() {
  // Track which tab is active
  const [activeTab, setActiveTab] = useState<"upcoming" | "previous">(
    "upcoming"
  );

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content Container */}
      <div className="mx-auto w-full max-w-[1340px] px-4 sm:px-6 md:px-8">
        {/* Page Title */}
        <PageTitle />

        {/* Tabs */}
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        {/* Conditional Sections */}
        {activeTab === "upcoming" && (
          <>
            <CalendarView />
            <EventsGrid activeTab={activeTab} />
          </>
        )}

        {activeTab === "previous" && (
          <>
            <EventsGrid activeTab={activeTab} />
          </>
        )}

        {/* Explore More Events - Always Visible */}
        <Explore />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
