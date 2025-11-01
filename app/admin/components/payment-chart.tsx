"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { date: "1 Oct", previous: 1800, current: 400 },
  { date: "3 Oct", previous: 2800, current: 1200 },
  { date: "7 Oct", previous: 2200, current: 1400 },
  { date: "10 Oct", previous: 2000, current: 800 },
  { date: "14 Oct", previous: 3600, current: 2800 },
  { date: "20 Oct", previous: 3800, current: 1600 },
  { date: "23 Oct", previous: 2714, current: 800 },
  { date: "27 Oct", previous: 3200, current: 2000 },
  { date: "30 Oct", previous: 3600, current: 2200 },
];

export function PaymentChart() {
  const [active, setActive] = useState("Month");
  const options = ["Day", "Week", "Month", "Year"];

  return (
    <div className="bg-background rounded-xl p-4 sm:p-6 shadow-sm w-full">
      {/* ===== Header Section ===== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Left: Title */}
        <div>
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">
            Statistics
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Payment received.
          </h2>
        </div>

        {/* Right: Legends + Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6">
          {/* Legends */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#6366F1]" />
              <span className="text-[11px] sm:text-xs text-muted-foreground">
                Previous Month
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#A78BFA]" />
              <span className="text-[11px] sm:text-xs text-muted-foreground">
                This Month
              </span>
            </div>
          </div>

          {/* Filter Buttons */}
          <div
            className="flex gap-1 sm:gap-2 rounded-2xl py-1 sm:py-2 px-2 sm:px-2"
            style={{ background: "rgba(248, 248, 255, 1)" }}
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setActive(option)}
                className={`px-3 sm:px-4 py-2 sm:py-3 text-[10px] dark:text-gray-700 sm:text-xs rounded-2xl transition-all ${
                  active === option
                    ? "bg-foreground dark:bg-[#6164f7] dark:text-white text-background"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Chart Section ===== */}
      <div className="w-full h-[220px] sm:h-[260px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 10, sm: { fontSize: 12 } }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 10 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                color: "#FFFFFF",
              }}
              formatter={(value) => [`$${value}`, ""]}
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="#6366F1"
              strokeWidth={2}
              dot={{ fill: "#6366F1", r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#A78BFA"
              strokeWidth={2}
              dot={{ fill: "#A78BFA", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}