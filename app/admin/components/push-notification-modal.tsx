"use client";

interface PushNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PushNotificationModal({
  isOpen,
  onClose,
}: PushNotificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4 sm:px-6">
      <div
        className="
          relative 
          rounded-2xl 
          shadow-2xl 
          bg-white 
          w-full 
          max-w-[532px] 
          max-h-[90vh]
          overflow-y-auto
          p-6 sm:p-8
        "
      >
        {/* ===== Close button ===== */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <img
            src="icons/close-icon.png"
            alt="Close"
            className="w-5 sm:w-6 h-5 sm:h-6"
          />
        </button>

        {/* ===== Content ===== */}
        <div className="flex flex-col items-center justify-center text-center py-4 sm:py-6">
          {/* Icon */}
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-5 sm:mb-6"
            style={{ background: "#D19537" }}
          >
            <img
              src="/icons/glipy.png"
              alt="Success"
              className="w-10 sm:w-12 h-10 sm:h-12"
            />
          </div>

          {/* Title */}
          <h2 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold text-black mb-3 sm:mb-4">
            Notifications Sent
          </h2>

          {/* Description */}
          <p className="text-[14px] sm:text-[16px] text-gray-700 leading-relaxed mb-6 sm:mb-8 max-w-md">
            Your message has been successfully delivered to all registered
            users.
          </p>

          {/* Button */}
          <button
            onClick={onClose}
            className="
              w-full 
              py-3 sm:py-3.5 
              rounded-lg 
              text-[14px] sm:text-[16px] 
              font-semibold 
              text-white 
              hover:opacity-90 
              transition-opacity
            "
            style={{ background: "#D19537" }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
