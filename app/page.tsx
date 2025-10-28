"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SearchSection } from "@/components/search-section";
import { PopularEvents } from "@/components/popular-events";
import { Footer } from "@/components/footer";

export default function Home() {
  // State to store search filters from SearchSection
  const [searchQuery, setSearchQuery] = useState({
    eventName: "",
    location: "",
    date: null as string | null,
  });

  return (
    <main className="min-h-screen bg-white dark:bg-[#101010] text-foreground">
      {/* Header */}
      <Header />

      {/* Hero Banner */}
      <HeroSection />

      {/* Search Bar */}
      <SearchSection onSearch={setSearchQuery} />

      {/* Popular Events (filtered dynamically by search) */}
      <PopularEvents searchQuery={searchQuery} />

      {/* Footer */}
      <Footer />
    </main>
  );
}

