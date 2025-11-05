"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, CheckCircle } from "lucide-react";
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
  const [showSuccess, setShowSuccess] = useState(false);

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
    return day === 0 ? 6 : day - 1; // Make Monday the first column
  };

  // ✅ Use functional updaters to avoid stale state
  const previousMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );

  const nextMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );

  const handleAddToCalendar = () => {
    setShowSuccess(true);
    setTimeout(() => onClose(), 1000);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const prevMonthDays = getDaysInMonth(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );

    const days: JSX.Element[] = [];

    // 🩶 Previous month's tail
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`prev-${i}`}
          className="h-10 sm:h-12 flex items-center justify-center text-gray-300 dark:text-gray-600 text-xs sm:text-sm"
        >
          {prevMonthDays - firstDay + i + 1}
        </div>
      );
    }

    // 🟦 Current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      days.push(
        <button
          type="button"
          key={`cur-${currentDate.getMonth()}-${day}`}
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
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
        <div className="relative w-full max-w-[400px] sm:max-w-[500px] bg-white dark:bg-[#101010] text-black dark:text-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[100vh] transition-colors duration-300">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#1E1E1E] hover:bg-white dark:hover:bg-[#2A2A2A] transition-colors"
          >
            <X className="w-5 h-5 text-gray-900 dark:text-gray-300" />
          </button>

          {/* Header Image */}
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
            <h2 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">
              {eventTitle}
            </h2>
            <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
              {eventDescription}
            </p>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <button
                type="button"
                onClick={previousMonth}
                className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#1E1E1E]"
              >
                <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>

              <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>

              <button
                type="button"
                onClick={nextMonth}
                className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#1E1E1E]"
              >
                <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>

            {/* Calendar */}
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

              {/* ✅ Force re-render on month change */}
              <div
                key={`${currentDate.getFullYear()}-${currentDate.getMonth()}`}
                className="grid grid-cols-7 gap-1 transition-all duration-300"
              >
                {renderCalendar()}
              </div>
            </div>

            <Button
              onClick={handleAddToCalendar}
              className="w-full bg-[#0077F7] hover:bg-[#0066D6] text-white py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold"
            >
              Add to Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fadeIn z-[100]">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            Added to calendar successfully!
          </span>
        </div>
      )}
    </>
  );
}
