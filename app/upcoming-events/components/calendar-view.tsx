"use client";
import { useState, useEffect } from "react";
import EventCard from "../components/eventcard/event-card";

export default function CalendarView({
  onDateRangeSelect,
}: {
  onDateRangeSelect?: (range: {
    checkIn: number | null;
    checkOut: number | null;
  }) => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5)); // June 2025
  const [checkIn, setCheckIn] = useState<number | null>(null);
  const [checkOut, setCheckOut] = useState<number | null>(null);

  // 🗓 Events data
  const eventsMap: Record<
    string,
    {
      id: number;
      title: string;
      type: "in-person" | "virtual";
      date: number;
      location: string;
    }[]
  > = {
    "4": [
      {
        id: 1,
        title: "Starry Nights Music Fest",
        type: "in-person",
        date: 4,
        location: "California",
      },
    ],
    "6": [
      {
        id: 2,
        title: "Food Carnival",
        type: "virtual",
        date: 6,
        location: "Miami",
      },
    ],
    "10": [
      {
        id: 3,
        title: "Tech Expo",
        type: "in-person",
        date: 10,
        location: "Austin",
      },
    ],
    "14": [
      {
        id: 4,
        title: "Wellness Retreat",
        type: "virtual",
        date: 14,
        location: "Denver",
      },
      {
        id: 5,
        title: "Startup Pitch Night",
        type: "in-person",
        date: 14,
        location: "New York",
      },
    ],
    "18": [
      {
        id: 6,
        title: "AI Conference",
        type: "virtual",
        date: 18,
        location: "San Francisco",
      },
    ],
    "22": [
      {
        id: 7,
        title: "Fashion Week",
        type: "in-person",
        date: 22,
        location: "Paris",
      },
    ],
    "25": [
      {
        id: 8,
        title: "Charity Gala",
        type: "virtual",
        date: 25,
        location: "London",
      },
    ],
  };

  const days = [
    ["1", "2", "3", "4", "5", "6", "7"],
    ["8", "9", "10", "11", "12", "13", "14"],
    ["15", "16", "17", "18", "19", "20", "21"],
    ["22", "23", "24", "25", "26", "27", "28"],
    ["29", "30", "", "", "", "", ""],
  ];

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const handlePrevMonth = () =>
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  const handleNextMonth = () =>
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));

  const handleDateClick = (day: string) => {
    const dayNum = parseInt(day);
    if (!dayNum) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dayNum);
      setCheckOut(null);
      return;
    }

    if (checkIn && !checkOut) {
      if (dayNum > checkIn) setCheckOut(dayNum);
      else {
        setCheckIn(dayNum);
        setCheckOut(null);
      }
    }
  };

  const isInRange = (day: number) =>
    checkIn && checkOut && day >= checkIn && day <= checkOut;

  // 🔔 send selected range to parent
  useEffect(() => {
    onDateRangeSelect?.({ checkIn, checkOut });
  }, [checkIn, checkOut]);

  // show events in range under calendar
  const getEventsInRange = () => {
    if (!checkIn || !checkOut) return [];
    let result: any[] = [];
    for (let d = checkIn; d <= checkOut; d++) {
      if (eventsMap[d]) result.push(...eventsMap[d]);
    }
    return result;
  };
  const selectedEvents = getEventsInRange();

  return (
    <section className="mx-auto mt-6 sm:mt-8 max-w-full">
      <div className="rounded-2xl border bg-card p-4 sm:p-6 md:p-8 shadow-sm">
        {/* Month header */}
        <div className="flex items-center justify-between">
          <button onClick={handlePrevMonth} className="text-xl sm:text-2xl">
            ‹
          </button>
          <p className="text-base sm:text-lg font-medium">
            {monthName} {year}
          </p>
          <button onClick={handleNextMonth} className="text-xl sm:text-2xl">
            ›
          </button>
        </div>

        {/* Legend */}
        <div className="mt-3 flex justify-center sm:justify-end items-center gap-4 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-[#6D10F5]" /> In Person
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-[#89FC00]" /> Virtual
          </span>
        </div>

        {/* Weekdays */}
        <div className="mt-4 grid grid-cols-7 text-center text-[10px] sm:text-sm text-gray-500">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-3">
          {days.flatMap((week, wi) =>
            week.map((d, di) => {
              const dayNum = parseInt(d);
              const eventsForDay = eventsMap[d] || [];
              const selected =
                (checkIn === dayNum && !checkOut) ||
                (checkOut === dayNum && checkIn);
              const inRange = isInRange(dayNum);

              return (
                <div
                  key={`${wi}-${di}`}
                  onClick={() => handleDateClick(d)}
                  className={`relative h-[70px] sm:h-[90px] md:h-[100px] rounded-lg border p-2 text-[10px] sm:text-sm cursor-pointer transition-all ${
                    selected
                      ? "border-[#0077F7] bg-[#0077F711]"
                      : inRange
                      ? "bg-blue-50 dark:bg-[#1a1a1a]"
                      : "hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-2 font-medium text-[10px] sm:text-xs ${
                      selected ? "text-[#0077F7]" : "text-gray-500"
                    }`}
                  >
                    {d}
                  </span>

                  {/* always show events */}
                  <div className="mt-5 space-y-1">
                    {eventsForDay.map((event) => (
                      <div
                        key={event.id}
                        className={`px-1 py-[2px] rounded-md text-[9px] sm:text-xs truncate font-medium ${
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

        {/* Selected range info */}
        {(checkIn || checkOut) && (
          <div className="mt-5 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
            {checkIn && !checkOut && `Check-in: ${checkIn} ${monthName}`}
            {checkIn &&
              checkOut &&
              `Start Date: ${checkIn} ${monthName} → End Date: ${checkOut} ${monthName}`}
          </div>
        )}
      </div>

      {/* Event cards under calendar */}
      {checkIn && checkOut && selectedEvents.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedEvents.map((event) => (
            <EventCard key={event.id} cta="View Details" purchased={false} />
          ))}
        </div>
      )}
      {checkIn && checkOut && selectedEvents.length === 0 && (
        <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
          No events available between these dates.
        </p>
      )}
    </section>
  );
}

// "use client";
// import { useState } from "react";
// import CalendarBadge from "../components/calendar-badge";

// export default function CalendarView() {
//   // Track current month and year
//   const [currentDate, setCurrentDate] = useState(new Date(2025, 5)); // June 2025 (0-indexed month)

//   // Get month name and year dynamically
//   const monthName = currentDate.toLocaleString("default", { month: "long" });
//   const year = currentDate.getFullYear();

//   // Move to previous month
//   const handlePrevMonth = () => {
//     setCurrentDate((prev) => {
//       const newDate = new Date(prev);
//       newDate.setMonth(prev.getMonth() - 1);
//       return newDate;
//     });
//   };

//   // Move to next month
//   const handleNextMonth = () => {
//     setCurrentDate((prev) => {
//       const newDate = new Date(prev);
//       newDate.setMonth(prev.getMonth() + 1);
//       return newDate;
//     });
//   };

//   // Example static calendar grid
//   const days = [
//     ["1", "2", "3", "4", "5", "6", "7"],
//     ["8", "9", "10", "11", "12", "13", "14"],
//     ["15", "16", "17", "18", "19", "20", "21"],
//     ["22", "23", "24", "25", "26", "27", "28"],
//     ["29", "30", "", "", "", "", ""],
//   ];

//   // Example events
//   const eventsMap: Record<
//     string,
//     { title: string; type: "in-person" | "virtual" }[]
//   > = {
//     "4": [{ title: "Starry Nights Music Fest", type: "in-person" }],
//     "6": [{ title: "Food Carnival", type: "virtual" }],
//     "10": [{ title: "Tech Expo", type: "in-person" }],
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
//           <button
//             onClick={handlePrevMonth}
//             className="text-xl sm:text-2xl"
//             aria-label="Previous month"
//           >
//             ‹
//           </button>

//           <p className="text-base sm:text-lg font-medium">
//             {monthName} {year}
//           </p>

//           <button
//             onClick={handleNextMonth}
//             className="text-xl sm:text-2xl"
//             aria-label="Next month"
//           >
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
