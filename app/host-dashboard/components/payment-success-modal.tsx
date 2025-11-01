"use client";

type PaymentSuccessModalProps = {
  open: boolean;
  onClose: () => void;
};

export function PaymentSuccessModal({
  open,
  onClose,
}: PaymentSuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Scrim / Overlay */}
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
        className="relative bg-white dark:bg-[#101010] text-black dark:text-white shadow-md rounded-2xl w-[90%] max-w-[532px] mx-auto flex flex-col items-center text-center px-5 sm:px-8 md:px-10 pt-10 sm:pt-12 pb-6 sm:pb-8"
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
            className="h-5 w-5 sm:h-6 sm:w-6"
          />
        </button>

        {/* Success Icon */}
        <div
          className="flex justify-center items-center mb-5 sm:mb-6"
          style={{
            width: 80,
            height: 80,
            borderRadius: 9999,
            background: "var(--brand, #D19537)",
          }}
        >
          <img
            src="/images/icons/payment-success-icon.png"
            alt="success"
            className="h-[32px] w-[38px] sm:h-[36px] sm:w-[44px]"
          />
        </div>

        {/* Title */}
        <h3
          id="withdraw-success-title"
          className="text-[20px] sm:text-[22px] md:text-[24px] font-black tracking-[-0.01em] mb-2"
        >
          Payment Details Updated
        </h3>

        {/* Description */}
        <p className="text-[14px] sm:text-[15px] leading-[1.6] text-gray-600 dark:text-gray-400 max-w-[420px] mb-5">
          Your payment information has been securely saved and is ready for
          future transactions on Event Core.
        </p>

        {/* Done Button */}
        <div className="w-full max-w-[400px] sm:max-w-[436px]">
          <button
            onClick={onClose}
            className="w-full h-11 sm:h-12 rounded-xl text-[14px] sm:text-[15px] font-semibold"
            style={{
              background: "var(--brand, #D19537)",
              color: "var(--brand-on, #FFFFFF)",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessModal;
