"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type LineChartPoint = {
  date: string;
  value: number;
};

type LineChartCardProps = {
  data: LineChartPoint[];
};

export function LineChartCard({ data }: LineChartCardProps) {
  const safeData = Array.isArray(data) && data.length > 0 ? data : [];

  return (
    <div className="rounded-2xl border bg-card p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-semibold">Reports</h3>
        <span className="text-muted-foreground text-size-lg">...</span>
      </div>

      {/* Chart */}
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={safeData}
            margin={{ left: 6, right: 8, top: 8, bottom: 8 }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#6EA2FF" />
                <stop offset="100%" stopColor="#F173FF" />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeOpacity={0.2} />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              width={30}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickCount={6}
              domain={[0, 100]}
            />

            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--bg-base)",
              }}
              labelStyle={{
                color: "var(--muted-foreground)",
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#lineGradient)"
              strokeWidth={4}
              dot={{
                r: 5,
                fill: "#fff",
                strokeWidth: 3,
                stroke: "#A2B6FF",
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Empty state */}
      {safeData.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          No report data available
        </div>
      )}
    </div>
  );
}

// "use client";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// const data = [
//   { name: "1 August", value: 55 },
//   { name: "1 August", value: 35 },
//   { name: "1 August", value: 60 },
//   { name: "1 August", value: 38 },
//   { name: "1 August", value: 28 },
//   { name: "1 August", value: 50 },
//   { name: "1 August", value: 70 },
//   { name: "1 August", value: 62 },
//   { name: "1 August", value: 80 },
// ];

// export function LineChartCard() {
//   return (
//     <div className="rounded-2xl border bg-card p-5">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-[16px] font-semibold">Reports</h3>
//         <span className="text-muted-foreground text-size-lg">...</span>
//       </div>
//       <div style={{ height: 300 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart
//             data={data}
//             margin={{ left: 6, right: 8, top: 8, bottom: 8 }}
//           >
//             <defs>
//               <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
//                 <stop offset="0%" stopColor="#6EA2FF" />
//                 <stop offset="100%" stopColor="#F173FF" />
//               </linearGradient>
//             </defs>
//             <CartesianGrid vertical={false} strokeOpacity={0.2} />
//             <XAxis
//               dataKey="name"
//               tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <YAxis
//               width={30}
//               tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
//               axisLine={false}
//               tickLine={false}
//               tickCount={6}
//               domain={[0, 100]}
//             />

//             <Tooltip
//               cursor={{ strokeDasharray: "3 3" }}
//               contentStyle={{
//                 borderRadius: 12,
//                 border: "1px solid var(--color-border)",
//               }}
//               labelStyle={{ color: "var(--muted-foreground)" }}
//             />
//             <Line
//               type="monotone"
//               dataKey="value"
//               stroke="url(#lineGradient)"
//               strokeWidth={4}
//               dot={{ r: 5, fill: "#fff", strokeWidth: 3, stroke: "#A2B6FF" }}
//               activeDot={{ r: 6 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
