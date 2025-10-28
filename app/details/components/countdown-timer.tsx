"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = +targetDate - +new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 md:p-6 min-w-[200px] sm:min-w-[260px] md:min-w-[280px] transition-colors duration-300">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 text-center sm:text-left">
        Starts In
      </h3>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {String(item.value).padStart(2, "0")}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-1">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
