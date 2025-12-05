"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const target = targetDate.getTime();
    const difference = Math.max(0, target - now);

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const eventStarted =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 min-w-[200px] sm:min-w-[260px] md:min-w-[280px] transition-colors duration-300">
      <h3 className="text-base sm:text-lg font-semibold text-center text-gray-900 dark:text-gray-100 mb-4">
        {eventStarted ? "Event Started!" : "Starts In"}
      </h3>

      {!eventStarted && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                {String(item.value).padStart(2, "0")}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

//code before integration

// "use client";

// import { useEffect, useState } from "react";

// interface TimeLeft {
//   days: number;
//   hours: number;
//   minutes: number;
//   seconds: number;
// }

// export function CountdownTimer() {
//   // initial time: 3 days, 3 hours, 45 minutes, 22 seconds
//   const INITIAL_TIME =
//     3 * 24 * 60 * 60 + 3 * 60 * 60 + 45 * 60 + 22; // total seconds

//   const [totalSeconds, setTotalSeconds] = useState(INITIAL_TIME);

//   // Convert seconds to days/hours/minutes/seconds
//   const calculateTimeLeft = (secs: number): TimeLeft => {
//     return {
//       days: Math.floor(secs / (60 * 60 * 24)),
//       hours: Math.floor((secs % (60 * 60 * 24)) / (60 * 60)),
//       minutes: Math.floor((secs % (60 * 60)) / 60),
//       seconds: secs % 60,
//     };
//   };

//   const [timeLeft, setTimeLeft] = useState<TimeLeft>(
//     calculateTimeLeft(INITIAL_TIME)
//   );

//   useEffect(() => {
//     if (totalSeconds <= 0) return; // stop when done

//     const timer = setInterval(() => {
//       setTotalSeconds((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [totalSeconds]);

//   // update display when seconds change
//   useEffect(() => {
//     setTimeLeft(calculateTimeLeft(totalSeconds));
//   }, [totalSeconds]);

//   return (
//     <div className="bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 min-w-[200px] sm:min-w-[260px] md:min-w-[280px] transition-colors duration-300">
//       <h3 className="text-base sm:text-lg font-semibold text-center text-gray-900 dark:text-gray-100 mb-4">
//         {totalSeconds > 0 ? "Starts In" : "Event Started!"}
//       </h3>

//       <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
//         {[
//           { label: "Days", value: timeLeft.days },
//           { label: "Hours", value: timeLeft.hours },
//           { label: "Minutes", value: timeLeft.minutes },
//           { label: "Seconds", value: timeLeft.seconds },
//         ].map((item) => (
//           <div key={item.label}>
//             <div className="text-xl sm:text-2xl md:text-3xl font-bold">
//               {String(item.value).padStart(2, "0")}
//             </div>
//             <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-1">
//               {item.label}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
