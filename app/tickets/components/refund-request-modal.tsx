"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface RefundRequestModalProps {
  open: boolean;
  onClose: () => void;
  ticketQuantity: number;
  onSubmit: (data: {
    reason: string;
    refundMedium: string;
    refundQuantity: number;
    requestedAt: string; // ✅ REQUIRED by backend
  }) => void;
}

export function RefundRequestModal({
  open,
  onClose,
  ticketQuantity,
  onSubmit,
}: RefundRequestModalProps) {
  const [reason, setReason] = useState("");
  const [refundMedium, setRefundMedium] = useState("");
  const [refundQuantity, setRefundQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePrimarySubmit = () => {
    if (!reason || !refundMedium || refundQuantity < 1) return;
    setShowConfirm(true);
  };

  const handleConfirmSubmit = () => {
    onSubmit({
      reason,
      refundMedium,
      refundQuantity,
      requestedAt: new Date().toISOString(), // ✅ REQUIRED by backend
    });

    // reset
    setReason("");
    setRefundMedium("");
    setRefundQuantity(1);
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      {/* MAIN MODAL */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] sm:w-[420px] rounded-xl p-6">
          <DialogTitle className="text-lg font-semibold">
            Refund Request
          </DialogTitle>

          <div className="mt-4 space-y-4">
            {/* Refund Quantity */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Refund Quantity
              </label>

              <div className="mt-1 flex items-center gap-3">
                <button
                  onClick={() => setRefundQuantity((q) => Math.max(1, q - 1))}
                  className="h-9 w-9 rounded-lg border text-lg font-medium"
                >
                  −
                </button>

                <span className="w-10 text-center font-semibold">
                  {refundQuantity}
                </span>

                <button
                  onClick={() =>
                    setRefundQuantity((q) => Math.min(ticketQuantity, q + 1))
                  }
                  className="h-9 w-9 rounded-lg border text-lg font-medium"
                >
                  +
                </button>

                <span className="text-xs text-gray-500">
                  of {ticketQuantity}
                </span>
              </div>
            </div>

            {/* Refund Medium */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Medium for Refund
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:bg-[#181818]"
                placeholder="Enter bank IBAN / wallet"
                value={refundMedium}
                onChange={(e) => setRefundMedium(e.target.value)}
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

            {/* NOTE */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-[12px] text-blue-800">
              Refunds are allowed while the event is upcoming or ongoing.
              Refunds are not processed once the event has ended.
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

      {/* CONFIRM MODAL */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="w-[90vw] sm:w-[360px] rounded-xl p-6">
          <DialogTitle className="text-lg font-semibold text-center">
            Confirm Refund Request
          </DialogTitle>

          <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
            You are requesting a refund for{" "}
            <span className="font-semibold">{refundQuantity} ticket(s)</span>.
            <br />
            <br />
            This action cannot be undone.
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

// code before integartion

// "use client";

// import { useState } from "react";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// interface RefundRequestModalProps {
//   open: boolean;
//   onClose: () => void;
//   ticketQuantity: number;
//   onSubmit: (data: {
//     reason: string;
//     bankAccount: string;
//     refundExpiryDate: string;
//     refundQuantity: number;
//   }) => void;
// }

// export function RefundRequestModal({
//   open,
//   onClose,
//   ticketQuantity,
//   onSubmit,
// }: RefundRequestModalProps) {
//   const [reason, setReason] = useState("");
//   const [bankAccount, setBankAccount] = useState("");
//   const [refundQuantity, setRefundQuantity] = useState(1);
//   const [showConfirm, setShowConfirm] = useState(false);

//   // 🔒 later comes from backend
//   const refundExpiryDate = "2025-12-20";

//   const handlePrimarySubmit = () => {
//     if (!reason || !bankAccount || refundQuantity < 1) return;
//     setShowConfirm(true);
//   };

//   const handleConfirmSubmit = () => {
//     onSubmit({
//       reason,
//       bankAccount,
//       refundExpiryDate,
//       refundQuantity,
//     });

//     // reset
//     setReason("");
//     setBankAccount("");
//     setRefundQuantity(1);
//     setShowConfirm(false);
//     onClose();
//   };

//   return (
//     <>
//       {/* MAIN MODAL */}
//       <Dialog open={open} onOpenChange={onClose}>
//         <DialogContent className="w-[95vw] sm:w-[420px] rounded-xl p-6">
//           <DialogTitle className="text-lg font-semibold">
//             Refund Request
//           </DialogTitle>

//           <div className="mt-4 space-y-4">
//             {/* Refund Quantity */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Refund Quantity
//               </label>

//               <div className="mt-1 flex items-center gap-3">
//                 <button
//                   onClick={() => setRefundQuantity((q) => Math.max(1, q - 1))}
//                   className="h-9 w-9 rounded-lg border text-lg font-medium"
//                 >
//                   −
//                 </button>

//                 <span className="w-10 text-center font-semibold">
//                   {refundQuantity}
//                 </span>

//                 <button
//                   onClick={() =>
//                     setRefundQuantity((q) => Math.min(ticketQuantity, q + 1))
//                   }
//                   className="h-9 w-9 rounded-lg border text-lg font-medium"
//                 >
//                   +
//                 </button>

//                 <span className="text-xs text-gray-500">
//                   of {ticketQuantity}
//                 </span>
//               </div>
//             </div>

//             {/* Bank Account */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Medium for Refund
//               </label>
//               <input
//                 type="text"
//                 className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:bg-[#181818]"
//                 placeholder="Enter bank / IBAN / wallet"
//                 value={bankAccount}
//                 onChange={(e) => setBankAccount(e.target.value)}
//               />
//             </div>

//             {/* Reason */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Reason for refund
//               </label>
//               <textarea
//                 className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:bg-[#181818]"
//                 rows={4}
//                 placeholder="Explain why you want a refund..."
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//               />
//             </div>

//             {/* Expiry */}
//             {/* <div>
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Refund Expiry Date
//               </label>
//               <input
//                 disabled
//                 value={refundExpiryDate}
//                 className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-gray-100 dark:bg-[#222]"
//               />
//             </div> */}

//             {/* NOTE */}
//             <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-[12px] text-blue-800">
//               Refunds are allowed while the event is upcoming or ongoing.
//               Refunds are not processed once the event has ended.
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="mt-6 flex justify-end gap-3">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 rounded-lg border text-sm"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handlePrimarySubmit}
//               className="px-4 py-2 rounded-lg bg-[#0077F7] text-white text-sm"
//             >
//               Send Request
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* CONFIRM MODAL */}
//       <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
//         <DialogContent className="w-[90vw] sm:w-[360px] rounded-xl p-6">
//           <DialogTitle className="text-lg font-semibold text-center">
//             Confirm Refund Request
//           </DialogTitle>

//           <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
//             You are requesting a refund for{" "}
//             <span className="font-semibold">{refundQuantity} ticket(s)</span>
//             .
//             <br />
//             <br />
//             This action cannot be undone.
//           </p>

//           <div className="mt-6 flex justify-center gap-3">
//             <button
//               onClick={() => setShowConfirm(false)}
//               className="px-4 py-2 rounded-lg border text-sm"
//             >
//               Go Back
//             </button>

//             <button
//               onClick={handleConfirmSubmit}
//               className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm"
//             >
//               Confirm & Submit
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
