"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventDescription: string;
  eventImage: string;
  initialDate?: Date;
}

export function CalendarModal({
  isOpen,
  onClose,
  eventTitle,
  eventDescription,
  eventImage,
  initialDate = new Date(2025, 5, 10),
}: CalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  if (!isOpen) return null;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const getDayName = (date: Date) =>
    [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][date.getDay()];

  const previousMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div
          key={`prev-${i}`}
          className="h-10 sm:h-12 flex items-center justify-center text-gray-300 dark:text-gray-600 text-xs sm:text-sm"
        >
          {new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            0
          ).getDate() - i}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth();

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-10 sm:h-12 flex items-center justify-center text-xs sm:text-sm rounded-lg transition-colors ${
            isSelected
              ? "bg-[#0077F7] text-white"
              : "text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1E1E1E]"
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 transition-colors">
      <div className="relative w-full max-w-[400px] sm:max-w-[500px] bg-white dark:bg-[#101010] text-black dark:text-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[100vh] transition-colors duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#1E1E1E] hover:bg-white dark:hover:bg-[#2A2A2A] transition-colors"
        >
          <X className="w-5 h-5 text-gray-900 dark:text-gray-300" />
        </button>

        {/* Event image */}
        <div className="relative h-[140px] sm:h-[100px] w-full">
          <Image
            src={eventImage}
            alt={eventTitle}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-4">
          <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            {eventTitle}
          </h2>
          <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            {eventDescription}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <button
              onClick={previousMonth}
              className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#1E1E1E] transition-colors"
            >
              <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-gray-900 dark:text-gray-300" />
            </button>
            <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
              {getDayName(selectedDate)}, {selectedDate.getDate()}{" "}
              {monthNames[selectedDate.getMonth()]}
            </div>
            <button
              onClick={nextMonth}
              className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#1E1E1E] transition-colors"
            >
              <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-gray-900 dark:text-gray-300" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="mb-2">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((d) => (
                <div
                  key={d}
                  className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 text-center"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </div>

          {/* Action Button */}
          <Button className="w-full bg-[#0077F7] hover:bg-[#0066D6] text-white py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold">
            Add to Calendar
          </Button>
        </div>
      </div>
    </div>
  );
}
