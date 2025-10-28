"use client";

import { useRouter } from "next/navigation";

interface MessageSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MessageSuccessModal({
  isOpen,
  onClose,
}: MessageSuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4 sm:px-6">
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[532px] p-6 sm:p-8 flex flex-col items-center justify-center overflow-hidden"
        style={{
          minHeight: "320px",
          maxHeight: "90vh",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <img
            src="/images/icons/close-button.png"
            alt="Close"
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center justify-center text-center px-2 sm:px-4 py-4 sm:py-6 w-full">
          {/* Icon */}
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-5 sm:mb-6"
            style={{ background: "#D19537" }}
          >
            <img src="/glipy.png" alt="" className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          {/* Title */}
          <h2 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold text-black mb-3 sm:mb-4">
            Message Sent
          </h2>

          {/* Description */}
          <p className="text-[14px] sm:text-[16px] text-gray-700 leading-relaxed mb-6 sm:mb-8 max-w-md">
            Thank you for contacting us. We’ve received your message and will
            respond as soon as possible.
          </p>

          {/* Button */}
          <button
            onClick={onClose}
            className="w-full py-3 sm:py-3.5 rounded-lg text-[14px] sm:text-[16px] font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: "#D19537" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
