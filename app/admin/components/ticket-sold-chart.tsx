"use client";

import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";

const data = [
  { year: "2017", value: 2500000 },
  { year: "2018", value: 1800000 },
  { year: "2019", value: 2800000 },
  { year: "2020", value: 2200000 },
  { year: "2021", value: 1600000 },
  { year: "2022", value: 2000000 },
];

export function TicketSoldChart({ data }: { data: any[] }) {
  return (
    <div className="bg-background rounded-xl p-4 sm:p-6 shadow-sm w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6">
        <div>
          <div className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1">
            Statistics
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Ticket Sold
          </h2>
        </div>

        <select
          className="px-3 sm:px-4 py-2 border border-border dark:text-black rounded-full text-xs sm:text-sm bg-background w-full sm:w-auto"
          style={{ background: "rgba(248, 248, 255, 1)" }}
        >
          <option>Annual</option>
          <option>Monthly</option>
          <option>Weekly</option>
        </select>
      </div>

      {/* Chart Container */}
      <div className="w-full h-[220px] sm:h-[260px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 10, sm: { fontSize: 12 } }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 10 }}
              tickFormatter={(value) => `${value / 1000000}M`}
            />
            <Bar dataKey="value" fill="#E9D5FF9F" radius={[6, 6, 0, 0]} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#A855F7"
              strokeWidth={2}
              dot={{ fill: "#A855F7", r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
