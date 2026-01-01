"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventDescription: string;
  eventImage: string;
  eventId: string;
  initialDate?: Date; // ⭐ Event actual date (for blue highlight)
  initialPinnedDate?: string | null; // e.g. "2025-12-06"
  initialCalendarId?: string | null;
  initialIsPinned?: boolean;
  onCalendarUpdated?: (data: {
    hasPinned: boolean;
    pinnedDate: string | null;
    calendarId: string | null;
  }) => void;
}

export function CalendarModal({
  isOpen,
  onClose,
  eventTitle,
  eventDescription,
  eventImage,
  eventId,
  initialDate = new Date(),
  initialPinnedDate = null,
  initialCalendarId = null,
  initialIsPinned = false,
  onCalendarUpdated,
}: CalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialPinnedDate ? new Date(initialPinnedDate) : initialDate
  );
  const [isPinned, setIsPinned] = useState<boolean>(
    !!initialPinnedDate || initialIsPinned
  );
  const [calendarId, setCalendarId] = useState<string | null>(
    initialCalendarId
  );

  const [initialPinnedDateState, setInitialPinnedDateState] =
    useState<Date | null>(
      initialPinnedDate ? new Date(initialPinnedDate) : null
    );

  const [isUnpinChecked, setIsUnpinChecked] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "Added to calendar successfully!"
  );

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sync state whenever modal opens with new props
  useEffect(() => {
    if (!isOpen) return;

    setCurrentDate(initialDate);

    const baseSelected = initialPinnedDate
      ? new Date(initialPinnedDate)
      : initialDate;
    setSelectedDate(baseSelected);

    setIsPinned(!!initialPinnedDate || initialIsPinned);
    setCalendarId(initialCalendarId ?? null);
    setInitialPinnedDateState(
      initialPinnedDate ? new Date(initialPinnedDate) : null
    );
    setIsUnpinChecked(false);
  }, [
    isOpen,
    initialDate,
    initialPinnedDate,
    initialCalendarId,
    initialIsPinned,
  ]);

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
    // convert Sunday=0 to index 6 to make Monday first
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

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // format date as "YYYY-MM-DD"
  const formatSelectedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getToken = () => {
    if (typeof window === "undefined") return null;

    let raw =
      localStorage.getItem("buyerToken") ||
      localStorage.getItem("staffToken") ||
      localStorage.getItem("hostToken") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");

    try {
      const parsed = JSON.parse(raw || "{}");
      return parsed?.token || parsed;
    } catch {
      return raw;
    }
  };

  const handleSave = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("You must be logged in to manage calendar reminders.");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }

      // CREATE (no pinned yet)
      if (!isPinned) {
        const payload = {
          selectedDate: formatSelectedDate(selectedDate),
          reminderTime: "10:00",
          notes: `Reminder for ${eventTitle}`,
          notificationType: "email",
          isPinned: true,
          color: "red",
          eventId,
        };

        const res = await axios.post(
          `${API_BASE_URL}/users/calendar`,
          payload,
          {
            headers: {
              "X-Tenant-ID": HOST_Tenant_ID,
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newId = res?.data?.data?.id ?? null;
        setIsPinned(true);
        setCalendarId(newId);
        setInitialPinnedDateState(new Date(formatSelectedDate(selectedDate)));

        onCalendarUpdated?.({
          hasPinned: true,
          pinnedDate: formatSelectedDate(selectedDate),
          calendarId: newId,
        });

        setSuccessMessage("Added to calendar successfully!");
      }
      // UNPIN (delete entry)
      else if (isPinned && isUnpinChecked) {
        if (!calendarId) {
          throw new Error("Missing calendarId for delete.");
        }

        await axios.delete(`${API_BASE_URL}/users/calendar/${calendarId}`, {
          headers: {
            "X-Tenant-ID": HOST_Tenant_ID,
            Authorization: `Bearer ${token}`,
          },
        });

        setIsPinned(false);
        setCalendarId(null);
        setInitialPinnedDateState(null);

        onCalendarUpdated?.({
          hasPinned: false,
          pinnedDate: null,
          calendarId: null,
        });

        setSuccessMessage("Reminder removed from calendar.");
      }
      // UPDATE (change pinned date)
      else {
        if (!calendarId) {
          throw new Error("Missing calendarId for update.");
        }

        const payload = {
          selectedDate: formatSelectedDate(selectedDate),
          reminderTime: "10:00",
          notes: `Updated reminder for ${eventTitle}`,
          notificationType: "email",
          isPinned: true,
          color: "red",
        };

        await axios.put(
          `${API_BASE_URL}/users/calendar/${calendarId}`,
          payload,
          {
            headers: {
              "X-Tenant-ID": HOST_Tenant_ID,
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setInitialPinnedDateState(new Date(formatSelectedDate(selectedDate)));

        onCalendarUpdated?.({
          hasPinned: true,
          pinnedDate: formatSelectedDate(selectedDate),
          calendarId,
        });

        setSuccessMessage("Calendar reminder updated!");
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1000);
    } catch (error: any) {
      console.error("Calendar Error:", error);

      const msg =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Calendar update failed.";

      setErrorMessage(msg);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // previous month "faded" days
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

    // current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      const isEventDay = isSameDay(date, initialDate);

      const isNewSelectedDay =
        !isSameDay(date, initialDate) &&
        !(
          isPinned &&
          initialPinnedDateState &&
          isSameDay(date, initialPinnedDateState)
        ) &&
        isSameDay(date, selectedDate);

      const isSelectedPinnedDay =
        isPinned &&
        initialPinnedDateState &&
        isSameDay(date, initialPinnedDateState);

      let classes =
        "h-10 sm:h-12 flex items-center justify-center text-xs sm:text-sm rounded-lg transition-colors ";

      if (isEventDay) {
        // 🔵 Event date (always blue)
        classes += "bg-[#0077F7] text-white";
      } else if (isSelectedPinnedDay) {
        // 🔴 Pinned reminder
        classes += "bg-red-500 text-white";
      } else if (isNewSelectedDay) {
        // ⚪ Newly selected (gray)
        classes +=
          "bg-gray-200 dark:bg-[#2A2A2A] text-gray-900 dark:text-white";
      } else {
        // Default
        classes +=
          "text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1E1E1E]";
      }

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={classes}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const hasChanges =
    !isPinned ||
    isUnpinChecked ||
    !initialPinnedDateState ||
    !isSameDay(selectedDate, initialPinnedDateState);

  const primaryButtonLabel = !isPinned ? "Add to Calendar" : "Update";

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 transition-colors">
        <div className="relative w-full max-w-[400px] sm:max-w-[500px] bg-white dark:bg-[#101010] text-black dark:text-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[100vh] transition-colors duration-300">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#1E1E1E] hover:bg-white dark:hover:bg-[#2A2A2A] transition-colors"
          >
            <X className="w-5 h-5 text-gray-900 dark:text-gray-300" />
          </button>

          {/* Event image */}
          {/* <div className="relative h-[140px] sm:h-[100px] w-full">
            <Image
              src={eventImage}
              alt={eventTitle}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div> */}

          {/* Content */}
          <div className="p-4 sm:p-4">
            <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              {eventTitle}
            </h2>
            <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 break-all line-clamp-2">
              {eventDescription || "No description available."}
            </p>

            {/* Navigation */}
            <div className="flex items-center justify-between mb-2 sm:mb-3">
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

            {/* Legend */}
            <div className="flex items-center gap-3 mb-2 sm:mb-3 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-[#0077F7]" />
                <span>Event date</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
                <span>Pinned reminder</span>
              </div>
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

            {/* Unpin toggle (only if already pinned) */}
            {isPinned && (
              <label className="flex items-center gap-2 mt-2 mb-3 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={isUnpinChecked}
                  onChange={(e) => setIsUnpinChecked(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span>Unpin this reminder</span>
              </label>
            )}

            {/* Action Button */}
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="w-full bg-[#0077F7] hover:bg-[#0066D6] text-white py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {primaryButtonLabel}
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ Bottom-right Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fadeIn z-[100]">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* ❌ Bottom-right Error Toast */}
      {showError && (
        <div className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fadeIn z-[100]">
          <X className="w-5 h-5" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}
    </>
  );
}

//code before mansoor bhai updates

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { ChevronLeft, ChevronRight, X, CheckCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// interface CalendarModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   eventTitle: string;
//   eventDescription: string;
//   eventImage: string;
//   eventId: string; // ✅ added to send in payload
//   initialDate?: Date;
// }

// export function CalendarModal({
//   isOpen,
//   onClose,
//   eventTitle,
//   eventDescription,
//   eventImage,
//   eventId,
//   initialDate = new Date(),
// }: CalendarModalProps) {
//   const [currentDate, setCurrentDate] = useState(initialDate);
//   const [selectedDate, setSelectedDate] = useState(initialDate);
//   const [showSuccess, setShowSuccess] = useState(false); // ✅ for toast message

//   const [showError, setShowError] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const [calendarId, setCalendarId] = useState<string | null>(null);

//   if (!isOpen) return null;

//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//   const getDaysInMonth = (date: Date) =>
//     new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

//   const getFirstDayOfMonth = (date: Date) => {
//     const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
//     return day === 0 ? 6 : day - 1;
//   };

//   const getDayName = (date: Date) =>
//     [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ][date.getDay()];

//   const previousMonth = () =>
//     setCurrentDate(
//       new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
//     );

//   const nextMonth = () =>
//     setCurrentDate(
//       new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
//     );

//   // ✅ helper to format date as "YYYY-MM-DD"
//   const formatSelectedDate = (date: Date) => {
//     const year = date.getFullYear();
//     const month = `${date.getMonth() + 1}`.padStart(2, "0");
//     const day = `${date.getDate()}`.padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   // ✅ Add to Calendar with POST /users/calendar
//   const handleAddToCalendar = async () => {
//     try {
//       const token =
//         typeof window !== "undefined"
//           ? localStorage.getItem("buyerToken") ||
//             localStorage.getItem("hostToken") ||
//             localStorage.getItem("accessToken") ||
//             localStorage.getItem("token")
//           : null;

//       if (!token) {
//         setErrorMessage("You must be logged in to add events.");
//         setShowError(true);
//         setTimeout(() => setShowError(false), 3000);
//         return;
//       }

//       const payload = {
//         selectedDate: formatSelectedDate(selectedDate),
//         reminderTime: "10:00",
//         notes: `Updated reminder for ${eventTitle}`,
//         notificationType: "email",
//         isPinned: true,
//         color: "red",
//       };

//       // ⭐ If calendarId exists → PUT (update existing)
//       if (calendarId) {
//         await axios.put(
//           `${API_BASE_URL}/users/calendar/${calendarId}`,
//           payload,
//           {
//             headers: {
//               "X-Tenant-ID": HOST_Tenant_ID,
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setShowSuccess(true);
//         setTimeout(onClose, 1000);
//         setTimeout(() => setShowSuccess(false), 3000);
//         return;
//       }

//       // ⭐ Else → POST (create new)
//       const res = await axios.post(
//         `${API_BASE_URL}/users/calendar`,
//         { ...payload, eventId }, // POST requires eventId
//         {
//           headers: {
//             "X-Tenant-ID": HOST_Tenant_ID,
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // ⭐ Save new calendarId returned by backend
//       if (res?.data?.data?.id) {
//         setCalendarId(res.data.data.id);
//       }

//       setShowSuccess(true);
//       setTimeout(onClose, 1000);
//       setTimeout(() => setShowSuccess(false), 3000);
//     } catch (error: any) {
//       console.error("Calendar Error:", error);

//       const msg =
//         error?.response?.data?.error?.message || "Calendar update failed.";

//       // ⭐ Backend says event already exists → Use PUT now
//       if (msg.includes("already in your calendar")) {
//         // We now must update using PUT but we still need calendarId
//         // Backend does NOT give ID in error, so we use saved one
//         if (calendarId) {
//           await handleUpdateExisting();
//           return;
//         }

//         // ❗ If calendarId not saved yet → must fetch it manually
//         setErrorMessage(
//           "Event already exists — unable to update (missing calendarId)."
//         );
//         setShowError(true);
//         setTimeout(() => setShowError(false), 3000);
//         return;
//       }

//       setErrorMessage(msg);
//       setShowError(true);
//       setTimeout(() => setShowError(false), 3000);
//     }
//   };

//   const handleUpdateExisting = async () => {
//     try {
//       const token =
//         localStorage.getItem("buyerToken") ||
//         localStorage.getItem("hostToken") ||
//         localStorage.getItem("accessToken") ||
//         localStorage.getItem("token");

//       const payload = {
//         id: calendarId, // ⭐ REQUIRED NOW
//         selectedDate: formatSelectedDate(selectedDate),
//         reminderTime: "10:00",
//         notes: "Updated reminder",
//         isPinned: false,
//         color: "blue",
//       };

//       await axios.put(`${API_BASE_URL}/users/calendar/${calendarId}`, payload, {
//         headers: {
//           "X-Tenant-ID": HOST_Tenant_ID,
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setShowSuccess(true);
//       setTimeout(onClose, 1000);
//       setTimeout(() => setShowSuccess(false), 3000);
//     } catch (error) {
//       setErrorMessage("Failed to update calendar entry.");
//       setShowError(true);
//       setTimeout(() => setShowError(false), 3000);
//     }
//   };

//   const renderCalendar = () => {
//     const daysInMonth = getDaysInMonth(currentDate);
//     const firstDay = getFirstDayOfMonth(currentDate);
//     const days = [];

//     for (let i = firstDay - 1; i >= 0; i--) {
//       days.push(
//         <div
//           key={`prev-${i}`}
//           className="h-10 sm:h-12 flex items-center justify-center text-gray-300 dark:text-gray-600 text-xs sm:text-sm"
//         >
//           {new Date(
//             currentDate.getFullYear(),
//             currentDate.getMonth() - 1,
//             0
//           ).getDate() - i}
//         </div>
//       );
//     }

//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(
//         currentDate.getFullYear(),
//         currentDate.getMonth(),
//         day
//       );
//       const isSelected =
//         selectedDate.getDate() === day &&
//         selectedDate.getMonth() === currentDate.getMonth();

//       days.push(
//         <button
//           key={day}
//           onClick={() => setSelectedDate(date)}
//           className={`h-10 sm:h-12 flex items-center justify-center text-xs sm:text-sm rounded-lg transition-colors ${
//             isSelected
//               ? "bg-[#0077F7] text-white"
//               : "text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1E1E1E]"
//           }`}
//         >
//           {day}
//         </button>
//       );
//     }

//     return days;
//   };

//   return (
//     <>
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 transition-colors">
//         <div className="relative w-full max-w-[400px] sm:max-w-[500px] bg-white dark:bg-[#101010] text-black dark:text-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[100vh] transition-colors duration-300">
//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#1E1E1E] hover:bg-white dark:hover:bg-[#2A2A2A] transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-900 dark:text-gray-300" />
//           </button>

//           {/* Event image */}
//           <div className="relative h-[140px] sm:h-[100px] w-full">
//             <Image
//               src={eventImage}
//               alt={eventTitle}
//               fill
//               className="object-cover"
//             />
//             <div className="absolute inset-0 bg-black/30" />
//           </div>

//           {/* Content */}
//           <div className="p-4 sm:p-4">
//             <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
//               {eventTitle}
//             </h2>
//             <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
//               {eventDescription}
//             </p>

//             {/* Navigation */}
//             <div className="flex items-center justify-between mb-3 sm:mb-4">
//               <button
//                 onClick={previousMonth}
//                 className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#1E1E1E] transition-colors"
//               >
//                 <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-gray-900 dark:text-gray-300" />
//               </button>
//               <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
//                 {getDayName(selectedDate)}, {selectedDate.getDate()}{" "}
//                 {monthNames[selectedDate.getMonth()]}
//               </div>
//               <button
//                 onClick={nextMonth}
//                 className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#1E1E1E] transition-colors"
//               >
//                 <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-gray-900 dark:text-gray-300" />
//               </button>
//             </div>

//             {/* Calendar Grid */}
//             <div className="mb-2">
//               <div className="grid grid-cols-7 gap-1 mb-2">
//                 {dayNames.map((d) => (
//                   <div
//                     key={d}
//                     className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 text-center"
//                   >
//                     {d}
//                   </div>
//                 ))}
//               </div>

//               <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
//             </div>

//             {/* Action Button */}
//             <Button
//               onClick={handleAddToCalendar}
//               className="w-full bg-[#0077F7] hover:bg-[#0066D6] text-white py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold"
//             >
//               Add to Calendar
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Bottom-right Success Toast */}
//       {showSuccess && (
//         <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fadeIn z-[100]">
//           <CheckCircle className="w-5 h-5" />
//           <span className="text-sm font-medium">
//             Added to calendar successfully!
//           </span>
//         </div>
//       )}

//       {/* ❌ Bottom-right Error Toast */}
//       {showError && (
//         <div className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fadeIn z-[100]">
//           <X className="w-5 h-5" />
//           <span className="text-sm font-medium">{errorMessage}</span>
//         </div>
//       )}
//     </>
//   );
// }

//code before integartion

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { ChevronLeft, ChevronRight, X, CheckCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface CalendarModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   eventTitle: string;
//   eventDescription: string;
//   eventImage: string;
//   initialDate?: Date;
// }

// export function CalendarModal({
//   isOpen,
//   onClose,
//   eventTitle,
//   eventDescription,
//   eventImage,
//   initialDate = new Date(2025, 5, 10),
// }: CalendarModalProps) {
//   const [currentDate, setCurrentDate] = useState(initialDate);
//   const [selectedDate, setSelectedDate] = useState(initialDate);
//   const [showSuccess, setShowSuccess] = useState(false); // ✅ for toast message

//   if (!isOpen) return null;

//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//   const getDaysInMonth = (date: Date) =>
//     new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

//   const getFirstDayOfMonth = (date: Date) => {
//     const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
//     return day === 0 ? 6 : day - 1;
//   };

//   const getDayName = (date: Date) =>
//     [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ][date.getDay()];

//   const previousMonth = () =>
//     setCurrentDate(
//       new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
//     );

//   const nextMonth = () =>
//     setCurrentDate(
//       new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
//     );

//   const handleAddToCalendar = () => {
//     setShowSuccess(true);

//     // Delay closing modal slightly so toast has time to render
//     setTimeout(() => {
//       onClose();
//     }, 1000); // 1 seconds is enough

//     // Hide toast after 3 seconds
//     setTimeout(() => {
//       setShowSuccess(false);
//     }, 3000);
//   };

//   const renderCalendar = () => {
//     const daysInMonth = getDaysInMonth(currentDate);
//     const firstDay = getFirstDayOfMonth(currentDate);
//     const days = [];

//     for (let i = firstDay - 1; i >= 0; i--) {
//       days.push(
//         <div
//           key={`prev-${i}`}
//           className="h-10 sm:h-12 flex items-center justify-center text-gray-300 dark:text-gray-600 text-xs sm:text-sm"
//         >
//           {new Date(
//             currentDate.getFullYear(),
//             currentDate.getMonth() - 1,
//             0
//           ).getDate() - i}
//         </div>
//       );
//     }

//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(
//         currentDate.getFullYear(),
//         currentDate.getMonth(),
//         day
//       );
//       const isSelected =
//         selectedDate.getDate() === day &&
//         selectedDate.getMonth() === currentDate.getMonth();

//       days.push(
//         <button
//           key={day}
//           onClick={() => setSelectedDate(date)}
//           className={`h-10 sm:h-12 flex items-center justify-center text-xs sm:text-sm rounded-lg transition-colors ${
//             isSelected
//               ? "bg-[#0077F7] text-white"
//               : "text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1E1E1E]"
//           }`}
//         >
//           {day}
//         </button>
//       );
//     }

//     return days;
//   };

//   return (
//     <>
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 transition-colors">
//         <div className="relative w-full max-w-[400px] sm:max-w-[500px] bg-white dark:bg-[#101010] text-black dark:text-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[100vh] transition-colors duration-300">
//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#1E1E1E] hover:bg-white dark:hover:bg-[#2A2A2A] transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-900 dark:text-gray-300" />
//           </button>

//           {/* Event image */}
//           <div className="relative h-[140px] sm:h-[100px] w-full">
//             <Image
//               src={eventImage}
//               alt={eventTitle}
//               fill
//               className="object-cover"
//             />
//             <div className="absolute inset-0 bg-black/30" />
//           </div>

//           {/* Content */}
//           <div className="p-4 sm:p-4">
//             <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
//               {eventTitle}
//             </h2>
//             <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
//               {eventDescription}
//             </p>

//             {/* Navigation */}
//             <div className="flex items-center justify-between mb-3 sm:mb-4">
//               <button
//                 onClick={previousMonth}
//                 className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#1E1E1E] transition-colors"
//               >
//                 <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-gray-900 dark:text-gray-300" />
//               </button>
//               <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
//                 {getDayName(selectedDate)}, {selectedDate.getDate()}{" "}
//                 {monthNames[selectedDate.getMonth()]}
//               </div>
//               <button
//                 onClick={nextMonth}
//                 className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#1E1E1E] transition-colors"
//               >
//                 <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-gray-900 dark:text-gray-300" />
//               </button>
//             </div>

//             {/* Calendar Grid */}
//             <div className="mb-2">
//               <div className="grid grid-cols-7 gap-1 mb-2">
//                 {dayNames.map((d) => (
//                   <div
//                     key={d}
//                     className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 text-center"
//                   >
//                     {d}
//                   </div>
//                 ))}
//               </div>

//               <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
//             </div>

//             {/* Action Button */}
//             <Button
//               onClick={() => handleAddToCalendar()}
//               className="w-full bg-[#0077F7] hover:bg-[#0066D6] text-white py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold"
//             >
//               Add to Calendar
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Bottom-right Success Toast */}
//       {showSuccess && (
//         <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fadeIn z-[100]">
//           <CheckCircle className="w-5 h-5" />
//           <span className="text-sm font-medium">
//             Added to calendar successfully!
//           </span>
//         </div>
//       )}
//     </>
//   );
// }
