"use client";

import Link from "next/link";

type WithdrawModalProps = {
  open: boolean;
  onClose: () => void;
  onRequest?: () => void;
};

export function WithdrawModal({
  open,
  onClose,
  onRequest,
}: WithdrawModalProps) {
  if (!open) return null;

  return (
    // Fullscreen overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Background dim layer */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        role="dialog"
        aria-labelledby="withdraw-title"
        aria-modal="true"
        className="relative bg-white text-black shadow-md rounded-3xl w-full mt-8 sm:mt-1 max-w-[640px] sm:h-auto"
      >
        <div className="w-full h-full px-6 sm:px-10 pt-8 sm:pt-10 pb-8 flex flex-col">
          {/* Title */}
          <h2
            id="withdraw-title"
            className="text-2xl sm:text-[32px] leading-none font-black tracking-[-0.02em]"
          >
            Withdraw Earnings
          </h2>

          {/* Current Balance */}
          <div className="mt-6 sm:mt-8">
            <div className="text-[15px] sm:text-[16px]">Current Balance</div>
            <div className="mt-2 text-[32px] sm:text-[40px] font-black tracking-[-0.02em]">
              $67,000
            </div>
          </div>

          {/* Withdrawal Amount */}
          <div className="mt-6 sm:mt-8">
            <label className="block text-[15px] sm:text-[16px] mb-3">
              Withdrawal Amount
            </label>
            <input
              type="text"
              placeholder="$0.00"
              className="w-full h-12 sm:h-14 rounded-2xl px-4 sm:px-5 text-[15px] sm:text-[16px] outline-none border border-gray-300"
              style={{ background: "var(--card)" }}
              required
            />
          </div>

          {/* Linked Payment Method */}
          <div className="mt-6 sm:mt-8">
            <div className="text-[15px] sm:text-[16px] mb-4">
              Linked Payment Method
            </div>
            <div className="flex items-center gap-3">
              <img src="/images/icons/bank.png" alt="" className="h-5 w-5" />
              <div>
                <div className="text-[15px] sm:text-[16px]">
                  Account ending in 1234
                </div>
                <div className="text-[13px] text-muted-foreground -mt-0.5">
                  Stripe Account
                </div>
              </div>
            </div>

            {/* Buttons: Add Method + Edit */}
            <div className="mt-6 flex flex-row sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button className="h-10 sm:h-12 sm:w-auto flex-1 rounded-full text-[10px] sm:text-[15px] font-medium border border-gray-300 bg-white">
                Add Payment Method
              </button>
              <Link href="/payment-setup" className="flex-1 sm:flex-none">
                <button className="h-10 w-[80px] sm:h-12 ml-8 sm:w-auto px-6 rounded-full text-[13px] sm:text-[15px] font-semibold bg-[#D19537] text-white">
                  Edit
                </button>
              </Link>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 sm:mt-8 flex flex-row sm:flex-row justify-end gap-3 sm:gap-4">
            <button
              className="h-12 w-full sm:w-auto px-8 rounded-2xl text-[15px] font-medium border border-gray-300 bg-[rgba(245,237,229,1)]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="h-12 w-full sm:w-auto px-8 rounded-2xl text-[15px] font-semibold bg-[#D19537] text-white"
              onClick={() => {
                if (onRequest) onRequest();
              }}
            >
              Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawModal;
