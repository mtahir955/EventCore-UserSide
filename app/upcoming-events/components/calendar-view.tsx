"use client";
import { useState } from "react";
import CalendarBadge from "../components/calendar-badge";

export default function CalendarView() {
  // Track current month and year
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5)); // June 2025 (0-indexed month)

  // Get month name and year dynamically
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  // Move to previous month
  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  // Move to next month
  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Example static calendar grid
  const days = [
    ["1", "2", "3", "4", "5", "6", "7"],
    ["8", "9", "10", "11", "12", "13", "14"],
    ["15", "16", "17", "18", "19", "20", "21"],
    ["22", "23", "24", "25", "26", "27", "28"],
    ["29", "30", "", "", "", "", ""],
  ];

  // Example events
  const eventsMap: Record<
    string,
    { title: string; type: "in-person" | "virtual" }[]
  > = {
    "4": [{ title: "Starry Nights Music Fest", type: "in-person" }],
    "6": [{ title: "Food Carnival", type: "virtual" }],
    "10": [{ title: "Tech Expo", type: "in-person" }],
    "14": [
      { title: "Wellness Retreat", type: "virtual" },
      { title: "Startup Pitch Night", type: "in-person" },
    ],
    "18": [{ title: "AI Conference", type: "virtual" }],
    "22": [{ title: "Fashion Week", type: "in-person" }],
    "25": [{ title: "Charity Gala", type: "virtual" }],
  };

  return (
    <section className="mx-auto mt-6 sm:mt-8">
      <div className="rounded-2xl border bg-card p-4 sm:p-6 md:p-8 shadow-sm">
        {/* Month header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="text-xl sm:text-2xl"
            aria-label="Previous month"
          >
            ‹
          </button>

          <p className="text-base sm:text-lg font-medium">
            {monthName} {year}
          </p>

          <button
            onClick={handleNextMonth}
            className="text-xl sm:text-2xl"
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        {/* Legend */}
        <div className="mt-3 flex justify-center sm:justify-end items-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1 sm:gap-2 text-foreground/80">
            <span className="inline-block h-3 w-3 rounded-full bg-[#6D10F5]" />
            In Person
          </span>
          <span className="inline-flex items-center gap-1 sm:gap-2 text-foreground/80">
            <span className="inline-block h-3 w-3 rounded-full bg-[#89FC00]" />
            Virtual
          </span>
        </div>

        {/* Days of week */}
        <div className="mt-4 sm:mt-6 grid grid-cols-7 text-center text-[10px] sm:text-sm text-foreground/60">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="mt-2 sm:mt-3 grid grid-cols-7 gap-1 sm:gap-3">
          {days.flatMap((week, wi) =>
            week.map((d, di) => {
              const eventsForDay = eventsMap[d] || [];
              return (
                <div
                  key={`${wi}-${di}`}
                  className="relative h-[70px] sm:h-[90px] md:h-[100px] rounded-lg sm:rounded-xl border p-2 sm:p-3 text-[10px] sm:text-sm overflow-hidden"
                >
                  <span className="absolute top-1 sm:top-2 left-2 text-foreground/60 font-medium text-[10px] sm:text-xs">
                    {d}
                  </span>
                  <div className="mt-4 sm:mt-5 space-y-1 sm:space-y-2">
                    {eventsForDay.map((event, i) => (
                      <div
                        key={i}
                        className={`px-1 sm:px-2 py-[2px] sm:py-1 rounded-md text-[9px] sm:text-xs font-medium truncate ${
                          event.type === "in-person"
                            ? "bg-[#6D10F5] text-white"
                            : "bg-[#89FC00] text-black"
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

// "use client";
// import CalendarBadge from "../components/calendar-badge";

// export default function CalendarView() {
//   const days = [
//     ["", "", "", "4", "5", "6", "7"],
//     ["8", "9", "10", "11", "12", "13", "14"],
//     ["15", "16", "17", "18", "19", "20", "21"],
//     ["22", "23", "24", "25", "26", "27", "28"],
//     ["29", "30", "1", "2", "3", "4", "5"],
//   ];

//   const eventsMap: Record<
//     string,
//     { title: string; type: "in-person" | "virtual" }[]
//   > = {
//     "4": [{ title: "Starry Nights Music Fest", type: "in-person" }],
//     "6": [{ title: "Food Carnival", type: "virtual" }],
//     "10": [{ title: "Tech Expo 2025", type: "in-person" }],
//     "14": [
//       { title: "Wellness Retreat", type: "virtual" },
//       { title: "Startup Pitch Night", type: "in-person" },
//     ],
//     "18": [{ title: "AI Conference", type: "virtual" }],
//     "22": [{ title: "Fashion Week", type: "in-person" }],
//     "25": [{ title: "Charity Gala", type: "virtual" }],
//   };

//   return (
//     <section className="mx-auto mt-6 sm:mt-8">
//       <div className="rounded-2xl border bg-card p-4 sm:p-6 md:p-8 shadow-sm">
//         {/* Month header */}
//         <div className="flex items-center justify-between">
//           <button className="text-xl sm:text-2xl" aria-label="Previous month">
//             ‹
//           </button>
//           <p className="text-base sm:text-lg font-medium">June 2025</p>
//           <button className="text-xl sm:text-2xl" aria-label="Next month">
//             ›
//           </button>
//         </div>

//         {/* Legend */}
//         <div className="mt-3 flex justify-center sm:justify-end items-center gap-4 sm:gap-6 text-xs sm:text-sm">
//           <span className="inline-flex items-center gap-1 sm:gap-2 text-foreground/80">
//             <span className="inline-block h-3 w-3 rounded-full bg-[#6D10F5]" />
//             In Person
//           </span>
//           <span className="inline-flex items-center gap-1 sm:gap-2 text-foreground/80">
//             <span className="inline-block h-3 w-3 rounded-full bg-[#89FC00]" />
//             Virtual
//           </span>
//         </div>

//         {/* Days of week */}
//         <div className="mt-4 sm:mt-6 grid grid-cols-7 text-center text-[10px] sm:text-sm text-foreground/60">
//           {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
//             <span key={d}>{d}</span>
//           ))}
//         </div>

//         {/* Calendar grid */}
//         <div className="mt-2 sm:mt-3 grid grid-cols-7 gap-1 sm:gap-3">
//           {days.flatMap((week, wi) =>
//             week.map((d, di) => {
//               const eventsForDay = eventsMap[d] || [];
//               return (
//                 <div
//                   key={`${wi}-${di}`}
//                   className="relative h-[70px] sm:h-[90px] md:h-[100px] rounded-lg sm:rounded-xl border p-2 sm:p-3 text-[10px] sm:text-sm overflow-hidden"
//                 >
//                   <span className="absolute top-1 sm:top-2 left-2 text-foreground/60 font-medium text-[10px] sm:text-xs">
//                     {d}
//                   </span>
//                   <div className="mt-4 sm:mt-5 space-y-1 sm:space-y-2">
//                     {eventsForDay.map((event, i) => (
//                       <div
//                         key={i}
//                         className={`px-1 sm:px-2 py-[2px] sm:py-1 rounded-md text-[9px] sm:text-xs font-medium truncate ${
//                           event.type === "in-person"
//                             ? "bg-[#6D10F5] text-white"
//                             : "bg-[#89FC00] text-black"
//                         }`}
//                       >
//                         {event.title}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }
