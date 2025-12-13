"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface RefundRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { reason: string; refundDate: string }) => void;
}

export function RefundRequestModal({
  open,
  onClose,
  onSubmit,
}: RefundRequestModalProps) {
  const [reason, setReason] = useState("");
  const [refundDate, setRefundDate] = useState("");

  const handleSubmit = () => {
    if (!reason || !refundDate) return;

    onSubmit({
      reason,
      refundDate,
    });

    setReason("");
    setRefundDate("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[420px] rounded-xl p-6">
        <DialogTitle className="text-lg font-semibold">
          Refund Request
        </DialogTitle>

        <div className="mt-4 space-y-4">
          {/* Reason */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Reason for refund
            </label>
            <textarea
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              rows={4}
              placeholder="Explain why you want a refund..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Refund Date */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Refund deadline
            </label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              value={refundDate}
              onChange={(e) => setRefundDate(e.target.value)}
            />
          </div>

          {/* ℹ️ NOTE */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-[12px] text-blue-800">
            Refunds are allowed while the event is upcoming or ongoing. Once the
            event has ended, refunds will no longer be available.
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
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-[#0077F7] text-white text-sm"
          >
            Send Request
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
