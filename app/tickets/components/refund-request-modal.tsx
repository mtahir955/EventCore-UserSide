"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface RefundRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    reason: string;
    bankAccount: string;
    refundExpiryDate: string;
  }) => void;
}

export function RefundRequestModal({
  open,
  onClose,
  onSubmit,
}: RefundRequestModalProps) {
  const [reason, setReason] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // 🔒 Hardcoded expiry date (later comes from backend)
  const refundExpiryDate = "2025-12-20";

  const handlePrimarySubmit = () => {
    if (!reason || !bankAccount) return;
    setShowConfirm(true);
  };

  const handleConfirmSubmit = () => {
    onSubmit({
      reason,
      bankAccount,
      refundExpiryDate,
    });

    // Reset state
    setReason("");
    setBankAccount("");
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      {/* MAIN REFUND MODAL */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] sm:w-[420px] rounded-xl p-6">
          <DialogTitle className="text-lg font-semibold">
            Refund Request
          </DialogTitle>

          <div className="mt-4 space-y-4">
            {/* Bank Account */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Medium for Refund
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:bg-[#181818]"
                placeholder="Enter your bank account / IBAN"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
              />
            </div>

            {/* Reason */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason for refund
              </label>
              <textarea
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:bg-[#181818]"
                rows={4}
                placeholder="Explain why you want a refund..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {/* Refund Expiry (Read-only) */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Refund Expiry Date
              </label>
              <input
                type="text"
                disabled
                value={refundExpiryDate}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-gray-100 dark:bg-[#222] cursor-not-allowed"
              />
            </div>

            {/* ℹ️ NOTE */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-[12px] text-blue-800">
              Refunds are permitted while the event is upcoming or ongoing.
              Refund requests submitted after the event has ended will not be
              processed.
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handlePrimarySubmit}
              className="px-4 py-2 rounded-lg bg-[#0077F7] text-white text-sm"
            >
              Send Request
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CONFIRMATION POPUP */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="w-[90vw] sm:w-[360px] rounded-xl p-6">
          <DialogTitle className="text-lg font-semibold text-center">
            Confirm Refund Request
          </DialogTitle>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
            Are you sure you want to proceed with this refund request?
            <br />
            <br />
            <span className="font-medium">
              Once this refund request is submitted, it cannot be cancelled or
              modified. Please ensure all details are correct before proceeding.
            </span>
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 rounded-lg border text-sm"
            >
              Go Back
            </button>

            <button
              onClick={handleConfirmSubmit}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm"
            >
              Confirm & Submit
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
