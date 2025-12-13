"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2, PencilLine } from "lucide-react";
import { ConfirmationModal } from "./confirmation-modal";
import { EventRevenueModal } from "./EventRevenueModal";

type Props = {
  id: string;
  imageSrc: string;
  price: string;
  isEditEvent: boolean;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;

  // 🔥 Needed for revenue modal
  ticketsSold?: number;
  ticketPrice?: number;
};

export function MyEventsCard({
  id,
  imageSrc,
  price,
  isEditEvent,
  title,
  description,
  location,
  date,
  time,
  ticketsSold = 0,
  ticketPrice = Number(price),
}: Props) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleEdit = () => {
    if (!id) return;
    isEditEvent
      ? (window.location.href = `/my-events/edit?id=${id}`)
      : (window.location.href = `/completed-events/edit?id=${id}`);
  };

  const handleDelete = () => setShowDeleteConfirmation(true);

  const eventForModal = {
    id,
    name: title,
    ticketsSold,
    ticketPrice,
  };

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden w-full max-w-full">
        {/* Image */}
        <div className="h-[220px] sm:h-[240px] md:h-[260px] w-full">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt="event cover"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.00) 20%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        {/* Top Actions */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          {/* Edit */}
          <button
            onClick={handleEdit}
            className="h-7 w-7 rounded-full bg-white grid place-items-center shadow hover:scale-105 transition"
          >
            <PencilLine color="#D19537" className="h-4 w-4"/>
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="h-7 w-7 rounded-full bg-white grid place-items-center shadow hover:scale-105 transition"
          >
            <Trash2 color="#D19537" className="h-4 w-4"/>
          </button>

          {/* 🔥 3-DOT MENU */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((p) => !p)}
              className="h-7 w-7 rounded-full bg-white grid place-items-center shadow hover:scale-105 transition"
            >
              <MoreVertical color="#D19537" className="h-4 w-4 text-gray-700" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
                <button
                  onClick={() => {
                    setShowRevenueModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Ticket Details
                </button>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="h-7 px-3 rounded-full text-[12px] font-semibold bg-[#D19537] text-white grid place-items-center">
            ${price}
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute left-4 right-4 bottom-4 text-white z-10">
          <div className="font-semibold text-[18px] line-clamp-2">{title}</div>
          <div className="mt-1 text-[12px] opacity-90 line-clamp-2">
            {description}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-[12px]">
            <span className="flex items-center gap-1">
              <img
                src="/images/icons/location-icon-orange.png"
                className="h-3"
              />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <img
                src="/images/icons/calendar-icon-orange.png"
                className="h-3"
              />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <img src="/images/icons/time-icon-orange.png" className="h-3" />
              {time}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={() => setShowDeleteConfirmation(false)}
      />

      {/* 🔥 Revenue Modal */}
      <EventRevenueModal
        isOpen={showRevenueModal}
        event={eventForModal}
        onClose={() => setShowRevenueModal(false)}
      />
    </>
  );
}
