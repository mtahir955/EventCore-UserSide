"use client";
import { useState } from "react";

export default function Tabs({
  activeTab,
  onTabChange,
}: {
  activeTab: "upcoming" | "previous";
  onTabChange: (tab: "upcoming" | "previous") => void;
}) {
  return (
    <div className="mx-auto mt-8 sm:mt-10">
      <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-10 border-b">
        {/* Upcoming Event Button */}
        <button
          onClick={() => onTabChange("upcoming")}
          className={`relative pb-2 sm:pb-4 text-sm sm:text-lg font-medium transition ${
            activeTab === "upcoming"
              ? "text-foreground"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          Upcoming Event
          {activeTab === "upcoming" && (
            <span className="absolute left-0 -bottom-[1px] h-[2px] sm:h-[3px] w-full bg-[var(--color-primary)]" />
          )}
        </button>

        {/* Previous Event Button */}
        <button
          onClick={() => onTabChange("previous")}
          className={`relative pb-2 sm:pb-4 text-sm sm:text-lg font-medium transition ${
            activeTab === "previous"
              ? "text-foreground"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          Previous Event
          {activeTab === "previous" && (
            <span className="absolute left-0 -bottom-[1px] h-[2px] sm:h-[3px] w-full bg-[var(--color-primary)]" />
          )}
        </button>
      </div>
    </div>
  );
}

