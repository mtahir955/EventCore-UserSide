"use client";

type WithdrawSuccessModalProps = {
  open: boolean;
  onClose: () => void;
};

export function WithdrawSuccessModal({
  open,
  onClose,
}: WithdrawSuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-labelledby="withdraw-success-title"
        aria-modal="true"
        className="relative bg-white text-black shadow-md rounded-2xl w-full max-w-[532px] sm:h-auto"
      >
        {/* Close Button */}
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 h-6 w-6 grid place-items-center"
        >
          <img
            src="/images/icons/close.png"
            alt="close"
            className="h-6 w-6"
          />
        </button>

        {/* Content */}
        <div className="h-full w-full px-6 sm:px-10 pt-10 sm:pt-12 pb-8 flex flex-col items-center text-center gap-5">
          {/* Envelope Badge */}
          <div
            className="grid place-items-center"
            style={{
              width: 70,
              height: 70,
              borderRadius: "9999px",
              background: "var(--brand, #D19537)",
            }}
          >
            <img
              src="/images/icons/envelope-send.png"
              alt="success"
              className="h-[40px] w-[40px] sm:h-[44px] sm:w-[44px]"
            />
          </div>

          {/* Title */}
          <h3
            id="withdraw-success-title"
            className="text-[20px] sm:text-[24px] leading-tight font-black tracking-[-0.01em] mt-1"
          >
            Withdrawal Request Sent
          </h3>

          {/* Description */}
          <p className="text-[14px] sm:text-[15px] leading-[1.6] text-gray-500 max-w-[420px]">
            Your withdrawal request has been submitted successfully and is now being processed.
          </p>

          {/* Button */}
          <div className="mt-2 w-full max-w-[436px]">
            <button
              onClick={onClose}
              className="w-full h-11 sm:h-12 rounded-full text-[15px] font-semibold bg-[#D19537] text-white hover:opacity-90 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawSuccessModal;
