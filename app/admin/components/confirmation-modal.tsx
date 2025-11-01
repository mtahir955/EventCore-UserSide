"use client";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4">
      <div className="relative rounded-2xl shadow-2xl bg-white dark:bg-[#101010] p-6 sm:p-8 w-full max-w-[532px] h-auto sm:h-[384px] transition-all">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <img
            src="icons/close-icon.png"
            alt="Close"
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center justify-center h-full mt-6 sm:mt-0">
          {/* Icon */}
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-5 sm:mb-6"
            style={{ background: "#D19537" }}
          >
            <img
              src="/icons/delete-icon.png"
              alt=""
              className="w-10 h-10 sm:w-12 sm:h-12"
            />
          </div>

          {/* Title */}
          <h2 className="text-[22px] sm:text-[28px] font-bold text-black dark:text-white mb-3 sm:mb-4 text-center">
            Delete Event
          </h2>

          {/* Description */}
          <p className="text-[14px] sm:text-[16px] text-center text-gray-700 dark:text-gray-400 leading-relaxed mb-6 sm:mb-8 max-w-md">
            Are you sure you want to delete this event? This action cannot be
            undone, and all related details will be permanently removed from
            your account.
          </p>

          {/* Delete button */}
          <button
            onClick={onConfirm}
            className="w-full py-3 sm:py-3.5 rounded-lg text-[14px] sm:text-[16px] font-semibold text-white"
            style={{ background: "#D19537" }}
          >
            Delete Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
