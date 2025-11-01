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
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 sm:px-6 bg-black/40">
      {/* Modal Card */}
      <div
        role="dialog"
        aria-labelledby="confirmation-title"
        aria-modal="true"
        className="relative bg-white dark:bg-[#101010] rounded-2xl shadow-2xl w-full max-w-[532px] sm:h-auto p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <img
            src="/images/icons/close-dark.png"
            alt="Close"
            className="w-6 h-6"
          />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center justify-center text-center mt-4 sm:mt-6">
          {/* Icon */}
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-6"
            style={{ background: "#D19537" }}
          >
            <img
              src="/images/icons/delete-event-icon.png"
              alt="Delete"
              className="w-10 h-10 sm:w-12 sm:h-12"
            />
          </div>

          {/* Title */}
          <h2
            id="confirmation-title"
            className="text-[22px] sm:text-[28px] font-bold text-black dark:text-white mb-3 sm:mb-4"
          >
            Delete Event
          </h2>

          {/* Description */}
          <p className="text-[14px] sm:text-[16px] text-gray-700 dark:text-gray-400 leading-relaxed mb-6 sm:mb-8 max-w-md">
            Are you sure you want to delete this event? This action cannot be
            undone, and all related details will be permanently removed from
            your account.
          </p>

          {/* Delete Button */}
          <button
            onClick={onConfirm}
            className="w-full py-3 sm:py-3.5 rounded-lg text-[15px] sm:text-[16px] font-semibold text-white"
            style={{ background: "#D19537" }}
          >
            Delete Anyway
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
