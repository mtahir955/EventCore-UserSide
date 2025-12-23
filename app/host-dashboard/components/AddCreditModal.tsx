"use client";

import { useEffect, useState } from "react";

interface AddCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: { id: string; name: string } | null;

  mode?: "add" | "update";

  initialCredit?: {
    amount: number;
    reason: string;
    expiresAt: string;
  } | null;

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
  mode = "add",
  initialCredit,
}: AddCreditModalProps) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  /* ───────── PREFILL FOR UPDATE ───────── */
  useEffect(() => {
    if (!isOpen) return;

    // ✅ UPDATE MODE → Prefill
    if (mode === "update" && initialCredit) {
      setAmount(String(initialCredit.amount));
      setReason(initialCredit.reason);
      setExpiresAt(initialCredit.expiresAt.split("T")[0]);
      return;
    }

    // ✅ ADD MODE → RESET
    if (mode === "add") {
      setAmount("");
      setReason("");
      setExpiresAt("");
    }
  }, [isOpen, mode, initialCredit]);

  if (!isOpen) return null;

  const resetForm = () => {
    setAmount("");
    setReason("");
    setExpiresAt("");
  };

  const handleSave = () => {
    if (!amount || !reason || !expiresAt || !customer?.id) return;

    const numericAmount = Number(amount);
    if (numericAmount <= 0) return;

    onSave({
      amount: numericAmount,
      reason,
      expiresAt,
      customerId: customer.id,
    });

    setAmount("");
    setReason("");
    setExpiresAt("");
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#101010] shadow-xl p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold">
            {mode === "update" ? "Update Credit" : "Add Credit"}
          </h2>
          {customer && (
            <p className="text-sm text-gray-500 mt-1">
              for <span className="font-medium">{customer.name}</span>
            </p>
          )}
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="text-sm font-medium">Amount</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              min="1"
              step="1"
              className="w-full border rounded-lg pl-8 pr-3 py-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </div>
        </div>

        {/* Reason */}
        <div className="mb-4">
          <label className="text-sm font-medium">Reason</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 h-20 mt-1"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Expiry */}
        <div className="mb-6">
          <label className="text-sm font-medium">Expires At</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 mt-1"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 py-2 border rounded-lg text-sm"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Cancel
          </button>

          <button
            className="flex-1 py-2 rounded-lg text-sm text-white bg-[#D19537]"
            onClick={handleSave}
          >
            {mode === "update" ? "Update Credit" : "Add Credit"}
          </button>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";

// interface AddCreditModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   customer?: { id: string; name: string } | null;
//   onSave: (data: {
//     amount: number; // dollars
//     reason: string;
//     expiresAt: string;
//     customerId: string;
//   }) => void;
// }

// export default function AddCreditModal({
//   isOpen,
//   onClose,
//   customer,
//   onSave,
// }: AddCreditModalProps) {
//   const [amount, setAmount] = useState("");
//   const [reason, setReason] = useState("");
//   const [expiresAt, setExpiresAt] = useState("");

//   if (!isOpen) return null;

//   const handleSave = () => {
//     if (!amount || !reason || !expiresAt || !customer?.id) return;

//     const numericAmount = Number(amount);

//     if (numericAmount <= 0) return;

//     onSave({
//       amount: numericAmount, // 5 => $5
//       reason,
//       expiresAt,
//       customerId: customer.id,
//     });

//     // Reset
//     setAmount("");
//     setReason("");
//     setExpiresAt("");

//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
//       <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#101010] shadow-xl p-6 relative">
//         {/* Close */}
//         <button
//           className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white"
//           onClick={onClose}
//         >
//           ✕
//         </button>

//         {/* Header */}
//         <div className="mb-6 text-center">
//           <h2 className="text-xl font-semibold">Add Credit</h2>
//           {customer && (
//             <p className="text-sm text-gray-500 mt-1">
//               for <span className="font-medium">{customer.name}</span>
//             </p>
//           )}
//         </div>

//         {/* Amount */}
//         <div className="mb-4">
//           <label className="text-sm font-medium">Amount</label>
//           <div className="relative mt-1">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
//               $
//             </span>
//             <input
//               type="number"
//               min="1"
//               step="1"
//               placeholder="0"
//               className="w-full border rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D19537]"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
//             />
//           </div>
//           <p className="text-xs text-gray-400 mt-1">
//             Enter whole dollars (e.g. 5 = $5)
//           </p>
//         </div>

//         {/* Reason */}
//         <div className="mb-4">
//           <label className="text-sm font-medium">Reason</label>
//           <textarea
//             className="w-full border rounded-lg px-3 py-2 h-20 mt-1 focus:outline-none focus:ring-2 focus:ring-[#D19537]"
//             placeholder="Reason for adding credit..."
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//           />
//         </div>

//         {/* Expiry Date */}
//         <div className="mb-6">
//           <label className="text-sm font-medium">Expires At</label>
//           <input
//             type="date"
//             className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#D19537]"
//             value={expiresAt}
//             onChange={(e) => setExpiresAt(e.target.value)}
//           />
//         </div>

//         {/* Actions */}
//         <div className="flex gap-3">
//           <button
//             className="flex-1 py-2 border rounded-lg text-sm"
//             onClick={onClose}
//           >
//             Cancel
//           </button>

//           <button
//             disabled={!amount || !reason || !expiresAt}
//             className="flex-1 py-2 rounded-lg text-sm text-white bg-[#D19537] disabled:opacity-50"
//             onClick={handleSave}
//           >
//             Add Credit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
