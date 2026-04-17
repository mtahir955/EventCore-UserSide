"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatCurrency, type TicketTypeBreakdown } from "@/lib/hostDashboardAnalytics";

const COLORS = ["rgba(91, 147, 255, 1)", "rgba(255, 214, 107, 1)"];
const EMPTY_COLOR = "rgba(209, 213, 219, 1)";

type DonutChartCardProps = {
  soldPercentage: number;
  transferredPercentage: number;
  ticketTypeBreakdown?: TicketTypeBreakdown[];
  revenueTypeBreakdown?: TicketTypeBreakdown[];
  currency?: string;
};

export function DonutChartCard({
  soldPercentage,
  transferredPercentage,
  ticketTypeBreakdown = [],
  revenueTypeBreakdown = [],
  currency = "USD",
}: DonutChartCardProps) {
  const safeSold = Number.isFinite(soldPercentage) ? soldPercentage : 0;
  const safeTransferred = Number.isFinite(transferredPercentage)
    ? transferredPercentage
    : 0;

  const data = [
    { name: "Ticket Sold", value: safeSold },
    { name: "Ticket Transferred", value: safeTransferred },
  ];
  const hasActivity = data.some((item) => item.value > 0);
  const chartData = hasActivity ? data : [{ name: "No activity", value: 1 }];

  return (
    <div className="rounded-2xl border bg-card p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-semibold">Analytics</h3>
        <span className="text-muted-foreground text-size-lg">...</span>
      </div>

      {/* Chart */}
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={70}
              outerRadius={95}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              cornerRadius={6}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={hasActivity ? COLORS[index % COLORS.length] : EMPTY_COLOR}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Center Text */}
      <div className="text-center -mt-[160px] mb-[120px] pointer-events-none">
        <div className="text-[28px] font-bold">{safeSold}%</div>
        <div className="text-[12px] text-muted-foreground">Transactions</div>
      </div>

      {/* Legend */}
      <div className="mt-10 flex items-center justify-center gap-6">
        <LegendDot color={COLORS[0]} label={`Ticket Sold (${safeSold}%)`} />
        <LegendDot
          color={COLORS[1]}
          label={`Ticket Transferred (${safeTransferred}%)`}
        />
      </div>

      <BreakdownList
        title="Tickets by type"
        emptyText="No ticket type data yet"
        items={ticketTypeBreakdown}
        getValue={(item) => item.ticketsSold.toLocaleString()}
      />

      <BreakdownList
        title="Revenue by type"
        emptyText="No revenue breakdown yet"
        items={revenueTypeBreakdown}
        getValue={(item) => formatCurrency(item.revenue, currency)}
      />
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className="inline-block h-3 w-3 rounded-full"
        style={{ background: color }}
        aria-hidden
      />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function BreakdownList({
  title,
  emptyText,
  items,
  getValue,
}: {
  title: string;
  emptyText: string;
  items: TicketTypeBreakdown[];
  getValue: (item: TicketTypeBreakdown) => string;
}) {
  return (
    <div className="mt-5 border-t pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${title}-${item.ticketType}`}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="truncate text-muted-foreground">
                {item.ticketType}
              </span>
              <span className="font-semibold">{getValue(item)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// "use client";

// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// const percent = 80;
// const data = [
//   { name: "Ticket Sold", value: percent },
//   { name: "Ticket Transferred", value: 100 - percent },
// ];
// const COLORS = ["rgba(91, 147, 255, 1)", "rgba(255, 214, 107, 1)"];

// export function DonutChartCard() {

//   return (
//     <div className="rounded-2xl border bg-card p-5 h-full">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-[16px] font-semibold">Analytics</h3>
//         <span className="text-muted-foreground text-size-lg">...</span>
//       </div>
//       <div className="h-[260px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               innerRadius={70}
//               outerRadius={95}
//               paddingAngle={2}
//               startAngle={90}
//               endAngle={-270}
//               dataKey="value"
//               cornerRadius={6} // 👈 makes edges rounded
//             >
//               {data.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//       <div className="text-center -mt-[160px] mb-[120px]">
//         <div className="text-[28px] font-bold">80%</div>
//         <div className="text-[12px] text-muted-foreground">Transactions</div>
//       </div>

//       <div className="mt-10 flex items-center justify-center gap-6">
//         <LegendDot color="rgba(91, 147, 255, 1)" label="Ticket Sold" />
//         <LegendDot color="rgba(255, 214, 107, 1)" label="Ticket Transferred" />
//       </div>
//     </div>
//   );
// }

// function LegendDot({ color, label }: { color: string; label: string }) {
//   return (
//     <div className="flex items-center gap-2 text-sm">
//       <span
//         className="inline-block h-3 w-3 rounded-full"
//         style={{ background: color }}
//         aria-hidden
//       />
//       <span className="text-muted-foreground">{label}</span>
//     </div>
//   );
// }
