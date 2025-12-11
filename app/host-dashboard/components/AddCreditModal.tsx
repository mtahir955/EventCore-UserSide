"use client";

import { useState } from "react";

interface AddCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: { id: string; name: string } | null;
  onSave: (data: {
    amount: number;
    reason: string;
    expiresAt: string;
    customerId: string;
  }) => void;
}

export default function AddCreditModal({
  isOpen,
  onClose,
  customer,
  onSave,
}: AddCreditModalProps) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!amount || !reason || !expiresAt || !customer?.id) return;

    onSave({
      amount: Number(amount),
      reason,
      expiresAt,
      customerId: customer.id,
    });

    // Reset
    setAmount("");
    setReason("");
    setExpiresAt("");

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#101010] w-[350px] rounded-xl p-6 relative shadow-lg">
        {/* Close */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-[22px] font-semibold mb-5 text-center">
          Add Credit
        </h2>

        {/* Amount */}
        <label className="text-sm">Amount</label>
        <input
          type="number"
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Reason */}
        <label className="text-sm">Reason</label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 h-20 mb-4"
          placeholder="Reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        {/* Expiry Date */}
        <label className="text-sm">Expires At</label>
        <div className="relative mb-6">
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-2">
          <button className="px-6 py-2 border rounded-lg" onClick={onClose}>
            Cancel
          </button>

          <button
            className="px-6 py-2 rounded-lg text-white bg-[#D19537]"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
