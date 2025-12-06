"use client";
import { useState, useEffect } from "react";
import EventCard from "../components/eventcard/event-card";

export default function CalendarView({
  calendarEvents,
  onDateRangeSelect,
}: {
  calendarEvents: any;
  onDateRangeSelect?: (range: {
    checkIn: number | null;
    checkOut: number | null;
  }) => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5));
  const [checkIn, setCheckIn] = useState<number | null>(null);
  const [checkOut, setCheckOut] = useState<number | null>(null);

  const [hoveredEvent, setHoveredEvent] = useState<any>(null);
  const [hoverPosition, setHoverPosition] = useState<any>(null);

  const currentYear = currentDate.getFullYear().toString();

  // 🔥 Backend uses 1–12, JS uses 0–11 → FIX
  const currentMonth = (currentDate.getMonth() + 1).toString();

  const eventsMap = calendarEvents[currentYear]?.[currentMonth] || [];

  // 🗓️ Calendar logic
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const totalWeeks = Math.ceil((firstDay + daysInMonth) / 7);

  const calendarDays = Array.from({ length: totalWeeks }, (_, weekIndex) => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const dateNumber = weekIndex * 7 + i - firstDay;
      days.push(dateNumber > 0 && dateNumber <= daysInMonth ? dateNumber : "");
    }
    return days;
  });

  const handlePrevMonth = () =>
    setCurrentDate((p) => new Date(p.getFullYear(), p.getMonth() - 1));

  const handleNextMonth = () =>
    setCurrentDate((p) => new Date(p.getFullYear(), p.getMonth() + 1));

  const handleDateClick = (day: string) => {
    const num = parseInt(day);
    if (!num) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(num);
      setCheckOut(null);
      return;
    }

    if (num > checkIn) setCheckOut(num);
    else {
      setCheckIn(num);
      setCheckOut(null);
    }
  };

  const isInRange = (day: number) =>
    checkIn && checkOut && day >= checkIn && day <= checkOut;

  useEffect(() => {
    onDateRangeSelect?.({ checkIn, checkOut });
  }, [checkIn, checkOut]);

  const selectedEvents =
    checkIn && checkOut
      ? eventsMap.filter((e: any) => e.date >= checkIn && e.date <= checkOut)
      : [];

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  return (
    <section className="mx-auto mt-6 sm:mt-8 max-w-full relative">
      <div className="rounded-2xl border bg-card p-4 sm:p-6 md:p-8 shadow-sm transition-all">
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

        {/* LEGEND */}
        <div className="mt-3 flex justify-center sm:justify-end items-center gap-4 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-[#6D10F5]" /> In Person
          </span>

          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-[#89FC00]" /> Virtual
          </span>

          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-[#FC1100]" /> You
          </span>

          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-[#0077F7]" /> Purchased
          </span>
        </div>

        {/* WEEK HEADERS */}
        <div className="mt-4 grid grid-cols-7 text-center text-[10px] sm:text-sm text-gray-500">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* CALENDAR */}
        <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-3 relative">
          {calendarDays.flatMap((week, wi) =>
            week.map((d, di) => {
              const dayNum = parseInt(d as string);
              const eventsForDay = eventsMap.filter(
                (e: any) => e.date === dayNum
              );

              const selected =
                (checkIn === dayNum && !checkOut) ||
                (checkOut === dayNum && checkIn);

              const inRange = isInRange(dayNum);

              return (
                <div
                  key={`${wi}-${di}`}
                  onClick={() => handleDateClick(String(d))}
                  className={`relative h-[70px] sm:h-[90px] md:h-[100px] rounded-lg border p-2 cursor-pointer transition-all
                  ${
                    selected
                      ? "border-[#0077F7] bg-[#0077F711]"
                      : inRange
                      ? "bg-blue-50 dark:bg-[#1a1a1a]"
                      : "hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                  }`}
                >
                  <span className="absolute top-1 left-2 font-medium text-[10px] sm:text-xs text-gray-500">
                    {d}
                  </span>

                  <div className="mt-5 space-y-1">
                    {eventsForDay.map((event: any) => (
                      <div
                        key={event.id}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredEvent(event);
                          setHoverPosition({
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          });
                        }}
                        onMouseLeave={() => setHoveredEvent(null)}
                        className={`px-1 py-[2px] rounded-md text-[9px] sm:text-xs font-medium truncate
                          ${
                            event.type === "in-person"
                              ? "bg-[#6D10F5] text-white"
                              : event.type === "virtual"
                              ? "bg-[#89FC00] text-black"
                              : event.type === "you"
                              ? "bg-[#FC1100] text-white"
                              : event.type === "purchased"
                              ? "bg-[#0077F7] text-white"
                              : ""
                          }
                        `}
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

      {/* HOVER CARD */}
      {hoveredEvent && hoverPosition && (
        <div
          className="absolute z-50 bg-white dark:bg-[#101010] border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg p-3 w-[220px]"
          style={{
            top: hoverPosition.y - 100,
            left: hoverPosition.x - 110,
          }}
        >
          <h3 className="font-semibold text-sm mb-1 text-[#0077F7]">
            {hoveredEvent.title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 capitalize">
            Type: {hoveredEvent.type}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
            Location: {hoveredEvent.location}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Date: {hoveredEvent.date} {monthName} {year}
          </p>
        </div>
      )}

      {/* EVENT LIST */}
      {checkIn && checkOut && selectedEvents.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedEvents.map((event: any) => (
            <EventCard
              key={event.id}
              event={event}
              cta="View Details"
              purchased={event.type === "purchased"}
            />
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

//code before integration

// "use client";
// import { useState, useEffect } from "react";
// import EventCard from "../components/eventcard/event-card";

// export default function CalendarView({
//   onDateRangeSelect,
// }: {
//   onDateRangeSelect?: (range: {
//     checkIn: number | null;
//     checkOut: number | null;
//   }) => void;
// }) {
//   const [currentDate, setCurrentDate] = useState(new Date(2025, 5)); // June 2025
//   const [checkIn, setCheckIn] = useState<number | null>(null);
//   const [checkOut, setCheckOut] = useState<number | null>(null);

//   // 🎟️ Hover state
//   const [hoveredEvent, setHoveredEvent] = useState<{
//     id: number;
//     title: string;
//     type: "in-person" | "virtual" | "you" | "purchased";
//     date: number;
//     location: string;
//   } | null>(null);
//   const [hoverPosition, setHoverPosition] = useState<{
//     x: number;
//     y: number;
//   } | null>(null);

//   // 🧠 Events data
//   const monthlyEvents: Record<
//     string,
//     Record<
//       string,
//       {
//         id: number;
//         title: string;
//         type: "in-person" | "virtual" | "you";
//         date: number;
//         location: string;
//       }[]
//     >
//   > = {
//     "2025": {
//       // ✅ May 2025 (Previous)
//       "4": [
//         {
//           id: 1,
//           title: "Spring Music Bash",
//           type: "in-person",
//           date: 3,
//           location: "Berlin",
//         },
//         {
//           id: 2,
//           title: "Tech Leaders Meetup",
//           type: "virtual",
//           date: 12,
//           location: "Online",
//         },
//         {
//           id: 3,
//           title: "Art & Wine Festival",
//           type: "in-person",
//           date: 20,
//           location: "Rome",
//         },
//       ],

//       // ✅ June 2025 (Current)
//       "5": [
//         {
//           id: 4,
//           title: "Starry Nights Music Fest",
//           type: "in-person",
//           date: 4,
//           location: "California",
//         },
//         {
//           id: 5,
//           title: "Food Carnival",
//           type: "virtual",
//           date: 6,
//           location: "Miami",
//         },
//         {
//           id: 20,
//           title: "Your Hosted Event",
//           type: "you",
//           date: 9,
//           location: "Los Angeles",
//         },
//         {
//           id: 21,
//           title: "Purchased Event",
//           type: "purchased",
//           date: 14,
//           location: "Chicago",
//         },
//         {
//           id: 6,
//           title: "Tech Expo",
//           type: "in-person",
//           date: 10,
//           location: "Austin",
//         },
//         {
//           id: 7,
//           title: "Wellness Retreat",
//           type: "virtual",
//           date: 14,
//           location: "Denver",
//         },
//         {
//           id: 8,
//           title: "Startup Pitch Night",
//           type: "in-person",
//           date: 14,
//           location: "New York",
//         },
//         {
//           id: 9,
//           title: "AI Conference",
//           type: "virtual",
//           date: 18,
//           location: "San Francisco",
//         },
//         {
//           id: 10,
//           title: "Fashion Week",
//           type: "in-person",
//           date: 22,
//           location: "Paris",
//         },
//         {
//           id: 11,
//           title: "Charity Gala",
//           type: "virtual",
//           date: 25,
//           location: "London",
//         },
//       ],

//       // ✅ July 2025 (Upcoming)
//       "6": [
//         {
//           id: 12,
//           title: "Blockchain Summit",
//           type: "virtual",
//           date: 3,
//           location: "Singapore",
//         },
//         {
//           id: 13,
//           title: "Summer Fashion Gala",
//           type: "in-person",
//           date: 8,
//           location: "Milan",
//         },
//         {
//           id: 14,
//           title: "Coding Bootcamp",
//           type: "virtual",
//           date: 18,
//           location: "Toronto",
//         },
//         {
//           id: 15,
//           title: "Designers Expo",
//           type: "in-person",
//           date: 24,
//           location: "London",
//         },
//       ],
//     },
//   };

//   const currentYear = currentDate.getFullYear().toString();
//   const currentMonth = currentDate.getMonth().toString();
//   const eventsMap = monthlyEvents[currentYear]?.[currentMonth] || [];

//   // 🗓️ Calendar setup
//   const daysInMonth = new Date(
//     currentDate.getFullYear(),
//     currentDate.getMonth() + 1,
//     0
//   ).getDate();
//   const firstDay = new Date(
//     currentDate.getFullYear(),
//     currentDate.getMonth(),
//     1
//   ).getDay();
//   const totalWeeks = Math.ceil((firstDay + daysInMonth) / 7);

//   const calendarDays = Array.from({ length: totalWeeks }, (_, weekIndex) => {
//     const days = [];
//     for (let i = 1; i <= 7; i++) {
//       const dateNumber = weekIndex * 7 + i - firstDay;
//       days.push(dateNumber > 0 && dateNumber <= daysInMonth ? dateNumber : "");
//     }
//     return days;
//   });

//   const handlePrevMonth = () =>
//     setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
//   const handleNextMonth = () =>
//     setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));

//   const handleDateClick = (day: string) => {
//     const dayNum = parseInt(day);
//     if (!dayNum) return;

//     if (!checkIn || (checkIn && checkOut)) {
//       setCheckIn(dayNum);
//       setCheckOut(null);
//       return;
//     }

//     if (checkIn && !checkOut) {
//       if (dayNum > checkIn) setCheckOut(dayNum);
//       else {
//         setCheckIn(dayNum);
//         setCheckOut(null);
//       }
//     }
//   };

//   const isInRange = (day: number) =>
//     checkIn && checkOut && day >= checkIn && day <= checkOut;

//   useEffect(() => {
//     onDateRangeSelect?.({ checkIn, checkOut });
//   }, [checkIn, checkOut]);

//   const getEventsInRange = () => {
//     if (!checkIn || !checkOut) return [];
//     return eventsMap.filter(
//       (event) => event.date >= checkIn && event.date <= checkOut
//     );
//   };

//   const selectedEvents = getEventsInRange();

//   const monthName = currentDate.toLocaleString("default", { month: "long" });
//   const year = currentDate.getFullYear();

//   return (
//     <section className="mx-auto mt-6 sm:mt-8 max-w-full relative">
//       <div className="rounded-2xl border bg-card p-4 sm:p-6 md:p-8 shadow-sm transition-all">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <button onClick={handlePrevMonth} className="text-xl sm:text-2xl">
//             ‹
//           </button>
//           <p className="text-base sm:text-lg font-medium">
//             {monthName} {year}
//           </p>
//           <button onClick={handleNextMonth} className="text-xl sm:text-2xl">
//             ›
//           </button>
//         </div>

//         {/* Legend */}
//         <div className="mt-3 flex justify-center sm:justify-end items-center gap-4 text-xs sm:text-sm">
//           <span className="inline-flex items-center gap-1">
//             <span className="h-3 w-3 rounded-full bg-[#6D10F5]" /> In Person
//           </span>

//           <span className="inline-flex items-center gap-1">
//             <span className="h-3 w-3 rounded-full bg-[#89FC00]" /> Virtual
//           </span>

//           <span className="inline-flex items-center gap-1">
//             <span className="h-3 w-3 rounded-full bg-[#FC1100]" /> You
//           </span>

//           <span className="inline-flex items-center gap-1">
//             <span className="h-3 w-3 rounded-full bg-[#0077F7]" /> Purchased
//           </span>
//         </div>

//         {/* Week headers */}
//         <div className="mt-4 grid grid-cols-7 text-center text-[10px] sm:text-sm text-gray-500">
//           {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
//             <span key={d}>{d}</span>
//           ))}
//         </div>

//         {/* Calendar grid */}
//         <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-3 relative">
//           {calendarDays.flatMap((week, wi) =>
//             week.map((d, di) => {
//               const dayNum = parseInt(d as string);
//               const eventsForDay = eventsMap.filter((e) => e.date === dayNum);
//               const selected =
//                 (checkIn === dayNum && !checkOut) ||
//                 (checkOut === dayNum && checkIn);
//               const inRange = isInRange(dayNum);

//               return (
//                 <div
//                   key={`${wi}-${di}`}
//                   onClick={() => handleDateClick(String(d))}
//                   className={`relative h-[70px] sm:h-[90px] md:h-[100px] rounded-lg border p-2 text-[10px] sm:text-sm cursor-pointer transition-all ${
//                     selected
//                       ? "border-[#0077F7] bg-[#0077F711]"
//                       : inRange
//                       ? "bg-blue-50 dark:bg-[#1a1a1a]"
//                       : "hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
//                   }`}
//                 >
//                   <span
//                     className={`absolute top-1 left-2 font-medium text-[10px] sm:text-xs ${
//                       selected ? "text-[#0077F7]" : "text-gray-500"
//                     }`}
//                   >
//                     {d}
//                   </span>

//                   <div className="mt-5 space-y-1">
//                     {eventsForDay.map((event) => (
//                       <div
//                         key={event.id}
//                         onMouseEnter={(e) => {
//                           const rect = e.currentTarget.getBoundingClientRect();
//                           setHoveredEvent(event);
//                           setHoverPosition({
//                             x: rect.left + rect.width / 2,
//                             y: rect.top,
//                           });
//                         }}
//                         onMouseLeave={() => setHoveredEvent(null)}
//                         className={`px-1 py-[2px] rounded-md text-[9px] sm:text-xs truncate font-medium
//   ${
//     event.type === "in-person"
//       ? "bg-[#6D10F5] text-white"
//       : event.type === "virtual"
//       ? "bg-[#89FC00] text-black"
//       : event.type === "you"
//       ? "bg-[#FC1100] text-white"
//       : event.type === "purchased"
//       ? "bg-[#0077F7] text-white"
//       : ""
//   }
// `}
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

//       {/* 🟡 Hover Event Card */}
//       {hoveredEvent && hoverPosition && (
//         <div
//           className="absolute z-50 bg-white dark:bg-[#101010] border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg p-3 w-[220px] transition-all"
//           style={{
//             top: hoverPosition.y - 100,
//             left: hoverPosition.x - 110,
//           }}
//         >
//           <h3 className="font-semibold text-sm mb-1 text-[#0077F7]">
//             {hoveredEvent.title}
//           </h3>
//           <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 capitalize">
//             Type: {hoveredEvent.type}
//           </p>
//           <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
//             Location: {hoveredEvent.location}
//           </p>
//           <p className="text-xs text-gray-500 dark:text-gray-400">
//             Date: {hoveredEvent.date} {monthName} {year}
//           </p>
//         </div>
//       )}

//       {/* Event cards under calendar */}
//       {checkIn && checkOut && selectedEvents.length > 0 && (
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//           {selectedEvents.map((event) => (
//             <EventCard
//               key={event.id}
//               event={event}
//               cta="View Details"
//               purchased={false}
//             />
//           ))}
//         </div>
//       )}
//       {checkIn && checkOut && selectedEvents.length === 0 && (
//         <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
//           No events available between these dates.
//         </p>
//       )}
//     </section>
//   );
// }

// // "use client";
// // import { useState, useEffect } from "react";
// // import EventCard from "../components/eventcard/event-card";

// // export default function CalendarView({
// //   onDateRangeSelect,
// // }: {
// //   onDateRangeSelect?: (range: {
// //     checkIn: number | null;
// //     checkOut: number | null;
// //   }) => void;
// // }) {
// //   const [currentDate, setCurrentDate] = useState(new Date(2025, 5)); // June 2025
// //   const [checkIn, setCheckIn] = useState<number | null>(null);
// //   const [checkOut, setCheckOut] = useState<number | null>(null);

// //   // 🧠 All events organized by month and year
// // const monthlyEvents: Record<
// //   string,
// //   Record<
// //     string,
// //     {
// //       id: number;
// //       title: string;
// //       type: "in-person" | "virtual";
// //       date: number;
// //       location: string;
// //     }[]
// //   >
// // > = {
// //   "2025": {
// //     // ✅ May 2025 (Previous)
// //     "4": [
// //       {
// //         id: 1,
// //         title: "Spring Music Bash",
// //         type: "in-person",
// //         date: 3,
// //         location: "Berlin",
// //       },
// //       {
// //         id: 2,
// //         title: "Tech Leaders Meetup",
// //         type: "virtual",
// //         date: 12,
// //         location: "Online",
// //       },
// //       {
// //         id: 3,
// //         title: "Art & Wine Festival",
// //         type: "in-person",
// //         date: 20,
// //         location: "Rome",
// //       },
// //     ],

// //     // ✅ June 2025 (Current)
// //     "5": [
// //       {
// //         id: 4,
// //         title: "Starry Nights Music Fest",
// //         type: "in-person",
// //         date: 4,
// //         location: "California",
// //       },
// //       {
// //         id: 5,
// //         title: "Food Carnival",
// //         type: "virtual",
// //         date: 6,
// //         location: "Miami",
// //       },
// //       {
// //         id: 6,
// //         title: "Tech Expo",
// //         type: "in-person",
// //         date: 10,
// //         location: "Austin",
// //       },
// //       {
// //         id: 7,
// //         title: "Wellness Retreat",
// //         type: "virtual",
// //         date: 14,
// //         location: "Denver",
// //       },
// //       {
// //         id: 8,
// //         title: "Startup Pitch Night",
// //         type: "in-person",
// //         date: 14,
// //         location: "New York",
// //       },
// //       {
// //         id: 9,
// //         title: "AI Conference",
// //         type: "virtual",
// //         date: 18,
// //         location: "San Francisco",
// //       },
// //       {
// //         id: 10,
// //         title: "Fashion Week",
// //         type: "in-person",
// //         date: 22,
// //         location: "Paris",
// //       },
// //       {
// //         id: 11,
// //         title: "Charity Gala",
// //         type: "virtual",
// //         date: 25,
// //         location: "London",
// //       },
// //     ],

// //     // ✅ July 2025 (Upcoming)
// //     "6": [
// //       {
// //         id: 12,
// //         title: "Blockchain Summit",
// //         type: "virtual",
// //         date: 3,
// //         location: "Singapore",
// //       },
// //       {
// //         id: 13,
// //         title: "Summer Fashion Gala",
// //         type: "in-person",
// //         date: 8,
// //         location: "Milan",
// //       },
// //       {
// //         id: 14,
// //         title: "Coding Bootcamp",
// //         type: "virtual",
// //         date: 18,
// //         location: "Toronto",
// //       },
// //       {
// //         id: 15,
// //         title: "Designers Expo",
// //         type: "in-person",
// //         date: 24,
// //         location: "London",
// //       },
// //     ],
// //   },
// // };

// //   // 🔄 Get current month's events from data
// //   const currentYear = currentDate.getFullYear().toString();
// //   const currentMonth = currentDate.getMonth().toString(); // 0-indexed (0 = Jan)
// //   const eventsMap = monthlyEvents[currentYear]?.[currentMonth] || [];

// //   // 🧮 Calendar structure
// //   const daysInMonth = new Date(
// //     currentDate.getFullYear(),
// //     currentDate.getMonth() + 1,
// //     0
// //   ).getDate();
// //   const firstDay = new Date(
// //     currentDate.getFullYear(),
// //     currentDate.getMonth(),
// //     1
// //   ).getDay();
// //   const totalWeeks = Math.ceil((firstDay + daysInMonth) / 7);

// //   const calendarDays = Array.from({ length: totalWeeks }, (_, weekIndex) => {
// //     const days = [];
// //     for (let i = 1; i <= 7; i++) {
// //       const dateNumber = weekIndex * 7 + i - firstDay;
// //       days.push(dateNumber > 0 && dateNumber <= daysInMonth ? dateNumber : "");
// //     }
// //     return days;
// //   });

// //   // 🔁 Month navigation
// //   const handlePrevMonth = () =>
// //     setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
// //   const handleNextMonth = () =>
// //     setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));

// //   // 🧭 Range logic
// //   const handleDateClick = (day: string) => {
// //     const dayNum = parseInt(day);
// //     if (!dayNum) return;

// //     if (!checkIn || (checkIn && checkOut)) {
// //       setCheckIn(dayNum);
// //       setCheckOut(null);
// //       return;
// //     }

// //     if (checkIn && !checkOut) {
// //       if (dayNum > checkIn) setCheckOut(dayNum);
// //       else {
// //         setCheckIn(dayNum);
// //         setCheckOut(null);
// //       }
// //     }
// //   };

// //   const isInRange = (day: number) =>
// //     checkIn && checkOut && day >= checkIn && day <= checkOut;

// //   useEffect(() => {
// //     onDateRangeSelect?.({ checkIn, checkOut });
// //   }, [checkIn, checkOut]);

// //   // 🎯 Get events within range
// //   const getEventsInRange = () => {
// //     if (!checkIn || !checkOut) return [];
// //     return eventsMap.filter(
// //       (event) => event.date >= checkIn && event.date <= checkOut
// //     );
// //   };

// //   const selectedEvents = getEventsInRange();

// //   const monthName = currentDate.toLocaleString("default", { month: "long" });
// //   const year = currentDate.getFullYear();

// //   return (
// //     <section className="mx-auto mt-6 sm:mt-8 max-w-full">
// //       <div className="rounded-2xl border bg-card p-4 sm:p-6 md:p-8 shadow-sm transition-all">
// //         {/* Month header */}
// //         <div className="flex items-center justify-between">
// //           <button onClick={handlePrevMonth} className="text-xl sm:text-2xl">
// //             ‹
// //           </button>
// //           <p className="text-base sm:text-lg font-medium">
// //             {monthName} {year}
// //           </p>
// //           <button onClick={handleNextMonth} className="text-xl sm:text-2xl">
// //             ›
// //           </button>
// //         </div>

// //         {/* Legend */}
// //         <div className="mt-3 flex justify-center sm:justify-end items-center gap-4 text-xs sm:text-sm">
// //           <span className="inline-flex items-center gap-1">
// //             <span className="h-3 w-3 rounded-full bg-[#6D10F5]" /> In Person
// //           </span>
// //           <span className="inline-flex items-center gap-1">
// //             <span className="h-3 w-3 rounded-full bg-[#89FC00]" /> Virtual
// //           </span>
// //         </div>

// //         {/* Week headers */}
// //         <div className="mt-4 grid grid-cols-7 text-center text-[10px] sm:text-sm text-gray-500">
// //           {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
// //             <span key={d}>{d}</span>
// //           ))}
// //         </div>

// //         {/* Calendar grid */}
// //         <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-3">
// //           {calendarDays.flatMap((week, wi) =>
// //             week.map((d, di) => {
// //               const dayNum = parseInt(d as string);
// //               const eventsForDay = eventsMap.filter((e) => e.date === dayNum);
// //               const selected =
// //                 (checkIn === dayNum && !checkOut) ||
// //                 (checkOut === dayNum && checkIn);
// //               const inRange = isInRange(dayNum);

// //               return (
// //                 <div
// //                   key={`${wi}-${di}`}
// //                   onClick={() => handleDateClick(String(d))}
// //                   className={`relative h-[70px] sm:h-[90px] md:h-[100px] rounded-lg border p-2 text-[10px] sm:text-sm cursor-pointer transition-all ${
// //                     selected
// //                       ? "border-[#0077F7] bg-[#0077F711]"
// //                       : inRange
// //                       ? "bg-blue-50 dark:bg-[#1a1a1a]"
// //                       : "hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
// //                   }`}
// //                 >
// //                   <span
// //                     className={`absolute top-1 left-2 font-medium text-[10px] sm:text-xs ${
// //                       selected ? "text-[#0077F7]" : "text-gray-500"
// //                     }`}
// //                   >
// //                     {d}
// //                   </span>

// //                   <div className="mt-5 space-y-1">
// //                     {eventsForDay.map((event) => (
// //                       <div
// //                         key={event.id}
// //                         className={`px-1 py-[2px] rounded-md text-[9px] sm:text-xs truncate font-medium ${
// //                           event.type === "in-person"
// //                             ? "bg-[#6D10F5] text-white"
// //                             : "bg-[#89FC00] text-black"
// //                         }`}
// //                       >
// //                         {event.title}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               );
// //             })
// //           )}
// //         </div>

// //         {/* Range Info */}
// //         {(checkIn || checkOut) && (
// //           <div className="mt-5 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
// //             {checkIn && !checkOut && `Check-in: ${checkIn} ${monthName}`}
// //             {checkIn &&
// //               checkOut &&
// //               `Start Date: ${checkIn} ${monthName} → End Date: ${checkOut} ${monthName}`}
// //           </div>
// //         )}
// //       </div>

// //       {/* Event cards under calendar */}
// //       {checkIn && checkOut && selectedEvents.length > 0 && (
// //         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
// //           {selectedEvents.map((event) => (
// //             <EventCard
// //               key={event.id}
// //               event={event}
// //               cta="View Details"
// //               purchased={false}
// //             />
// //           ))}
// //         </div>
// //       )}
// //       {checkIn && checkOut && selectedEvents.length === 0 && (
// //         <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
// //           No events available between these dates.
// //         </p>
// //       )}
// //     </section>
// //   );
// // }
