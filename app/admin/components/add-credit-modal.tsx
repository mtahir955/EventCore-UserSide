"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

interface AddCreditModalProps {
  isOpen: boolean;
  onClose: () => void;

  refundRequestId: string;
  buyerEmail: string;
  totalTicketAmount: number;

  onSubmit: (data: {
    refundRequestId: string;
    buyerEmail: string;
    amount: number;
    reason: string;
    expiresAt: string;
  }) => void;
}

export function AddCreditModal({
  isOpen,
  onClose,
  refundRequestId,
  buyerEmail,
  totalTicketAmount,
  onSubmit,
}: AddCreditModalProps) {
  /* ---------------- HOOKS (ALWAYS CALLED) ---------------- */
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("2026-01-31");

  const creditAmount = Number(amount) || 0;

  const remainingRefund = useMemo(() => {
    const remaining = totalTicketAmount - creditAmount;
    return remaining > 0 ? remaining : 0;
  }, [totalTicketAmount, creditAmount]);

  /* ---------------- EARLY EXIT AFTER HOOKS ---------------- */
  if (!isOpen) return null;

  /* ---------------- HANDLERS ---------------- */
  const handleSubmit = () => {
    if (!buyerEmail || !refundRequestId) return;
    if (creditAmount <= 0) return;
    if (!reason.trim()) return;

    onSubmit({
      refundRequestId,
      buyerEmail,
      amount: creditAmount,
      reason: reason.trim(),
      expiresAt,
    });
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-[520px] rounded-2xl bg-white dark:bg-[#101010] p-6 sm:p-7 shadow-2xl border border-border dark:border-gray-800">
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 hover:opacity-70"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        <h3 className="text-xl font-bold text-foreground">Add Credit</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Add promotional credit to the buyer’s account.
        </p>

        {/* FORM */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Buyer Email
            </label>
            <input
              value={buyerEmail}
              disabled
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-gray-100 dark:bg-[#1a1a1a] cursor-not-allowed dark:border-gray-800"
            />
          </div>

          {/* Credit Amount */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Credit Amount
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                $
              </span>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 5"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border pl-7 pr-3 py-2 text-sm dark:bg-[#101010] dark:border-gray-800"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Reason
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:bg-[#101010] dark:border-gray-800"
            />
          </div>

          {/* Expiry */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Expires At
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:bg-[#101010] dark:border-gray-800"
            />
          </div>
        </div>

        {/* SUMMARY */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm space-y-1 text-muted-foreground">
            <p>
              Total Ticket Amount:{" "}
              <span className="font-medium text-foreground">
                ${totalTicketAmount.toFixed(2)}
              </span>
            </p>
            <p>
              Credit Added:{" "}
              <span className="font-medium text-red-600">
                - ${creditAmount.toFixed(2)}
              </span>
            </p>
            <div className="border-t pt-1 mt-1">
              <p className="font-semibold text-foreground">
                Remaining Refund: ${remainingRefund.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-sm dark:border-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg text-sm text-white"
              style={{ backgroundColor: "#0077F7" }}
            >
              Add Credit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
