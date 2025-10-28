"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EditStaffModal } from "./edit-staff-modal";

interface EventSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIseditstaffmodalopen: (value: boolean) => void;
}

export function EventSuccessModal({
  isOpen,
  onClose,
  setIseditstaffmodalopen,
}: EventSuccessModalProps) {
  const router = useRouter();
  useEffect(() => {
    console.log("[v0] Modal mounted, isOpen:", isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => {
        // Only close if clicking the backdrop itself, not the modal content
        if (e.target === e.currentTarget) {
          console.log("[v0] Backdrop clicked");
        }
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col sm:w-[640px] w-[330px] h-[600px]"
        // style={{ width: "640px", height: "592.15px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-10 pt-10 pb-0">
          <img
            src="/images/event-venue.png"
            alt="Event venue"
            className="w-full h-[200px] sm:h-[280px] object-cover rounded-2xl"
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-between px-10 pt-8 pb-10">
          <div className="text-center">
            <h2 className="sm:text-[36px] text-[26px] font-bold mb-3 leading-tight tracking-tight">
              Event Successfully Uploaded!
            </h2>
            <p className="sm:text-[17px] text-[15px] text-gray-700 leading-relaxed px-2">
              Your event is now live on Event Core. Attendees can start
              exploring and booking right away.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full">
            <button
              type="button"
              onClick={() => {
                onClose();
                setIseditstaffmodalopen(true);
              }}
              className="flex-1 px-6 sm:py-4 py-2 rounded-xl font-medium sm:text-[17px] text-[12px] transition-all hover:opacity-90"
              style={{ backgroundColor: "#F5EDE5", color: "#D19537" }}
            >
              Add Event Staff
            </button>
            <button
              type="button"
              onClick={() => {
                console.log("[v0] Done clicked");
                onClose();
                router.push("/my-events");
              }}
              className="flex-1 px-6 sm:py-4 py-4 rounded-xl font-medium text-white sm:text-[17px] text-[14px] transition-all hover:opacity-90"
              style={{ backgroundColor: "#D19537" }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
