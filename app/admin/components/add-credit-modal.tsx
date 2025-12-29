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
    amount: number; // POINTS
    reason: string;
    expiresAt: string;
  }) => void;
}

const POINT_TO_DOLLAR_RATE = 5 / 1000; // 1000 points = $5

export function AddCreditModal({
  isOpen,
  onClose,
  refundRequestId,
  buyerEmail,
  totalTicketAmount,
  onSubmit,
}: AddCreditModalProps) {
  /* ---------------- HOOKS (ALWAYS CALLED) ---------------- */
  const [points, setPoints] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("2026-01-31");

  const numericPoints = Number(points) || 0;

  const usdValue = useMemo(() => {
    if (numericPoints <= 0) return 0;
    return numericPoints * POINT_TO_DOLLAR_RATE;
  }, [numericPoints]);

  const remainingRefund = useMemo(() => {
    const remaining = totalTicketAmount - usdValue;
    return remaining > 0 ? remaining : 0;
  }, [totalTicketAmount, usdValue]);

  /* ---------------- EARLY EXIT AFTER HOOKS ---------------- */
  if (!isOpen) return null;

  /* ---------------- HANDLERS ---------------- */
  const handleSubmit = () => {
    if (!buyerEmail || !refundRequestId) return;
    if (numericPoints <= 0) return;
    if (!reason.trim()) return;

    onSubmit({
      refundRequestId,
      buyerEmail,
      amount: numericPoints, // ✅ POINTS ONLY
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

        <h3 className="text-xl font-bold text-foreground">Add Points</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Add promotional points to the buyer’s account.
        </p>

        {/* POINTS INFO */}
        <div className="mt-4 mb-5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2 text-sm text-blue-700 dark:text-blue-300 text-center">
          ⭐ <span className="font-medium">1000 points = $5</span>
        </div>

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

          {/* POINTS INPUT */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Points
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Enter points"
                value={points}
                onChange={(e) =>
                  setPoints(e.target.value.replace(/[^0-9]/g, ""))
                }
                className="w-full rounded-lg border px-3 py-2 pr-28 text-sm dark:bg-[#101010] dark:border-gray-800"
              />

              {/* LIVE USD */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 whitespace-nowrap">
                ≈ ${usdValue.toFixed(2)}
              </div>
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
              Credit Value:{" "}
              <span className="font-medium text-red-600">
                - ${usdValue.toFixed(2)}
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
              Add Points
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useMemo, useState } from "react";
// import { X } from "lucide-react";

// interface AddCreditModalProps {
//   isOpen: boolean;
//   onClose: () => void;

//   refundRequestId: string;
//   buyerEmail: string;
//   totalTicketAmount: number;

//   onSubmit: (data: {
//     refundRequestId: string;
//     buyerEmail: string;
//     amount: number;
//     reason: string;
//     expiresAt: string;
//   }) => void;
// }

// export function AddCreditModal({
//   isOpen,
//   onClose,
//   refundRequestId,
//   buyerEmail,
//   totalTicketAmount,
//   onSubmit,
// }: AddCreditModalProps) {
//   /* ---------------- HOOKS (ALWAYS CALLED) ---------------- */
//   const [amount, setAmount] = useState<string>("");
//   const [reason, setReason] = useState<string>("");
//   const [expiresAt, setExpiresAt] = useState<string>("2026-01-31");

//   const creditAmount = Number(amount) || 0;

//   const remainingRefund = useMemo(() => {
//     const remaining = totalTicketAmount - creditAmount;
//     return remaining > 0 ? remaining : 0;
//   }, [totalTicketAmount, creditAmount]);

//   /* ---------------- EARLY EXIT AFTER HOOKS ---------------- */
//   if (!isOpen) return null;

//   /* ---------------- HANDLERS ---------------- */
//   const handleSubmit = () => {
//     if (!buyerEmail || !refundRequestId) return;
//     if (creditAmount <= 0) return;
//     if (!reason.trim()) return;

//     onSubmit({
//       refundRequestId,
//       buyerEmail,
//       amount: creditAmount,
//       reason: reason.trim(),
//       expiresAt,
//     });
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
//       <div className="relative w-full max-w-[520px] rounded-2xl bg-white dark:bg-[#101010] p-6 sm:p-7 shadow-2xl border border-border dark:border-gray-800">
//         {/* Close */}
//         <button
//           onClick={onClose}
//           aria-label="Close"
//           className="absolute top-4 right-4 hover:opacity-70"
//         >
//           <X className="w-5 h-5 text-foreground" />
//         </button>

//         <h3 className="text-xl font-bold text-foreground">Add Credit</h3>
//         <p className="text-sm text-muted-foreground mt-1">
//           Add promotional credit to the buyer’s account.
//         </p>

//         {/* FORM */}
//         <div className="mt-5 space-y-4">
//           <div>
//             <label className="text-sm font-medium text-foreground">
//               Buyer Email
//             </label>
//             <input
//               value={buyerEmail}
//               disabled
//               className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-gray-100 dark:bg-[#1a1a1a] cursor-not-allowed dark:border-gray-800"
//             />
//           </div>

//           {/* Credit Amount */}
//           <div>
//             <label className="text-sm font-medium text-foreground">
//               Credit Amount
//             </label>
//             <div className="relative mt-1">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
//                 $
//               </span>
//               <input
//                 type="number"
//                 min="0"
//                 step="1"
//                 placeholder="e.g. 5"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 className="w-full rounded-lg border pl-7 pr-3 py-2 text-sm dark:bg-[#101010] dark:border-gray-800"
//               />
//             </div>
//           </div>

//           {/* Reason */}
//           <div>
//             <label className="text-sm font-medium text-foreground">
//               Reason
//             </label>
//             <textarea
//               rows={3}
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:bg-[#101010] dark:border-gray-800"
//             />
//           </div>

//           {/* Expiry */}
//           <div>
//             <label className="text-sm font-medium text-foreground">
//               Expires At
//             </label>
//             <input
//               type="date"
//               value={expiresAt}
//               onChange={(e) => setExpiresAt(e.target.value)}
//               className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:bg-[#101010] dark:border-gray-800"
//             />
//           </div>
//         </div>

//         {/* SUMMARY */}
//         <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div className="text-sm space-y-1 text-muted-foreground">
//             <p>
//               Total Ticket Amount:{" "}
//               <span className="font-medium text-foreground">
//                 ${totalTicketAmount.toFixed(2)}
//               </span>
//             </p>
//             <p>
//               Credit Added:{" "}
//               <span className="font-medium text-red-600">
//                 - ${creditAmount.toFixed(2)}
//               </span>
//             </p>
//             <div className="border-t pt-1 mt-1">
//               <p className="font-semibold text-foreground">
//                 Remaining Refund: ${remainingRefund.toFixed(2)}
//               </p>
//             </div>
//           </div>

//           <div className="flex justify-end gap-3">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 rounded-lg border text-sm dark:border-gray-800"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="px-4 py-2 rounded-lg text-sm text-white"
//               style={{ backgroundColor: "#0077F7" }}
//             >
//               Add Credit
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
